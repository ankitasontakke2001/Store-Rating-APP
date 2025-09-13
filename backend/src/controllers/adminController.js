const { User, Store, Rating } = require('../models');
const bcrypt = require('bcrypt');

// Add user (by admin)
exports.addUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    if (!name || name.length < 20 || name.length > 60) return res.status(400).json({ message: 'Invalid name length' });
    if (!password) return res.status(400).json({ message: 'Password required' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, password: hashed, role: role || 'user' });
    return res.json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Add store
exports.addStore = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const store = await Store.create({ name, email, address });
    return res.json(store);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Dashboard counts
exports.dashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    return res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// List users (filter by name, email, address, role)
exports.listUsers = async (req, res) => {
  try {
    const { q, role, order = 'ASC', sortBy = 'name' } = req.query;
    const where = {};
    if (role) where.role = role;
    // simple search across name/email/address:
    const { Op } = require('sequelize');
    if (q) where[Op.or] = [
      { name: { [Op.iLike]: `%${q}%` } },
      { email: { [Op.iLike]: `%${q}%` } },
      { address: { [Op.iLike]: `%${q}%` } }
    ];
    const users = await User.findAll({ where, order: [[sortBy, order]] , attributes: ['id','name','email','address','role']});
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// List stores (filter & include average rating)
exports.listStores = async (req, res) => {
  try {
    const { q, order = 'ASC', sortBy = 'name' } = req.query;
    const { Op, fn, col, literal } = require('sequelize');
    const where = {};
    if (q) where[Op.or] = [
      { name: { [Op.iLike]: `%${q}%` } },
      { email: { [Op.iLike]: `%${q}%` } },
      { address: { [Op.iLike]: `%${q}%` } }
    ];

    // include avg rating
    const stores = await Store.findAll({
      where,
      attributes: {
        include: [
          [literal(`(
            SELECT COALESCE(ROUND(AVG("score")::numeric,2),0)
            FROM "Ratings" as r
            WHERE r."StoreId" = "Store"."id"
          )`), 'avgRating']
        ]
      },
      order: [[sortBy, order]]
    });
    return res.json(stores);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get user details (include rating if owner)
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { attributes: ['id','name','email','address','role']});
    if (!user) return res.status(404).json({ message: 'Not found' });

    if (user.role === 'owner') {
      // find owner's store ratings average (if owner has single store mapping is required - for simplicity we assume owner email links store email)
      const store = await Store.findOne({ where: { email: user.email }});
      if (store) {
        const { sequelize } = require('../models');
        const [result] = await sequelize.query(`SELECT COALESCE(ROUND(AVG("score")::numeric,2),0) as "avgRating" FROM "Ratings" WHERE "StoreId" = ${store.id}`);
        user.dataValues.avgRating = result[0].avgRating;
      }
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

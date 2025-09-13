const { Store, Rating, User } = require('../models');

// For owners: get list of users who rated their store & avg rating
exports.ownerStoreInfo = async (req, res) => {
  try {
    // identify store by owner email (req.user.email)
    const store = await Store.findOne({ where: { email: req.user.email }});
    if (!store) return res.status(404).json({ message: 'Store not found for this owner' });

    const ratings = await Rating.findAll({
      where: { StoreId: store.id },
      include: [{ model: User, attributes: ['id','name','email','address'] }],
      order: [['createdAt','DESC']]
    });

    // avg:
    const avg = ratings.length ? (ratings.reduce((s,r)=>s+r.score,0) / ratings.length).toFixed(2) : 0;
    return res.json({ store: { id: store.id, name: store.name, address: store.address, email: store.email }, avgRating: parseFloat(avg), ratings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const { Rating, Store, User } = require('../models');

// list stores with user's submitted rating (for normal user page)
exports.listStoresForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { Op, literal } = require('sequelize');

    // get all stores and include user's rating if present and avgRating
    const stores = await Store.findAll({
      attributes: {
        include: [
          [literal(`(
            SELECT COALESCE(ROUND(AVG("score")::numeric,2),0)
            FROM "Ratings" as r
            WHERE r."StoreId" = "Store"."id"
          )`), 'avgRating'],
          [literal(`(
            SELECT r."score"
            FROM "Ratings" as r
            WHERE r."StoreId" = "Store"."id" AND r."UserId" = ${userId}
            LIMIT 1
          )`), 'userRating']
        ]
      },
      order: [['name','ASC']]
    });

    return res.json(stores);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.submitOrUpdateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { score } = req.body;
    const userId = req.user.id;

    if (!score || score < 1 || score > 5) return res.status(400).json({ message: 'Score must be 1 to 5' });

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    // check existing rating
    let rating = await Rating.findOne({ where: { StoreId: store.id, UserId: userId }});
    if (rating) {
      rating.score = score;
      await rating.save();
      return res.json({ message: 'Rating updated', rating });
    } else {
      rating = await Rating.create({ score, StoreId: store.id, UserId: userId });
      return res.json({ message: 'Rating created', rating });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

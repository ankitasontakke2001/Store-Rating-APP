const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// user: list stores (with user's rating)
router.get('/stores', allowRoles('user','admin','owner'), ratingController.listStoresForUser);

// submit/update rating (only normal users)
router.post('/stores/:storeId/rate', allowRoles('user'), ratingController.submitOrUpdateRating);

module.exports = router;

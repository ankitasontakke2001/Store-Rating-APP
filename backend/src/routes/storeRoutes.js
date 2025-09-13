const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.get('/owner/info', allowRoles('owner'), storeController.ownerStoreInfo);

module.exports = router;

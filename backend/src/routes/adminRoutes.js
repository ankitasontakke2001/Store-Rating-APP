const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(allowRoles('admin'));

// admin actions
router.post('/users', admin.addUser);
router.post('/stores', admin.addStore);
router.get('/dashboard', admin.dashboard);
router.get('/users', admin.listUsers);
router.get('/stores', admin.listStores);
router.get('/users/:id', admin.getUserDetails);

module.exports = router;

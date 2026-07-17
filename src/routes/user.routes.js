const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/user/auth');
const categoryRoutes = require('../modules/user/categories');
const serviceRoutes = require('../modules/user/services');
const profileRoutes = require('../modules/user/profile');
const addressRoutes = require('../modules/user/addresses');
const cartRoutes = require('../modules/user/cart');
const userAuth = require('../middlewares/user-auth.middleware');

router.use('/auth', authRoutes);

// Protected routes
router.use(userAuth);
router.use('/categories', categoryRoutes);
router.use('/services', serviceRoutes);
router.use('/profile', profileRoutes);
router.use('/addresses', addressRoutes);
router.use('/cart', cartRoutes);

module.exports = router;

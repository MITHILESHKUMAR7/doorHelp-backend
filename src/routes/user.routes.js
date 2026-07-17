const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/user/auth');
const categoryRoutes = require('../modules/user/categories');
const userAuth = require('../middlewares/user-auth.middleware');

router.use('/auth', authRoutes);

// Protected routes
router.use(userAuth);
router.use('/categories', categoryRoutes);

module.exports = router;

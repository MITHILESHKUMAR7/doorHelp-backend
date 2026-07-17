const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/admin/auth');
const categoryRoutes = require('../modules/admin/categories');

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;

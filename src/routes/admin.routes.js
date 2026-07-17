const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/admin/auth');
const categoryRoutes = require('../modules/admin/categories');
const serviceRoutes = require('../modules/admin/services');

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/services', serviceRoutes);

module.exports = router;

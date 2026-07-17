const express = require('express');
const router = express.Router();
const categoryCtrl = require('./category.controller');

router.get('/', categoryCtrl.getAllCategories);
router.get('/:slug/subcategories', categoryCtrl.getSubcategories);

module.exports = router;

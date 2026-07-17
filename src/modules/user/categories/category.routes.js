const express = require('express');
const validate = require('../../../middlewares/validate.middleware');
const controller = require('./category.controller');
const { slugParamSchema } = require('./category.validator');

const router = express.Router();

// GET /api/v1/categories  — Home screen category grid (public)
router.get('/', controller.listCategories);

// GET /api/v1/categories/:slug/subcategories  — pill-tabs on category listing screen (public)
router.get('/:slug/subcategories', validate(slugParamSchema), controller.listSubcategoriesBySlug);

module.exports = router;

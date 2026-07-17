const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const controller = require('./category.controller');
const subcategoryController = require('./subcategory.controller');
const { slugParamSchema } = require('./category.validator');

const router = express.Router();

// GET /api/v1/categories -> Home screen category grid
router.get('/', controller.listCategories);

// GET /api/v1/categories/:slug/subcategories -> pill-tabs on a category listing screen
router.get('/:slug/subcategories', validate(slugParamSchema), subcategoryController.listSubcategoriesByCategorySlug);

module.exports = router;

const express = require('express');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const validate = require('../../middlewares/validate.middleware');
const ROLES = require('../../common/constants/roles');
const controller = require('./category.controller');
const subcategoryController = require('./subcategory.controller');
const {
  createCategorySchema,
  updateCategorySchema,
  idParamSchema,
  createSubcategorySchema,
  updateSubcategorySchema,
} = require('./category.validator');

const router = express.Router();

const adminOnly = [auth, rbac([ROLES.ADMIN, ROLES.SUPERADMIN])];

// --- Categories ---
router.get('/categories', ...adminOnly, controller.listCategoriesAdmin);
router.post('/categories', ...adminOnly, validate(createCategorySchema), controller.createCategory);
router.patch('/categories/:id', ...adminOnly, validate(updateCategorySchema), controller.updateCategory);
router.delete('/categories/:id', ...adminOnly, validate(idParamSchema), controller.deleteCategory);

// --- Subcategories ---
router.get('/subcategories', ...adminOnly, subcategoryController.listSubcategoriesAdmin);
router.post('/subcategories', ...adminOnly, validate(createSubcategorySchema), subcategoryController.createSubcategory);
router.patch('/subcategories/:id', ...adminOnly, validate(updateSubcategorySchema), subcategoryController.updateSubcategory);
router.delete('/subcategories/:id', ...adminOnly, validate(idParamSchema), subcategoryController.deleteSubcategory);

module.exports = router;

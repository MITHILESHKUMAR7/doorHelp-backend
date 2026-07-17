const express = require('express');
const adminAuth = require('../../../middlewares/admin-auth.middleware');
const rbac = require('../../../middlewares/rbac.middleware');
const validate = require('../../../middlewares/validate.middleware');
const ROLES = require('../../../common/constants/roles');
const controller = require('./category.controller');
const {
  createCategorySchema,
  updateCategorySchema,
  idParamSchema,
  createSubcategorySchema,
  updateSubcategorySchema,
} = require('./category.validator');

const router = express.Router();
const adminOnly = [adminAuth, rbac([ROLES.ADMIN, ROLES.SUPERADMIN])];

// ── Categories ────────────────────────────────────────────────────────────────
// GET    /api/v1/admin/categories
router.get('/categories', ...adminOnly, controller.listCategories);
// POST   /api/v1/admin/categories
router.post('/categories', ...adminOnly, validate(createCategorySchema), controller.createCategory);
// PATCH  /api/v1/admin/categories/:id
router.patch('/categories/:id', ...adminOnly, validate(updateCategorySchema), controller.updateCategory);
// DELETE /api/v1/admin/categories/:id
router.delete('/categories/:id', ...adminOnly, validate(idParamSchema), controller.deleteCategory);

// ── Subcategories ─────────────────────────────────────────────────────────────
// GET    /api/v1/admin/subcategories?category=<id>
router.get('/subcategories', ...adminOnly, controller.listSubcategories);
// POST   /api/v1/admin/subcategories
router.post('/subcategories', ...adminOnly, validate(createSubcategorySchema), controller.createSubcategory);
// PATCH  /api/v1/admin/subcategories/:id
router.patch('/subcategories/:id', ...adminOnly, validate(updateSubcategorySchema), controller.updateSubcategory);
// DELETE /api/v1/admin/subcategories/:id
router.delete('/subcategories/:id', ...adminOnly, validate(idParamSchema), controller.deleteSubcategory);

module.exports = router;

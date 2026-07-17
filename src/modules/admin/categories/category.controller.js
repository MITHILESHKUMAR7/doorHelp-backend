const asyncHandler = require('../../../common/utils/asyncHandler');
const { sendSuccess } = require('../../../common/utils/apiResponse');
const categoryService = require('./category.service');

// ── Categories ────────────────────────────────────────────────────────────────

const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  sendSuccess(res, { message: 'Categories fetched', data: categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Category created', data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  sendSuccess(res, { message: 'Category updated', data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  sendSuccess(res, { message: 'Category deleted' });
});

// ── Subcategories ─────────────────────────────────────────────────────────────

const listSubcategories = asyncHandler(async (req, res) => {
  const subcategories = await categoryService.getAllSubcategories(req.query.category);
  sendSuccess(res, { message: 'Subcategories fetched', data: subcategories });
});

const createSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await categoryService.createSubcategory(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Subcategory created', data: subcategory });
});

const updateSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await categoryService.updateSubcategory(req.params.id, req.body);
  sendSuccess(res, { message: 'Subcategory updated', data: subcategory });
});

const deleteSubcategory = asyncHandler(async (req, res) => {
  await categoryService.deleteSubcategory(req.params.id);
  sendSuccess(res, { message: 'Subcategory deleted' });
});

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};

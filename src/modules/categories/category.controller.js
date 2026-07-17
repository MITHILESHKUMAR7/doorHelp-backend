const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');
const categoryService = require('./category.service');

const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getActiveCategories();
  sendSuccess(res, { message: 'Categories fetched', data: categories });
});

const listCategoriesAdmin = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategoriesForAdmin();
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

module.exports = { listCategories, listCategoriesAdmin, createCategory, updateCategory, deleteCategory };

const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');
const subcategoryService = require('./subcategory.service');

const listSubcategoriesByCategorySlug = asyncHandler(async (req, res) => {
  const subcategories = await subcategoryService.getSubcategoriesByCategorySlug(req.params.slug);
  sendSuccess(res, { message: 'Subcategories fetched', data: subcategories });
});

const listSubcategoriesAdmin = asyncHandler(async (req, res) => {
  const subcategories = await subcategoryService.getAllSubcategoriesForAdmin(req.query.category);
  sendSuccess(res, { message: 'Subcategories fetched', data: subcategories });
});

const createSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await subcategoryService.createSubcategory(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Subcategory created', data: subcategory });
});

const updateSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await subcategoryService.updateSubcategory(req.params.id, req.body);
  sendSuccess(res, { message: 'Subcategory updated', data: subcategory });
});

const deleteSubcategory = asyncHandler(async (req, res) => {
  await subcategoryService.deleteSubcategory(req.params.id);
  sendSuccess(res, { message: 'Subcategory deleted' });
});

module.exports = {
  listSubcategoriesByCategorySlug,
  listSubcategoriesAdmin,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};

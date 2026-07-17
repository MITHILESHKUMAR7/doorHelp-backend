const asyncHandler = require('../../../common/utils/asyncHandler');
const { sendSuccess } = require('../../../common/utils/apiResponse');
const categoryService = require('./category.service');

const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getActiveCategories();
  sendSuccess(res, { message: 'Categories fetched', data: categories });
});

const listSubcategoriesBySlug = asyncHandler(async (req, res) => {
  const subcategories = await categoryService.getSubcategoriesByCategorySlug(req.params.slug);
  sendSuccess(res, { message: 'Subcategories fetched', data: subcategories });
});

module.exports = { listCategories, listSubcategoriesBySlug };

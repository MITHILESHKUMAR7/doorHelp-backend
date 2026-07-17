const categoryService = require('./category.service');
const { ApiResponse } = require('../../../common/utils/apiResponse');
const asyncHandler = require('../../../common/utils/asyncHandler');

exports.getAllCategories = asyncHandler(async (req, res) => {
    const result = await categoryService.getAllActiveCategories();
    res.status(200).json(new ApiResponse(true, 'Categories fetched', result));
});

exports.getSubcategories = asyncHandler(async (req, res) => {
    const result = await categoryService.getSubcategories(req.params.slug);
    res.status(200).json(new ApiResponse(true, 'Subcategories fetched', result));
});

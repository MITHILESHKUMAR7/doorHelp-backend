const categoryService = require('./category.service');
const { ApiResponse } = require('../../../common/utils/apiResponse');
const asyncHandler = require('../../../common/utils/asyncHandler');

exports.createCategory = asyncHandler(async (req, res) => {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json(new ApiResponse(true, 'Category created', result));
});

exports.getAllCategories = asyncHandler(async (req, res) => {
    const result = await categoryService.getAllCategories();
    res.status(200).json(new ApiResponse(true, 'Categories fetched', result));
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const result = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json(new ApiResponse(true, 'Category updated', result));
});

exports.deleteCategory = asyncHandler(async (req, res) => {
    const result = await categoryService.deleteCategory(req.params.id);
    res.status(200).json(new ApiResponse(true, 'Category deleted', result));
});

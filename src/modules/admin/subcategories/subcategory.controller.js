const subService = require('./subcategory.service');
const { ApiResponse } = require('../../../common/utils/apiResponse');
const asyncHandler = require('../../../common/utils/asyncHandler');

exports.createSubcategory = asyncHandler(async (req, res) => {
    const result = await subService.createSubcategory(req.body);
    res.status(201).json(new ApiResponse(true, 'Subcategory created', result));
});

exports.getAllSubcategories = asyncHandler(async (req, res) => {
    const result = await subService.getAllSubcategories(req.query);
    res.status(200).json(new ApiResponse(true, 'Subcategories fetched', result));
});

exports.updateSubcategory = asyncHandler(async (req, res) => {
    const result = await subService.updateSubcategory(req.params.id, req.body);
    res.status(200).json(new ApiResponse(true, 'Subcategory updated', result));
});

exports.deleteSubcategory = asyncHandler(async (req, res) => {
    const result = await subService.deleteSubcategory(req.params.id);
    res.status(200).json(new ApiResponse(true, 'Subcategory soft deleted', result));
});

const serviceService = require('./service.service');
const { ApiResponse } = require('../../../common/utils/apiResponse');
const asyncHandler = require('../../../common/utils/asyncHandler');

exports.getServices = asyncHandler(async (req, res) => {
    const result = await serviceService.getActiveServices(req.query);
    res.status(200).json(new ApiResponse(true, 'Services fetched', result));
});

exports.getServiceDetails = asyncHandler(async (req, res) => {
    const result = await serviceService.getServiceBySlug(req.params.slug);
    res.status(200).json(new ApiResponse(true, 'Service details fetched', result));
});

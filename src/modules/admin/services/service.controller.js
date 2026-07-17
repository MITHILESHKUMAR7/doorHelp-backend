const serviceService = require('./service.service');
const { ApiResponse } = require('../../../common/utils/apiResponse');
const asyncHandler = require('../../../common/utils/asyncHandler');

exports.createService = asyncHandler(async (req, res) => {
    const result = await serviceService.createService(req.body);
    res.status(201).json(new ApiResponse(true, 'Service created', result));
});

exports.getAllServices = asyncHandler(async (req, res) => {
    const result = await serviceService.getAllServices(req.query);
    res.status(200).json(new ApiResponse(true, 'Services fetched', result));
});

exports.updateService = asyncHandler(async (req, res) => {
    const result = await serviceService.updateService(req.params.id, req.body);
    res.status(200).json(new ApiResponse(true, 'Service updated', result));
});

exports.deleteService = asyncHandler(async (req, res) => {
    const result = await serviceService.deleteService(req.params.id);
    res.status(200).json(new ApiResponse(true, 'Service soft deleted', result));
});

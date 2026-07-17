const addressService = require('./address.service');
const { ApiResponse } = require('../../../common/utils/apiResponse');
const asyncHandler = require('../../../common/utils/asyncHandler');

exports.createAddress = asyncHandler(async (req, res) => {
    const result = await addressService.createAddress(req.user.id, req.body);
    res.status(201).json(new ApiResponse(true, 'Address created', result));
});

exports.getAddresses = asyncHandler(async (req, res) => {
    const result = await addressService.getAddresses(req.user.id);
    res.status(200).json(new ApiResponse(true, 'Addresses fetched', result));
});

exports.updateAddress = asyncHandler(async (req, res) => {
    const result = await addressService.updateAddress(req.params.id, req.user.id, req.body);
    res.status(200).json(new ApiResponse(true, 'Address updated', result));
});

exports.deleteAddress = asyncHandler(async (req, res) => {
    const result = await addressService.deleteAddress(req.params.id, req.user.id);
    res.status(200).json(new ApiResponse(true, 'Address deleted', result));
});

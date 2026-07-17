const addonService = require('./addon.service');
const { ApiResponse } = require('../../../common/utils/apiResponse');
const asyncHandler = require('../../../common/utils/asyncHandler');

exports.createAddon = asyncHandler(async (req, res) => {
    const result = await addonService.createAddon(req.body);
    res.status(201).json(new ApiResponse(true, 'Addon created', result));
});

exports.getAllAddons = asyncHandler(async (req, res) => {
    const result = await addonService.getAllAddons(req.query);
    res.status(200).json(new ApiResponse(true, 'Addons fetched', result));
});

exports.updateAddon = asyncHandler(async (req, res) => {
    const result = await addonService.updateAddon(req.params.id, req.body);
    res.status(200).json(new ApiResponse(true, 'Addon updated', result));
});

exports.deleteAddon = asyncHandler(async (req, res) => {
    const result = await addonService.deleteAddon(req.params.id);
    res.status(200).json(new ApiResponse(true, 'Addon soft deleted', result));
});

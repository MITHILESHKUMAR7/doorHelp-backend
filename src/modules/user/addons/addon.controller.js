const addonService = require('./addon.service');
const { ApiResponse } = require('../../../common/utils/apiResponse');
const asyncHandler = require('../../../common/utils/asyncHandler');

exports.getAddons = asyncHandler(async (req, res) => {
    const result = await addonService.getActiveAddons(req.query);
    res.status(200).json(new ApiResponse(true, 'Active addons fetched', result));
});

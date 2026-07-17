const profileService = require('./profile.service');
const { ApiResponse } = require('../../../common/utils/apiResponse');
const asyncHandler = require('../../../common/utils/asyncHandler');

exports.getProfile = asyncHandler(async (req, res) => {
    const result = await profileService.getProfile(req.user.id);
    res.status(200).json(new ApiResponse(true, 'Profile fetched', result));
});

exports.updateProfile = asyncHandler(async (req, res) => {
    const result = await profileService.updateProfile(req.user.id, req.body);
    res.status(200).json(new ApiResponse(true, 'Profile updated', result));
});

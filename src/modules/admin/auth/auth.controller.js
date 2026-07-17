const authService = require('./auth.service');
const { ApiResponse } = require('../../../common/utils/apiResponse');
const asyncHandler = require('../../../common/utils/asyncHandler');

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(new ApiResponse(true, 'Admin logged in', result));
});

exports.refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.status(200).json(new ApiResponse(true, 'Token refreshed', result));
});

exports.logout = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(true, 'Logged out', {}));
});

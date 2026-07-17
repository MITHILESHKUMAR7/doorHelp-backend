const authService = require('./auth.service');
const { ApiResponse } = require('../../../common/utils/apiResponse');
const asyncHandler = require('../../../common/utils/asyncHandler');

exports.requestOtp = asyncHandler(async (req, res) => {
    const { phone } = req.body;
    await authService.requestOtp(phone);
    res.status(200).json(new ApiResponse(true, 'OTP sent', {}));
});

exports.verifyOtp = asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;
    const result = await authService.verifyOtp(phone, otp);
    res.status(200).json(new ApiResponse(true, 'OTP verified', result));
});

exports.register = asyncHandler(async (req, res) => {
    const { tempToken, fullName, email, referralCode } = req.body;
    const result = await authService.register(tempToken, fullName, email, referralCode);
    res.status(201).json(new ApiResponse(true, 'User registered', result));
});

exports.refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.status(200).json(new ApiResponse(true, 'Token refreshed', result));
});

exports.logout = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(true, 'Logged out', {}));
});

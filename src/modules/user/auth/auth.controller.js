const asyncHandler = require('../../../common/utils/asyncHandler');
const { sendSuccess } = require('../../../common/utils/apiResponse');
const authService = require('./auth.service');

const requestOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const data = await authService.requestOtp(phone);
  sendSuccess(res, { message: 'OTP sent successfully', data });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;
  const data = await authService.verifyOtp(phone, otp);
  sendSuccess(res, { message: 'OTP verified', data });
});

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Account created successfully', data });
});

const refreshToken = asyncHandler(async (req, res) => {
  const data = await authService.refreshAccessToken(req.body.refreshToken);
  sendSuccess(res, { message: 'Token refreshed', data });
});

module.exports = { requestOtp, verifyOtp, register, refreshToken };

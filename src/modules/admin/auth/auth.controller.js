const asyncHandler = require('../../../common/utils/asyncHandler');
const { sendSuccess } = require('../../../common/utils/apiResponse');
const authService = require('./auth.service');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const data = await authService.adminLogin(email, password);
  sendSuccess(res, { message: 'Login successful', data });
});

const refreshToken = asyncHandler(async (req, res) => {
  const data = await authService.refreshAccessToken(req.body.refreshToken);
  sendSuccess(res, { message: 'Token refreshed', data });
});

module.exports = { login, refreshToken };

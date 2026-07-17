const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const controller = require('./auth.controller');
const {
  otpRequestSchema,
  otpVerifySchema,
  registerSchema,
  refreshTokenSchema,
  adminLoginSchema,
} = require('./auth.validator');

const router = express.Router();

// Customer auth (User App)
router.post('/otp/request', validate(otpRequestSchema), controller.requestOtp);
router.post('/otp/verify', validate(otpVerifySchema), controller.verifyOtp);
router.post('/register', validate(registerSchema), controller.register);
router.post('/refresh-token', validate(refreshTokenSchema), controller.refreshToken);

// Admin auth (Admin Panel)
router.post('/admin/login', validate(adminLoginSchema), controller.adminLogin);

module.exports = router;

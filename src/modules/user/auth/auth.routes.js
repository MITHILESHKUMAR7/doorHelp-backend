const express = require('express');
const validate = require('../../../middlewares/validate.middleware');
const controller = require('./auth.controller');
const { otpRequestSchema, otpVerifySchema, registerSchema, refreshTokenSchema } = require('./auth.validator');

const router = express.Router();

// POST /api/v1/auth/otp/request
router.post('/otp/request', validate(otpRequestSchema), controller.requestOtp);

// POST /api/v1/auth/otp/verify
router.post('/otp/verify', validate(otpVerifySchema), controller.verifyOtp);

// POST /api/v1/auth/register  (requires tempToken from otp/verify)
router.post('/register', validate(registerSchema), controller.register);

// POST /api/v1/auth/refresh-token
router.post('/refresh-token', validate(refreshTokenSchema), controller.refreshToken);

module.exports = router;

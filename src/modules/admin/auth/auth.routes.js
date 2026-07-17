const express = require('express');
const validate = require('../../../middlewares/validate.middleware');
const controller = require('./auth.controller');
const { loginSchema, refreshTokenSchema } = require('./auth.validator');

const router = express.Router();

// POST /api/v1/admin/auth/login  — public, no auth middleware needed
router.post('/login', validate(loginSchema), controller.login);

// POST /api/v1/admin/auth/refresh-token
router.post('/refresh-token', validate(refreshTokenSchema), controller.refreshToken);

module.exports = router;

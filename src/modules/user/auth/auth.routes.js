const express = require('express');
const router = express.Router();
const authCtrl = require('./auth.controller');

router.post('/otp/request', authCtrl.requestOtp);
router.post('/otp/verify', authCtrl.verifyOtp);
router.post('/register', authCtrl.register);
router.post('/refresh-token', authCtrl.refreshToken);
router.post('/logout', authCtrl.logout);

module.exports = router;

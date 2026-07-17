const express = require('express');
const router = express.Router();
const authCtrl = require('./auth.controller');

router.post('/login', authCtrl.login);
router.post('/refresh-token', authCtrl.refreshToken);
router.post('/logout', authCtrl.logout);

module.exports = router;

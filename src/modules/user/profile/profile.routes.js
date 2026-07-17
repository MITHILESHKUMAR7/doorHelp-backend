const express = require('express');
const router = express.Router();
const profileCtrl = require('./profile.controller');

router.get('/', profileCtrl.getProfile);
router.patch('/', profileCtrl.updateProfile);

module.exports = router;

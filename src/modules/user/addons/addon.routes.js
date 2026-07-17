const express = require('express');
const router = express.Router();
const addonCtrl = require('./addon.controller');

router.get('/', addonCtrl.getAddons);

module.exports = router;

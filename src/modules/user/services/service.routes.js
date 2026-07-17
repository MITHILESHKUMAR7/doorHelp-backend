const express = require('express');
const router = express.Router();
const serviceCtrl = require('./service.controller');

router.get('/', serviceCtrl.getServices);
router.get('/:slug', serviceCtrl.getServiceDetails);

module.exports = router;

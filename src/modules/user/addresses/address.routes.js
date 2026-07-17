const express = require('express');
const router = express.Router();
const addressCtrl = require('./address.controller');

router.post('/', addressCtrl.createAddress);
router.get('/', addressCtrl.getAddresses);
router.patch('/:id', addressCtrl.updateAddress);
router.delete('/:id', addressCtrl.deleteAddress);

module.exports = router;

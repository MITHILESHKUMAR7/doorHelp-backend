const express = require('express');
const router = express.Router();
const cartCtrl = require('./cart.controller');

router.get('/', cartCtrl.getCart);
router.post('/items', cartCtrl.addItem);
router.patch('/items/:itemId', cartCtrl.updateItemQuantity);
router.delete('/items/:itemId', cartCtrl.removeItem);
router.delete('/', cartCtrl.clearCart);

module.exports = router;

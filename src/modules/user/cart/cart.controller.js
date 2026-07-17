const cartService = require('./cart.service');
const { ApiResponse } = require('../../../common/utils/apiResponse');
const asyncHandler = require('../../../common/utils/asyncHandler');

exports.getCart = asyncHandler(async (req, res) => {
    const result = await cartService.getCart(req.user.id);
    res.status(200).json(new ApiResponse(true, 'Cart fetched', result));
});

exports.addItem = asyncHandler(async (req, res) => {
    const { service, quantity, addons } = req.body;
    const result = await cartService.addItem(req.user.id, service, quantity, addons);
    res.status(200).json(new ApiResponse(true, 'Item added to cart', result));
});

exports.updateItemQuantity = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const result = await cartService.updateItemQuantity(req.user.id, req.params.itemId, quantity);
    res.status(200).json(new ApiResponse(true, 'Cart item updated', result));
});

exports.removeItem = asyncHandler(async (req, res) => {
    const result = await cartService.removeItem(req.user.id, req.params.itemId);
    res.status(200).json(new ApiResponse(true, 'Item removed from cart', result));
});

exports.clearCart = asyncHandler(async (req, res) => {
    const result = await cartService.clearCart(req.user.id);
    res.status(200).json(new ApiResponse(true, 'Cart cleared', result));
});

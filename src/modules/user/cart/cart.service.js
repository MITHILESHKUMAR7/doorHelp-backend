const Cart = require('../../shared/models/cart.model');
const ApiError = require('../../../common/utils/apiError');

// Helper to get or create cart
const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId, isDeleted: false }).populate('items.service');
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
};

exports.getCart = async (userId) => {
    return await getOrCreateCart(userId);
};

exports.addItem = async (userId, serviceId, quantity = 1, addons = []) => {
    let cart = await getOrCreateCart(userId);
    
    // Check if item already exists
    const itemIndex = cart.items.findIndex(item => item.service && item.service._id.toString() === serviceId);
    
    if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.items.push({ service: serviceId, quantity, addons });
    }
    
    await cart.save();
    return await cart.populate('items.service');
};

exports.updateItemQuantity = async (userId, itemId, quantity) => {
    const cart = await Cart.findOne({ user: userId, isDeleted: false });
    if (!cart) throw new ApiError(404, 'NOT_FOUND', 'Cart not found');
    
    const item = cart.items.id(itemId);
    if (!item) throw new ApiError(404, 'NOT_FOUND', 'Item not found in cart');
    
    item.quantity = quantity;
    await cart.save();
    return await cart.populate('items.service');
};

exports.removeItem = async (userId, itemId) => {
    const cart = await Cart.findOne({ user: userId, isDeleted: false });
    if (!cart) throw new ApiError(404, 'NOT_FOUND', 'Cart not found');
    
    cart.items.pull(itemId);
    await cart.save();
    return await cart.populate('items.service');
};

exports.clearCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId, isDeleted: false });
    if (cart) {
        cart.items = [];
        await cart.save();
    }
    return cart;
};

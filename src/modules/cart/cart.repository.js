const Cart = require('./cart.model');

function findByUser(userId) {
  return Cart.findOne({ user: userId });
}

async function findOrCreateByUser(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

function save(cart) {
  return cart.save();
}

function clearCart(userId) {
  return Cart.findOneAndUpdate({ user: userId }, { items: [], appliedCoupon: null }, { new: true });
}

module.exports = { findByUser, findOrCreateByUser, save, clearCart };
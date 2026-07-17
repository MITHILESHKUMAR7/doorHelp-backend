const mongoose = require('mongoose');

const cartAddonSchema = new mongoose.Schema(
  {
    addon: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceAddon', required: true },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false },
);

const cartItemSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    quantity: { type: Number, default: 1, min: 1 },
    addons: { type: [cartAddonSchema], default: [] },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
    appliedCoupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
  },
  { timestamps: true },
);

// Cart totals are NEVER stored here — always computed on read in cart.service.js
// so prices never drift from the live `services` collection until checkout locks them in.

module.exports = mongoose.model('Cart', cartSchema);

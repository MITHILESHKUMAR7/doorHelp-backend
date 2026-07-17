const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [{
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        quantity: { type: Number, default: 1 },
        addons: [{ addon: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceAddon' }, quantity: { type: Number, default: 1 } }]
    }],
    appliedCoupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    savedForLater: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Cart', schema);
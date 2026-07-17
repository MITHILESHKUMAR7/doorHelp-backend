const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    discountValue: { type: Number, required: true },
    maxDiscountAmount: { type: Number },
    minCartValue: { type: Number, default: 0 },
    validFrom: { type: Date },
    validTill: { type: Date },
    usageLimitPerUser: { type: Number, default: 1 },
    totalUsageLimit: { type: Number },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }}, { timestamps: true });
schema.index({ isActive: 1, validTill: 1 });
module.exports = mongoose.model('Coupon', schema);
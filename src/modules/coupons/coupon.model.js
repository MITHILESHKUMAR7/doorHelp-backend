const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscountAmount: { type: Number, default: null }, // cap for percentage coupons
    minCartValue: { type: Number, default: 0 },
    validFrom: { type: Date, required: true },
    validTill: { type: Date, required: true },
    usageLimitPerUser: { type: Number, default: 1 },
    totalUsageLimit: { type: Number, default: null }, // null = unlimited
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

couponSchema.index({ isActive: 1, validTill: 1 });

module.exports = mongoose.model('Coupon', couponSchema);

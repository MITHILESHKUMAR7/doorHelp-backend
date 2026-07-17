const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    codeHash: { type: String, required: true },
    purpose: { type: String, enum: ['login', 'signup'], required: true },
    attempts: { type: Number, default: 0, max: 5 },
    expiresAt: { type: Date, required: true, index: { expires: '0' } },
    isDeleted: { type: Boolean, default: false }}, { timestamps: true });

otpSchema.index({ phone: 1, purpose: 1 });

module.exports = mongoose.model('OTP', otpSchema);

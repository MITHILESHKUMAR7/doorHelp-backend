const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ['customer', 'admin', 'superadmin'], default: 'customer' },
    referralCode: { type: String, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    membershipTier: { type: String, enum: ['standard', 'premium'], default: 'standard' },
    avatarUrl: { type: String },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    passwordHash: { type: String },
    lastLoginAt: { type: Date },
    isDeleted: { type: Boolean, default: false }}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const ROLES = require('../../common/constants/roles');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    phone: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.CUSTOMER },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    membershipTier: { type: String, enum: ['standard', 'premium'], default: 'standard' },
    avatarUrl: { type: String, default: null },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    passwordHash: { type: String, select: false }, // only used for admin/superadmin
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);

userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);

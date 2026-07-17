const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema(
  {
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // a user can only be referred once
    status: { type: String, enum: ['pending', 'rewarded'], default: 'pending' },
    rewardAmount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

referralSchema.index({ referrer: 1 });

module.exports = mongoose.model('Referral', referralSchema);

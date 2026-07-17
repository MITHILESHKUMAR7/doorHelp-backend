const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    status: { type: String, enum: ['pending', 'rewarded'], default: 'pending' },
    rewardAmount: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false }}, { timestamps: true });
module.exports = mongoose.model('Referral', schema);
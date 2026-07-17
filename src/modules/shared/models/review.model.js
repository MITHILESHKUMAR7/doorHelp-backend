const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    isVisible: { type: Boolean, default: true }
}, { timestamps: true });
schema.index({ service: 1, createdAt: -1 });
module.exports = mongoose.model('Review', schema);
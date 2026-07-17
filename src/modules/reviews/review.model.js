const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true }, // one review per booking
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    isVisible: { type: Boolean, default: true }, // admin moderation flag
  },
  { timestamps: true },
);

reviewSchema.index({ service: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);

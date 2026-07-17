const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
    amount: { type: Number, required: true }, // in paise
    status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Payment', paymentSchema);

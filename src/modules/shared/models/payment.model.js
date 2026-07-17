const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' }
}, { timestamps: true });
module.exports = mongoose.model('Payment', schema);
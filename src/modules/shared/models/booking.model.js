const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    bookingCode: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    items: [{
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        title: String,
        price: Number,
        quantity: Number,
        addons: []
    }],
    priceBreakdown: { serviceTotal: Number, taxesAndFees: Number, deliveryFee: Number, discount: Number, couponCode: String, grandTotal: Number },
    slot: { date: Date, startTime: String, endTime: String },
    status: { type: String, enum: ['PENDING_PAYMENT', 'SCHEDULED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'PENDING_PAYMENT' },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    cancelledReason: { type: String },
    completedAt: { type: Date },
    isDeleted: { type: Boolean, default: false }}, { timestamps: true });
schema.index({ user: 1, createdAt: -1 });
schema.index({ status: 1 });
schema.index({ technician: 1, 'slot.date': 1 });
module.exports = mongoose.model('Booking', schema);
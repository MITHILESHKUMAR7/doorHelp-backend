const mongoose = require('mongoose');
const BOOKING_STATUS = require('./booking.constants');

const bookingAddonSnapshotSchema = new mongoose.Schema(
  { addon: mongoose.Schema.Types.ObjectId, title: String, price: Number, quantity: Number },
  { _id: false },
);

// Line items are SNAPSHOTTED at booking time (title/price copied in) — never re-joined to
// `services` later, so historical bookings stay accurate even if a service's price changes.
const bookingItemSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    addons: { type: [bookingAddonSnapshotSchema], default: [] },
  },
  { _id: false },
);

const priceBreakdownSchema = new mongoose.Schema(
  {
    serviceTotal: { type: Number, required: true },
    taxesAndFees: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    grandTotal: { type: Number, required: true },
  },
  { _id: false },
);

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: { type: String, required: true, unique: true }, // e.g. DH-B62X-XL
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    items: { type: [bookingItemSchema], required: true },
    priceBreakdown: { type: priceBreakdownSchema, required: true },
    slot: {
      date: { type: Date, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    status: { type: String, enum: Object.values(BOOKING_STATUS), default: BOOKING_STATUS.PENDING_PAYMENT },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician', default: null },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
    cancelledReason: { type: String, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ technician: 1, 'slot.date': 1 });

module.exports = mongoose.model('Booking', bookingSchema);

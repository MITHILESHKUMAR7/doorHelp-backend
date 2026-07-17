const Booking = require('../models/booking.model');

function findById(id) {
  return Booking.findById(id);
}

function findByIdAndUser(id, userId) {
  return Booking.findOne({ _id: id, user: userId });
}

function findByBookingCode(bookingCode) {
  return Booking.findOne({ bookingCode });
}

/** Powers the "My Bookings" Upcoming / History tabs. */
async function findByUser(userId, { status, page, limit }) {
  const UPCOMING = ['PENDING_PAYMENT', 'SCHEDULED', 'ASSIGNED', 'IN_PROGRESS'];
  const HISTORY = ['COMPLETED', 'CANCELLED'];

  const filter = { user: userId };
  if (status === 'upcoming') filter.status = { $in: UPCOMING };
  else if (status === 'history') filter.status = { $in: HISTORY };

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Booking.find(filter)
      .populate('technician', 'fullName avatarUrl phone')
      .populate('address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Booking.countDocuments(filter),
  ]);

  return { items, total };
}

/** Powers the admin bookings list with optional status/date filters. */
async function findAllForAdmin({ status, from, to, page, limit }) {
  const filter = {};
  if (status) filter.status = status;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Booking.find(filter)
      .populate('user', 'fullName phone')
      .populate('technician', 'fullName phone')
      .populate('address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Booking.countDocuments(filter),
  ]);

  return { items, total };
}

function create(data) {
  return Booking.create(data);
}

function updateById(id, data) {
  return Booking.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

/** Check technician availability for a given date (used by available-slots endpoint). */
function findByTechnicianAndDate(technicianId, date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return Booking.find({
    technician: technicianId,
    'slot.date': { $gte: start, $lte: end },
    status: { $in: ['SCHEDULED', 'ASSIGNED', 'IN_PROGRESS'] },
  }).lean();
}

module.exports = {
  findById,
  findByIdAndUser,
  findByBookingCode,
  findByUser,
  findAllForAdmin,
  create,
  updateById,
  findByTechnicianAndDate,
};

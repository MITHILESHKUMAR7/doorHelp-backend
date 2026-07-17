const Review = require('../models/review.model');

async function findByService(serviceId, { page, limit }) {
  const skip = (page - 1) * limit;
  const filter = { service: serviceId, isVisible: true };

  const [items, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'fullName avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
  ]);

  return { items, total };
}

function findByBookingId(bookingId) {
  return Review.findOne({ booking: bookingId });
}

function create(data) {
  return Review.create(data);
}

/** Used to recompute a service's ratingAvg/ratingCount after a new review. */
async function getAggregateForService(serviceId) {
  const [result] = await Review.aggregate([
    { $match: { service: serviceId, isVisible: true } },
    { $group: { _id: '$service', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  return result
    ? { ratingAvg: Math.round(result.avg * 10) / 10, ratingCount: result.count }
    : { ratingAvg: 0, ratingCount: 0 };
}

async function findAllForAdmin({ isVisible, page, limit }) {
  const filter = {};
  if (isVisible !== undefined) filter.isVisible = isVisible;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'fullName')
      .populate('service', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
  ]);
  return { items, total };
}

function toggleVisibility(id, isVisible) {
  return Review.findByIdAndUpdate(id, { isVisible }, { new: true });
}

module.exports = { findByService, findByBookingId, create, getAggregateForService, findAllForAdmin, toggleVisibility };

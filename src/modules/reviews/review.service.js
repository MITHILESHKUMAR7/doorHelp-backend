const reviewRepository = require('./review.repository');
const serviceRepository = require('../services/service.repository');
const bookingRepository = require('../bookings/booking.repository');
const BOOKING_STATUS = require('../bookings/booking.constants');
const ApiError = require('../../common/utils/apiError');
const Review = require('./review.model');

/** Public — service detail page "Customer Reviews" section. */
async function getServiceReviews(serviceId, pagination) {
  const { items, total } = await reviewRepository.findByService(serviceId, pagination);
  return { items, total };
}

/**
 * Called from bookings module (POST /bookings/:id/review). A review can only be left on a
 * booking that: belongs to the requesting user, is COMPLETED, and hasn't been reviewed yet.
 */
async function createReviewForBooking({ bookingId, userId, rating, comment }) {
  const booking = await bookingRepository.findById(bookingId);

  if (!booking || booking.user.toString() !== userId) {
    throw new ApiError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
  }
  if (booking.status !== BOOKING_STATUS.COMPLETED) {
    throw new ApiError(400, 'BOOKING_NOT_COMPLETED', 'You can only review a completed booking');
  }

  const alreadyReviewed = await reviewRepository.findByBookingId(bookingId);
  if (alreadyReviewed) {
    throw new ApiError(409, 'CONFLICT', 'This booking has already been reviewed');
  }

  // A booking can have multiple line items; the review is tied to the first service in it —
  // sufficient for the current single-focus "Full Home Deep Cleaning"-style bookings in Figma.
  const primaryServiceId = booking.items[0].service;

  const review = await reviewRepository.create({
    service: primaryServiceId,
    booking: bookingId,
    user: userId,
    rating,
    comment,
  });

  const { ratingAvg, ratingCount } = await reviewRepository.getAggregateForService(primaryServiceId);
  await serviceRepository.recomputeRating(primaryServiceId, ratingAvg, ratingCount);

  return review;
}

function getReviewsForAdmin(query) {
  return reviewRepository.findAllForAdmin(query);
}

async function toggleReviewVisibility(id) {
  const review = await Review.findById(id);
  if (!review) {
    throw new ApiError(404, 'REVIEW_NOT_FOUND', 'Review not found');
  }
  return reviewRepository.toggleVisibility(id, !review.isVisible);
}

module.exports = { getServiceReviews, createReviewForBooking, getReviewsForAdmin, toggleReviewVisibility };
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');
const reviewService = require('./review.service');

const listReviewsAdmin = asyncHandler(async (req, res) => {
  const { isVisible, page, limit } = req.query;
  const [items, total] = await reviewService.getReviewsForAdmin({ isVisible, page, limit });
  sendSuccess(res, { message: 'Reviews fetched', data: { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } } });
});

const toggleVisibility = asyncHandler(async (req, res) => {
  const review = await reviewService.toggleReviewVisibility(req.params.id);
  sendSuccess(res, { message: 'Review visibility updated', data: review });
});

module.exports = { listReviewsAdmin, toggleVisibility };
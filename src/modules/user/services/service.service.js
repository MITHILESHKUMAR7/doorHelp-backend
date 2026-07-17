const serviceRepository = require('../../shared/repositories/service.repository');
const reviewRepository = require('../../shared/repositories/review.repository');
const ApiError = require('../../../common/utils/apiError');

/** Powers GET /services — category listing screen with optional filters + search. */
async function listServices({ category, subcategory, search, page, limit }) {
  const { items, total } = await serviceRepository.findMany({ category, subcategory, search, page, limit });
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

/** Powers the service detail screen (About / What's Included / available addons). */
async function getServiceDetail(slug) {
  const service = await serviceRepository.findBySlug(slug);
  if (!service) {
    throw new ApiError(404, 'SERVICE_NOT_FOUND', 'Service not found');
  }
  const availableAddons = await serviceRepository.findActiveAddonsForService(service._id);
  return { ...service, availableAddons };
}

/** Powers the "Customer Reviews" section on the service detail page. */
async function getServiceReviews(serviceId, { page, limit }) {
  const { items, total } = await reviewRepository.findByService(serviceId, { page, limit });
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

module.exports = { listServices, getServiceDetail, getServiceReviews };

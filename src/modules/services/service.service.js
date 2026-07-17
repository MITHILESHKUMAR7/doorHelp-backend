const serviceRepository = require('./service.repository');
const serviceAddonRepository = require('./serviceAddon.repository');
const { reviewService } = require('../reviews');
const ApiError = require('../../common/utils/apiError');

/** Public — category listing screen. */
async function listServices({ category, subcategory, search, page, limit }) {
  const { items, total } = await serviceRepository.findMany({ category, subcategory, search, page, limit });
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

/** Public — service detail screen (About / What's Included / addons available for this service). */
async function getServiceDetail(slug) {
  const service = await serviceRepository.findBySlug(slug);
  if (!service) {
    throw new ApiError(404, 'SERVICE_NOT_FOUND', 'Service not found');
  }
  const addons = await serviceAddonRepository.findActiveForService(service._id);
  return { ...service, availableAddons: addons };
}

async function getServiceReviews(serviceId, pagination) {
  // service existence isn't re-verified here for a plain read — a non-existent id will just return an empty list.
  const { items, total } = await reviewService.getServiceReviews(serviceId, pagination);
  return { items, pagination: { ...pagination, total, totalPages: Math.ceil(total / pagination.limit) } };
}

async function createService(payload) {
  const existing = await serviceRepository.findBySlugRaw(payload.slug);
  if (existing) {
    throw new ApiError(409, 'CONFLICT', 'A service with this slug already exists');
  }
  return serviceRepository.create(payload);
}

async function updateService(id, payload) {
  const service = await serviceRepository.findById(id);
  if (!service) {
    throw new ApiError(404, 'SERVICE_NOT_FOUND', 'Service not found');
  }
  if (payload.slug && payload.slug !== service.slug) {
    const clashing = await serviceRepository.findBySlugRaw(payload.slug);
    if (clashing) throw new ApiError(409, 'CONFLICT', 'A service with this slug already exists');
  }
  return serviceRepository.updateById(id, payload);
}

async function deleteService(id) {
  const service = await serviceRepository.findById(id);
  if (!service) {
    throw new ApiError(404, 'SERVICE_NOT_FOUND', 'Service not found');
  }
  await serviceRepository.deleteById(id);
}

// --- Addons ---

function listAddonsForAdmin() {
  return serviceAddonRepository.findAllForAdmin();
}

function createAddon(payload) {
  return serviceAddonRepository.create(payload);
}

async function updateAddon(id, payload) {
  const addon = await serviceAddonRepository.findById(id);
  if (!addon) throw new ApiError(404, 'ADDON_NOT_FOUND', 'Service addon not found');
  return serviceAddonRepository.updateById(id, payload);
}

async function deleteAddon(id) {
  const addon = await serviceAddonRepository.findById(id);
  if (!addon) throw new ApiError(404, 'ADDON_NOT_FOUND', 'Service addon not found');
  await serviceAddonRepository.deleteById(id);
}

module.exports = {
  listServices,
  getServiceDetail,
  getServiceReviews,
  createService,
  updateService,
  deleteService,
  listAddonsForAdmin,
  createAddon,
  updateAddon,
  deleteAddon,
};
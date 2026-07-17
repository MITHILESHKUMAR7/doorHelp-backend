const Service = require('../models/service.model');
const ServiceAddon = require('../models/serviceAddon.model');

// ── Service ──────────────────────────────────────────────────────────────────

const CARD_PROJECTION =
  'title slug shortDescription price strikePrice durationLabel ratingAvg ratingCount isBestSeller isEcoFriendly images category subcategory';

/** Powers GET /services with filters + pagination + search. */
async function findMany({ category, subcategory, search, page, limit }) {
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (search) filter.$text = { $search: search };

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Service.find(filter)
      .select(CARD_PROJECTION)
      .sort({ isBestSeller: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Service.countDocuments(filter),
  ]);

  return { items, total };
}

function findBySlug(slug) {
  return Service.findOne({ slug, isActive: true })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .lean();
}

function findById(id) {
  return Service.findById(id);
}

function findByIds(ids) {
  return Service.find({ _id: { $in: ids } }).lean();
}

function findBySlugRaw(slug) {
  return Service.findOne({ slug });
}

function createService(data) {
  return Service.create(data);
}

function updateServiceById(id, data) {
  return Service.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteServiceById(id) {
  return Service.findByIdAndDelete(id);
}

/** Called by review module whenever a new review is added, to keep ratingAvg/ratingCount denormalized. */
function recomputeRating(serviceId, ratingAvg, ratingCount) {
  return Service.findByIdAndUpdate(serviceId, { ratingAvg, ratingCount });
}

// ── ServiceAddon ─────────────────────────────────────────────────────────────

function findActiveAddonsForService(serviceId) {
  return ServiceAddon.find({ relatedServices: serviceId, isActive: true }).lean();
}

function findAllAddonsForAdmin() {
  return ServiceAddon.find({}).populate('relatedServices', 'title slug').lean();
}

function findAddonById(id) {
  return ServiceAddon.findById(id);
}

function findAddonByIds(ids) {
  return ServiceAddon.find({ _id: { $in: ids } }).lean();
}

function createAddon(data) {
  return ServiceAddon.create(data);
}

function updateAddonById(id, data) {
  return ServiceAddon.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteAddonById(id) {
  return ServiceAddon.findByIdAndDelete(id);
}

module.exports = {
  findMany,
  findBySlug,
  findById,
  findByIds,
  findBySlugRaw,
  createService,
  updateServiceById,
  deleteServiceById,
  recomputeRating,
  findActiveAddonsForService,
  findAllAddonsForAdmin,
  findAddonById,
  findAddonByIds,
  createAddon,
  updateAddonById,
  deleteAddonById,
};

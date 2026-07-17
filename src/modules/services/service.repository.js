const Service = require('./service.model');

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
    Service.find(filter).select(CARD_PROJECTION).sort({ isBestSeller: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Service.countDocuments(filter),
  ]);

  return { items, total };
}

function findBySlug(slug) {
  return Service.findOne({ slug, isActive: true }).populate('category', 'name slug').populate('subcategory', 'name slug').lean();
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

function create(data) {
  return Service.create(data);
}

function updateById(id, data) {
  return Service.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteById(id) {
  return Service.findByIdAndDelete(id);
}

/** Called by review.service.js whenever a new review is added, to keep ratingAvg/ratingCount denormalized. */
function recomputeRating(serviceId, ratingAvg, ratingCount) {
  return Service.findByIdAndUpdate(serviceId, { ratingAvg, ratingCount });
}

module.exports = {
  findMany,
  findBySlug,
  findById,
  findByIds,
  findBySlugRaw,
  create,
  updateById,
  deleteById,
  recomputeRating,
};
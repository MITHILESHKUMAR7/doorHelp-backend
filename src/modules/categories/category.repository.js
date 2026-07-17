const Category = require('./category.model');

function findAllActive() {
  return Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
}

function findAllForAdmin() {
  return Category.find({}).sort({ sortOrder: 1 }).lean();
}

function findById(id) {
  return Category.findById(id);
}

function findBySlug(slug) {
  return Category.findOne({ slug });
}

function create(data) {
  return Category.create(data);
}

function updateById(id, data) {
  return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteById(id) {
  return Category.findByIdAndDelete(id);
}

module.exports = { findAllActive, findAllForAdmin, findById, findBySlug, create, updateById, deleteById };

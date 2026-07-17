const Subcategory = require('./subcategory.model');

function findActiveByCategory(categoryId) {
  return Subcategory.find({ category: categoryId, isActive: true }).sort({ sortOrder: 1 }).lean();
}

function findAllForAdmin(categoryId) {
  const filter = categoryId ? { category: categoryId } : {};
  return Subcategory.find(filter).populate('category', 'name slug').sort({ sortOrder: 1 }).lean();
}

function findById(id) {
  return Subcategory.findById(id);
}

function create(data) {
  return Subcategory.create(data);
}

function updateById(id, data) {
  return Subcategory.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteById(id) {
  return Subcategory.findByIdAndDelete(id);
}

module.exports = { findActiveByCategory, findAllForAdmin, findById, create, updateById, deleteById };

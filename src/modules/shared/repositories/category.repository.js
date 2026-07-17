const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');

// ── Category ────────────────────────────────────────────────────────────────

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

function createCategory(data) {
  return Category.create(data);
}

function updateCategoryById(id, data) {
  return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteCategoryById(id) {
  return Category.findByIdAndDelete(id);
}

// ── Subcategory ──────────────────────────────────────────────────────────────

function findActiveSubcategoriesByCategory(categoryId) {
  return Subcategory.find({ category: categoryId, isActive: true }).sort({ sortOrder: 1 }).lean();
}

function findAllSubcategoriesForAdmin(categoryId) {
  const filter = categoryId ? { category: categoryId } : {};
  return Subcategory.find(filter).populate('category', 'name slug').sort({ sortOrder: 1 }).lean();
}

function findSubcategoryById(id) {
  return Subcategory.findById(id);
}

function createSubcategory(data) {
  return Subcategory.create(data);
}

function updateSubcategoryById(id, data) {
  return Subcategory.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteSubcategoryById(id) {
  return Subcategory.findByIdAndDelete(id);
}

module.exports = {
  findAllActive,
  findAllForAdmin,
  findById,
  findBySlug,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  findActiveSubcategoriesByCategory,
  findAllSubcategoriesForAdmin,
  findSubcategoryById,
  createSubcategory,
  updateSubcategoryById,
  deleteSubcategoryById,
};

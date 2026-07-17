const categoryRepository = require('../../shared/repositories/category.repository');
const ApiError = require('../../../common/utils/apiError');

// ── Categories ───────────────────────────────────────────────────────────────

function getAllCategories() {
  return categoryRepository.findAllForAdmin();
}

async function createCategory(payload) {
  const existing = await categoryRepository.findBySlug(payload.slug);
  if (existing) {
    throw new ApiError(409, 'CONFLICT', 'A category with this slug already exists');
  }
  return categoryRepository.createCategory(payload);
}

async function updateCategory(id, payload) {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
  }
  if (payload.slug && payload.slug !== category.slug) {
    const clashing = await categoryRepository.findBySlug(payload.slug);
    if (clashing) throw new ApiError(409, 'CONFLICT', 'A category with this slug already exists');
  }
  return categoryRepository.updateCategoryById(id, payload);
}

async function deleteCategory(id) {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
  }
  await categoryRepository.deleteCategoryById(id);
}

// ── Subcategories ─────────────────────────────────────────────────────────────

function getAllSubcategories(categoryId) {
  return categoryRepository.findAllSubcategoriesForAdmin(categoryId);
}

async function createSubcategory(payload) {
  return categoryRepository.createSubcategory(payload);
}

async function updateSubcategory(id, payload) {
  const sub = await categoryRepository.findSubcategoryById(id);
  if (!sub) throw new ApiError(404, 'SUBCATEGORY_NOT_FOUND', 'Subcategory not found');
  return categoryRepository.updateSubcategoryById(id, payload);
}

async function deleteSubcategory(id) {
  const sub = await categoryRepository.findSubcategoryById(id);
  if (!sub) throw new ApiError(404, 'SUBCATEGORY_NOT_FOUND', 'Subcategory not found');
  await categoryRepository.deleteSubcategoryById(id);
}

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};

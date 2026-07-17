const categoryRepository = require('./category.repository');
const subcategoryRepository = require('./subcategory.repository');
const ApiError = require('../../common/utils/apiError');

/** Public: powers the pill-tabs under a category screen (e.g. Deep Cleaning / Bathroom / Kitchen). */
async function getSubcategoriesByCategorySlug(slug) {
  const category = await categoryRepository.findBySlug(slug);
  if (!category) {
    throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
  }
  return subcategoryRepository.findActiveByCategory(category._id);
}

function getAllSubcategoriesForAdmin(categoryId) {
  return subcategoryRepository.findAllForAdmin(categoryId);
}

async function createSubcategory(payload) {
  const category = await categoryRepository.findById(payload.category);
  if (!category) {
    throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Parent category not found');
  }
  return subcategoryRepository.create(payload);
}

async function updateSubcategory(id, payload) {
  const subcategory = await subcategoryRepository.findById(id);
  if (!subcategory) {
    throw new ApiError(404, 'SUBCATEGORY_NOT_FOUND', 'Subcategory not found');
  }
  return subcategoryRepository.updateById(id, payload);
}

async function deleteSubcategory(id) {
  const subcategory = await subcategoryRepository.findById(id);
  if (!subcategory) {
    throw new ApiError(404, 'SUBCATEGORY_NOT_FOUND', 'Subcategory not found');
  }
  await subcategoryRepository.deleteById(id);
}

module.exports = {
  getSubcategoriesByCategorySlug,
  getAllSubcategoriesForAdmin,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};

const categoryRepository = require('./category.repository');
const ApiError = require('../../common/utils/apiError');

/** Public: powers the Home category grid. */
function getActiveCategories() {
  return categoryRepository.findAllActive();
}

/** Admin: sees inactive categories too, so they can be re-enabled. */
function getAllCategoriesForAdmin() {
  return categoryRepository.findAllForAdmin();
}

async function createCategory(payload) {
  const existing = await categoryRepository.findBySlug(payload.slug);
  if (existing) {
    throw new ApiError(409, 'CONFLICT', 'A category with this slug already exists');
  }
  return categoryRepository.create(payload);
}

async function updateCategory(id, payload) {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
  }

  if (payload.slug && payload.slug !== category.slug) {
    const clashing = await categoryRepository.findBySlug(payload.slug);
    if (clashing) {
      throw new ApiError(409, 'CONFLICT', 'A category with this slug already exists');
    }
  }

  return categoryRepository.updateById(id, payload);
}

async function deleteCategory(id) {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
  }
  // NOTE: Services referencing this category are intentionally NOT cascade-deleted.
  // TODO (later phase, once services module is wired up): block delete if active services exist,
  // or reassign them — decide with product before enabling hard delete in production.
  await categoryRepository.deleteById(id);
}

module.exports = { getActiveCategories, getAllCategoriesForAdmin, createCategory, updateCategory, deleteCategory };

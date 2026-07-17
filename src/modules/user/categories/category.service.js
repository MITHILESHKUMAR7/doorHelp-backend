const categoryRepository = require('../../shared/repositories/category.repository');

/** Powers the Home category grid — active categories only, sorted. */
function getActiveCategories() {
  return categoryRepository.findAllActive();
}

/** Powers the pill-tab filter on the category listing screen. */
async function getSubcategoriesByCategorySlug(slug) {
  const category = await categoryRepository.findBySlug(slug);
  if (!category) return [];
  return categoryRepository.findActiveSubcategoriesByCategory(category._id);
}

module.exports = { getActiveCategories, getSubcategoriesByCategorySlug };

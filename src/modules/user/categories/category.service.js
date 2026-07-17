const Category = require('../../shared/models/category.model');
const Subcategory = require('../../shared/models/subcategory.model');
const ApiError = require('../../../common/utils/apiError');

exports.getAllActiveCategories = async () => {
    return await Category.find({ isActive: true }).sort({ sortOrder: 1 });
};

exports.getSubcategories = async (slug) => {
    const category = await Category.findOne({ slug, isActive: true });
    if (!category) throw new ApiError(404, 'NOT_FOUND', 'Category not found');
    
    return await Subcategory.find({ category: category._id }).sort({ sortOrder: 1 });
};

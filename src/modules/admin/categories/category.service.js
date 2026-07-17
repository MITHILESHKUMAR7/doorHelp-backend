const Category = require('../../shared/models/category.model');
const ApiError = require('../../../common/utils/apiError');

exports.createCategory = async (data) => {
    const category = await Category.create(data);
    return category;
};

exports.getAllCategories = async () => {
    return await Category.find().sort({ sortOrder: 1 });
};

exports.updateCategory = async (id, data) => {
    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    if (!category) throw new ApiError(404, 'NOT_FOUND', 'Category not found');
    return category;
};

exports.deleteCategory = async (id) => {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new ApiError(404, 'NOT_FOUND', 'Category not found');
    return category;
};

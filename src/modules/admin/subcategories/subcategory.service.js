const Subcategory = require('../../shared/models/subcategory.model');
const ApiError = require('../../../common/utils/apiError');

exports.createSubcategory = async (data) => {
    return await Subcategory.create(data);
};

exports.getAllSubcategories = async (filters = {}) => {
    return await Subcategory.find({ ...filters, isDeleted: false }).populate('category');
};

exports.updateSubcategory = async (id, data) => {
    const sub = await Subcategory.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true });
    if (!sub) throw new ApiError(404, 'NOT_FOUND', 'Subcategory not found');
    return sub;
};

exports.deleteSubcategory = async (id) => {
    // Soft Delete
    const sub = await Subcategory.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!sub) throw new ApiError(404, 'NOT_FOUND', 'Subcategory not found');
    return sub;
};

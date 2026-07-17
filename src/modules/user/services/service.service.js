const Service = require('../../shared/models/service.model');
const ApiError = require('../../../common/utils/apiError');

exports.getActiveServices = async (filters = {}) => {
    // Only return active services for users
    return await Service.find({ ...filters, isActive: true }).populate('category subcategory');
};

exports.getServiceBySlug = async (slug) => {
    const service = await Service.findOne({ slug, isActive: true }).populate('category subcategory');
    if (!service) throw new ApiError(404, 'NOT_FOUND', 'Service not found');
    return service;
};

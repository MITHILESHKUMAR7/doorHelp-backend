const Service = require('../../shared/models/service.model');
const ApiError = require('../../../common/utils/apiError');

exports.createService = async (data) => {
    return await Service.create(data);
};

exports.getAllServices = async (filters = {}) => {
    return await Service.find(filters).populate('category subcategory');
};

exports.updateService = async (id, data) => {
    const service = await Service.findByIdAndUpdate(id, data, { new: true });
    if (!service) throw new ApiError(404, 'NOT_FOUND', 'Service not found');
    return service;
};

exports.deleteService = async (id) => {
    // Soft Delete
    const service = await Service.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!service) throw new ApiError(404, 'NOT_FOUND', 'Service not found');
    return service;
};

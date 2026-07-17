const ServiceAddon = require('../../shared/models/serviceAddon.model');
const ApiError = require('../../../common/utils/apiError');

exports.createAddon = async (data) => {
    return await ServiceAddon.create(data);
};

exports.getAllAddons = async (filters = {}) => {
    return await ServiceAddon.find({ ...filters, isDeleted: false }).populate('services');
};

exports.updateAddon = async (id, data) => {
    const addon = await ServiceAddon.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true });
    if (!addon) throw new ApiError(404, 'NOT_FOUND', 'Addon not found');
    return addon;
};

exports.deleteAddon = async (id) => {
    // Soft Delete
    const addon = await ServiceAddon.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!addon) throw new ApiError(404, 'NOT_FOUND', 'Addon not found');
    return addon;
};

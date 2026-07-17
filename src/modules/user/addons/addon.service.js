const ServiceAddon = require('../../shared/models/serviceAddon.model');

exports.getActiveAddons = async (filters = {}) => {
    return await ServiceAddon.find({ ...filters, isDeleted: false, isActive: true });
};

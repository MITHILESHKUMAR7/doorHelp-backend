const Address = require('../../shared/models/address.model');
const ApiError = require('../../../common/utils/apiError');

exports.createAddress = async (userId, data) => {
    return await Address.create({ ...data, user: userId });
};

exports.getAddresses = async (userId) => {
    return await Address.find({ user: userId, isDeleted: false });
};

exports.updateAddress = async (id, userId, data) => {
    const address = await Address.findOneAndUpdate({ _id: id, user: userId, isDeleted: false }, data, { new: true });
    if (!address) throw new ApiError(404, 'NOT_FOUND', 'Address not found');
    return address;
};

exports.deleteAddress = async (id, userId) => {
    const address = await Address.findOneAndUpdate({ _id: id, user: userId, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!address) throw new ApiError(404, 'NOT_FOUND', 'Address not found');
    return address;
};

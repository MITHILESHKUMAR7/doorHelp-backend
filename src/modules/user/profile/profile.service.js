const User = require('../../shared/models/user.model');
const ApiError = require('../../../common/utils/apiError');

exports.getProfile = async (userId) => {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user || user.isDeleted) throw new ApiError(404, 'NOT_FOUND', 'User not found');
    return user;
};

exports.updateProfile = async (userId, data) => {
    // Only allow updating specific fields
    const { fullName, email, avatarUrl } = data;
    const user = await User.findByIdAndUpdate(userId, { fullName, email, avatarUrl }, { new: true }).select('-passwordHash');
    if (!user || user.isDeleted) throw new ApiError(404, 'NOT_FOUND', 'User not found');
    return user;
};

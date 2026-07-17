const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../shared/models/user.model');
const env = require('../../../config/env');
const ApiError = require('../../../common/utils/apiError');

const generateTokens = (user) => {
    const accessToken = jwt.sign({ sub: user._id, role: user.role }, env.JWT_ADMIN_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: user._id }, env.JWT_ADMIN_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

exports.login = async (email, password) => {
    const admin = await User.findOne({ email, role: { $in: ['admin', 'superadmin'] } });
    if (!admin) throw new ApiError(401, 'UNAUTHORIZED', 'Invalid credentials');
    
    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) throw new ApiError(401, 'UNAUTHORIZED', 'Invalid credentials');
    
    return generateTokens(admin);
};

exports.refreshToken = async (token) => {
    try {
        const payload = jwt.verify(token, env.JWT_ADMIN_REFRESH_SECRET);
        const admin = await User.findById(payload.sub);
        if (!admin || !['admin', 'superadmin'].includes(admin.role)) throw new Error();
        return generateTokens(admin);
    } catch (e) {
        throw new ApiError(401, 'UNAUTHORIZED', 'Invalid refresh token');
    }
};

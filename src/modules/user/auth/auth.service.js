const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../shared/models/user.model');
const OTP = require('../../shared/models/otp.model');
const env = require('../../../config/env');
const ApiError = require('../../../common/utils/apiError');

const generateTokens = (user) => {
    const accessToken = jwt.sign({ sub: user._id, role: user.role }, env.JWT_USER_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: user._id }, env.JWT_USER_REFRESH_SECRET, { expiresIn: '30d' });
    return { accessToken, refreshToken };
};

exports.requestOtp = async (phone) => {
    const code = env.OTP_STATIC_CODE || '1234';
    const codeHash = await bcrypt.hash(code, 10);
    
    await OTP.deleteMany({ phone, purpose: 'login' });
    
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 mins
    await OTP.create({ phone, codeHash, purpose: 'login', expiresAt });
    
    return { message: 'OTP sent successfully' };
};

exports.verifyOtp = async (phone, code) => {
    const otpRecord = await OTP.findOne({ phone, purpose: 'login' });
    if (!otpRecord) throw new ApiError(400, 'BAD_REQUEST', 'OTP expired or not requested');
    
    if (otpRecord.attempts >= 5) {
        await OTP.deleteOne({ _id: otpRecord._id });
        throw new ApiError(400, 'BAD_REQUEST', 'Max attempts reached. Request a new OTP.');
    }
    
    const isValid = await bcrypt.compare(code, otpRecord.codeHash);
    if (!isValid) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        throw new ApiError(400, 'BAD_REQUEST', 'Invalid OTP');
    }
    
    await OTP.deleteOne({ _id: otpRecord._id });
    
    let user = await User.findOne({ phone, role: 'customer' });
    if (user) {
        return { isNewUser: false, ...generateTokens(user) };
    } else {
        const tempToken = jwt.sign({ phone }, env.JWT_USER_ACCESS_SECRET, { expiresIn: '15m' });
        return { isNewUser: true, tempToken };
    }
};

exports.register = async (tempToken, fullName, email, referralCode) => {
    const payload = jwt.verify(tempToken, env.JWT_USER_ACCESS_SECRET);
    if (!payload.phone) throw new ApiError(400, 'BAD_REQUEST', 'Invalid temp token');
    
    const existing = await User.findOne({ phone: payload.phone });
    if (existing) throw new ApiError(400, 'BAD_REQUEST', 'User already exists');
    
    const user = await User.create({
        fullName,
        email,
        phone: payload.phone,
        role: 'customer',
        isPhoneVerified: true
    });
    
    return generateTokens(user);
};

exports.refreshToken = async (token) => {
    try {
        const payload = jwt.verify(token, env.JWT_USER_REFRESH_SECRET);
        const user = await User.findById(payload.sub);
        if (!user || user.role !== 'customer') throw new Error();
        return generateTokens(user);
    } catch (e) {
        throw new ApiError(401, 'UNAUTHORIZED', 'Invalid refresh token');
    }
};

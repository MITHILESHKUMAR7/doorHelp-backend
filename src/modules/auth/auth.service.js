const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../users/user.model');
const otpRepository = require('./otp.repository');
const ApiError = require('../../common/utils/apiError');
const ROLES = require('../../common/constants/roles');
const env = require('../../config/env');
const logger = require('../../logger/logger');
const {
  issueTokenPair,
  signTempSignupToken,
  verifyTempSignupToken,
  generateReferralCode,
} = require('./auth.helper');

/**
 * PHASE 2 NOTE: the OTP *code itself* is static for now (env.OTP_STATIC_CODE) — no SMS
 * provider is wired up yet. Everything else (hashing, persistence, TTL expiry, attempt
 * limiting) is already real, so swapping in a real SMS provider later is a one-line change
 * inside this function only — nothing else in the codebase needs to change.
 * TODO (later phase): generate a random 4-digit code + call SMS provider instead of using
 * env.OTP_STATIC_CODE, once SMS_PROVIDER_API_KEY is wired up.
 */
async function requestOtp(phone) {
  const code = env.OTP_STATIC_MODE ? env.OTP_STATIC_CODE : null;
  if (!code) {
    throw new ApiError(500, 'INTERNAL_ERROR', 'Real OTP mode not implemented yet');
  }

  const codeHash = await bcrypt.hash(code, 10);
  await otpRepository.createOtp({ phone, codeHash, purpose: 'login' });

  logger.info(`[STATIC OTP] phone=${phone} otp=${code} (persisted, expires in 5 min)`);

  return {
    otpSent: true,
    ...(env.NODE_ENV !== 'production' ? { devNote: `Static OTP mode is ON. Use ${code}.` } : {}),
  };
}

async function verifyOtp(phone, otp) {
  const otpRecord = await otpRepository.findActiveOtp({ phone, purpose: 'login' });

  if (!otpRecord) {
    throw new ApiError(400, 'OTP_EXPIRED', 'OTP has expired or was not requested. Please request a new one.');
  }

  if (otpRecord.attempts >= otpRepository.MAX_ATTEMPTS) {
    throw new ApiError(429, 'TOO_MANY_ATTEMPTS', 'Too many incorrect attempts. Please request a new OTP.');
  }

  const isMatch = await bcrypt.compare(otp, otpRecord.codeHash);
  if (!isMatch) {
    await otpRepository.incrementAttempts(otpRecord._id);
    throw new ApiError(400, 'INVALID_OTP', 'Invalid OTP');
  }

  await otpRepository.markConsumed(otpRecord._id);

  const existingUser = await User.findOne({ phone, role: ROLES.CUSTOMER });

  if (existingUser) {
    existingUser.lastLoginAt = new Date();
    existingUser.isPhoneVerified = true;
    await existingUser.save();
    return { isNewUser: false, ...issueTokenPair(existingUser) };
  }

  return { isNewUser: true, tempToken: signTempSignupToken(phone) };
}

async function register({ tempToken, fullName, email, referralCode }) {
  let phone;
  try {
    phone = verifyTempSignupToken(tempToken);
  } catch (err) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Signup session expired, please verify OTP again');
  }

  const alreadyExists = await User.findOne({ phone });
  if (alreadyExists) {
    throw new ApiError(409, 'CONFLICT', 'An account with this phone number already exists');
  }

  let referredBy = null;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (!referrer) {
      throw new ApiError(400, 'INVALID_REFERRAL_CODE', 'Referral code is not valid');
    }
    referredBy = referrer._id;
  }

  const user = await User.create({
    phone,
    fullName,
    email,
    referredBy,
    referralCode: generateReferralCode(fullName),
    isPhoneVerified: true,
    lastLoginAt: new Date(),
  });

  return issueTokenPair(user);
}

async function refreshAccessToken(refreshToken) {
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Account not found or inactive');
  }

  return issueTokenPair(user);
}

async function adminLogin(email, password) {
  const user = await User.findOne({
    email: email.toLowerCase(),
    role: { $in: [ROLES.ADMIN, ROLES.SUPERADMIN] },
  }).select('+passwordHash');

  if (!user || !user.passwordHash) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  user.lastLoginAt = new Date();
  await user.save();

  return { ...issueTokenPair(user), role: user.role, fullName: user.fullName };
}

module.exports = { requestOtp, verifyOtp, register, refreshAccessToken, adminLogin };

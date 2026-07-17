const bcrypt = require('bcryptjs');
const userRepository = require('../../shared/repositories/user.repository');
const otpRepository = require('../../shared/repositories/otp.repository');
const ApiError = require('../../../common/utils/apiError');
const ROLES = require('../../../common/constants/roles');
const env = require('../../../config/env');
const logger = require('../../../logger/logger');
const {
  issueUserTokenPair,
  signTempSignupToken,
  verifyTempSignupToken,
  verifyUserRefreshToken,
  generateReferralCode,
} = require('../../../common/helpers/auth.helper');

/**
 * PHASE 2 NOTE: the OTP *code itself* is static for now (env.OTP_STATIC_CODE) — no SMS
 * provider is wired up yet. Everything else (hashing, persistence, TTL expiry, attempt
 * limiting) is already real, so swapping in a real SMS provider later is a one-line change
 * inside this function only — nothing else in the codebase needs to change.
 */
async function requestOtp(phone) {
  const code = env.OTP_STATIC_MODE ? env.OTP_STATIC_CODE : null;
  if (!code) {
    throw new ApiError(500, 'INTERNAL_ERROR', 'Real OTP mode not implemented yet');
  }

  const codeHash = await bcrypt.hash(code, 10);
  await otpRepository.createOtp({ phone, codeHash, purpose: 'login' });

  logger.info(`[STATIC OTP] phone=${phone} (persisted, expires in 5 min)`);

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

  const existingUser = await userRepository.findByPhoneAndRole(phone, ROLES.CUSTOMER);

  if (existingUser) {
    existingUser.lastLoginAt = new Date();
    existingUser.isPhoneVerified = true;
    await existingUser.save();
    return { isNewUser: false, ...issueUserTokenPair(existingUser) };
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

  const alreadyExists = await userRepository.findByPhone(phone);
  if (alreadyExists) {
    throw new ApiError(409, 'CONFLICT', 'An account with this phone number already exists');
  }

  let referredBy = null;
  if (referralCode) {
    const referrer = await userRepository.findByReferralCode(referralCode);
    if (!referrer) {
      throw new ApiError(400, 'INVALID_REFERRAL_CODE', 'Referral code is not valid');
    }
    referredBy = referrer._id;
  }

  const user = await userRepository.create({
    phone,
    fullName,
    email,
    referredBy,
    referralCode: generateReferralCode(fullName),
    role: ROLES.CUSTOMER,
    isPhoneVerified: true,
    lastLoginAt: new Date(),
  });

  return issueUserTokenPair(user);
}

async function refreshAccessToken(refreshToken) {
  let payload;
  try {
    payload = verifyUserRefreshToken(refreshToken);
  } catch (err) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
  }

  const user = await userRepository.findById(payload.sub);
  if (!user || !user.isActive) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Account not found or inactive');
  }

  return issueUserTokenPair(user);
}

module.exports = { requestOtp, verifyOtp, register, refreshAccessToken };

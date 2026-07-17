const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../../config/env');

function signAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  });
}

function issueTokenPair(user) {
  return { accessToken: signAccessToken(user), refreshToken: signRefreshToken(user) };
}

/** Short-lived token issued after OTP verify for a brand-new phone, so /auth/register can trust the phone was verified. */
function signTempSignupToken(phone) {
  return jwt.sign({ phone, purpose: 'signup' }, env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
}

function verifyTempSignupToken(tempToken) {
  const payload = jwt.verify(tempToken, env.JWT_ACCESS_SECRET);
  if (payload.purpose !== 'signup') throw new Error('Invalid token purpose');
  return payload.phone;
}

function generateReferralCode(fullName) {
  const prefix = (fullName || 'DH').replace(/\s+/g, '').slice(0, 4).toUpperCase();
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}${suffix}`;
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  issueTokenPair,
  signTempSignupToken,
  verifyTempSignupToken,
  generateReferralCode,
};

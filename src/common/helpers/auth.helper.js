const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../../config/env');

// ── User-side token helpers ──────────────────────────────────────────────────

function signUserAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_USER_ACCESS_SECRET, {
    expiresIn: env.JWT_USER_ACCESS_EXPIRY,
  });
}

function signUserRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_USER_REFRESH_SECRET, {
    expiresIn: env.JWT_USER_REFRESH_EXPIRY,
  });
}

function issueUserTokenPair(user) {
  return {
    accessToken: signUserAccessToken(user),
    refreshToken: signUserRefreshToken(user),
  };
}

/**
 * Short-lived token issued after OTP verify for a brand-new phone number,
 * so /user/auth/register can trust the phone was verified without storing state.
 * Uses the USER access secret since it's part of the customer auth flow.
 */
function signTempSignupToken(phone) {
  return jwt.sign({ phone, purpose: 'signup' }, env.JWT_USER_ACCESS_SECRET, { expiresIn: '10m' });
}

function verifyTempSignupToken(tempToken) {
  const payload = jwt.verify(tempToken, env.JWT_USER_ACCESS_SECRET);
  if (payload.purpose !== 'signup') throw new Error('Invalid token purpose');
  return payload.phone;
}

// ── Admin-side token helpers ─────────────────────────────────────────────────

function signAdminAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_ADMIN_ACCESS_SECRET, {
    expiresIn: env.JWT_ADMIN_ACCESS_EXPIRY,
  });
}

function signAdminRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_ADMIN_REFRESH_SECRET, {
    expiresIn: env.JWT_ADMIN_REFRESH_EXPIRY,
  });
}

function issueAdminTokenPair(user) {
  return {
    accessToken: signAdminAccessToken(user),
    refreshToken: signAdminRefreshToken(user),
  };
}

function verifyAdminRefreshToken(token) {
  return jwt.verify(token, env.JWT_ADMIN_REFRESH_SECRET);
}

function verifyUserRefreshToken(token) {
  return jwt.verify(token, env.JWT_USER_REFRESH_SECRET);
}

// ── Shared helper ────────────────────────────────────────────────────────────

function generateReferralCode(fullName) {
  const prefix = (fullName || 'DH').replace(/\s+/g, '').slice(0, 4).toUpperCase();
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}${suffix}`;
}

module.exports = {
  issueUserTokenPair,
  signTempSignupToken,
  verifyTempSignupToken,
  issueAdminTokenPair,
  verifyAdminRefreshToken,
  verifyUserRefreshToken,
  generateReferralCode,
};

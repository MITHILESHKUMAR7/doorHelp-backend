const Otp = require('./otp.model');

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 5;

/** Replaces any previous OTP for this phone+purpose with a fresh one (one active OTP at a time). */
async function createOtp({ phone, codeHash, purpose }) {
  await Otp.deleteMany({ phone, purpose, consumedAt: null });
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  return Otp.create({ phone, codeHash, purpose, expiresAt });
}

/** Fetches the latest unconsumed, non-expired OTP for this phone+purpose. */
function findActiveOtp({ phone, purpose }) {
  return Otp.findOne({ phone, purpose, consumedAt: null, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
}

function incrementAttempts(otpId) {
  return Otp.findByIdAndUpdate(otpId, { $inc: { attempts: 1 } }, { new: true });
}

function markConsumed(otpId) {
  return Otp.findByIdAndUpdate(otpId, { consumedAt: new Date() });
}

module.exports = { createOtp, findActiveOtp, incrementAttempts, markConsumed, MAX_ATTEMPTS };

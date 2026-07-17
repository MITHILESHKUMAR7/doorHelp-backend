const mongoose = require('mongoose');

/**
 * Every OTP request/verify is persisted here — even in STATIC mode — so we get
 * a real audit trail, attempts-limiting, and expiry behaviour identical to what
 * production (real SMS) mode will use later. Only the "how the code is generated
 * and delivered" part is static right now (see auth.service.js).
 */
const otpSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, trim: true },
    codeHash: { type: String, required: true }, // bcrypt hash, never store plaintext OTP
    purpose: { type: String, enum: ['login', 'signup'], default: 'login' },
    attempts: { type: Number, default: 0 },
    consumedAt: { type: Date, default: null }, // set once successfully verified
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

otpSchema.index({ phone: 1, purpose: 1 });
// TTL index: MongoDB auto-deletes the document once expiresAt passes. No cron needed.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);

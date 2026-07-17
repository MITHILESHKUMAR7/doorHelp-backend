const { z } = require('zod');

const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number');

const otpRequestSchema = {
  body: z.object({ phone: phoneSchema }),
};

const otpVerifySchema = {
  body: z.object({
    phone: phoneSchema,
    otp: z.string().length(4, 'OTP must be 4 digits'),
  }),
};

const registerSchema = {
  body: z.object({
    tempToken: z.string().min(1, 'tempToken is required'),
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email().optional(),
    referralCode: z.string().optional(),
  }),
};

const refreshTokenSchema = {
  body: z.object({ refreshToken: z.string().min(1) }),
};

module.exports = { otpRequestSchema, otpVerifySchema, registerSchema, refreshTokenSchema };

const { z } = require('zod');

const loginSchema = {
  body: z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
};

const refreshTokenSchema = {
  body: z.object({ refreshToken: z.string().min(1) }),
};

module.exports = { loginSchema, refreshTokenSchema };

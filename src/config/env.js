require('dotenv').config();
const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.string().default('5000'),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),

  // USER-side JWT (modules/user/auth) — signs tokens for customers
  JWT_USER_ACCESS_SECRET: z.string().min(10, 'JWT_USER_ACCESS_SECRET is too short'),
  JWT_USER_REFRESH_SECRET: z.string().min(10, 'JWT_USER_REFRESH_SECRET is too short'),
  JWT_USER_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_USER_REFRESH_EXPIRY: z.string().default('30d'),

  // ADMIN-side JWT (modules/admin/auth) — signs tokens for admin/superadmin
  // Deliberately separate secrets from USER above — a customer token physically cannot
  // verify against the admin secret, removing an entire class of privilege-escalation bugs.
  JWT_ADMIN_ACCESS_SECRET: z.string().min(10, 'JWT_ADMIN_ACCESS_SECRET is too short'),
  JWT_ADMIN_REFRESH_SECRET: z.string().min(10, 'JWT_ADMIN_REFRESH_SECRET is too short'),
  JWT_ADMIN_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_ADMIN_REFRESH_EXPIRY: z.string().default('7d'),

  OTP_STATIC_MODE: z.string().default('true'),
  OTP_STATIC_CODE: z.string().default('1234'),

  CORS_ORIGIN: z.string().default('*'),

  // Superadmin seed script
  SUPERADMIN_EMAIL: z.string().optional(),
  SUPERADMIN_PASSWORD: z.string().optional(),
  SUPERADMIN_NAME: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid/missing environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = {
  ...parsed.data,
  PORT: Number(parsed.data.PORT),
  OTP_STATIC_MODE: parsed.data.OTP_STATIC_MODE === 'true',
};

// Boot-time assertion: user and admin secrets MUST be different values.
// This enforces the dual-token isolation guarantee at startup, not just by convention.
if (env.JWT_USER_ACCESS_SECRET === env.JWT_ADMIN_ACCESS_SECRET) {
  console.error('❌ JWT_USER_ACCESS_SECRET and JWT_ADMIN_ACCESS_SECRET must be different values.');
  process.exit(1);
}
if (env.JWT_USER_REFRESH_SECRET === env.JWT_ADMIN_REFRESH_SECRET) {
  console.error('❌ JWT_USER_REFRESH_SECRET and JWT_ADMIN_REFRESH_SECRET must be different values.');
  process.exit(1);
}

module.exports = env;

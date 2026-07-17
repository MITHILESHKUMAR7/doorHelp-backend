/**
 * Run: npm run seed:superadmin
 * Creates the first superadmin using SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD / SUPERADMIN_NAME from .env
 * so credentials never live hardcoded in source (see Production Readiness Checklist §38).
 */
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const env = require('../config/env');
const connectDB = require('../config/db');
const User = require('../modules/users/user.model');
const ROLES = require('../common/constants/roles');
const logger = require('../logger/logger');

async function seed() {
  if (!env.SUPERADMIN_EMAIL || !env.SUPERADMIN_PASSWORD) {
    logger.error('SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD not set in .env');
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email: env.SUPERADMIN_EMAIL });
  if (existing) {
    logger.info('Superadmin already exists, skipping.');
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(env.SUPERADMIN_PASSWORD, 10);

  await User.create({
    fullName: env.SUPERADMIN_NAME || 'Super Admin',
    email: env.SUPERADMIN_EMAIL,
    phone: '9999999999', // placeholder unique phone for admin-only account
    role: ROLES.SUPERADMIN,
    passwordHash,
    isPhoneVerified: true,
  });

  logger.info(`Superadmin created: ${env.SUPERADMIN_EMAIL}`);
  await mongoose.disconnect();
}

seed();

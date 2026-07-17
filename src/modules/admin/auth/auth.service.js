const bcrypt = require('bcryptjs');
const userRepository = require('../../shared/repositories/user.repository');
const ApiError = require('../../../common/utils/apiError');
const ROLES = require('../../../common/constants/roles');
const {
  issueAdminTokenPair,
  verifyAdminRefreshToken,
} = require('../../../common/helpers/auth.helper');

/**
 * Admin login — email + password only, no OTP.
 * Only users with role admin or superadmin can log in here.
 * Issues an ADMIN JWT signed with JWT_ADMIN_ACCESS_SECRET — physically separate from user tokens.
 */
async function adminLogin(email, password) {
  const user = await userRepository.findAdminByEmail(email, [ROLES.ADMIN, ROLES.SUPERADMIN]);

  if (!user || !user.passwordHash) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'FORBIDDEN', 'This account has been deactivated');
  }

  user.lastLoginAt = new Date();
  await user.save();

  return {
    ...issueAdminTokenPair(user),
    role: user.role,
    fullName: user.fullName,
  };
}

async function refreshAccessToken(refreshToken) {
  let payload;
  try {
    payload = verifyAdminRefreshToken(refreshToken);
  } catch (err) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
  }

  const user = await userRepository.findById(payload.sub);
  if (!user || !user.isActive) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Account not found or inactive');
  }
  if (![ROLES.ADMIN, ROLES.SUPERADMIN].includes(user.role)) {
    throw new ApiError(403, 'FORBIDDEN', 'Not an admin account');
  }

  return issueAdminTokenPair(user);
}

module.exports = { adminLogin, refreshAccessToken };

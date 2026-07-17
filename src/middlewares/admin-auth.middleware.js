const jwt = require('jsonwebtoken');
const ApiError = require('../common/utils/apiError');
const env = require('../config/env');

/**
 * Verifies an ADMIN access token signed with JWT_ADMIN_ACCESS_SECRET.
 * Attaches { id, role } to req.admin.
 *
 * This middleware ONLY accepts tokens issued by modules/admin/auth — any user/customer token
 * (signed with JWT_USER_ACCESS_SECRET) will fail signature verification here. This means
 * a customer token can never reach an admin controller, regardless of any downstream bug.
 */
function adminAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Access token missing');
    }

    const payload = jwt.verify(token, env.JWT_ADMIN_ACCESS_SECRET);
    req.admin = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    // Emit a clear signal if a wrong-audience token was attempted
    next(new ApiError(401, 'INVALID_TOKEN_AUDIENCE', 'Invalid or expired access token'));
  }
}

module.exports = adminAuth;

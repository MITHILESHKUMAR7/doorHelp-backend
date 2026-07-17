const jwt = require('jsonwebtoken');
const ApiError = require('../common/utils/apiError');
const env = require('../config/env');

/**
 * Verifies a USER access token signed with JWT_USER_ACCESS_SECRET.
 * Attaches { id, role } to req.user.
 *
 * This middleware ONLY accepts tokens issued by modules/user/auth — any admin token
 * (signed with JWT_ADMIN_ACCESS_SECRET) will fail signature verification here, enforcing
 * the audience boundary at the crypto level before any business logic runs.
 */
function userAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Access token missing');
    }

    const payload = jwt.verify(token, env.JWT_USER_ACCESS_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    next(new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired access token'));
  }
}

module.exports = userAuth;

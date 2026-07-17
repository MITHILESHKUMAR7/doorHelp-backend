const jwt = require('jsonwebtoken');
const ApiError = require('../common/utils/apiError');
const env = require('../config/env');

/** Verifies the access token and attaches { id, role } to req.user */
function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Access token missing');
    }

    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    next(new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired access token'));
  }
}

module.exports = auth;

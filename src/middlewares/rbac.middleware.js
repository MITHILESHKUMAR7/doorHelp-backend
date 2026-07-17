const ApiError = require('../common/utils/apiError');

/** Usage: router.patch('/x', auth, rbac(['admin', 'superadmin']), controller) */
function rbac(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'FORBIDDEN', 'You do not have permission to perform this action'));
    }
    next();
  };
}

module.exports = rbac;

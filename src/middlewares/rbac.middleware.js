const ApiError = require('../common/utils/apiError');

/** Usage: router.patch('/x', auth, rbac('admin', 'superadmin'), controller) */
function rbac(...roles) {
  const allowedRoles = roles.flat();
  return (req, res, next) => {
    const user = req.user || req.admin;
    if (!user || !allowedRoles.includes(user.role)) {
      return next(new ApiError(403, 'FORBIDDEN', 'You do not have permission to perform this action'));
    }
    next();
  };
}

module.exports = rbac;

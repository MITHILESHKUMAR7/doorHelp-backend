const express = require('express');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const validate = require('../../middlewares/validate.middleware');
const ROLES = require('../../common/constants/roles');
const controller = require('./review.controller');
const { listReviewsAdminSchema, idParamSchema } = require('./review.validator');

const router = express.Router();
const adminOnly = [auth, rbac([ROLES.ADMIN, ROLES.SUPERADMIN])];

router.get('/', ...adminOnly, validate(listReviewsAdminSchema), controller.listReviewsAdmin);
router.patch('/:id/toggle-visibility', ...adminOnly, validate(idParamSchema), controller.toggleVisibility);

module.exports = router;
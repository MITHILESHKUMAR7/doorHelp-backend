const express = require('express');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const validate = require('../../middlewares/validate.middleware');
const ROLES = require('../../common/constants/roles');
const controller = require('./coupon.controller');
const { createCouponSchema, updateCouponSchema, idParamSchema } = require('./coupon.validator');

const router = express.Router();
const adminOnly = [auth, rbac([ROLES.ADMIN, ROLES.SUPERADMIN])];

router.get('/', ...adminOnly, controller.listCoupons);
router.post('/', ...adminOnly, validate(createCouponSchema), controller.createCoupon);
router.patch('/:id', ...adminOnly, validate(updateCouponSchema), controller.updateCoupon);
router.delete('/:id', ...adminOnly, validate(idParamSchema), controller.deleteCoupon);

module.exports = router;
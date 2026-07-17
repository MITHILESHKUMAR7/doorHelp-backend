const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');
const couponService = require('./coupon.service');

const listCoupons = asyncHandler(async (req, res) => {
  const coupons = await couponService.listCouponsForAdmin();
  sendSuccess(res, { message: 'Coupons fetched', data: coupons });
});

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Coupon created', data: coupon });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.updateCoupon(req.params.id, req.body);
  sendSuccess(res, { message: 'Coupon updated', data: coupon });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  await couponService.deleteCoupon(req.params.id);
  sendSuccess(res, { message: 'Coupon deleted' });
});

module.exports = { listCoupons, createCoupon, updateCoupon, deleteCoupon };
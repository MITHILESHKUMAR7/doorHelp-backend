const couponRepository = require('./coupon.repository');
const ApiError = require('../../common/utils/apiError');

/**
 * Called by cart.service.js when the user applies a coupon code.
 * NOTE: per-user / total usage-limit enforcement is NOT implemented yet — it needs a query
 * across the `bookings` collection (count bookings where priceBreakdown.couponCode = code).
 * TODO (later phase): enforce usageLimitPerUser / totalUsageLimit at booking-creation time in
 * booking.service.js, since that's the point a coupon is actually "spent", not at cart-apply time.
 */
async function validateAndComputeDiscount(code, cartSubtotal) {
  const coupon = await couponRepository.findActiveByCode(code);

  if (!coupon) {
    throw new ApiError(404, 'INVALID_COUPON', 'Coupon code is invalid or inactive');
  }

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validTill) {
    throw new ApiError(400, 'COUPON_EXPIRED', 'This coupon is not valid right now');
  }

  if (cartSubtotal < coupon.minCartValue) {
    throw new ApiError(400, 'MIN_CART_VALUE_NOT_MET', `Add items worth at least ₹${coupon.minCartValue} to use this coupon`);
  }

  let discount =
    coupon.discountType === 'percentage' ? Math.round((cartSubtotal * coupon.discountValue) / 100) : coupon.discountValue;

  if (coupon.discountType === 'percentage' && coupon.maxDiscountAmount) {
    discount = Math.min(discount, coupon.maxDiscountAmount);
  }
  discount = Math.min(discount, cartSubtotal); // never discount more than the cart is worth

  return { coupon, discount };
}

function listCouponsForAdmin() {
  return couponRepository.findAllForAdmin();
}

async function createCoupon(payload) {
  const existing = await couponRepository.findByCodeRaw(payload.code);
  if (existing) throw new ApiError(409, 'CONFLICT', 'A coupon with this code already exists');
  return couponRepository.create(payload);
}

async function updateCoupon(id, payload) {
  const coupon = await couponRepository.findById(id);
  if (!coupon) throw new ApiError(404, 'COUPON_NOT_FOUND', 'Coupon not found');
  return couponRepository.updateById(id, payload);
}

async function deleteCoupon(id) {
  const coupon = await couponRepository.findById(id);
  if (!coupon) throw new ApiError(404, 'COUPON_NOT_FOUND', 'Coupon not found');
  await couponRepository.deleteById(id);
}

module.exports = { validateAndComputeDiscount, listCouponsForAdmin, createCoupon, updateCoupon, deleteCoupon };
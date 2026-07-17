/**
 * Every Mongoose model MUST be required here once, at boot, before any request is served.
 * Why: Mongoose resolves `ref: 'Category'` etc. by name at populate-time, not at require-time.
 * If a model file has never been required, populate() throws "Schema hasn't been registered".
 * Requiring them centrally here means individual modules never have to worry about it.
 *
 * ACTION FOR NEW MODULES: whenever you add a new model file, add one require() line here.
 */
require('../modules/users/user.model');
require('../modules/auth/otp.model');
require('../modules/addresses/address.model');
require('../modules/categories/category.model');
require('../modules/categories/subcategory.model');
require('../modules/services/service.model');
require('../modules/services/serviceAddon.model');
require('../modules/coupons/coupon.model');
require('../modules/cart/cart.model');
require('../modules/bookings/booking.model');
require('../modules/technicians/technician.model');
require('../modules/reviews/review.model');
require('../modules/referrals/referral.model');
require('../modules/payments/payment.model');

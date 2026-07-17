/**
 * Every Mongoose model MUST be required here once, at boot, before any request is served.
 * Why: Mongoose resolves `ref: 'Category'` etc. by name at populate-time, not at require-time.
 * If a model file has never been required, populate() throws "Schema hasn't been registered".
 * Requiring them centrally here means individual modules never have to worry about it.
 *
 * All models now live in modules/shared/models/ — single source of truth, never duplicated.
 */
require('../modules/shared/models/user.model');
require('../modules/shared/models/otp.model');
require('../modules/shared/models/address.model');
require('../modules/shared/models/category.model');
require('../modules/shared/models/subcategory.model');
require('../modules/shared/models/service.model');
require('../modules/shared/models/serviceAddon.model');
require('../modules/shared/models/coupon.model');
require('../modules/shared/models/cart.model');
require('../modules/shared/models/booking.model');
require('../modules/shared/models/technician.model');
require('../modules/shared/models/review.model');
require('../modules/shared/models/referral.model');
require('../modules/shared/models/payment.model');

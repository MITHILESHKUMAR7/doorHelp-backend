module.exports = {
  adminRouter: require('./admin.routes'),
  couponService: require('./coupon.service'), // consumed by cart module for applying a coupon
};
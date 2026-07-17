module.exports = {
  adminRouter: require('./admin.routes'),
  reviewService: require('./review.service'), // exported for services/bookings modules to consume directly
};
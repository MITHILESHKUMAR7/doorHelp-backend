module.exports = {
  adminRouter: require('./admin.routes'),
  technicianService: require('./technician.service'), // consumed by bookings module for assignment
};
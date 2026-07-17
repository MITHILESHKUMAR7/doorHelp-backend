const Coupon = require('./coupon.model');

function findActiveByCode(code) {
  return Coupon.findOne({ code: code.toUpperCase(), isActive: true });
}

function findAllForAdmin() {
  return Coupon.find({}).sort({ createdAt: -1 }).lean();
}

function findById(id) {
  return Coupon.findById(id);
}

function findByCodeRaw(code) {
  return Coupon.findOne({ code: code.toUpperCase() });
}

function create(data) {
  data.code = data.code.toUpperCase();
  return Coupon.create(data);
}

function updateById(id, data) {
  if (data.code) data.code = data.code.toUpperCase();
  return Coupon.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteById(id) {
  return Coupon.findByIdAndDelete(id);
}

module.exports = { findActiveByCode, findAllForAdmin, findById, findByCodeRaw, create, updateById, deleteById };
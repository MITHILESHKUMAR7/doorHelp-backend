const User = require('../models/user.model');

function findById(id) {
  return User.findById(id);
}

function findByPhone(phone) {
  return User.findOne({ phone });
}

function findByPhoneAndRole(phone, role) {
  return User.findOne({ phone, role });
}

function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase() });
}

function findAdminByEmail(email, roles) {
  return User.findOne({ email: email.toLowerCase(), role: { $in: roles } }).select('+passwordHash');
}

function findByReferralCode(referralCode) {
  return User.findOne({ referralCode: referralCode.toUpperCase() });
}

function create(data) {
  return User.create(data);
}

function updateById(id, data) {
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function findAllForAdmin({ search, page, limit }) {
  const filter = search
    ? { $or: [{ fullName: { $regex: search, $options: 'i' } }, { phone: { $regex: search, $options: 'i' } }] }
    : {};
  const skip = (page - 1) * limit;
  return Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);
}

function toggleActive(id, isActive) {
  return User.findByIdAndUpdate(id, { isActive }, { new: true });
}

module.exports = {
  findById,
  findByPhone,
  findByPhoneAndRole,
  findByEmail,
  findAdminByEmail,
  findByReferralCode,
  create,
  updateById,
  findAllForAdmin,
  toggleActive,
};

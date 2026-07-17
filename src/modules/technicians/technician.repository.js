const Technician = require('./technician.model');

function findActiveBySkill(categoryId) {
  return Technician.find({ skillCategories: categoryId, isActive: true }).lean();
}

function findAllForAdmin() {
  return Technician.find({}).populate('skillCategories', 'name slug').sort({ createdAt: -1 }).lean();
}

function findById(id) {
  return Technician.findById(id);
}

function findByPhone(phone) {
  return Technician.findOne({ phone });
}

function create(data) {
  return Technician.create(data);
}

function updateById(id, data) {
  return Technician.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteById(id) {
  return Technician.findByIdAndDelete(id);
}

module.exports = { findActiveBySkill, findAllForAdmin, findById, findByPhone, create, updateById, deleteById };
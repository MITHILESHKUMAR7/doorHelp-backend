const ServiceAddon = require('./serviceAddon.model');

function findActiveForService(serviceId) {
  return ServiceAddon.find({ relatedServices: serviceId, isActive: true }).lean();
}

function findAllForAdmin() {
  return ServiceAddon.find({}).populate('relatedServices', 'title slug').lean();
}

function findById(id) {
  return ServiceAddon.findById(id);
}

function findByIds(ids) {
  return ServiceAddon.find({ _id: { $in: ids } }).lean();
}

function create(data) {
  return ServiceAddon.create(data);
}

function updateById(id, data) {
  return ServiceAddon.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteById(id) {
  return ServiceAddon.findByIdAndDelete(id);
}

module.exports = { findActiveForService, findAllForAdmin, findById, findByIds, create, updateById, deleteById };
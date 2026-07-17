const technicianRepository = require('./technician.repository');
const ApiError = require('../../common/utils/apiError');

function listTechniciansForAdmin() {
  return technicianRepository.findAllForAdmin();
}

async function createTechnician(payload) {
  const existing = await technicianRepository.findByPhone(payload.phone);
  if (existing) {
    throw new ApiError(409, 'CONFLICT', 'A technician with this phone number already exists');
  }
  return technicianRepository.create(payload);
}

async function updateTechnician(id, payload) {
  const technician = await technicianRepository.findById(id);
  if (!technician) throw new ApiError(404, 'TECHNICIAN_NOT_FOUND', 'Technician not found');
  return technicianRepository.updateById(id, payload);
}

async function deleteTechnician(id) {
  const technician = await technicianRepository.findById(id);
  if (!technician) throw new ApiError(404, 'TECHNICIAN_NOT_FOUND', 'Technician not found');
  await technicianRepository.deleteById(id);
}

/** Used by bookings module when admin assigns a technician — must be active and skilled in the category. */
async function assertTechnicianIsAssignable(technicianId) {
  const technician = await technicianRepository.findById(technicianId);
  if (!technician || !technician.isActive) {
    throw new ApiError(404, 'TECHNICIAN_NOT_FOUND', 'Technician not found or inactive');
  }
  return technician;
}

module.exports = {
  listTechniciansForAdmin,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  assertTechnicianIsAssignable,
};
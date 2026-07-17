const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');
const technicianService = require('./technician.service');

const listTechnicians = asyncHandler(async (req, res) => {
  const technicians = await technicianService.listTechniciansForAdmin();
  sendSuccess(res, { message: 'Technicians fetched', data: technicians });
});

const createTechnician = asyncHandler(async (req, res) => {
  const technician = await technicianService.createTechnician(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Technician created', data: technician });
});

const updateTechnician = asyncHandler(async (req, res) => {
  const technician = await technicianService.updateTechnician(req.params.id, req.body);
  sendSuccess(res, { message: 'Technician updated', data: technician });
});

const deleteTechnician = asyncHandler(async (req, res) => {
  await technicianService.deleteTechnician(req.params.id);
  sendSuccess(res, { message: 'Technician deleted' });
});

module.exports = { listTechnicians, createTechnician, updateTechnician, deleteTechnician };
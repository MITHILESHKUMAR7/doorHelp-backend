const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');
const serviceService = require('./service.service');

const listServices = asyncHandler(async (req, res) => {
  const { items, pagination } = await serviceService.listServices(req.query);
  sendSuccess(res, { message: 'Services fetched', data: items, meta: pagination });
});

const getServiceDetail = asyncHandler(async (req, res) => {
  const service = await serviceService.getServiceDetail(req.params.slug);
  sendSuccess(res, { message: 'Service fetched', data: service });
});

const getServiceReviews = asyncHandler(async (req, res) => {
  const { items, pagination } = await serviceService.getServiceReviews(req.params.id, req.query);
  sendSuccess(res, { message: 'Reviews fetched', data: items, meta: pagination });
});

const createService = asyncHandler(async (req, res) => {
  const service = await serviceService.createService(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Service created', data: service });
});

const updateService = asyncHandler(async (req, res) => {
  const service = await serviceService.updateService(req.params.id, req.body);
  sendSuccess(res, { message: 'Service updated', data: service });
});

const deleteService = asyncHandler(async (req, res) => {
  await serviceService.deleteService(req.params.id);
  sendSuccess(res, { message: 'Service deleted' });
});

const listAddonsAdmin = asyncHandler(async (req, res) => {
  const addons = await serviceService.listAddonsForAdmin();
  sendSuccess(res, { message: 'Service addons fetched', data: addons });
});

const createAddon = asyncHandler(async (req, res) => {
  const addon = await serviceService.createAddon(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Service addon created', data: addon });
});

const updateAddon = asyncHandler(async (req, res) => {
  const addon = await serviceService.updateAddon(req.params.id, req.body);
  sendSuccess(res, { message: 'Service addon updated', data: addon });
});

const deleteAddon = asyncHandler(async (req, res) => {
  await serviceService.deleteAddon(req.params.id);
  sendSuccess(res, { message: 'Service addon deleted' });
});

module.exports = {
  listServices,
  getServiceDetail,
  getServiceReviews,
  createService,
  updateService,
  deleteService,
  listAddonsAdmin,
  createAddon,
  updateAddon,
  deleteAddon,
};
const asyncHandler = require('../../../common/utils/asyncHandler');
const { sendSuccess } = require('../../../common/utils/apiResponse');
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

module.exports = { listServices, getServiceDetail, getServiceReviews };

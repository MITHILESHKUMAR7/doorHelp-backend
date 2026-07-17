const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const controller = require('./service.controller');
const { listServicesSchema, slugParamSchema, listReviewsSchema } = require('./service.validator');

const router = express.Router();

// GET /api/v1/services?category=&subcategory=&search=&page=&limit= -> category listing / search screen
router.get('/', validate(listServicesSchema), controller.listServices);

// GET /api/v1/services/:slug -> service detail screen
router.get('/:slug', validate(slugParamSchema), controller.getServiceDetail);

// GET /api/v1/services/:id/reviews -> "Customer Reviews" section on detail screen (uses service _id, not slug)
router.get('/:id/reviews', validate(listReviewsSchema), controller.getServiceReviews);

module.exports = router;
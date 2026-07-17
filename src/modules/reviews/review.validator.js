const { z } = require('zod');
const mongoose = require('mongoose');

const objectId = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: 'Invalid id' });

const listReviewsAdminSchema = {
  query: z.object({
    isVisible: z.enum(['true', 'false']).optional().transform((v) => (v === undefined ? undefined : v === 'true')),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  }),
};

const idParamSchema = { params: z.object({ id: objectId }) };

const createReviewSchema = {
  params: z.object({ id: objectId }), // booking id
  body: z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),
  }),
};

module.exports = { listReviewsAdminSchema, idParamSchema, createReviewSchema };
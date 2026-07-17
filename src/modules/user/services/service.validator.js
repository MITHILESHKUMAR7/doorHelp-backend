const { z } = require('zod');
const mongoose = require('mongoose');

const objectId = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: 'Invalid id' });

const listServicesSchema = {
  query: z.object({
    category: objectId.optional(),
    subcategory: objectId.optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  }),
};

const slugParamSchema = {
  params: z.object({ slug: z.string().min(1) }),
};

const reviewsParamSchema = {
  params: z.object({ id: objectId }),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
};

module.exports = { listServicesSchema, slugParamSchema, reviewsParamSchema };

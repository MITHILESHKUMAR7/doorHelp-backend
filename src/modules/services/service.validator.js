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

const idParamSchema = {
  params: z.object({ id: objectId }),
};

const listReviewsSchema = {
  params: z.object({ id: objectId }),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
};

const inclusionSchema = z.object({ title: z.string(), description: z.string().optional(), icon: z.string().optional() });

const createServiceSchema = {
  body: z.object({
    category: objectId,
    subcategory: objectId.optional(),
    title: z.string().min(2),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
    shortDescription: z.string().optional(),
    longDescription: z.string().optional(),
    images: z.array(z.string().url()).optional(),
    price: z.number().min(0),
    strikePrice: z.number().min(0).optional(),
    durationLabel: z.string().optional(),
    isEcoFriendly: z.boolean().optional(),
    inclusions: z.array(inclusionSchema).optional(),
    isBestSeller: z.boolean().optional(),
  }),
};

const updateServiceSchema = {
  params: z.object({ id: objectId }),
  body: createServiceSchema.body.partial().extend({ isActive: z.boolean().optional() }),
};

const createAddonSchema = {
  body: z.object({
    title: z.string().min(2),
    price: z.number().min(0),
    icon: z.string().url().optional(),
    relatedServices: z.array(objectId).default([]),
  }),
};

const updateAddonSchema = {
  params: z.object({ id: objectId }),
  body: createAddonSchema.body.partial().extend({ isActive: z.boolean().optional() }),
};

module.exports = {
  listServicesSchema,
  slugParamSchema,
  idParamSchema,
  listReviewsSchema,
  createServiceSchema,
  updateServiceSchema,
  createAddonSchema,
  updateAddonSchema,
};
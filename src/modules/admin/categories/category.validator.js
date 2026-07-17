const { z } = require('zod');
const mongoose = require('mongoose');

const objectId = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: 'Invalid id' });

const createCategorySchema = {
  body: z.object({
    name: z.string().min(2, 'Category name is required'),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, numbers and hyphens only'),
    iconUrl: z.string().url().optional(),
    sortOrder: z.number().int().optional(),
  }),
};

const updateCategorySchema = {
  params: z.object({ id: objectId }),
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
    iconUrl: z.string().url().optional().nullable(),
    sortOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
};

const idParamSchema = {
  params: z.object({ id: objectId }),
};

const createSubcategorySchema = {
  body: z.object({
    category: objectId,
    name: z.string().min(2, 'Subcategory name is required'),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
    sortOrder: z.number().int().optional(),
  }),
};

const updateSubcategorySchema = {
  params: z.object({ id: objectId }),
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
    sortOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
};

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  idParamSchema,
  createSubcategorySchema,
  updateSubcategorySchema,
};

const { z } = require('zod');
const mongoose = require('mongoose');

const objectId = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: 'Invalid id' });

const createTechnicianSchema = {
  body: z.object({
    fullName: z.string().min(2),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    avatarUrl: z.string().url().optional(),
    skillCategories: z.array(objectId).default([]),
  }),
};

const updateTechnicianSchema = {
  params: z.object({ id: objectId }),
  body: createTechnicianSchema.body.partial().extend({ isActive: z.boolean().optional() }),
};

const idParamSchema = { params: z.object({ id: objectId }) };

module.exports = { createTechnicianSchema, updateTechnicianSchema, idParamSchema };
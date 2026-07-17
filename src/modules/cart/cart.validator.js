const { z } = require('zod');
const mongoose = require('mongoose');

const objectId = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: 'Invalid id' });

const addItemSchema = {
  body: z.object({ serviceId: objectId, quantity: z.number().int().min(1).default(1) }),
};

const updateItemSchema = {
  params: z.object({ serviceId: objectId }),
  body: z.object({ quantity: z.number().int().min(0) }), // 0 = remove
};

const addAddonSchema = {
  params: z.object({ serviceId: objectId }),
  body: z.object({ addonId: objectId, quantity: z.number().int().min(1).default(1) }),
};

const applyCouponSchema = {
  body: z.object({ code: z.string().min(3) }),
};

module.exports = { addItemSchema, updateItemSchema, addAddonSchema, applyCouponSchema };
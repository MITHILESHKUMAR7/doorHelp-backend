const { z } = require('zod');
const mongoose = require('mongoose');

const objectId = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: 'Invalid id' });

const createCouponSchema = {
  body: z.object({
    code: z.string().min(3).max(20),
    discountType: z.enum(['percentage', 'flat']),
    discountValue: z.number().min(0),
    maxDiscountAmount: z.number().min(0).optional(),
    minCartValue: z.number().min(0).default(0),
    validFrom: z.coerce.date(),
    validTill: z.coerce.date(),
    usageLimitPerUser: z.number().int().min(1).default(1),
    totalUsageLimit: z.number().int().min(1).optional(),
  }),
};

const updateCouponSchema = {
  params: z.object({ id: objectId }),
  body: createCouponSchema.body.partial().extend({ isActive: z.boolean().optional() }),
};

const idParamSchema = { params: z.object({ id: objectId }) };

module.exports = { createCouponSchema, updateCouponSchema, idParamSchema };
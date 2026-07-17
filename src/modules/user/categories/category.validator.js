const { z } = require('zod');

const slugParamSchema = {
  params: z.object({ slug: z.string().min(1) }),
};

module.exports = { slugParamSchema };

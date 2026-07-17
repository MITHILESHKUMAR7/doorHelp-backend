/**
 * Usage: router.post('/route', validate(schema), controller)
 * schema = { body?: ZodSchema, query?: ZodSchema, params?: ZodSchema }
 */
function validate(schema) {
  return (req, res, next) => {
    if (schema.body) req.body = schema.body.parse(req.body);
    if (schema.query) req.query = schema.query.parse(req.query);
    if (schema.params) req.params = schema.params.parse(req.params);
    next();
  };
}

module.exports = validate;

const { ZodError } = require('zod');
const mongoose = require('mongoose');
const logger = require('../logger/logger');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Something went wrong. Please try again.';
  let errors = [];

  if (err.isApiError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    errors = err.errors || [];
  } else if (err instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    code = 'INVALID_ID';
    message = `Invalid value for ${err.path}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    code = 'CONFLICT';
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate value';
  }

  if (statusCode === 500) {
    logger.error(`${req.method} ${req.originalUrl} -> ${err.stack || err.message}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> [${code}] ${message}`);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length ? { errors } : {}),
    code,
    ...(env.NODE_ENV !== 'production' && statusCode === 500 ? { stack: err.stack } : {}),
  });
}

module.exports = errorHandler;

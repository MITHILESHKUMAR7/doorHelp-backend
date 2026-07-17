class ApiError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} code - machine-readable error code, e.g. 'NOT_FOUND'
   * @param {string} message - human-readable message
   * @param {Array<{field: string, message: string}>} errors - field-level validation errors
   */
  constructor(statusCode, code, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isApiError = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;

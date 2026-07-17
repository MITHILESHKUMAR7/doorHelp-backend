/**
 * Wraps an async controller so rejected promises are forwarded to Express's
 * error pipeline automatically — no repeated try/catch in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

/**
 * Higher-order function that wraps asynchronous Express route handlers.
 * It eliminates the need for repetitive try-catch blocks in controllers
 * by catching rejected promises and passing them to Express's next() handler.
 *
 * @param {Function} fn - The asynchronous route handler to wrap.
 * @returns {Function} Express middleware function.
 */
export const asyncHandler = (fn) => {
  // Returns a standard Express middleware function
  return (req, res, next) => {
    // Executes the async function inside a Promise resolver
    // Any rejected promise/error is caught and sent to the global error middleware via next
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

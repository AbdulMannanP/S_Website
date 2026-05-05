"use strict";

/**
 * utils/asyncHandler.js
 * Wraps an async route handler so that any thrown error is automatically
 * passed to Express's next(err) — eliminating try/catch boilerplate in routes.
 *
 * Usage:
 *   router.post("/lead", asyncHandler(async (req, res) => { ... }));
 */

function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;

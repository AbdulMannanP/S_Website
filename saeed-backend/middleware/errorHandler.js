"use strict";

/**
 * middleware/errorHandler.js
 * Global Express error handler — must have 4 parameters to be recognised by Express.
 * Catches any error passed via next(err) in any route or middleware.
 */

const { isProd } = require("../config/env");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status  = err.status || err.statusCode || 500;
  const message = isProd && status === 500
    ? "An unexpected error occurred. Please try again."
    : err.message || "Unknown error";

  // Always log the full stack in the server console
  if (status >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${status}`);
    console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;

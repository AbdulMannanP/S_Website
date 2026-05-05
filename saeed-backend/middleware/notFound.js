"use strict";

/**
 * middleware/notFound.js
 * Catches any request that didn't match a defined route.
 */

function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
}

module.exports = notFound;

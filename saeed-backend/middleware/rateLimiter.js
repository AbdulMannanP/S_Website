"use strict";

/**
 * middleware/rateLimiter.js
 * Two rate limiters used across the app:
 *
 *  globalLimiter — 500 req / 15 min per IP (applied to all routes in server.js)
 *  leadLimiter   — 60  req / 15 min per IP (applied only to POST /api/lead)
 */

const rateLimit = require("express-rate-limit");

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const globalLimiter = rateLimit({
  windowMs:       WINDOW_MS,
  max:            500,
  standardHeaders: true,
  legacyHeaders:  false,
  message: {
    success: false,
    message: "Too many requests. Please slow down and try again shortly.",
  },
});

const leadLimiter = rateLimit({
  windowMs:       WINDOW_MS,
  max:            60,
  standardHeaders: true,
  legacyHeaders:  false,
  message: {
    success: false,
    message: "Too many submissions. Please wait a few minutes before trying again.",
  },
  // Count failed requests too — prevents bots from probing with bad payloads
  skipSuccessfulRequests: false,
});

module.exports = { globalLimiter, leadLimiter };

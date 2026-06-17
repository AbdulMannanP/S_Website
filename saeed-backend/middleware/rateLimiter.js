"use strict";

const { rateLimit } = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const Redis = require("ioredis");
const config = require("../config/env");

let redisClient;
let redisStore;

try {
  // Skip Redis in testing environment since a local instance might not be running
  if (config.redisUrl && config.nodeEnv !== "test") {
    // Initialize secure Redis connection
    redisClient = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          console.error("[REDIS] Critical connection failure. Falling back to memory store.");
          return null; // Stop retrying and trigger fallback
        }
        return Math.min(times * 100, 2000);
      }
    });

    redisClient.on("error", (err) => {
      console.warn("[REDIS] Error connecting to server:", err.message);
    });

    // Build the distributed rate limit store
    redisStore = new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    });
  }
} catch (error) {
  console.error("[REDIS] Initialization failed, using memory store fallback:", error);
}

// ─── Global Limiter (All Public Endpoints) ───────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: redisStore, // Automatically defaults to memory if redisStore is undefined
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

// ─── Strict Limiter (Lead Submissions) ───────────────────────────────────────
const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window for lead generation
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore,
  message: {
    success: false,
    message: "Submission limit exceeded. Please wait 15 minutes before trying again.",
  },
});

module.exports = {
  globalLimiter,
  leadLimiter,
};

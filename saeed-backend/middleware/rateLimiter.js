"use strict";

const { rateLimit } = require("express-rate-limit");
const config = require("../config/env");

let redisStore;

// Only attempt Redis if an explicit REDIS_URL env var is set.
// On Render free tier (no Redis), this is skipped and memory store is used.
if (process.env.REDIS_URL && config.nodeEnv !== "test") {
  try {
    const RedisStore = require("rate-limit-redis").default;
    const Redis = require("ioredis");

    const redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 3) {
          console.error("[REDIS] Critical connection failure. Using memory store fallback.");
          return null;
        }
        return Math.min(times * 100, 2000);
      },
    });

    redisClient.on("error", (err) => {
      console.warn("[REDIS] Connection error:", err.message);
    });

    // rate-limit-redis v4 API uses sendCommand
    redisStore = new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    });

    console.log("[REDIS] RedisStore initialized successfully.");
  } catch (err) {
    console.error("[REDIS] Initialization failed, falling back to memory store:", err.message);
    redisStore = undefined;
  }
} else {
  console.log("[RATE LIMIT] No REDIS_URL set — using in-memory store.");
}

// ─── Global Limiter (All Public Endpoints) ───────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore, // undefined → express-rate-limit defaults to memory store
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

// ─── Strict Limiter (Lead Submissions) ───────────────────────────────────────
const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
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

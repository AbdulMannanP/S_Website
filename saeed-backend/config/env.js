"use strict";

/**
 * config/env.js
 * Loads and validates environment variables once at startup.
 * Import this module anywhere config values are needed.
 */

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

function required(key, defaultValue = "") {
  const val = process.env[key];
  if (!val) {
    console.error(`[CONFIG] [ERROR] Missing required environment variable: ${key}`);
    return defaultValue;
  }
  return val;
}

function optional(key, defaultValue = "") {
  return process.env[key] || defaultValue;
}

// Validate PORT before building config object
const rawPort = parseInt(optional("PORT", "3001"), 10);
if (!Number.isInteger(rawPort) || rawPort < 1 || rawPort > 65535) {
  console.error(`[CONFIG] Invalid PORT value: "${process.env.PORT}". Must be an integer between 1–65535.`);
  process.exit(1);
}

const redisUrl = process.env.REDIS_URL;

if (process.env.NODE_ENV === "production" && !redisUrl) {
  console.warn("[WARN] REDIS_URL is missing. Rate limiting will fall back to memory.");
}

const config = {
  redisUrl: redisUrl || "redis://127.0.0.1:6379",
  port:            rawPort,
  nodeEnv:         optional("NODE_ENV", "development"),
  isProd:          optional("NODE_ENV", "development") === "production",

  // CORS — comma-separated list of allowed frontend origins
  allowedOrigins:  optional("ALLOWED_ORIGINS", "http://localhost:5500,http://127.0.0.1:5500")
                     .split(",")
                     .map((o) => o.trim())
                     .filter(Boolean),

  // Admin dashboard credentials
  adminPassword:   required("ADMIN_PASSWORD", "admin123"),
  sessionSecret:   required("SESSION_SECRET", "session_secret_change_me"),   // Used to sign the admin session cookie

  // Session cookie config
  cookieName:      "sf_admin",
  cookieMaxAge:    8 * 60 * 60 * 1000,           // 8 hours in ms

  // Supabase Config
  supabaseUrl:     required("SUPABASE_URL", ""),
  supabaseAnonKey: required("SUPABASE_ANON_KEY", ""),
  supabaseServiceKey: optional("SUPABASE_SERVICE_ROLE_KEY"),
};

module.exports = config;

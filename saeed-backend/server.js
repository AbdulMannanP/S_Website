"use strict";

/**
 * server.js
 * Entry point for the Saeed Furniture lead generation backend.
 *
 * Routes:
 *   GET  /health         — Uptime + status check (public)
 *   GET  /api/session    — Generate secure order_id + session_id (public)
 *   POST /api/lead       — Upsert lead data (rate-limited, public)
 *   GET  /admin          — Lead dashboard (auth required)
 *   GET  /admin/csv      — CSV export (auth required)
 *   POST /admin/login    — Admin authentication
 *   GET  /admin/logout   — Clear admin session
 */

// ─── Config must load first — it validates required env vars ──────────────────
const config  = require("./config/env");
const path    = require("path");

const express  = require("express");
const helmet   = require("helmet");
const cors     = require("cors");
const crypto   = require("crypto");
const cookieParser = require("cookie-parser");

const { globalLimiter, leadLimiter } = require("./middleware/rateLimiter");
const notFound     = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { initSchema } = require("./services/database");

const leadRoute  = require("./routes/lead");
const adminRoute = require("./routes/admin");

const app = express();

app.set("trust proxy", 1); // Trust first proxy (e.g. load balancer or CDN) for correct rate limiting

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // Admin HTML is inline — CSP disabled for now
}));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        const corsError = new Error("CORS: origin not allowed");
        corsError.status = 403;
        callback(corsError);
      }
    },
    methods:      ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials:  true,
  })
);

// ─── Serve Frontend Static Files ────────────────────────────────────────────
// Serves index.html and all assets from ../frontend at http://localhost:3001
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
app.use(globalLimiter);

// ─── Public Routes ────────────────────────────────────────────────────────────

/**
 * GET /health
 * Uptime monitor and deployment verification endpoint.
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    success:     true,
    status:      "ok",
    uptime:      Math.floor(process.uptime()),
    timestamp:   new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

/**
 * GET /api/session
 * Called once on page load. Returns a cryptographically secure
 * order_id and session_id for the frontend to persist for the session.
 *
 * Why here and not in routes/: These IDs are infrastructure-level,
 * not business-logic-level. They belong at the app entry point.
 */
app.get("/api/session", (req, res) => {
  res.status(200).json({
    success:      true,
    order_id:     generateOrderId(),
    session_id:   crypto.randomUUID(),
    generated_at: new Date().toISOString(),
  });
});

// ─── Lead Route (rate-limited) ────────────────────────────────────────────────
app.use("/api/lead", leadLimiter, leadRoute);

// ─── Admin Route ──────────────────────────────────────────────────────────────
app.use("/admin", adminRoute);

// ─── 404 + Error Handlers (must be last) ─────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── ID Generation Helpers ────────────────────────────────────────────────────

/**
 * generateOrderId()
 * Format: SF-XXXXXX (6 unambiguous alphanumeric chars)
 * Charset excludes visually confusing characters: 0, O, 1, I, L
 * Example: SF-A3K9BZ
 */
function generateOrderId() {
  const CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes   = crypto.randomBytes(6);
  let id = "SF-";
  for (const byte of bytes) {
    id += CHARSET[byte % CHARSET.length];
  }
  return id;
}

// ─── Start ────────────────────────────────────────────────────────────────────
async function start() {
  await initSchema(); // Ensure schema exists before accepting any request

  app.listen(config.port, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║      Saeed Furniture Backend — Running       ║
╠══════════════════════════════════════════════╣
║  Port        : ${String(config.port).padEnd(28)}║
║  Environment : ${config.nodeEnv.padEnd(28)}║
║  Database    : leads.db (SQLite + WAL)       ║
║  Admin       : http://localhost:${String(config.port).padEnd(14)}║
║               /admin                         ║
╚══════════════════════════════════════════════╝
    `);
  });
}

start().catch((err) => {
  console.error("[FATAL] Server failed to start:", err);
  process.exit(1);
});

module.exports = app;

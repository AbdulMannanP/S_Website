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
const compression = require("compression");

const { globalLimiter, leadLimiter } = require("./middleware/rateLimiter");
const notFound     = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { requireAdmin } = require("./middleware/auth");
const { initSchema, getStats } = require("./services/database");

const morgan       = require("morgan");
const swaggerUi    = require("swagger-ui-express");
const swaggerDoc   = require("./docs/swagger.json");

const leadRoute    = require("./routes/lead");
const adminRoute   = require("./routes/admin");
const adminApi     = require("./routes/adminApi");

const app = express();
app.use(compression());

app.set("trust proxy", 1); // Trust first proxy (e.g. load balancer or CDN) for correct rate limiting

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'", "https://cdn.tailwindcss.com", "https://unpkg.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.supabase.co", "wss://*.supabase.co", "https://cdn.jsdelivr.net", "https://unpkg.com"]
    }
  },
}));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL] 
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) or strictly whitelisted domains
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS: Origin not allowed by strict policy'));
    }
  },
  credentials: true
}));

// ─── Serve Frontend Static Files ────────────────────────────────────────────
// Serves index.html and all assets from ../frontend at http://localhost:3001
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath, { maxAge: '30d' }));

// ─── Favicon (prevent 404 on browser auto-request) ─────────────────────────
app.get("/favicon.ico", (req, res) => res.status(204).end());

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
 * GET /api/keep-alive
 * Lightweight ping that wakes both Render and Supabase.
 * Registered BEFORE the global rate limiter so cron services
 * are never blocked regardless of hit frequency.
 */
app.get("/api/keep-alive", async (req, res) => {
  try {
    await getStats(); // non-destructive read — wakes the Supabase connection pool
    res.status(200).json({ success: true, message: "Render and Supabase are awake." });
  } catch (e) {
    // Still return 200 so cron services don't alarm on DB hiccups
    res.status(200).json({ success: true, message: "Render is awake. Supabase may be slow." });
  }
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

/**
 * GET /api/config
 * Exposes non-sensitive configuration to the frontend (e.g., Supabase Public Anon Key)
 */
app.get("/api/config", (req, res) => {
  res.status(200).json({
    success: true,
    supabaseUrl: config.supabaseUrl,
    supabaseAnonKey: config.supabaseAnonKey,
  });
});

// ─── Lead Route (rate-limited) ────────────────────────────────────────────────
app.use("/api/lead", leadLimiter, leadRoute);

// ─── Admin Routes ─────────────────────────────────────────────────────────────
app.use("/admin", adminRoute);
app.use("/api/admin", adminApi);
app.use("/api-docs", requireAdmin, swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// ─── Dashboard & Auth Routes (Frontend) ───────────────────────────────────────
app.get("/dashboard/client", (req, res) => res.sendFile(path.join(frontendPath, "dashboard", "client.html")));
app.get("/dashboard/admin", (req, res) => res.sendFile(path.join(frontendPath, "dashboard", "admin.html")));
app.get("/dashboard/production", (req, res) => res.sendFile(path.join(frontendPath, "dashboard", "production.html")));
app.get("/auth", (req, res) => res.sendFile(path.join(frontendPath, "auth.html")));

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
║  Database    : Supabase (PostgreSQL)         ║
║  Admin       : http://localhost:${String(config.port).padEnd(14)}║
║               /admin                         ║
╚══════════════════════════════════════════════╝
    `);
  });
}

if (process.env.NODE_ENV !== 'test') {
  start().catch((err) => {
    console.error("[FATAL] Server failed to start:", err);
    process.exit(1);
  });
}

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
function shutdown(signal) {
  console.log(`[server] ${signal} received. Shutting down gracefully...`);
  // Give active requests 10s to complete before forcing exit
  setTimeout(() => {
    console.error("[server] Force-exiting after shutdown timeout.");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGINT",  () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  console.error("[server] Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[server] Uncaught Exception:", err);
  process.exit(1);
});

module.exports = app;

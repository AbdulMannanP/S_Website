"use strict";

/**
 * routes/admin.js
 * Protected admin dashboard for the Saeed Furniture sales team.
 *
 * Routes:
 *   GET  /admin           — Lead table dashboard (requires auth)
 *   GET  /admin/csv       — Export all leads as CSV (requires auth)
 *   POST /admin/login     — Password form submission, sets signed session cookie
 *   GET  /admin/logout    — Clears session cookie
 *
 * Security model:
 *   - Single-password, cookie-based session signed with HMAC-SHA256
 *   - HttpOnly + SameSite=Strict cookie — not accessible to JavaScript
 *   - All admin HTML is server-rendered — no client-side token handling
 */

const express      = require("express");
const router       = express.Router();
const crypto       = require("crypto");
const rateLimit    = require("express-rate-limit");
const asyncHandler = require("../utils/asyncHandler");
const { getAllLeads, getStats } = require("../services/database");
const config       = require("../config/env");

// ─── Login-specific rate limiter (10 attempts / 15 min per IP) ───────────────
const loginLimiter = rateLimit({
  windowMs:              15 * 60 * 1000,
  max:                   10,
  skipSuccessfulRequests: true,
  standardHeaders:       true,
  legacyHeaders:         false,
  message: { success: false, message: "Too many login attempts. Please wait before trying again." },
});

// ─── Cookie Helpers ───────────────────────────────────────────────────────────

function signToken(value) {
  return crypto
    .createHmac("sha256", config.sessionSecret)
    .update(value)
    .digest("hex");
}

function createSessionToken() {
  const payload = `${Date.now()}-${crypto.randomUUID()}`;
  const sig     = signToken(payload);
  return `${payload}.${sig}`;
}

function isValidToken(token) {
  if (!token || typeof token !== "string") return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload  = token.slice(0, lastDot);
  const sig      = token.slice(lastDot + 1);
  const expected = signToken(payload);
  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

function isAuthenticated(req) {
  const token = req.cookies?.[config.cookieName];
  return isValidToken(token);
}

// ─── Auth Guard Middleware ────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  if (isAuthenticated(req)) return next();
  res.redirect("/admin/login");
}

// ─── Login Page ───────────────────────────────────────────────────────────────

router.get("/login", (req, res) => {
  if (isAuthenticated(req)) return res.redirect("/admin");
  res.send(loginPage());
});

router.post("/login", loginLimiter, express.urlencoded({ extended: false }), (req, res) => {
  const { password } = req.body;

  // Constant-time comparison to prevent timing attacks on password check
  const submitted = Buffer.from(password || "");
  const correct   = Buffer.from(config.adminPassword);
  const match = submitted.length === correct.length &&
    crypto.timingSafeEqual(submitted, correct);

  if (!match) {
    return res.status(401).send(loginPage("Incorrect password. Try again."));
  }

  const token = createSessionToken();
  res.cookie(config.cookieName, token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge:   config.cookieMaxAge,
    secure:   config.isProd,
  });
  res.redirect("/admin");
});

// ─── Logout ───────────────────────────────────────────────────────────────────

router.get("/logout", (req, res) => {
  res.clearCookie(config.cookieName);
  res.redirect("/admin/login");
});

// ─── Dashboard ────────────────────────────────────────────────────────────────

router.get("/", requireAuth, asyncHandler(async (req, res) => {
  const [leads, stats] = await Promise.all([getAllLeads(), getStats()]);
  res.send(dashboardPage(leads, stats));
}));

// ─── CSV Export ───────────────────────────────────────────────────────────────

router.get("/csv", requireAuth, asyncHandler(async (req, res) => {
  const leads = await getAllLeads();

  const headers = [
    "order_id", "session_id", "name", "phone", "district_city",
    "style_selected", "capacity_selected", "visit_type", "vision_notes",
    "last_step", "status", "score", "time_spent", "source",
    "lead_status", "sales_notes", "contacted_at", "created_at", "updated_at",
  ];

  const escape = (val) => {
    if (val == null) return "";
    const str = String(val).replace(/"/g, '""');
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str}"`
      : str;
  };

  const rows = leads.map((lead) =>
    headers.map((h) => escape(lead[h])).join(",")
  );

  const csv = [headers.join(","), ...rows].join("\r\n");
  const filename = `saeed-leads-${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send("\uFEFF" + csv); // BOM prefix for correct Excel UTF-8 rendering
}));

// ─── HTML Templates ───────────────────────────────────────────────────────────

function loginPage(error = "") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saeed Furniture — Admin Login</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f0f13; color: #e8e8e8; min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
    }
    .card {
      background: #1a1a22; border: 1px solid #2a2a38; border-radius: 12px;
      padding: 2.5rem 2rem; width: 100%; max-width: 380px;
    }
    .logo { font-size: 1.1rem; font-weight: 700; color: #c9a96e; margin-bottom: 0.4rem; }
    .sub  { font-size: 0.8rem; color: #666; margin-bottom: 2rem; }
    label { display: block; font-size: 0.78rem; color: #888; margin-bottom: 0.4rem; }
    input[type=password] {
      width: 100%; padding: 0.75rem 1rem; background: #0f0f13;
      border: 1px solid #2a2a38; border-radius: 8px; color: #e8e8e8;
      font-size: 0.95rem; outline: none; transition: border-color 0.2s;
    }
    input[type=password]:focus { border-color: #c9a96e; }
    button {
      width: 100%; margin-top: 1.2rem; padding: 0.8rem;
      background: #c9a96e; color: #0f0f13; font-weight: 700;
      font-size: 0.9rem; border: none; border-radius: 8px; cursor: pointer;
    }
    button:hover { background: #d4b87a; }
    .error { color: #e05252; font-size: 0.82rem; margin-top: 0.8rem; }
    .robots { display: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Saeed Furniture</div>
    <div class="sub">Admin Dashboard — Staff Only</div>
    <form method="POST" action="/admin/login">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" autocomplete="current-password" required>
      <!-- Honeypot -->
      <div class="robots"><input type="text" name="company_name" tabindex="-1" autocomplete="off"></div>
      <button type="submit">Sign In</button>
      ${error ? `<div class="error">${error}</div>` : ""}
    </form>
  </div>
</body>
</html>`;
}

function statusBadge(status) {
  const map = {
    new:        { bg: "#1e3a5f", color: "#60a5fa", label: "New" },
    contacted:  { bg: "#1e3f2a", color: "#4ade80", label: "Contacted" },
    qualified:  { bg: "#3b2f10", color: "#fbbf24", label: "Qualified" },
    lost:       { bg: "#3b1010", color: "#f87171", label: "Lost" },
    won:        { bg: "#0f3b1e", color: "#34d399", label: "Won" },
  };
  const s = map[status] || map.new;
  return `<span style="background:${s.bg};color:${s.color};padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:600;">${s.label}</span>`;
}

function dashboardPage(leads, stats) {
  const rows = leads.map((l) => `
    <tr>
      <td><code style="color:#c9a96e;font-size:0.8rem;">${escHtml(l.order_id)}</code></td>
      <td>${escHtml(l.name)}</td>
      <td>${escHtml(l.phone)}</td>
      <td>${escHtml(l.district_city)}</td>
      <td>${escHtml(l.style_selected)}</td>
      <td>${escHtml(l.capacity_selected)}</td>
      <td>${l.score ?? 0}</td>
      <td>${l.status === "final"
        ? '<span style="color:#4ade80;font-weight:600;">Final</span>'
        : '<span style="color:#888;">Draft</span>'}</td>
      <td>${statusBadge(l.lead_status)}</td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(l.vision_notes)}</td>
      <td style="color:#555;font-size:0.75rem;">${(l.created_at || "").slice(0, 16).replace("T", " ")}</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saeed Furniture — Admin Dashboard</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f0f13; color: #e8e8e8; min-height: 100vh;
    }
    header {
      background: #1a1a22; border-bottom: 1px solid #2a2a38;
      padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between;
    }
    .logo { font-size: 1rem; font-weight: 700; color: #c9a96e; }
    .header-actions { display: flex; gap: 0.75rem; align-items: center; }
    a.btn {
      padding: 0.45rem 1rem; border-radius: 6px; font-size: 0.82rem;
      font-weight: 600; text-decoration: none; cursor: pointer; display: inline-block;
    }
    .btn-primary { background: #c9a96e; color: #0f0f13; }
    .btn-ghost   { background: transparent; color: #888; border: 1px solid #2a2a38; }
    .btn-ghost:hover { border-color: #555; color: #ccc; }
    .stats {
      display: flex; gap: 1rem; padding: 1.5rem 2rem; flex-wrap: wrap;
    }
    .stat {
      background: #1a1a22; border: 1px solid #2a2a38; border-radius: 10px;
      padding: 1rem 1.5rem; flex: 1; min-width: 140px;
    }
    .stat-label { font-size: 0.72rem; color: #666; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-value { font-size: 1.8rem; font-weight: 700; color: #e8e8e8; }
    .stat-sub   { font-size: 0.72rem; color: #c9a96e; margin-top: 0.2rem; }
    .table-wrap { overflow-x: auto; padding: 0 2rem 2rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
    thead th {
      text-align: left; padding: 0.65rem 0.75rem;
      font-size: 0.7rem; color: #666; text-transform: uppercase; letter-spacing: 0.05em;
      border-bottom: 1px solid #2a2a38; white-space: nowrap;
    }
    tbody tr { border-bottom: 1px solid #1e1e28; transition: background 0.15s; }
    tbody tr:hover { background: #1a1a22; }
    tbody td { padding: 0.65rem 0.75rem; color: #ccc; vertical-align: middle; }
    .empty { text-align: center; padding: 4rem; color: #444; }
  </style>
</head>
<body>
  <header>
    <div class="logo">Saeed Furniture — Admin</div>
    <div class="header-actions">
      <a class="btn btn-primary" href="/admin/csv">⬇ Export CSV</a>
      <a class="btn btn-ghost"   href="/admin/logout">Sign Out</a>
    </div>
  </header>

  <div class="stats">
    <div class="stat">
      <div class="stat-label">Total Leads</div>
      <div class="stat-value">${stats?.total ?? 0}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Final Submissions</div>
      <div class="stat-value">${stats?.final_count ?? 0}</div>
      <div class="stat-sub">Full form completed</div>
    </div>
    <div class="stat">
      <div class="stat-label">Phone Captured</div>
      <div class="stat-value">${stats?.with_phone ?? 0}</div>
      <div class="stat-sub">Callable leads</div>
    </div>
    <div class="stat">
      <div class="stat-label">Awaiting Contact</div>
      <div class="stat-value">${stats?.new_count ?? 0}</div>
      <div class="stat-sub">Status: New</div>
    </div>
  </div>

  <div class="table-wrap">
    ${leads.length === 0
      ? `<div class="empty">No leads yet. They will appear here as visitors interact with the site.</div>`
      : `<table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>City / District</th>
              <th>Style</th>
              <th>Capacity</th>
              <th>Score</th>
              <th>Status</th>
              <th>CRM Status</th>
              <th>Vision Notes</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>`
    }
  </div>
</body>
</html>`;
}

function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = router;

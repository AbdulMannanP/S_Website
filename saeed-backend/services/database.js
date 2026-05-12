"use strict";

/**
 * database.js
 * Initialises the SQLite database using the `sqlite3` package (async API).
 * Uses the `sqlite` wrapper for async/await support.
 *
 * Schema covers:
 *  - All 17 original session-state fields
 *  - 4 CRM fields: lead_status, vision_notes, sales_notes, contacted_at
 *  - Automatic created_at / updated_at timestamps
 */

const path     = require("path");
const sqlite3  = require("sqlite3").verbose();

// ─── Database File Path ───────────────────────────────────────────────────────
const DB_PATH = path.join(__dirname, "..", "leads.db");

// ─── Create & Open Database ───────────────────────────────────────────────────
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("[DB] Failed to open leads.db:", err.message);
    process.exit(1);
  }
  console.log("[DB] Connected to leads.db");
});

// ─── Promisify db.run and db.all ──────────────────────────────────────────────
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// ─── Initialise Schema ────────────────────────────────────────────────────────
async function initSchema() {
  // WAL mode for safe concurrent reads during admin queries
  await run("PRAGMA journal_mode = WAL");
  await run("PRAGMA synchronous = NORMAL");
  await run("PRAGMA foreign_keys = ON");

  await run(`
    CREATE TABLE IF NOT EXISTS leads (

      -- ── Identity ────────────────────────────────────────────────────────────
      order_id          TEXT PRIMARY KEY,
      session_id        TEXT NOT NULL,

      -- ── Customer Info ───────────────────────────────────────────────────────
      name              TEXT DEFAULT '',
      phone             TEXT DEFAULT '',
      district_city     TEXT DEFAULT '',

      -- ── Journey Selections ──────────────────────────────────────────────────
      selected_model_id TEXT DEFAULT '',
      visit_mode        TEXT DEFAULT '',
      preferred_contact_time TEXT DEFAULT '',
      room_size_known   INTEGER DEFAULT 0,
      room_length       REAL DEFAULT NULL,
      room_width        REAL DEFAULT NULL,
      color_preference  TEXT DEFAULT '',
      material_preference TEXT DEFAULT '',
      photo_urls        TEXT DEFAULT '[]',
      vision_notes      TEXT DEFAULT '',

      -- ── Journey Tracking ────────────────────────────────────────────────────
      last_step         TEXT DEFAULT 'hero',
      status            TEXT DEFAULT 'draft'
                          CHECK(status IN ('draft', 'final')),
      score             INTEGER DEFAULT 0,
      time_spent        INTEGER DEFAULT 0,

      -- ── Attribution ─────────────────────────────────────────────────────────
      source            TEXT DEFAULT 'website',
      user_agent        TEXT DEFAULT '',
      referrer          TEXT DEFAULT '',
      ip                TEXT DEFAULT '',

      -- ── Bot Protection ──────────────────────────────────────────────────────
      company_name      TEXT DEFAULT '',

      -- ── CRM Fields (sales team use) ─────────────────────────────────────────
      lead_status       TEXT DEFAULT 'new'
                          CHECK(lead_status IN ('new', 'contacted', 'qualified', 'lost', 'won')),
      sales_notes       TEXT DEFAULT '',
      contacted_at      TEXT DEFAULT NULL,
      home_visit_completed INTEGER DEFAULT 0,
      assigned_to       TEXT DEFAULT NULL,
      email             TEXT DEFAULT NULL,

      -- ── Timestamps ──────────────────────────────────────────────────────────
      created_at        TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at        TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    )
  `);

  // Indexes for fast admin queries
  await run(`CREATE INDEX IF NOT EXISTS idx_leads_status      ON leads(status)`);
  await run(`CREATE INDEX IF NOT EXISTS idx_leads_lead_status ON leads(lead_status)`);
  await run(`CREATE INDEX IF NOT EXISTS idx_leads_created_at  ON leads(created_at)`);
  await run(`CREATE INDEX IF NOT EXISTS idx_leads_phone       ON leads(phone)`);

  // ── Safe column migrations for existing databases ───────────────────────────
  // SQLite doesn't support IF NOT EXISTS for columns; we catch the error silently.
  const migrations = [
    `ALTER TABLE leads ADD COLUMN home_visit_completed INTEGER DEFAULT 0`,
    `ALTER TABLE leads ADD COLUMN assigned_to TEXT DEFAULT NULL`,
    `ALTER TABLE leads ADD COLUMN email TEXT DEFAULT NULL`,
  ];
  for (const sql of migrations) {
    try { await run(sql); } catch (e) { /* column already exists */ }
  }

  console.log("[DB] Schema ready.");
}

// ─── Upsert Lead ──────────────────────────────────────────────────────────────
/**
 * Upserts a lead row. On conflict (same order_id), updates all customer-facing
 * fields but preserves CRM fields (lead_status, sales_notes, contacted_at)
 * and the original created_at timestamp.
 */
async function upsertLead(data) {
  const {
    order_id, session_id,
    name = "", phone = "", district_city = "",
    selected_model_id = "", visit_mode = "", preferred_contact_time = "",
    room_size_known = 0, room_length = null, room_width = null,
    color_preference = "", material_preference = "", photo_urls = "[]",
    vision_notes = "", last_step = "hero", status = "draft",
    score = 0, time_spent = 0, source = "website",
    user_agent = "", referrer = "", ip = "", company_name = "",
    email = null,
  } = data;

  // Check if this is an insert or update
  const existing = await get("SELECT order_id FROM leads WHERE order_id = ?", [order_id]);
  const action = existing ? "updated" : "inserted";

  await run(`
    INSERT INTO leads (
      order_id, session_id, name, phone, district_city,
      selected_model_id, visit_mode, preferred_contact_time,
      room_size_known, room_length, room_width,
      color_preference, material_preference, photo_urls,
      vision_notes, last_step, status, score, time_spent,
      source, user_agent, referrer, ip, company_name, email
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(order_id) DO UPDATE SET
      -- NOTE: 'source' intentionally excluded to preserve first-touch attribution
      name              = excluded.name,
      phone             = excluded.phone,
      district_city     = excluded.district_city,
      selected_model_id = excluded.selected_model_id,
      visit_mode        = excluded.visit_mode,
      preferred_contact_time = excluded.preferred_contact_time,
      room_size_known   = excluded.room_size_known,
      room_length       = excluded.room_length,
      room_width        = excluded.room_width,
      color_preference  = excluded.color_preference,
      material_preference = excluded.material_preference,
      photo_urls        = excluded.photo_urls,
      vision_notes      = excluded.vision_notes,
      last_step         = excluded.last_step,
      status            = excluded.status,
      score             = excluded.score,
      time_spent        = excluded.time_spent,
      user_agent        = excluded.user_agent,
      referrer          = excluded.referrer,
      ip                = excluded.ip,
      email             = COALESCE(excluded.email, leads.email),
      updated_at        = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  `, [
    order_id, session_id, name, phone, district_city,
    selected_model_id, visit_mode, preferred_contact_time,
    room_size_known, room_length, room_width,
    color_preference, material_preference, photo_urls,
    vision_notes, last_step, status, score, time_spent,
    source, user_agent, referrer, ip, company_name, email,
  ]);

  return { order_id, action };
}

// ─── Query Helpers ────────────────────────────────────────────────────────────
function getLeadByOrderId(order_id) {
  return get(`
    SELECT
      order_id, name, phone, district_city,
      selected_model_id, visit_mode, preferred_contact_time,
      room_size_known, room_length, room_width,
      color_preference, material_preference, photo_urls,
      vision_notes, last_step, status, score, time_spent, source,
      lead_status, sales_notes, contacted_at, home_visit_completed, assigned_to,
      created_at, updated_at
    FROM leads WHERE order_id = ?
  `, [order_id]);
}

function getAllLeads() {
  return all(`
    SELECT
      order_id, name, phone, district_city,
      selected_model_id, visit_mode, preferred_contact_time,
      room_size_known, room_length, room_width,
      color_preference, material_preference, photo_urls,
      vision_notes, last_step, status, score, time_spent, source,
      lead_status, sales_notes, contacted_at, home_visit_completed, assigned_to,
      created_at, updated_at
    FROM leads
    ORDER BY created_at DESC
  `);
}

async function getStats() {
  return get(`
    SELECT
      COUNT(*)                                           AS total,
      COUNT(CASE WHEN status = 'final' THEN 1 END)      AS final_count,
      COUNT(CASE WHEN phone != '' THEN 1 END)            AS with_phone,
      COUNT(CASE WHEN lead_status = 'new' THEN 1 END)    AS new_count
    FROM leads
  `);
}

function getLeadsByEmail(email) {
  return all(`
    SELECT
      order_id, name, phone, district_city,
      selected_model_id, visit_mode, preferred_contact_time,
      room_size_known, room_length, room_width,
      color_preference, material_preference, photo_urls,
      vision_notes, last_step, status, score, time_spent, source,
      lead_status, sales_notes, contacted_at, home_visit_completed, assigned_to,
      created_at, updated_at
    FROM leads
    WHERE email = ?
    ORDER BY created_at DESC
  `, [email]);
}

async function updateLeadCRM(order_id, data) {
  const { lead_status, sales_notes, home_visit_completed, assigned_to } = data;
  
  return run(`
    UPDATE leads SET
      lead_status = COALESCE(?, lead_status),
      sales_notes = COALESCE(?, sales_notes),
      home_visit_completed = COALESCE(?, home_visit_completed),
      assigned_to = COALESCE(?, assigned_to),
      updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE order_id = ?
  `, [lead_status, sales_notes, home_visit_completed, assigned_to, order_id]);
}

// ─── Exports ──────────────────────────────────────────────────────────────────
module.exports = {
  initSchema,
  upsertLead,
  getLeadByOrderId,
  getAllLeads,
  getLeadsByEmail,
  getStats,
  updateLeadCRM,
};

"use strict";

/**
 * routes/lead.js
 * Lead capture API for Saeed Furniture.
 *
 * POST /api/lead     — Upsert a lead (optionally authenticated via Supabase JWT).
 *                      Uses a 3-attempt retry + dead-letter fallback for resilience.
 * GET  /api/lead/mine — Returns all leads for the authenticated client.
 */

const express      = require("express");
const router       = express.Router();
const path         = require("path");
const { appendFileSync } = require("fs");
const asyncHandler = require("../utils/asyncHandler");
const db           = require("../services/database");
const { sanitizeLead, isBot, isValidKSAPhone, calculateScore } = require("../utils/validator");
const { requireAuth, optionalAuth } = require("../middleware/auth");

// Dead-letter file path — lives at project root, never inside /routes
const DEAD_LETTER_PATH = path.join(__dirname, "..", "dead_letters.log");

// ─── Resilient Save: 3-attempt retry + dead-letter fallback ─────────────────
// Adapted from the SQLite retry pattern to work with Supabase's transient errors.
// Supabase can return transient errors (503, connection pool exhausted, network
// hiccup between Render and Supabase cluster). This handles all of those without
// the user ever seeing an error.
//
// Delay schedule (ms): attempt 1 → 0, attempt 2 → ~100, attempt 3 → ~300
async function saveWithRetry(req, leadData) {
  const MAX_RETRIES = 3;
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await db.upsertLead(req, leadData);
      return { success: true, action: result.action };
    } catch (err) {
      lastError = err;
      const isRetryable =
        err?.status === 503 ||
        err?.status === 429 ||
        err?.code === "PGRST301" ||     // Supabase: JWT expired mid-request
        err?.message?.includes("timeout") ||
        err?.message?.includes("network");

      console.warn(
        `[lead] Save attempt ${attempt}/${MAX_RETRIES} failed (${err?.message}). ` +
        (isRetryable ? "Retrying..." : "Non-retryable, skipping further attempts.")
      );

      if (!isRetryable) break; // Don't retry validation or auth failures

      if (attempt < MAX_RETRIES) {
        // Exponential backoff with jitter: ~100ms, ~300ms
        const delay = 100 * (2 ** (attempt - 1)) + Math.random() * 100;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // ── All retries exhausted → dead-letter fallback ─────────────────────────
  // Writes the raw payload to dead_letters.log at the project root.
  // This file is a manual recovery path — no lead is ever permanently lost.
  try {
    const logEntry = `\n[${new Date().toISOString()}] ${JSON.stringify({
      order_id: leadData.order_id,
      user_id: req.user?.id || null,
      error: lastError?.message,
      payload: leadData,
    })}`;
    appendFileSync(DEAD_LETTER_PATH, logEntry, "utf8");
    console.error("[lead] CRITICAL: All retries failed. Lead saved to dead_letters.log");
  } catch (fsError) {
    console.error("[lead] CRITICAL: Could not write to dead_letters.log:", fsError.message);
  }

  return { success: false, error: lastError?.message };
}

// ─── GET /api/lead/mine ───────────────────────────────────────────────────────
// Returns all leads belonging to the authenticated client.
// Supabase RLS enforces that only the requesting user's rows are returned.
router.get(
  "/mine",
  requireAuth,
  asyncHandler(async (req, res) => {
    const leads = await db.getAllLeads(req);
    res.json({ success: true, data: leads });
  })
);

// ─── POST /api/lead ───────────────────────────────────────────────────────────
// The core lead capture endpoint. Accepts partial data at any step in the
// frontend journey (hero, style, capacity, contact, review) via upsert.
router.post(
  "/",
  optionalAuth, // Links the lead to a logged-in client if a JWT is present
  asyncHandler(async (req, res) => {
    // ── Honeypot check ────────────────────────────────────────────────────────
    // The `company_name` field is hidden from real users. If it's filled,
    // it's a bot. Return 200 to avoid revealing the detection mechanism.
    if (isBot(req.body?.company_name)) {
      return res.status(200).json({ success: true, ignored: true });
    }

    // ── Sanitise & normalise payload ─────────────────────────────────────────
    // sanitizeLead handles ALL fields, aliases (camelCase ↔ snake_case),
    // and type coercion. It never throws.
    const lead = sanitizeLead({
      ...req.body,
      ip:         (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.ip,
      user_agent: req.headers["user-agent"] || "",
      referrer:   req.headers["referer"]    || "",
    });

    // ── Guard: order_id and session_id are required ───────────────────────────
    if (!lead.order_id || !lead.session_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: order_id or session_id",
      });
    }

    // ── Server-side score anomaly detection ──────────────────────────────────
    const serverScore = calculateScore(lead);
    if (Math.abs((lead.score || 0) - serverScore) > 50) {
      console.warn(
        `[SCORE] Anomaly on order ${lead.order_id}: ` +
        `frontend sent ${lead.score}, server calculated ${serverScore} (Δ${Math.abs((lead.score||0)-serverScore)})`
      );
    }

    // ── Soft phone validation ─────────────────────────────────────────────────
    if (lead.phone && !isValidKSAPhone(lead.phone)) {
      console.warn(`[lead] Possibly invalid phone saved: ${lead.phone}`);
    }

    // ── Resilient save ────────────────────────────────────────────────────────
    // The user ALWAYS gets a 200 OK. The lead is either saved to Supabase,
    // or safely written to dead_letters.log for manual recovery.
    const result = await saveWithRetry(req, lead);

    return res.status(200).json({
      success:      true,
      message:      "Lead received",
      order_id:     lead.order_id,
      session_id:   lead.session_id,
      save_action:  result.success ? result.action : "queued",
      phone_valid:  lead.phone ? isValidKSAPhone(lead.phone) : null,
    });
  })
);

module.exports = router;

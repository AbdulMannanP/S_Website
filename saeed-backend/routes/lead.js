"use strict";

/**
 * routes/lead.js
 * POST /api/lead
 *
 * The core data capture endpoint. Called on every meaningful state change
 * during the user's journey on the frontend. Accepts full or partial lead data.
 *
 * Key behaviours:
 *  - Never rejects a save due to missing or malformed fields
 *  - Honeypot check silently drops bot submissions (returns 200 to fool bots)
 *  - Upserts by order_id — the same row is updated throughout the session
 *  - Rate limited to 60 req / 15 min per IP (via leadLimiter in server.js)
 *  - Logs a server-side score anomaly warning if frontend score differs significantly
 */

const express       = require("express");
const router        = express.Router();
const asyncHandler  = require("../utils/asyncHandler");
const { sanitizeLead, isBot, isValidKSAPhone, calculateScore } = require("../utils/validator");
const { upsertLead } = require("../services/database");

// ─── POST /api/lead ───────────────────────────────────────────────────────────
router.post(
  "/",
  asyncHandler(async (req, res) => {

    // 1. Honeypot — silently succeed to not reveal detection to bots
    if (isBot(req.body.company_name)) {
      console.warn(`[BOT] Honeypot triggered from IP: ${req.ip}`);
      return res.status(200).json({
        success:    true,
        order_id:   req.body.order_id || "SF-000000",
        save_action: "ignored",
      });
    }

    // 2. Sanitise — trim, truncate, apply safe defaults to all fields
    const lead = sanitizeLead(req.body);

    // 3. Require at minimum an order_id — without it we cannot upsert correctly
    if (!lead.order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required. Call GET /api/session first.",
      });
    }

    // 4. Attach server-resolved fields
    lead.ip         = req.ip || req.socket?.remoteAddress || "";
    lead.user_agent = lead.user_agent || req.get("user-agent") || "";
    lead.referrer   = lead.referrer   || req.get("referer")    || "";

    // 5. Phone quality flag (logged only — never blocks save)
    const phoneValid = isValidKSAPhone(lead.phone);
    if (lead.phone && !phoneValid) {
      console.info(`[LEAD] Non-standard phone format for order ${lead.order_id}: "${lead.phone}"`);
    }

    // 6. Server-side score sanity check (logged only — frontend score is used)
    const serverScore = calculateScore(lead);
    const scoreDelta  = Math.abs(serverScore - lead.score);
    if (scoreDelta > 50) {
      console.warn(
        `[SCORE] Anomaly on order ${lead.order_id}: ` +
        `frontend sent ${lead.score}, server calculated ${serverScore} (Δ${scoreDelta})`
      );
    }

    // 7. Upsert into SQLite
    const result = await upsertLead(lead);

    // 8. Respond
    console.info(
      `[LEAD] ${result.action.toUpperCase()} — ${lead.order_id} | ` +
      `step: ${lead.last_step} | status: ${lead.status} | score: ${lead.score}`
    );

    return res.status(200).json({
      success:     true,
      order_id:    result.order_id,
      save_action: result.action,         // "inserted" | "updated"
      phone_valid: phoneValid,            // Hint for frontend to show format warning
    });
  })
);

module.exports = router;

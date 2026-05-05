"use strict";

/**
 * utils/validator.js
 * Input validation and sanitisation for lead submissions.
 *
 * Core philosophy: NEVER reject a lead due to format issues.
 * Partial data is infinitely more valuable than a lost submission.
 * Validation only flags issues — it never blocks saves.
 */

// ─── Sanitise ─────────────────────────────────────────────────────────────────

/**
 * Trim and truncate a string to a maximum length.
 * Returns empty string if input is not a string.
 */
function sanitizeStr(val, maxLen = 500) {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLen);
}

/**
 * Clamp a number between min and max.
 * Returns 0 if input is not a finite number.
 */
function sanitizeNum(val, min = 0, max = 9999) {
  const n = parseInt(val, 10);
  if (!Number.isFinite(n)) return 0;
  return Math.max(min, Math.min(max, n));
}

// ─── Validate ─────────────────────────────────────────────────────────────────

/**
 * Loosely validates a Saudi phone number.
 * Accepts: 05XXXXXXXX, 5XXXXXXXX, +9665XXXXXXXX, 009665XXXXXXXX
 * Returns true if the number looks valid, false otherwise.
 * A false return NEVER blocks a save — it is only used for scoring hints.
 */
function isValidKSAPhone(phone) {
  if (!phone || typeof phone !== "string") return false;
  const cleaned = phone.replace(/[\s\-().]/g, "");
  return /^(\+9665|009665|05|5)\d{8}$/.test(cleaned);
}

/**
 * Honeypot check.
 * The company_name field is a hidden input that real users never fill.
 * Any non-empty value indicates a bot submission.
 */
function isBot(company_name) {
  return typeof company_name === "string" && company_name.trim().length > 0;
}

/**
 * Validate the status field against allowed enum values.
 */
function isValidStatus(status) {
  return ["draft", "final"].includes(status);
}

/**
 * Validate the style_selected field against allowed values.
 */
function isValidStyle(style) {
  return ["", "Modern Majlis", "Authentic Majlis", "Heritage Floor Majlis", "Accessories & Steel"]
    .includes(style);
}

/**
 * Validate the capacity_selected field against allowed values.
 */
function isValidCapacity(capacity) {
  return ["", "One-Piece", "Three-Piece", "Five-Piece"].includes(capacity);
}

// ─── Sanitise Full Lead Payload ───────────────────────────────────────────────

/**
 * sanitizeLead(body)
 * Accepts raw request body and returns a clean, safe lead object.
 * Every field has a safe default — this function never throws.
 */
function sanitizeLead(body = {}) {
  return {
    order_id:          sanitizeStr(body.order_id,          32),
    session_id:        sanitizeStr(body.session_id,        64),
    name:              sanitizeStr(body.name,              100),
    phone:             sanitizeStr(body.phone,              20),
    district_city:     sanitizeStr(body.district_city,    100),
    style_selected:    isValidStyle(body.style_selected)
                         ? sanitizeStr(body.style_selected,    50)
                         : "",
    capacity_selected: isValidCapacity(body.capacity_selected)
                         ? sanitizeStr(body.capacity_selected, 50)
                         : "",
    visit_type:        sanitizeStr(body.visit_type,        50),
    vision_notes:      sanitizeStr(body.vision_notes,     500),
    last_step:         sanitizeStr(body.last_step,         50) || "hero",
    status:            isValidStatus(body.status) ? body.status : "draft",
    score:             sanitizeNum(body.score, 0, 300),
    time_spent:        sanitizeNum(body.time_spent, 0, 86400),
    source:            sanitizeStr(body.source, 50)  || "website",
    user_agent:        sanitizeStr(body.user_agent,       300),
    referrer:          sanitizeStr(body.referrer,         500),
    company_name:      sanitizeStr(body.company_name,     100), // honeypot
  };
}

// ─── Server-Side Score Recalculation ─────────────────────────────────────────
/**
 * Recalculates lead score server-side as a sanity check.
 * Frontend score is used, but this is logged for anomaly detection.
 * Weights per master plan:
 *   Style selected:     +10
 *   Capacity selected:  +20
 *   Phone entered:      +80
 *   Final submitted:   +100
 */
function calculateScore(lead) {
  let score = 0;
  if (lead.style_selected)    score += 10;
  if (lead.capacity_selected) score += 20;
  if (lead.phone)             score += 80;
  if (lead.status === "final") score += 100;
  return score;
}

module.exports = {
  sanitizeLead,
  sanitizeStr,
  sanitizeNum,
  isValidKSAPhone,
  isBot,
  isValidStyle,
  isValidCapacity,
  calculateScore,
};

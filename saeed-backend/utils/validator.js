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
    name:              sanitizeStr(body.name || body.fullName, 100),
    phone:             sanitizeStr(body.phone || body.mobileNumber, 20),
    district_city:     sanitizeStr(body.district_city || body.areaCity, 100),
    style_selected:    sanitizeStr(body.style_selected, 100),
    capacity_selected: sanitizeStr(body.capacity_selected, 100),
    selected_model_id: sanitizeStr(
      body.selected_model_id || 
      body.selectedModelId || 
      (body.style_selected ? body.style_selected + (body.capacity_selected ? " — " + body.capacity_selected : "") : ""), 
    100),
    visit_mode:        sanitizeStr(body.visit_mode || body.visitMode || body.visit_type, 50),
    preferred_contact_time: sanitizeStr(body.preferred_contact_time || body.preferredContactTime, 50),
    room_size_known:   (body.room_size_known === true || body.roomSize?.known === true || body.roomSize?.known === "true" || body.room_size_known === 1) ? 1 : 0,
    room_length:       (body.room_length && !isNaN(parseFloat(body.room_length))) ? parseFloat(body.room_length) : (body.roomSize?.length && !isNaN(parseFloat(body.roomSize.length)) ? parseFloat(body.roomSize.length) : null),
    room_width:        (body.room_width && !isNaN(parseFloat(body.room_width))) ? parseFloat(body.room_width) : (body.roomSize?.width && !isNaN(parseFloat(body.roomSize.width)) ? parseFloat(body.roomSize.width) : null),
    color_preference:  sanitizeStr(body.color_preference || body.colorPreference, 50),
    material_preference: sanitizeStr(body.material_preference || body.materialPreference, 50),
    photo_urls:        Array.isArray(body.photo_urls || body.photoUrls) ? JSON.stringify((body.photo_urls || body.photoUrls).map(url => sanitizeStr(url, 500))) : "[]",
    vision_notes:      sanitizeStr(body.vision_notes || body.specialNotes, 500),
    last_step:         sanitizeStr(body.last_step,         50) || "hero",
    status:            isValidStatus(body.status) ? body.status : "draft",
    score:             sanitizeNum(body.score, 0, 300),
    time_spent:        sanitizeNum(body.time_spent, 0, 86400),
    source:            sanitizeStr(body.source, 50)  || "website",
    user_agent:        sanitizeStr(body.user_agent,       300),
    referrer:          sanitizeStr(body.referrer,         500),
    email:             sanitizeStr(body.email,            100).toLowerCase(),
    company_name:      sanitizeStr(body.company_name,     100), // honeypot
  };
}

/**
 * sanitizeLeadCRM(body)
 * Sanitises input for CRM-only updates.
 */
function sanitizeLeadCRM(body = {}) {
  return {
    lead_status: ["new", "contacted", "qualified", "lost", "won"].includes(body.lead_status) ? body.lead_status : null,
    sales_notes: sanitizeStr(body.sales_notes || body.salesNotes, 1000),
    home_visit_completed: (body.home_visit_completed === true || body.home_visit_completed === 1 || body.home_visit_completed === "1" || body.home_visit_completed === "true") ? 1 : 0,
    assigned_to: sanitizeStr(body.assigned_to || body.assignedTo, 100),
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
  if (lead.style_selected || lead.selected_model_id) score += 10;
  if (lead.capacity_selected) score += 20;
  if (lead.phone && isValidKSAPhone(lead.phone)) score += 80;
  if (lead.status === "final") score += 100;
  return score;
}

module.exports = {
  sanitizeLead,
  sanitizeStr,
  sanitizeNum,
  isValidKSAPhone,
  isBot,
  calculateScore,
  sanitizeLeadCRM,
};

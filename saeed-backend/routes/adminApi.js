"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { getAllLeads, getLeadByOrderId, updateLeadCRM } = require("../services/database");
const { sanitizeLeadCRM } = require("../utils/validator");
const { requireAdmin } = require("../middleware/auth");

/**
 * routes/adminApi.js
 * JSON API for the Admin Dashboard. All routes require a valid admin JWT.
 */

// GET /api/admin/leads — Returns all leads (admin only, RLS bypassed via JWT role check)
router.get("/leads", requireAdmin, asyncHandler(async (req, res) => {
  const leads = await getAllLeads(req);
  res.json({ success: true, leads });
}));

// GET /api/admin/leads/:order_id — Returns a single lead
router.get("/leads/:order_id", requireAdmin, asyncHandler(async (req, res) => {
  const lead = await getLeadByOrderId(req, req.params.order_id);
  if (!lead) {
    return res.status(404).json({ success: false, message: "Lead not found" });
  }
  res.json({ success: true, lead });
}));

// PATCH /api/admin/leads/:order_id — Update CRM fields on a lead
router.patch("/leads/:order_id", requireAdmin, asyncHandler(async (req, res) => {
  const data = sanitizeLeadCRM(req.body);
  await updateLeadCRM(req, req.params.order_id, data);
  const updated = await getLeadByOrderId(req, req.params.order_id);
  res.json({ success: true, lead: updated });
}));

module.exports = router;

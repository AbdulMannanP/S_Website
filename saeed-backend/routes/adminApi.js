"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { getAllLeads, getLeadByOrderId, updateLeadCRM } = require("../services/database");
const { sanitizeLeadCRM } = require("../utils/validator");

const { requireAuth } = require("../middleware/auth");

/**
 * routes/adminApi.js
 * JSON API for the modern Admin Dashboard.
 */

// Middleware to check for Admin role (using session cookie)
const adminApiAuth = requireAuth(true);

router.get("/leads", adminApiAuth, asyncHandler(async (req, res) => {
  const leads = await getAllLeads();
  res.json({ success: true, leads });
}));

router.get("/leads/:order_id", adminApiAuth, asyncHandler(async (req, res) => {
  const lead = await getLeadByOrderId(req.params.order_id);
  if (!lead) {
    return res.status(404).json({ success: false, message: "Lead not found" });
  }
  res.json({ success: true, lead });
}));

router.patch("/leads/:order_id", adminApiAuth, asyncHandler(async (req, res) => {
  const data = sanitizeLeadCRM(req.body);
  await updateLeadCRM(req.params.order_id, data);
  const updated = await getLeadByOrderId(req.params.order_id);
  res.json({ success: true, lead: updated });
}));

module.exports = router;

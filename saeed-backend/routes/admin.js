"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const db = require("../services/database");
const { requireAdmin } = require("../middleware/auth");

// Apply requireAdmin to all routes in this file
router.use(requireAdmin);

// Admin Dashboard stats
router.get("/", asyncHandler(async (req, res) => {
  const leads = await db.getAllLeads(req);
  const stats = await db.getStats(req);
  
  res.json({
    success: true,
    data: {
      stats,
      recent_leads: leads.slice(0, 50)
    }
  });
}));

// Update lead status
router.post("/update/:order_id", asyncHandler(async (req, res) => {
  const result = await db.updateLeadCRM(req, req.params.order_id, req.body);
  res.json({ success: true, result });
}));

module.exports = router;

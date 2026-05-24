"use strict";

const { createClient } = require("@supabase/supabase-js");
const config = require("../config/env");

// ─── Initialize Supabase Client ───────────────────────────────────────────────
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey || config.supabaseAnonKey);

async function initSchema() {
  // Schema is managed manually in Supabase SQL Editor.
  console.log("[DB] Connected to Supabase");
}

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

  const payload = {
    order_id, session_id, name, phone, district_city,
    selected_model_id, visit_mode, preferred_contact_time,
    room_size_known: Boolean(room_size_known), 
    room_length, room_width,
    color_preference, material_preference, 
    photo_urls: typeof photo_urls === 'string' ? JSON.parse(photo_urls || "[]") : photo_urls,
    vision_notes, last_step, status, score, time_spent,
    source, user_agent, referrer, ip, company_name, email
  };

  // Check if lead exists to determine action type for logging
  const { data: existing } = await supabase
    .from('leads')
    .select('order_id')
    .eq('order_id', order_id)
    .single();

  const action = existing ? "updated" : "inserted";

  const { error } = await supabase
    .from('leads')
    .upsert(payload, { onConflict: 'order_id' });

  if (error) {
    console.error("[DB] upsertLead error:", error);
    throw error;
  }

  return { order_id, action };
}

async function getLeadByOrderId(order_id) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('order_id', order_id)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found
  return data;
}

async function getAllLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

async function getStats() {
  const { data, error } = await supabase.rpc('get_leads_stats');
  if (error) throw error;
  
  return {
    total: data.total || 0,
    final_count: data.final_count || 0,
    with_phone: data.with_phone || 0,
    new_count: data.new_count || 0
  };
}

async function getLeadsByEmail(email) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

async function updateLeadCRM(order_id, data) {
  const { lead_status, sales_notes, home_visit_completed, assigned_to } = data;
  
  const payload = {};
  if (lead_status !== undefined) payload.lead_status = lead_status;
  if (sales_notes !== undefined) payload.sales_notes = sales_notes;
  if (home_visit_completed !== undefined) payload.home_visit_completed = Boolean(home_visit_completed);
  if (assigned_to !== undefined) payload.assigned_to = assigned_to;

  const { error } = await supabase
    .from('leads')
    .update(payload)
    .eq('order_id', order_id);

  if (error) throw error;
  return { changes: 1 };
}

module.exports = {
  initSchema,
  upsertLead,
  getLeadByOrderId,
  getAllLeads,
  getLeadsByEmail,
  getStats,
  updateLeadCRM,
};

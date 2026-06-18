"use strict";

const { createClient } = require("@supabase/supabase-js");
const config = require("../config/env");
// Path B: Explicitly provide a WebSocket implementation.
// Required for Node < 22 environments (e.g. Render free tier) where
// the global WebSocket may not be available for Supabase Realtime.
const WebSocket = require("ws");

const supabaseOptions = {
  realtime: { transport: WebSocket }
};

// Create a singleton Supabase client for validating JWTs
const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, supabaseOptions);

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing Bearer Token" });
    }

    const token = authHeader.split(" ")[1];
    
    // Verify token using Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid Token" });
    }

    // Attach user to request object
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
}

async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing Bearer Token" });
    }

    const token = authHeader.split(" ")[1];
    
    // Verify token using Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid Token" });
    }

    // Check if user has admin role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
    }

    // Attach user to request object
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
}

async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.user = user;
        req.token = token;
      }
    }
    next();
  } catch (error) {
    next();
  }
}

module.exports = {
  requireAuth,
  requireAdmin,
  optionalAuth,
};

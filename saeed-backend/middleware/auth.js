"use strict";

const crypto = require("crypto");
const config = require("../config/env");

/**
 * middleware/auth.js
 * Shared authentication logic for admin access.
 */

function signToken(value) {
  return crypto
    .createHmac("sha256", config.sessionSecret)
    .update(value)
    .digest("hex");
}

function isValidToken(token) {
  if (!token || typeof token !== "string") return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  
  const payload  = token.slice(0, lastDot);
  const sig      = token.slice(lastDot + 1);
  const expected = signToken(payload);
  
  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

function isAuthenticated(req) {
  const token = req.cookies?.[config.cookieName];
  return isValidToken(token);
}

/**
 * Middleware to protect routes.
 * Traditional routes redirect to /admin/login.
 * API routes return a 401 Unauthorized JSON.
 */
function requireAuth(isApi = false) {
  return (req, res, next) => {
    if (isAuthenticated(req)) return next();
    
    if (isApi) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in as admin." });
    }
    res.redirect("/admin/login");
  };
}

module.exports = {
  isValidToken,
  isAuthenticated,
  requireAuth,
};

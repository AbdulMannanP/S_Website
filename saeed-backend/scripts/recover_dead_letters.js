"use strict";

/**
 * scripts/recover_dead_letters.js
 * Run via: node scripts/recover_dead_letters.js
 * Recovers stranded leads from dead_letters.log and pushes them to Supabase.
 */
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const db = require("../services/database");

const LOG_PATH = path.join(__dirname, "..", "dead_letters.log");
const ARCHIVE_PATH = path.join(__dirname, "..", "dead_letters_archive.log");

async function recover() {
  console.log("Starting Dead-Letter Recovery...");

  if (!fs.existsSync(LOG_PATH)) {
    console.log("No dead_letters.log found. System is clean.");
    process.exit(0);
  }

  const fileStream = fs.createReadStream(LOG_PATH);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let successCount = 0;
  let failureCount = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;

    try {
      // Extract the JSON payload after the timestamp bracket `[YYYY-MM-DD...] `
      const jsonStart = line.indexOf("] ") + 2;
      const jsonString = line.substring(jsonStart);
      const parsed = JSON.parse(jsonString);

      const payload = parsed.payload;
      if (!payload) continue;

      // Reconstruct an empty mock request object. 
      // We purposefully DO NOT set mockReq.user here. 
      // If we did, db.upsertLead would try to extract a JWT token (which we don't have) 
      // to create an authenticated client, causing it to crash.
      const mockReq = {};

      console.log(`Recovering order_id: ${payload.order_id}...`);
      await db.upsertLead(mockReq, payload);
      successCount++;
    } catch (err) {
      console.error(`Failed to recover a lead:`, err.message);
      failureCount++;
    }
  }

  console.log(`\nRecovery Complete.`);
  console.log(`✅ Successfully Recovered: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);

  // Archive the file to prevent duplicate processing in the future
  if (failureCount === 0 && successCount > 0) {
    fs.renameSync(LOG_PATH, ARCHIVE_PATH);
    console.log(`Log archived to dead_letters_archive.log`);
  } else if (failureCount > 0) {
    console.log("Warning: Some records failed. The log file was NOT archived.");
  }

  process.exit(0);
}

recover();

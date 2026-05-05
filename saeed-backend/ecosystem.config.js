// ecosystem.config.js
// PM2 process manager configuration for Saeed Furniture backend.
// Usage:
//   Start:   npx pm2 start ecosystem.config.js
//   Status:  npx pm2 status
//   Logs:    npx pm2 logs saeed-furniture
//   Restart: npx pm2 restart saeed-furniture
//   Stop:    npx pm2 stop saeed-furniture
//   Auto-start on reboot: npx pm2 startup  (then follow the printed command)

module.exports = {
  apps: [
    {
      name:         "saeed-furniture",
      script:       "server.js",
      instances:    1,               // Single instance — SQLite is not safe with multiple writers
      autorestart:  true,            // Restart immediately if the process crashes
      watch:        false,           // Do NOT watch files in production (causes unnecessary restarts)
      max_memory_restart: "200M",    // Restart if RAM exceeds 200 MB (memory leak safety net)
      restart_delay: 1000,          // Wait 1 second before restarting after a crash

      // Environment variables for production
      env_production: {
        NODE_ENV: "production",
        PORT:     3001,
      },

      // Environment variables for development
      env_development: {
        NODE_ENV: "development",
        PORT:     3001,
      },

      // Logging
      out_file:  "./logs/out.log",   // stdout
      error_file: "./logs/err.log",  // stderr
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};

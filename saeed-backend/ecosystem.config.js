module.exports = {
  apps: [
    {
      name:         "saeed-furniture",
      script:       "server.js",
      instances:    "max",           // Unleash Node.js: spawn a process for every CPU core
      exec_mode:    "cluster",       // Enable PM2's internal load balancer
      autorestart:  true,
      watch:        false,
      max_memory_restart: "200M",
      restart_delay: 1000,
      env_production: {
        NODE_ENV: "production",
        PORT:     3001,
      },
      env_development: {
        NODE_ENV: "development",
        PORT:     3001,
      },
      out_file:  "./logs/out.log",
      error_file: "./logs/err.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};

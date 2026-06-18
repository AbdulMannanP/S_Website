# STAGE 1: Skipped.
# We are skipping the Tailwind and React builds on Render because the 
# free tier (512MB RAM) often OOM kills esbuild/tailwindcss.
# All compiled assets (react-bundle.js, output.css) are now committed directly to Git.

# STAGE 2: Setup the Production Node Backend
FROM node:22-alpine
WORKDIR /app

# 1. Setup Backend Dependencies
# Copy only the backend package files first for better caching
COPY saeed-backend/package*.json ./saeed-backend/

# Install only production dependencies to keep the image light
RUN cd saeed-backend && npm install --omit=dev

# 2. Copy Backend Code
COPY saeed-backend/ ./saeed-backend/

# 3. Copy Frontend Code
# Copy the static HTML/JS files, including the pre-built dist folder
COPY frontend/ ./frontend/

# Ensure the app runs in production mode
ENV NODE_ENV=production

# Expose the port (Render can map this dynamically, but 3001 matches our config)
EXPOSE 3001

# Start the Node.js backend
# The server.js path logic (path.join(__dirname, "..", "frontend")) will work perfectly here
CMD ["node", "./saeed-backend/server.js"]

# STAGE 1: Build the Frontend (Tailwind CSS)
FROM node:20-alpine AS builder
WORKDIR /app

# Copy the root package files to install Tailwind CSS
COPY package*.json ./
RUN npm install

# Copy the frontend files
COPY frontend/ ./frontend/

# Copy build.js which is essential for bundling the React Majlis page
COPY build.js ./

# Build the Tailwind CSS and the React JSX bundle
RUN npm run build:css
RUN npm run build:react

# STAGE 2: Setup the Production Node Backend
FROM node:20-alpine
WORKDIR /app

# 1. Setup Backend Dependencies
# Copy only the backend package files first for better caching
COPY saeed-backend/package*.json ./saeed-backend/

# Install only production dependencies to keep the image light
RUN cd saeed-backend && npm install --omit=dev

# 2. Copy Backend Code
COPY saeed-backend/ ./saeed-backend/

# 3. Copy Frontend Code
# Copy the static HTML/JS files
COPY frontend/ ./frontend/
# Overwrite with the built CSS from Stage 1
COPY --from=builder /app/frontend/dist ./frontend/dist

# Ensure the app runs in production mode
ENV NODE_ENV=production

# Expose the port (Render can map this dynamically, but 3001 matches our config)
EXPOSE 3001

# Start the Node.js backend
# The server.js path logic (path.join(__dirname, "..", "frontend")) will work perfectly here
CMD ["node", "./saeed-backend/server.js"]

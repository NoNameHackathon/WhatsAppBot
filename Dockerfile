# Multi-stage build for efficiency
FROM node:21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy TypeScript config and source files
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript project
RUN npm run build

# Production stage
FROM node:21-alpine

# Install minimal runtime dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn \
    # Basic X11 libraries
    libx11 \
    libxcomposite \
    libxcursor \
    libxdamage \
    libxext \
    libxfixes \
    libxi \
    libxrandr \
    libxrender \
    libxscrnsaver \
    libxtst \
    # Let Puppeteer download its own Chromium
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy source files for ts-node (used in npm run web)
COPY tsconfig.json ./
COPY src ./src

# Create necessary directories for WhatsApp session
RUN mkdir -p /app/.wwebjs_auth && \
    mkdir -p /app/.wwebjs_cache

# Set permissions
RUN chmod -R 777 /app/.wwebjs_auth && \
    chmod -R 777 /app/.wwebjs_cache

# Expose port for web server
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Run the web server
CMD ["npm", "run", "web:prod"] 
# ============================================
# Multi-stage Dockerfile for Express Backend
# ============================================

# --- Stage 1: Install dependencies ---
FROM node:20-alpine AS deps

# bcrypt memerlukan native build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files dulu untuk cache layer
COPY package.json package-lock.json ./

# Install production dependencies saja
RUN npm ci --omit=dev

# --- Stage 2: Production image ---
FROM node:20-alpine AS production

# Label metadata
LABEL maintainer="YPRN Team"
LABEL description="Rimba Nusantara Backend - Express API Server"

# Security: jalankan sebagai non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy dependencies dari stage sebelumnya
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY package.json ./
COPY server.js ./
COPY database/ ./database/
COPY scripts/ ./scripts/

# Buat direktori uploads dengan subdirectories
RUN mkdir -p uploads/beranda uploads/kegiatan uploads/sia uploads/sroi uploads/video \
    && chown -R appuser:appgroup /app

# Expose port (default 5000)
EXPOSE 5000

# Health check menggunakan endpoint /api/health
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:${PORT:-5000}/api/health').then(r=>{if(!r.ok)throw new Error();process.exit(0)}).catch(()=>process.exit(1))"

# Jalankan sebagai non-root user
USER appuser

# Start server
CMD ["node", "server.js"]

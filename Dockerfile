# Multi-stage Dockerfile for React + Vite frontend

# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (use legacy peer deps to match local dev setup)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Accept build-time env vars for Vite (baked into build)
ARG VITE_API_URL
ARG VITE_FRONTEND_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_FRONTEND_URL=${VITE_FRONTEND_URL}

# Build the application (skip full tsc check in container for faster builds/tests)
RUN npx vite build

# Stage 2: Production
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

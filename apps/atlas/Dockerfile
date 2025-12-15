# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy root package.json and workspace configuration
COPY package.json bun.lock ./
COPY apps/atlas/package.json ./apps/atlas/

# Install dependencies
RUN bun install --filter @bx-team/atlas

# Copy application source
COPY apps/atlas ./apps/atlas

# Build the application
WORKDIR /app/apps/atlas
RUN bun run build

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy standalone build
COPY --from=builder /app/apps/atlas/.next/standalone ./
COPY --from=builder /app/apps/atlas/.next/static ./apps/atlas/.next/static

EXPOSE 3000

# Start the application
CMD ["bun", "apps/atlas/server.js"]

# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy root package.json and workspace configuration
COPY package.json bun.lock ./
COPY apps/website/package.json ./apps/website/

# Install dependencies
RUN bun install --filter @bx-team/website --ignore-scripts

# Copy application source
COPY apps/website ./apps/website

# Run postinstall scripts
WORKDIR /app/apps/website
RUN bun run postinstall

# Build the application
RUN --mount=type=secret,id=github_token \
    GITHUB_TOKEN=$(cat /run/secrets/github_token) bun run build

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy standalone build
COPY --from=builder /app/apps/website/.next/standalone ./
COPY --from=builder /app/apps/website/.next/static ./apps/website/.next/static
COPY --from=builder /app/apps/website/public ./apps/website/public

EXPOSE 3000

# Start the application
CMD ["bun", "apps/website/server.js"]

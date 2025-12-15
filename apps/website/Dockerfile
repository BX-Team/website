# Build stage
FROM oven/bun:1 AS builder

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN

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
RUN bun run build

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/website/.next ./.next
COPY --from=builder /app/apps/website/public ./public
COPY --from=builder /app/apps/website/package.json ./
COPY --from=builder /app/apps/website/next.config.ts ./
COPY --from=builder /app/apps/website/node_modules ./node_modules

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]

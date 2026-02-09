# Prune stage - create minimal workspace
FROM oven/bun:1 AS pruner

WORKDIR /app

# Install turbo globally
RUN bun add -g turbo@2.8.3

# Copy monorepo files
COPY . .

# Prune workspace for atlas app
RUN turbo prune @bx-team/atlas --docker

# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy pruned lockfile and package.json files
COPY --from=pruner /app/out/json/ .

# Install dependencies
RUN bun install --ignore-scripts

# Copy pruned source code
COPY --from=pruner /app/out/full/ .

# Copy turbo config
COPY turbo.json turbo.json

# Build the application
RUN bun add -g turbo@2.8.3
RUN turbo run build --filter=@bx-team/atlas

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

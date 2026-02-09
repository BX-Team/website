# Prune stage - create minimal workspace
FROM oven/bun:1 AS pruner

WORKDIR /app

# Install turbo globally
RUN bun add -g turbo@2.8.3

# Copy monorepo files
COPY . .

# Prune workspace for website app
RUN turbo prune @bx-team/website --docker

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

# Run postinstall scripts
RUN bun add -g turbo@2.8.3
RUN turbo run postinstall --filter=@bx-team/website

# Build the application
RUN --mount=type=secret,id=github_token \
    GITHUB_TOKEN=$(cat /run/secrets/github_token) turbo run build --filter=@bx-team/website

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

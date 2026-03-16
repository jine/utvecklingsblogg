# ============================================
# Stage 1: Dependencies Installation Stage
# ============================================

# IMPORTANT: Node.js Version Maintenance
# This Dockerfile uses Node.js 24.13.0-slim, which was the latest LTS version at the time of writing.
# To ensure security and compatibility, regularly update the NODE_VERSION ARG to the latest LTS version.
ARG NODE_VERSION=24.13.0-slim

FROM node:${NODE_VERSION} AS dependencies

# Set working directory
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Install project dependencies with frozen lockfile for reproducible builds
RUN --mount=type=cache,target=/root/.npm \
 --mount=type=cache,target=/usr/local/share/.cache/yarn \
 --mount=type=cache,target=/root/.local/share/pnpm/store \
 if [ -f package-lock.json ]; then \
 npm ci --no-audit --no-fund; \
 elif [ -f yarn.lock ]; then \
 corepack enable yarn && yarn install --frozen-lockfile --production=false; \
 elif [ -f pnpm-lock.yaml ]; then \
 corepack enable pnpm && pnpm install --frozen-lockfile; \
 else \
 echo "No lockfile found." && exit 1; \
 fi

# ============================================
# Stage 2: Build Next.js application in standalone mode
# ============================================

FROM node:${NODE_VERSION} AS builder

# Set working directory
WORKDIR /app

# Copy project dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source code
COPY . .

ENV NODE_ENV=production

# Generate PRISMA client
RUN npx prisma generate

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN --mount=type=cache,target=/app/.next/cache \
 if [ -f package-lock.json ]; then \
 npm run build; \
 elif [ -f yarn.lock ]; then \
 corepack enable yarn && yarn build; \
 elif [ -f pnpm-lock.yaml ]; then \
 corepack enable pnpm && pnpm build; \
 else \
 echo "No lockfile found." && exit 1; \
 fi

# ============================================
# Stage 3: Run Next.js application
# ============================================

FROM node:${NODE_VERSION} AS runner

# Install curl for health checks and gosu for user switching
RUN apt-get update && apt-get install -y curl gosu && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to want to disable telemetry during the run time.
# ENV NEXT_TELEMETRY_DISABLED=1

# Copy production assets
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create uploads directory (ownership fixed at runtime by entrypoint)
RUN mkdir -p /app/public/uploads/images

# Expose port 3000 to allow HTTP traffic
EXPOSE 3000

# Health check for Coolify - checks if the application is responding
# Interval: 30s, Timeout: 3s, Start period: 5s, Retries: 3
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Use entrypoint to fix permissions then run as node user
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]

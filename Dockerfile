# syntax=docker/dockerfile:1.4

# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /home/engine/project

COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /home/engine/project
COPY --from=deps /home/engine/project/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /home/engine/project

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /home/engine/project/public ./public
COPY --from=builder --chown=nextjs:nodejs /home/engine/project/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /home/engine/project/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN --mount=type=secret,id=PRISMA_FIELD_ENCRYPTION_KEY echo "PRISMA_FIELD_ENCRYPTION_KEY=$(cat /run/secrets/PRISMA_FIELD_ENCRYPTION_KEY)" >> .env.production
RUN --mount=type=secret,id=ASSETS_URL echo "ASSETS_URL=$(cat /run/secrets/ASSETS_URL)" >> .env.production
RUN npm run build && rm .env.production

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node server.js
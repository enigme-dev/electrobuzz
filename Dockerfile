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

RUN --mount=type=secret,id=NEXT_PUBLIC_ALGOLIA_APP_ID echo "NEXT_PUBLIC_ALGOLIA_APP_ID=$(cat /run/secrets/NEXT_PUBLIC_ALGOLIA_APP_ID)" >> .env.production
RUN --mount=type=secret,id=NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY echo "NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=$(cat /run/secrets/NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY)" >> .env.production
RUN --mount=type=secret,id=PRISMA_FIELD_ENCRYPTION_KEY echo "PRISMA_FIELD_ENCRYPTION_KEY=$(cat /run/secrets/PRISMA_FIELD_ENCRYPTION_KEY)" >> .env.production
RUN --mount=type=secret,id=ASSETS_URL echo "ASSETS_URL=$(cat /run/secrets/ASSETS_URL)" >> .env.production
RUN --mount=type=secret,id=MINIO_ENDPOINT echo "MINIO_ENDPOINT=$(cat /run/secrets/MINIO_ENDPOINT)" >> .env.production
RUN --mount=type=secret,id=MINIO_ACCESS_KEY echo "MINIO_ACCESS_KEY=$(cat /run/secrets/MINIO_ACCESS_KEY)" >> .env.production
RUN --mount=type=secret,id=MINIO_SECRET_KEY echo "MINIO_SECRET_KEY=$(cat /run/secrets/MINIO_SECRET_KEY)" >> .env.production

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
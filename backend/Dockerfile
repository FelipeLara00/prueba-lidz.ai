FROM node:22-bookworm-slim AS development

WORKDIR /app/backend
ENV DATABASE_URL=file:./dev.db

# Build context expected at repo root
COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev

EXPOSE 3001
CMD ["npm", "run", "start"]

FROM node:22-bookworm-slim AS production
WORKDIR /app/backend

COPY --from=development /app/backend/node_modules ./node_modules
COPY --from=development /app/backend/dist ./dist
COPY --from=development /app/backend/prisma ./prisma
COPY --from=development /app/backend/dev.db ./dev.db
COPY --from=development /app/backend/package*.json ./

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001
CMD ["npm", "run", "start:prod"]

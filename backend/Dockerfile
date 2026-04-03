FROM node:23 AS development

WORKDIR /app/backend

# Build context expected at repo root
COPY backend/package*.json ./
RUN npm install

COPY backend/ ./
RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start"]

FROM node:23 AS production
WORKDIR /app/backend

# Build context expected at repo root
COPY backend/package*.json ./
RUN npm install --omit=dev

COPY --from=development /app/backend/dist ./dist
COPY --from=development /app/backend/prisma ./prisma
COPY --from=development /app/backend/dev.db ./dev.db

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001
CMD ["npm", "run", "start:prod"]

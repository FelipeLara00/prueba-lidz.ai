FROM node:22-alpine AS development

WORKDIR /app/frontend

# Build context expected at repo root
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps

COPY frontend/ ./
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM node:22-alpine AS production

WORKDIR /app/frontend

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
ENV PORT=3000

COPY --from=development /app/frontend/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

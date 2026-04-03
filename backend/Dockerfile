# Development stage
FROM node:23 AS development

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3001

# Start the app in development mode
CMD ["npm", "run", "start"]

# Production stage
FROM node:23 AS base
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy built app from development stage
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/src ./src
COPY --from=development /usr/src/app/tsconfig.json ./
COPY --from=development /usr/src/app/test ./test

# Expose port
EXPOSE 3001

# Start the app
CMD ["npm", "run", "start:prod"]
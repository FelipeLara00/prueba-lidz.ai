# Development stage
FROM node:23 AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the app in development mode
CMD ["npm", "run", "dev"]

# Production stage
FROM node:23 AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", ".output/server/index.mjs"]

FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Use npm install instead of npm ci to resolve version conflicts
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/db-init.sql ./src/

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

USER nodejs

EXPOSE 4000

CMD ["node", "dist/index.js"]

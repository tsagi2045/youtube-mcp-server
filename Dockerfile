# Use an official Node runtime as the base image
FROM node:16-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json 
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application's source code
COPY . .

# Build the application
RUN npm run build

# Use a lightweight Node runtime as the release image
FROM node:16-alpine AS release

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/package-lock.json /app/

# Install only production dependencies
RUN npm ci --only=production

# Make the CLI script executable
RUN chmod +x /app/dist/cli.js

# Set environment variables will be provided at runtime via config
ENV NODE_ENV=production

# MCP servers typically listen on stdio
CMD ["node", "dist/index.js"]
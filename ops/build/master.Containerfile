# Build stage
FROM node:23.0.0-alpine AS builder

WORKDIR /app

# Upgrade npm to latest version
RUN npm install -g npm@latest

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build for production (builds both frontend and backend)
RUN npm run build

# Extract Node.js and minimal dependencies
FROM node:23.0.0-alpine AS node-runtime

# Create minimal runtime stage
FROM scratch

WORKDIR /app

# Copy Node.js binary and essential libraries from Alpine
COPY --from=node-runtime /usr/local/bin/node /usr/local/bin/node
COPY --from=node-runtime /lib/ld-musl-x86_64.so.1 /lib/ld-musl-x86_64.so.1
COPY --from=node-runtime /usr/lib/libstdc++.so.6 /usr/lib/libstdc++.so.6
COPY --from=node-runtime /usr/lib/libgcc_s.so.1 /usr/lib/libgcc_s.so.1

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy node_modules (production dependencies)
COPY --from=builder /app/node_modules ./node_modules

# Copy package.json for metadata
COPY --from=builder /app/package.json ./package.json

# Copy public data files
COPY --from=builder /app/public ./public

# Create minimal /etc/passwd for non-root user
COPY --from=node-runtime /etc/passwd /etc/passwd

# Set environment to production
ENV NODE_ENV=production
ENV PORT=5000

# Expose backend port
EXPOSE 5000

# Run the Node.js backend server
ENTRYPOINT ["/usr/local/bin/node"]
CMD ["dist/index.js"]
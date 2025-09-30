FROM node:23.0.0-alpine AS development

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run dev server with host binding for container access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


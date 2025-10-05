FROM node:23.0.0-alpine AS development

WORKDIR /app

# Upgrade npm to latest version
RUN npm install -g npm@latest

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run dev server with host binding for container access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


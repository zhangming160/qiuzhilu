FROM node:18

WORKDIR /app

# Install dependencies (better-sqlite3 needs build tools)
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Build frontend
RUN npx vite build

# Expose port (Zeabur uses PORT env var)
EXPOSE 3001

# Start the Express server (serves both API and static files)
CMD ["node", "server/index.js"]

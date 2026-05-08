FROM node:20

WORKDIR /app

# Install dependencies (better-sqlite3 needs build tools)
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Build frontend
RUN npx vite build && ls -la dist/

# Expose port (Zeabur uses PORT env var)
EXPOSE 8080

# Start the Express server (serves both API and static files)
CMD ["node", "server/index.js"]

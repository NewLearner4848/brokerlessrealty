# ---- Backend: Express + SQLite API ----
FROM node:20-bookworm-slim

# sqlite3 npm package builds/uses native bindings; the slim image already has
# what it needs at runtime. Set production early so npm skips dev deps.
ENV NODE_ENV=production

WORKDIR /app

# Install dependencies first for better layer caching. The prebuilt sqlite3
# native binary targets a newer glibc than the base image ships, so we compile
# it from source against this image's glibc. Build toolchain is removed after.
COPY package*.json ./
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && npm_config_build_from_source=true npm ci --omit=dev \
  && apt-get purge -y python3 make g++ \
  && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*

# Copy application source.
COPY . .

# The SQLite database and uploaded files live under these paths, which are
# mounted as named volumes in docker-compose so they persist across rebuilds.
ENV DB_PATH=/app/data/brokerless.sqlite
RUN mkdir -p /app/data /app/public/uploads

# Entrypoint runs migrations (and first-time seed) before starting the server.
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]

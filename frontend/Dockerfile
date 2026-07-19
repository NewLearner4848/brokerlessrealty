# ---- Stage 1: build the Vite app ----
FROM node:20-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# The API base URL is baked into the static bundle at build time. It defaults to
# the production backend domain (see config.ts) but can be overridden here.
ARG VITE_API_BASE_URL=https://backend.brokerlessrealty.com
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# Optional: Gemini key used by vite.config.ts (safe to leave as a placeholder).
ARG GEMINI_API_KEY=dummy_gemini_api_key
ENV GEMINI_API_KEY=$GEMINI_API_KEY

RUN npm run build

# ---- Stage 2: serve the built files with Caddy ----
FROM caddy:2-alpine

COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

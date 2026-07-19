#!/bin/sh
set -e

echo "[entrypoint] Ensuring data directories exist..."
mkdir -p /app/data /app/public/uploads

echo "[entrypoint] Running database migrations..."
npx knex migrate:latest --knexfile knexfile.js

# Seed the database only once (admin user + demo properties). A marker file in
# the persistent data volume prevents duplicate seeding on every restart.
if [ ! -f /app/data/.seeded ]; then
  echo "[entrypoint] First run detected — seeding database..."
  node src/seeders/runSeeders.js || echo "[entrypoint] Seeding skipped/failed (continuing)."
  touch /app/data/.seeded
else
  echo "[entrypoint] Database already seeded — skipping."
fi

echo "[entrypoint] Starting: $*"
exec "$@"

#!/bin/bash
set -e

echo "📥 Pulling latest backend code..."
git pull origin main

echo "🐳 Rebuilding backend container..."
docker compose build backend

echo "🚀 Restarting backend..."
docker compose up -d backend

echo "🧹 Cleaning unused Docker images..."
docker image prune -f

echo "✅ Backend deployment completed!"

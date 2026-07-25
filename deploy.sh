#!/bin/bash
set -e

echo "📥 Pulling latest frontend code..."
git pull origin main

echo "🐳 Rebuilding frontend container..."
docker compose build frontend

echo "🚀 Restarting frontend..."
docker compose up -d frontend

echo "🧹 Cleaning unused Docker images..."
docker image prune -f

echo "✅ Frontend deployment completed!"

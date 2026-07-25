#!/bin/bash
set -e

echo "📥 Pulling latest code..."
git pull origin main

echo "🐳 Rebuilding frontend..."
docker compose build frontend

echo "🐳 Rebuilding backend..."
docker compose build backend

echo "🚀 Restarting services..."
docker compose up -d frontend backend

echo "🧹 Cleaning unused images..."
docker image prune -f

echo "✅ Deployment completed successfully!"

#!/bin/sh
set -e

echo "⏳ Waiting for database..."
sleep 2

echo "📦 Generating Prisma client..."
npx prisma generate

echo "📦 Running Prisma db push..."
npx prisma db push --accept-data-loss

echo "🌱 Seeding database..."
npm run db:seed || echo "Seed skipped or already done"

if [ "$NODE_ENV" = "development" ]; then
  echo "🚀 Starting backend (development)..."
  exec npm run dev
fi

echo "🚀 Starting backend (production)..."
exec node dist/index.js

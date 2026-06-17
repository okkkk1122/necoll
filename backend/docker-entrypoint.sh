#!/bin/sh
set -e

echo "⏳ Waiting for database..."
sleep 2

if [ ! -f "node_modules/.prisma/client/index.js" ]; then
  echo "📦 Generating Prisma client..."
  npx prisma generate || { echo "Prisma generate failed, retrying..."; sleep 5; npx prisma generate; }
fi

echo "📦 Running Prisma db push..."
npx prisma db push --accept-data-loss

echo "🌱 Seeding database..."
npm run db:seed || echo "Seed skipped or already done"

if [ "$NODE_ENV" = "development" ]; then
  echo "🚀 Starting backend (development)..."
  exec npm run dev
fi

echo "🔨 Building backend..."
npm run build

echo "🚀 Starting backend (production)..."
exec npm run start

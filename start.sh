#!/bin/sh
echo "========================================"
echo "  Necoll Shop - Docker Desktop Setup"
echo "========================================"

if ! docker info >/dev/null 2>&1; then
  echo "[ERROR] Docker is not running. Start Docker Desktop first."
  exit 1
fi

cd "$(dirname "$0")"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "[OK] Created .env from .env.example"
fi

echo "Building and starting all services..."
docker compose -f docker-compose.yml --env-file .env up --build -d

if [ $? -eq 0 ]; then
  echo ""
  echo "  Store:   http://localhost:3011"
  echo "  Admin:   http://localhost:3011/admin"
  echo "  Login:   admin@necoll.ir / admin123"
else
  echo "[ERROR] Failed. Run: docker compose logs"
fi

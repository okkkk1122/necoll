#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

python3 << 'PY'
import json
from pathlib import Path

config = json.loads(Path("config.json").read_text(encoding="utf-8"))
extra = dict(config["extra_env"])
extra["DB_PASSWORD"] = config["project"]["db_password"]

domain = config["project"]["domain"]
scheme = "https" if config["project"].get("ssl") else "http"
base = f"{scheme}://{domain}"
extra["SITE_URL"] = base
extra["CORS_ORIGIN"] = base
extra["NEXT_PUBLIC_SITE_URL"] = base
extra["NEXT_PUBLIC_API_URL"] = f"{base}/api"
extra["MINIO_PUBLIC_URL"] = f"{base}/uploads"

pw = config["project"]["db_password"].replace("@", "%40")
db_user = extra.get("DB_USER", "necoll")
db_name = extra.get("DB_NAME", "necoll_db")
extra["DATABASE_URL"] = f"postgresql://{db_user}:{pw}@postgres:5432/{db_name}"

extra["SITE_PORT"] = "80"
extra["HOST"] = "0.0.0.0"
extra["BACKEND_PORT"] = "4000"
extra["API_INTERNAL_URL"] = "http://backend:4000/api"
extra["REDIS_URL"] = "redis://redis:6379"
extra["MINIO_ENDPOINT"] = "minio"
extra["MINIO_PORT"] = "9000"

lines = [f"{k}={v}" for k, v in extra.items()]
Path(".env.production").write_text("\n".join(lines) + "\n", encoding="utf-8")
print("[OK] Wrote .env.production from config.json")
PY

git pull
docker compose -f docker-compose.yml -f docker-compose.override.yml --env-file .env.production build --no-cache store admin backend
docker compose -f docker-compose.yml -f docker-compose.override.yml --env-file .env.production up -d
docker compose -f docker-compose.yml -f docker-compose.override.yml --env-file .env.production restart nginx

DOMAIN="$(python3 -c "import json; print(json.load(open('config.json'))['project']['domain'])")"
echo ""
echo "Production deploy complete: https://${DOMAIN}"

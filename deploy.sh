#!/bin/bash
set -e

echo "🚀 Deployment Started"
read -p "Project name: " PROJECT_NAME
read -p "Domain: " DOMAIN
read -p "Repository URL: " REPO_URL
read -s -p "Database password: " DB_PASSWORD
echo ""

PROJECT_PATH="/opt/projects/$PROJECT_NAME"
PROJECT_NETWORK="${PROJECT_NAME}-network"
JWT_SECRET=$(openssl rand -base64 32)

rm -rf $PROJECT_PATH
cd /opt/projects
git clone $REPO_URL $PROJECT_NAME
cd $PROJECT_PATH

cat > .env << EOF
NODE_ENV=production
DOMAIN=${DOMAIN}
JWT_SECRET=${JWT_SECRET}
DATABASE_URL="postgresql://necoll:${DB_PASSWORD}@postgres:5432/${PROJECT_NAME}_db"
POSTGRES_USER=necoll
POSTGRES_PASSWORD=${DB_PASSWORD}
POSTGRES_DB=${PROJECT_NAME}_db
MINIO_ROOT_USER=necoll_minio
MINIO_ROOT_PASSWORD=necoll_minio_secret
EOF

docker network create $PROJECT_NETWORK 2>/dev/null || true

cat > docker-compose.yml << 'DOCKER'
services:
  postgres:
    image: postgres:16-alpine
    container_name: ${PROJECT_NAME}-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 10s
    networks:
      - ${PROJECT_NETWORK}

  redis:
    image: redis:7-alpine
    container_name: ${PROJECT_NAME}-redis
    restart: unless-stopped
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10
    networks:
      - ${PROJECT_NETWORK}

  minio:
    image: minio/minio:latest
    container_name: ${PROJECT_NAME}-minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    volumes:
      - minio_data:/data
    networks:
      - ${PROJECT_NETWORK}

  minio-init:
    image: minio/mc:latest
    container_name: ${PROJECT_NAME}-minio-init
    depends_on:
      minio:
        condition: service_started
    entrypoint: >
      /bin/sh -c "
      sleep 3;
      mc alias set ${PROJECT_NAME} http://minio:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD};
      mc mb ${PROJECT_NAME}/${PROJECT_NAME}-uploads --ignore-existing;
      mc anonymous set download ${PROJECT_NAME}/${PROJECT_NAME}-uploads;
      echo 'MinIO bucket ready';
      "
    restart: "no"
    networks:
      - ${PROJECT_NETWORK}

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: ${PROJECT_NAME}-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 4000
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      MINIO_ENDPOINT: minio
      MINIO_PORT: 9000
      MINIO_ACCESS_KEY: ${MINIO_ROOT_USER}
      MINIO_SECRET_KEY: ${MINIO_ROOT_PASSWORD}
      MINIO_BUCKET: ${PROJECT_NAME}-uploads
      CORS_ORIGIN: https://${DOMAIN}
      SITE_URL: https://${DOMAIN}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      minio-init:
        condition: service_completed_successfully
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:4000/api/health"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 90s
    networks:
      - ${PROJECT_NETWORK}

  store:
    build:
      context: ./store
      dockerfile: Dockerfile
    container_name: ${PROJECT_NAME}-store
    restart: unless-stopped
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: https://${DOMAIN}/api
      NEXT_PUBLIC_SITE_URL: https://${DOMAIN}
      API_INTERNAL_URL: http://backend:4000/api
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test
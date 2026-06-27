# Necoll - Docker Desktop Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Necoll Shop - Docker Desktop Setup  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
try {
    docker info 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Docker not running" }
    Write-Host "[OK] Docker Desktop is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

Set-Location $PSScriptRoot

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "[OK] Created .env from .env.example" -ForegroundColor Green
}

Write-Host ""
Write-Host "Building and starting all services..." -ForegroundColor Yellow
Write-Host "This may take 5-10 minutes on first run." -ForegroundColor Gray
Write-Host ""

docker compose -f docker-compose.yml --env-file .env up --build -d

if ($LASTEXITCODE -eq 0) {
    docker compose -f docker-compose.yml restart nginx | Out-Null
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Necoll is ready!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Store:    http://localhost:3011" -ForegroundColor White
    Write-Host "  Admin:    http://localhost:3011/admin" -ForegroundColor White
    Write-Host "  API:      http://localhost:3011/api/health" -ForegroundColor White
    Write-Host "  Adminer:  http://localhost:8080" -ForegroundColor White
    Write-Host "  MinIO:    http://localhost:9001" -ForegroundColor White
    Write-Host ""
    Write-Host "  Login: admin@necoll.ir / admin123" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  View logs: docker compose logs -f" -ForegroundColor Gray
    Write-Host "  Stop:      docker compose down" -ForegroundColor Gray
} else {
    Write-Host "[ERROR] Failed to start. Check logs:" -ForegroundColor Red
    Write-Host "  docker compose logs" -ForegroundColor Yellow
}

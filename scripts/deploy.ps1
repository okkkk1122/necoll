$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$config = Get-Content "config.json" -Raw | ConvertFrom-Json
$domain = $config.project.domain
$scheme = if ($config.project.ssl) { 'https' } else { 'http' }
$base = "$scheme://$domain"
$dbPassword = $config.project.db_password
$dbPasswordEncoded = $dbPassword -replace '@', '%40'
$dbUser = $config.extra_env.DB_USER
$dbName = $config.extra_env.DB_NAME

$envMap = [ordered]@{}
foreach ($prop in $config.extra_env.PSObject.Properties) {
    $envMap[$prop.Name] = [string]$prop.Value
}

$envMap['DB_PASSWORD'] = $dbPassword
$envMap['DATABASE_URL'] = "postgresql://${dbUser}:${dbPasswordEncoded}@postgres:5432/${dbName}"
$envMap['SITE_URL'] = $base
$envMap['CORS_ORIGIN'] = $base
$envMap['NEXT_PUBLIC_SITE_URL'] = $base
$envMap['NEXT_PUBLIC_API_URL'] = "$base/api"
$envMap['MINIO_PUBLIC_URL'] = "$base/uploads"

# متغیرهای داخلی Docker (خارج از extra_env در config.json)
$envMap['SITE_PORT'] = '80'
$envMap['HOST'] = '0.0.0.0'
$envMap['BACKEND_PORT'] = '4000'
$envMap['API_INTERNAL_URL'] = 'http://backend:4000/api'
$envMap['REDIS_URL'] = 'redis://redis:6379'
$envMap['MINIO_ENDPOINT'] = 'minio'
$envMap['MINIO_PORT'] = '9000'

$envMap.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" } | Set-Content ".env.production" -Encoding UTF8
Write-Host "[OK] Wrote .env.production from config.json" -ForegroundColor Green

git pull
docker compose -f docker-compose.yml -f docker-compose.override.yml --env-file .env.production build --no-cache store admin backend
docker compose -f docker-compose.yml -f docker-compose.override.yml --env-file .env.production up -d
docker compose -f docker-compose.yml -f docker-compose.override.yml --env-file .env.production restart nginx

Write-Host ""
Write-Host "Production deploy complete: $base" -ForegroundColor Green

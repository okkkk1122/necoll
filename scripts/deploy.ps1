$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

git pull
docker compose build --no-cache store admin backend
docker compose up -d

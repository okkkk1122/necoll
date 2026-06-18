$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

git pull
docker compose build
docker compose up -d

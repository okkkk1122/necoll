# Necoll — Full Site Test Suite (Extended)
$BaseUrl = "http://localhost:3011"
$ApiUrl = "$BaseUrl/api"
$Passed = 0
$Failed = 0
$Results = @()

function Test-Endpoint {
    param([string]$Name, [string]$Url, [int[]]$ExpectedCodes = @(200), [string]$Contains = "", [string]$Method = "GET", [string]$Body = "")
    try {
        $params = @{ Uri = $Url; UseBasicParsing = $true; TimeoutSec = 15; Method = $Method }
        if ($Body) { $params.Body = $Body; $params.ContentType = "application/json" }
        $res = Invoke-WebRequest @params
        $ok = $ExpectedCodes -contains $res.StatusCode
        if ($Contains -and $res.Content -notmatch [regex]::Escape($Contains)) { $ok = $false }
        if ($ok) {
            $script:Passed++
            $script:Results += [PSCustomObject]@{ Status = "PASS"; Name = $Name; Code = $res.StatusCode }
        } else {
            $script:Failed++
            $script:Results += [PSCustomObject]@{ Status = "FAIL"; Name = $Name; Code = $res.StatusCode; Error = "Unexpected status" }
        }
    } catch {
        $script:Failed++
        $code = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 0 }
        $script:Results += [PSCustomObject]@{ Status = "FAIL"; Name = $Name; Code = $code; Error = $_.Exception.Message }
    }
}

function Test-JsonApi {
    param([string]$Name, [string]$Url, [scriptblock]$Validator)
    try {
        $res = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 15
        $json = $res.Content | ConvertFrom-Json
        $ok = & $Validator $json
        if ($ok) {
            $script:Passed++
            $script:Results += [PSCustomObject]@{ Status = "PASS"; Name = $Name; Code = $res.StatusCode }
        } else {
            $script:Failed++
            $script:Results += [PSCustomObject]@{ Status = "FAIL"; Name = $Name; Code = $res.StatusCode; Error = "Validation failed" }
        }
    } catch {
        $script:Failed++
        $script:Results += [PSCustomObject]@{ Status = "FAIL"; Name = $Name; Code = 0; Error = $_.Exception.Message }
    }
}

function Test-No404 {
    param([string]$Name, [string]$Url)
    try {
        $res = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 10
        if ($res.StatusCode -eq 200) {
            $script:Passed++
            $script:Results += [PSCustomObject]@{ Status = "PASS"; Name = $Name; Code = 200 }
        } else {
            $script:Failed++
            $script:Results += [PSCustomObject]@{ Status = "FAIL"; Name = $Name; Code = $res.StatusCode; Error = "Not 200" }
        }
    } catch {
        $script:Failed++
        $code = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 0 }
        $script:Results += [PSCustomObject]@{ Status = "FAIL"; Name = $Name; Code = $code; Error = "404 or error" }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Necoll Site Test Suite (Extended)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Docker containers
Write-Host "[Docker] Checking containers..." -ForegroundColor Yellow
$containers = @("necoll-nginx", "necoll-backend", "necoll-store", "necoll-admin", "necoll-postgres", "necoll-redis")
foreach ($c in $containers) {
    $status = docker inspect -f '{{.State.Status}}' $c 2>$null
    if ($status -eq "running") {
        $Passed++
        $Results += [PSCustomObject]@{ Status = "PASS"; Name = "Docker: $c"; Code = "running" }
    } else {
        $Failed++
        $Results += [PSCustomObject]@{ Status = "FAIL"; Name = "Docker: $c"; Code = $status; Error = "Not running" }
    }
}

Write-Host ""
Write-Host "[API] Testing endpoints..." -ForegroundColor Yellow

Test-Endpoint "API Health" "$ApiUrl/health" -Contains "ok"
Test-JsonApi "Config Public" "$ApiUrl/config/public" { param($j) ($j.site_name.fa -or $j.site_name.en -or $j.site_name) -ne $null }
Test-JsonApi "Config: site_logo" "$ApiUrl/config/public" { param($j) $j.site_logo -eq '/logo.png' }
Test-JsonApi "Config: announcement_bar" "$ApiUrl/config/public" { param($j) $j.announcement_bar.enabled -eq $true }
Test-JsonApi "Config: lookbook_config" "$ApiUrl/config/public" { param($j) $j.lookbook_config.enabled -eq $true }
Test-JsonApi "Config: home has lookbook" "$ApiUrl/config/public" { param($j) $j.home_layout_blocks -contains 'lookbook' }
Test-JsonApi "Products List" "$ApiUrl/products?limit=5" { param($j) $j.products.Count -gt 0 }
Test-JsonApi "Categories" "$ApiUrl/categories" { param($j) $j.Count -gt 0 }
Test-JsonApi "Blog Posts" "$ApiUrl/blog" { param($j) $j.Count -gt 0 }
Test-JsonApi "Navigation" "$ApiUrl/navigation" { param($j) $j.Count -ge 5 }
Test-JsonApi "Payment Gateways" "$ApiUrl/payment/gateways" { param($j) $true }
Test-JsonApi "Chat Status" "$ApiUrl/chat/status" { param($j) $j.enabled -ne $null }
Test-JsonApi "Pages About" "$ApiUrl/pages/about" { param($j) $j.title -ne $null }
Test-Endpoint "Newsletter Subscribe" "$ApiUrl/newsletter/subscribe" -Method POST -Body '{"email":"test@necoll.ir"}' -ExpectedCodes @(200)

Write-Host ""
Write-Host "[Pages] Testing frontend pages..." -ForegroundColor Yellow

$pages = @(
    @{ Name = "Home"; Url = "$BaseUrl/" },
    @{ Name = "Products"; Url = "$BaseUrl/products" },
    @{ Name = "Lookbook"; Url = "$BaseUrl/lookbook" },
    @{ Name = "Cart"; Url = "$BaseUrl/cart" },
    @{ Name = "Checkout"; Url = "$BaseUrl/checkout" },
    @{ Name = "About"; Url = "$BaseUrl/about" },
    @{ Name = "Contact"; Url = "$BaseUrl/contact" },
    @{ Name = "Blog"; Url = "$BaseUrl/blog" },
    @{ Name = "Admin Login"; Url = "$BaseUrl/admin/login" },
    @{ Name = "Admin Dashboard"; Url = "$BaseUrl/admin" },
    @{ Name = "Admin Content"; Url = "$BaseUrl/admin/content" },
    @{ Name = "Admin Navigation"; Url = "$BaseUrl/admin/navigation" },
    @{ Name = "Admin Product Edit"; Url = "$BaseUrl/admin/products/edit" }
)

foreach ($p in $pages) {
    Test-Endpoint $p.Name $p.Url
}

Test-JsonApi "Product Slug" "$ApiUrl/products/pinstripe-suit-set" { param($j) $j.slug -eq "pinstripe-suit-set" }
Test-JsonApi "Product has image" "$ApiUrl/products/pinstripe-suit-set" { param($j) $j.images.Count -gt 0 }
Test-Endpoint "Product Detail Page" "$BaseUrl/products/pinstripe-suit-set"
Test-No404 "Product Image" "$BaseUrl/images/products/pinstripe-suit-set.png"
Test-Endpoint "Blog Post Page" "$BaseUrl/blog/welcome-to-necoll"

Write-Host ""
Write-Host "[Mobile] Checking responsive markup..." -ForegroundColor Yellow

try {
    $homeHtml = (Invoke-WebRequest -Uri "$BaseUrl/" -UseBasicParsing -TimeoutSec 15).Content
    $mobileChecks = @(
        @{ Name = "Viewport meta"; Pattern = 'width=device-width' },
        @{ Name = "Hero slider class"; Pattern = 'hero-slider' },
        @{ Name = "Mobile bottom nav"; Pattern = 'mobile-bottom-nav' },
        @{ Name = "Mobile nav lg:hidden"; Pattern = 'lg:hidden' },
        @{ Name = "Main mobile padding"; Pattern = 'main-with-mobile-nav' }
    )
    foreach ($check in $mobileChecks) {
        if ($homeHtml -match [regex]::Escape($check.Pattern) -or $homeHtml -match $check.Pattern) {
            $Passed++
            $Results += [PSCustomObject]@{ Status = "PASS"; Name = "Mobile: $($check.Name)"; Code = "found" }
        } else {
            $Failed++
            $Results += [PSCustomObject]@{ Status = "FAIL"; Name = "Mobile: $($check.Name)"; Code = 0; Error = "Not in HTML" }
        }
    }
} catch {
    $Failed++
    $Results += [PSCustomObject]@{ Status = "FAIL"; Name = "Mobile: Homepage fetch"; Code = 0; Error = $_.Exception.Message }
}

Write-Host ""
Write-Host "[Assets] Checking static files..." -ForegroundColor Yellow

Test-No404 "Logo PNG" "$BaseUrl/logo.png"
Test-No404 "Favicon PNG" "$BaseUrl/favicon.png"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Results: $Passed passed, $Failed failed" -ForegroundColor $(if ($Failed -eq 0) { "Green" } else { "Yellow" })
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$Results | Format-Table -AutoSize

if ($Failed -gt 0) {
    Write-Host "Some tests failed!" -ForegroundColor Red
    exit 1
} else {
    Write-Host "All tests passed!" -ForegroundColor Green
    exit 0
}

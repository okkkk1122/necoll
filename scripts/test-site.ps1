# Necoll — Site Test Suite (Monaie minimal)
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
Write-Host "  Necoll Site Test Suite (Minimal)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Docker containers
Write-Host "[Docker] Checking containers..." -ForegroundColor Yellow
$containers = @("necoll-nginx", "necoll-backend", "necoll-store", "necoll-postgres", "necoll-redis")
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
Test-JsonApi "Config: announcement disabled" "$ApiUrl/config/public" { param($j) $j.announcement_bar.enabled -eq $false }
Test-JsonApi "Config: lookbook disabled" "$ApiUrl/config/public" { param($j) $j.lookbook_config.enabled -eq $false }
Test-JsonApi "Config: minimal home layout" "$ApiUrl/config/public" {
    param($j)
    $blocks = $j.home_layout_blocks
    ($blocks -contains 'categories') -and ($blocks -notcontains 'hero_slider') -and ($blocks -notcontains 'lookbook')
}
Test-JsonApi "Config: home categories" "$ApiUrl/config/public" { param($j) $j.home_categories.Count -ge 7 }
Test-JsonApi "Products List" "$ApiUrl/products?limit=5" { param($j) $j.products.Count -gt 0 }
try {
    $cats = (Invoke-WebRequest -Uri "$ApiUrl/categories" -UseBasicParsing -TimeoutSec 15).Content | ConvertFrom-Json
    $manteauId = ($cats | Where-Object { $_.slug -eq 'manteau' }).id
    if ($manteauId) {
        Test-JsonApi "Menu filter: manteau only" "$ApiUrl/products?section=clothing&category=$manteauId" {
            param($j)
            $j.products.Count -eq 1 -and $j.products[0].slug -eq 'mustard-lace-manteau'
        }
    }
} catch {
    $Failed++
    $Results += [PSCustomObject]@{ Status = "FAIL"; Name = "Menu filter: manteau only"; Code = 0; Error = $_.Exception.Message }
}
Test-JsonApi "Menu filter: scarves rosari" "$ApiUrl/products?section=scarves&item=rosari" {
  param($j) $j.products.Count -eq 1 -and $j.products[0].slug -eq 'silk-rosari'
}
Test-JsonApi "Menu filter: featured" "$ApiUrl/products?featured=true" {
  param($j) ($j.products | Where-Object { $_.isFeatured -eq $true }).Count -eq $j.products.Count -and $j.products.Count -gt 0
}
Test-JsonApi "Categories" "$ApiUrl/categories" { param($j) $j.Count -gt 0 }
Test-JsonApi "Navigation" "$ApiUrl/navigation" { param($j) $j.Count -ge 10 }
Test-JsonApi "Payment Gateways" "$ApiUrl/payment/gateways" { param($j) $true }
Test-JsonApi "Chat disabled" "$ApiUrl/chat/status" { param($j) $j.enabled -eq $false }
Test-JsonApi "Pages About" "$ApiUrl/pages/about" { param($j) $j.title -ne $null }

Write-Host ""
Write-Host "[Pages] Testing frontend pages..." -ForegroundColor Yellow

$pages = @(
    @{ Name = "Home"; Url = "$BaseUrl/" },
    @{ Name = "Products"; Url = "$BaseUrl/products" },
    @{ Name = "Cart"; Url = "$BaseUrl/cart" },
    @{ Name = "Checkout"; Url = "$BaseUrl/checkout" },
    @{ Name = "About"; Url = "$BaseUrl/about" },
    @{ Name = "Contact"; Url = "$BaseUrl/contact" },
    @{ Name = "Account"; Url = "$BaseUrl/account" },
    @{ Name = "Club"; Url = "$BaseUrl/club" },
    @{ Name = "Terms"; Url = "$BaseUrl/terms" },
    @{ Name = "Admin Login"; Url = "$BaseUrl/admin/login" },
    @{ Name = "Admin Dashboard"; Url = "$BaseUrl/admin" }
)

foreach ($p in $pages) {
    Test-Endpoint $p.Name $p.Url
}

Test-JsonApi "Product Slug" "$ApiUrl/products/pinstripe-suit-set" { param($j) $j.slug -eq "pinstripe-suit-set" }
Test-JsonApi "Product has image" "$ApiUrl/products/pinstripe-suit-set" { param($j) $j.images.Count -gt 0 }
Test-Endpoint "Product Detail Page" "$BaseUrl/products/pinstripe-suit-set"
Test-No404 "Product Image" "$BaseUrl/images/products/pinstripe-suit-set.jpg"

Write-Host ""
Write-Host "[Mobile] Checking responsive markup..." -ForegroundColor Yellow

try {
    $homeHtml = (Invoke-WebRequest -Uri "$BaseUrl/" -UseBasicParsing -TimeoutSec 15).Content
    $mobileChecks = @(
        @{ Name = "Viewport meta"; Pattern = 'width=device-width' },
        @{ Name = "Monaie category cards"; Pattern = 'monaie-cat-card' },
        @{ Name = "Monaie home grid"; Pattern = 'monaie-home-categories' },
        @{ Name = "Mobile menu lg:hidden"; Pattern = 'lg:hidden' }
    )
    $noExtraChecks = @(
        @{ Name = "No hero slider"; Pattern = 'hero-slider' },
        @{ Name = "No mobile bottom nav"; Pattern = 'mobile-bottom-nav' }
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
    foreach ($check in $noExtraChecks) {
        if ($homeHtml -notmatch [regex]::Escape($check.Pattern)) {
            $Passed++
            $Results += [PSCustomObject]@{ Status = "PASS"; Name = "Mobile: $($check.Name)"; Code = "absent" }
        } else {
            $Failed++
            $Results += [PSCustomObject]@{ Status = "FAIL"; Name = "Mobile: $($check.Name)"; Code = 0; Error = "Still in HTML" }
        }
    }

    $productsHtml = (Invoke-WebRequest -Uri "$BaseUrl/products" -UseBasicParsing -TimeoutSec 15).Content
    if ($productsHtml -match 'monaie-shop-products__grid' -and $productsHtml -match 'monaie-product-card' -and $productsHtml -notmatch 'فیلترها') {
        $Passed++
        $Results += [PSCustomObject]@{ Status = "PASS"; Name = "Products: wide grid no filters"; Code = "found" }
    } else {
        $Failed++
        $Results += [PSCustomObject]@{ Status = "FAIL"; Name = "Products: wide grid no filters"; Code = 0; Error = "Layout mismatch" }
    }
} catch {
    $Failed++
    $Results += [PSCustomObject]@{ Status = "FAIL"; Name = "Mobile: Homepage fetch"; Code = 0; Error = $_.Exception.Message }
}

Write-Host ""
Write-Host "[Assets] Checking static files..." -ForegroundColor Yellow

Test-No404 "Logo PNG" "$BaseUrl/logo.png"
Test-No404 "Favicon PNG" "$BaseUrl/favicon.png"
Test-No404 "Enamad badge" "$BaseUrl/enamad.png"

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

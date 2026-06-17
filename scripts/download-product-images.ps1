# Download wide 5:2 product images from Unsplash (free license)
$dest = Join-Path $PSScriptRoot "..\store\public\images\products"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

function U($id) { "https://images.unsplash.com/photo-$id`?auto=format&fit=crop&w=2000&h=800&q=85" }

# Each image matched to product title (fa name)
$products = [ordered]@{
    "pinstripe-suit-set.jpg"    = U "1606776627650-454d6d7bd7bf"   # ست رسمی راه‌راه - formal blazer suit
    "vani-mode-black-set.jpg"   = U "1693746943973-c654ff84170c"   # ست مشکی سفید
    "gold-button-blazer-set.jpg"= U "1551698618-1dfe5d97d256"     # بلیزر رسمی
    "geometric-blazer-set.jpg"  = U "1604049079145-96579db3101c"   # بلیزر طرح‌دار
    "artistic-print-jacket.jpg" = U "1551026118-ef7e5817efc4"     # کت چاپی رنگی
    "altun-black-manteau.jpg"   = U "1607606780078-eb06bd04a574"   # مانتو مشکی
    "navy-marble-tunic.jpg"     = U "1694036317080-d7f7e751ff61"   # تونیک سرمه‌ای
    "navy-leaf-tunic.jpg"       = U "1485236419343-488598784b40"   # تونیک گل‌دار
    "mustard-lace-manteau.jpg"  = U "1515886657617-9f3515b0c78f"   # مانتو زرد/خردلی
    "wool-scarf.jpg"            = U "1648662804888-656d31292aca"   # شال پشمی
    "silk-rosari.jpg"           = U "1684973775764-eca6563e758d"   # روسری ابریشمی
    "leather-bag-brown.jpg"     = U "1637759292654-a12cb2be085e"   # کیف چرمی قهوه‌ای
    "cotton-socks-set.jpg"      = U "1586350977771-b0e4b4d4dd36"   # جوراب نخی
    "canvas-tote-bag.jpg"       = U "1587845663811-586aecd59be9"   # توت‌بگ کتان
}

$ok = 0; $fail = @()
foreach ($entry in $products.GetEnumerator()) {
    $out = Join-Path $dest $entry.Key
    Write-Host "$($entry.Key)..."
    curl.exe -fsSL "$($entry.Value)" -o "$out" 2>$null
    if ($LASTEXITCODE -eq 0 -and (Test-Path $out) -and (Get-Item $out).Length -gt 8000) {
        Write-Host "  OK ($((Get-Item $out).Length))"
        $ok++
    } else {
        Write-Host "  FAILED"
        if (Test-Path $out) { Remove-Item $out -Force }
        $fail += $entry.Key
    }
}
Write-Host "`n$ok/$($products.Count) downloaded"
if ($fail.Count) { Write-Host "Failed: $($fail -join ', ')" }

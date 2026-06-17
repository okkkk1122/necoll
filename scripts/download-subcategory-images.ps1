# Download wide (5:2) subcategory banners from Unsplash (free license)
$dest = Join-Path $PSScriptRoot "..\store\public\images\subcategories"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$base = "https://images.unsplash.com/photo-{0}?auto=format&fit=crop&w=2000&h=800&q=85"

$images = @{
    "manteau.jpg"        = $base -f "1607606780078-eb06bd04a574"
    "tunic-blouse.jpg"   = $base -f "1694036317080-d7f7e751ff61"
    "formal-set.jpg"     = $base -f "1551698618-1dfe5d97d256"
    "rosari.jpg"         = $base -f "1684973775764-eca6563e758d"
    "shal.jpg"           = $base -f "1648662804888-656d31292aca"
    "socks.jpg"          = $base -f "1632345031114-855e0bdcb7fe"
    "tote.jpg"           = $base -f "1564422174806-5d7b6ffbbbb"
    "sport-set.jpg"      = $base -f "1517838279406-79f359f7e004"
    "sports-manteau.jpg" = $base -f "1571019613454-1cb2f99b2d8b"
    "bags.jpg"           = $base -f "1548036328-f3358b2185c6"
    "shoes.jpg"          = $base -f "1460353581641-92b9b0d5d986"
}

foreach ($entry in $images.GetEnumerator()) {
    $out = Join-Path $dest $entry.Key
    Write-Host "Downloading $($entry.Key)..."
    try {
        Invoke-WebRequest -Uri $entry.Value -OutFile $out -UseBasicParsing -TimeoutSec 60
        $size = (Get-Item $out).Length
        if ($size -lt 10000) { throw "File too small ($size bytes)" }
        Write-Host "  OK ($size bytes)"
    } catch {
        Write-Host "  FAILED: $($_.Exception.Message)"
    }
}

Get-ChildItem $dest | Format-Table Name, Length

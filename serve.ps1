# Launch Julmi Jaat Imperial Portal in Default Browser
$htmlPath = Join-Path $PSScriptRoot "index.html"
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "⚡ LAUNCHING JULMI JAAT IMPERIAL PORTAL ⚡" -ForegroundColor Red
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "Opening: $htmlPath" -ForegroundColor Cyan

Start-Process $htmlPath

# share-with-team.ps1
# PowerShell script to share Calendar API with team using ngrok

Write-Host "🚀 Starting Calendar API with ngrok tunnel..." -ForegroundColor Cyan
Write-Host ""

# Check if ngrok is installed
$ngrokExists = Get-Command ngrok -ErrorAction SilentlyContinue
if (-not $ngrokExists) {
    Write-Host "❌ ngrok is not installed." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install ngrok:"
    Write-Host "  Download from https://ngrok.com/download"
    Write-Host "  Or use: choco install ngrok (if you have Chocolatey)"
    exit 1
}

# Check if Node.js is installed
$nodeExists = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeExists) {
    Write-Host "❌ Node.js is not installed." -ForegroundColor Red
    Write-Host "Download from https://nodejs.org"
    exit 1
}

# Check if server is already running
$serverRunning = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($serverRunning) {
    Write-Host "✅ Server already running on port 3000" -ForegroundColor Green
} else {
    Write-Host "📦 Starting server..." -ForegroundColor Yellow
    Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow
    Start-Sleep -Seconds 3
}

# Start ngrok
Write-Host ""
Write-Host "🌐 Creating public tunnel..." -ForegroundColor Cyan
Start-Process -FilePath "ngrok" -ArgumentList "http 3000" -NoNewWindow

Start-Sleep -Seconds 3

# Get the public URL
Write-Host ""
Write-Host "🎉 Your Calendar API is now accessible!" -ForegroundColor Green
Write-Host ""
Write-Host "Getting public URL..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels"
    $publicUrl = $response.tunnels | Where-Object { $_.proto -eq "https" } | Select-Object -First 1 -ExpandProperty public_url
    
    if ($publicUrl) {
        Write-Host ""
        Write-Host "📋 Share this URL with your team:" -ForegroundColor Cyan
        Write-Host "   $publicUrl" -ForegroundColor White
        Write-Host ""
        Write-Host "📋 Web interface:" -ForegroundColor Cyan
        Write-Host "   $publicUrl/client.html" -ForegroundColor White
    } else {
        Write-Host "⚠️  Couldn't auto-detect URL. Open http://localhost:4040 to see your ngrok URL" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Couldn't auto-detect URL. Open http://localhost:4040 to see your ngrok URL" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📊 ngrok dashboard: http://localhost:4040" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop..." -ForegroundColor Yellow

# Keep script running
while ($true) {
    Start-Sleep -Seconds 1
}

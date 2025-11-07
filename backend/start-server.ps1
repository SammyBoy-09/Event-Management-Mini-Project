# Start the backend server
Write-Host "Starting CampusConnect Backend Server..." -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Navigate to backend directory
Set-Location -Path "d:\sam\Projects\Event Management\app2\backend"

# Start the server
node server.js

# Keep the window open if there's an error
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nServer exited with error code: $LASTEXITCODE" -ForegroundColor Red
    Read-Host -Prompt "Press Enter to close"
}

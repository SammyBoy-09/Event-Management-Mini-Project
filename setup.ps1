# CampusConnect Setup Script
# Quick installation for both backend and frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CampusConnect Event Management App" -ForegroundColor Cyan
Write-Host "  Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install Backend Dependencies
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Backend Dependencies..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location backend
if (Test-Path "node_modules") {
    Write-Host "Backend dependencies already installed. Skipping..." -ForegroundColor Yellow
} else {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Backend dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
}

# Install Frontend Dependencies
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Frontend Dependencies..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location ../frontend
if (Test-Path "node_modules") {
    Write-Host "Frontend dependencies already installed. Skipping..." -ForegroundColor Yellow
} else {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Frontend dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
}

Set-Location ..

# Configuration Check
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuration Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (Test-Path "backend\.env") {
    Write-Host "✓ Backend .env file found" -ForegroundColor Green
} else {
    Write-Host "⚠ Backend .env file not found!" -ForegroundColor Red
    Write-Host "  Please create backend/.env with:" -ForegroundColor Yellow
    Write-Host "  - MONGO_URI" -ForegroundColor Yellow
    Write-Host "  - JWT_SECRET" -ForegroundColor Yellow
    Write-Host "  - PORT" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configure backend/.env file" -ForegroundColor White
Write-Host "2. Update API URL in frontend/api/api.js" -ForegroundColor White
Write-Host ""
Write-Host "To start the backend:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the frontend:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "For detailed instructions, see README.md" -ForegroundColor White
Write-Host ""

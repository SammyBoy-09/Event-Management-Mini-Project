#!/bin/bash

# CampusConnect Setup Script
# Quick installation for both backend and frontend

echo "========================================"
echo "  CampusConnect Event Management App"
echo "  Installation Script"
echo "========================================"
echo ""

# Check if Node.js is installed
echo "Checking prerequisites..."
if command -v node &> /dev/null; then
    echo "✓ Node.js installed: $(node --version)"
else
    echo "✗ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Install Backend Dependencies
echo ""
echo "========================================"
echo "Installing Backend Dependencies..."
echo "========================================"

cd backend
if [ -d "node_modules" ]; then
    echo "Backend dependencies already installed. Skipping..."
else
    npm install
    if [ $? -eq 0 ]; then
        echo "✓ Backend dependencies installed successfully!"
    else
        echo "✗ Failed to install backend dependencies"
        exit 1
    fi
fi

# Install Frontend Dependencies
echo ""
echo "========================================"
echo "Installing Frontend Dependencies..."
echo "========================================"

cd ../frontend
if [ -d "node_modules" ]; then
    echo "Frontend dependencies already installed. Skipping..."
else
    npm install
    if [ $? -eq 0 ]; then
        echo "✓ Frontend dependencies installed successfully!"
    else
        echo "✗ Failed to install frontend dependencies"
        exit 1
    fi
fi

cd ..

# Configuration Check
echo ""
echo "========================================"
echo "Configuration Check"
echo "========================================"

if [ -f "backend/.env" ]; then
    echo "✓ Backend .env file found"
else
    echo "⚠ Backend .env file not found!"
    echo "  Please create backend/.env with:"
    echo "  - MONGO_URI"
    echo "  - JWT_SECRET"
    echo "  - PORT"
fi

echo ""
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "Next Steps:"
echo ""
echo "1. Configure backend/.env file"
echo "2. Update API URL in frontend/api/api.js"
echo ""
echo "To start the backend:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "To start the frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "For detailed instructions, see README.md"
echo ""

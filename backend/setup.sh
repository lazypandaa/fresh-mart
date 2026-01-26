#!/bin/bash

echo "Setting up FreshMart Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Detect OS and activate accordingly
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    echo "Activating virtual environment (Windows)..."
    source venv/Scripts/activate
else
    # macOS/Linux
    echo "Activating virtual environment (macOS/Linux)..."
    source venv/bin/activate
fi

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your MongoDB URL and other settings"
fi

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "To activate the virtual environment manually:"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "  Windows: venv\\Scripts\\activate"
else
    echo "  macOS/Linux: source venv/bin/activate"
fi
echo ""
echo "To start the server: ./start.sh"
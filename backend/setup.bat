@echo off
echo Setting up FreshMart Backend...

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
pip install --upgrade pip

REM Install dependencies
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo ⚠️  Please update .env file with your MongoDB URL and other settings
)

echo.
echo ✅ Backend setup complete!
echo.
echo To activate the virtual environment manually:
echo   venv\Scripts\activate
echo.
echo To start the server: start.bat
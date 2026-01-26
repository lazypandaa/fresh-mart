@echo off
cd /d "%~dp0"

REM Check if virtual environment exists
if not exist "venv" (
    echo Virtual environment not found. Please run setup.bat first.
    pause
    exit /b 1
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Start the server
uvicorn app.main:app --reload --port 8000
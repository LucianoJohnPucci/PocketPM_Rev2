@echo off
echo Starting PocketPM Frontend Server...
echo.

cd /d "%~dp0frontend"

echo Checking for dependencies...
if not exist "node_modules" (
    echo Installing dependencies with --force flag to resolve conflicts...
    npm install --force
    if errorlevel 1 (
        echo Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

echo Starting React development server...
echo Frontend will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm start

pause

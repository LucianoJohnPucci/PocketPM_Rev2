@echo off
echo Starting PocketPM Backend Server...
echo.
echo Backend API will be available at: http://localhost:8000
echo API Documentation will be available at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause

@echo off
echo ===================================
echo     Starting CloakBox...
echo ===================================

echo.
echo [1/4] Installing Server Dependencies...
cd server
call npm install

echo.
echo [2/4] Starting Backend Server...
start "CloakBox Backend" cmd /k "npm run dev"

echo.
echo [3/4] Installing Client Dependencies...
cd ../client
call npm install

echo.
echo [4/4] Starting Frontend Client...
start "CloakBox Frontend" cmd /k "npm run dev"

cd ..
echo.
echo ===================================
echo CloakBox is now starting up!
echo The backend is running in a new window on port 5000.
echo The frontend is running in a new window and should open in your browser shortly.
echo ===================================
pause

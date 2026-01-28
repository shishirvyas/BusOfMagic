@echo off
REM Magic Bus Launcher Script
REM This script helps launch both frontend and backend

echo.
echo ========================================
echo   Magic Bus - Application Launcher
echo ========================================
echo.

REM Check if running from correct directory
if not exist "frontend" (
    echo Error: Please run this script from the magic-bus root directory
    echo Current directory: %cd%
    exit /b 1
)

echo Available options:
echo 1. Launch Backend (Spring Boot)
echo 2. Launch Frontend (Vite + React)
echo 3. Launch Both (in separate windows)
echo 4. Build Backend
echo 5. Build Frontend
echo 6. Show Status
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto backend
if "%choice%"=="2" goto frontend
if "%choice%"=="3" goto both
if "%choice%"=="4" goto build_backend
if "%choice%"=="5" goto build_frontend
if "%choice%"=="6" goto status
goto invalid

:backend
echo.
echo Starting Backend...
cd backend
mvn spring-boot:run
goto end

:frontend
echo.
echo Starting Frontend...
cd frontend
npm install
npm run dev
goto end

:both
echo.
echo Launching Backend in new window...
start cmd /k "cd /d %cd%\backend && mvn spring-boot:run"
timeout /t 3
echo.
echo Launching Frontend in new window...
start cmd /k "cd /d %cd%\frontend && npm install && npm run dev"
echo.
echo Both applications starting...
echo Backend: http://localhost:8080/api
echo Frontend: http://localhost:5173
goto end

:build_backend
echo.
echo Building Backend...
cd backend
mvn clean install
echo.
echo Build completed!
goto end

:build_frontend
echo.
echo Building Frontend...
cd frontend
npm install
npm run build
echo.
echo Build completed!
goto end

:status
echo.
echo Checking prerequisites...
echo.
echo Java Version:
java -version 2>&1 | findstr /R "version"
echo.
echo Maven Version:
mvn -version 2>&1 | findstr /R "Apache Maven"
echo.
echo Node Version:
node --version
echo.
echo NPM Version:
npm --version
echo.
echo.
echo Testing Backend Connectivity...
timeout /t 2 >nul
for /f "tokens=*" %%A in ('powershell -Command "try { Invoke-WebRequest -Uri http://localhost:8080/api/health -UseBasicParsing -ErrorAction SilentlyContinue | Select-Object -ExpandProperty StatusCode } catch { Write-Host 'Not Running' }"') do set backend_status=%%A
if "%backend_status%"=="200" (
    echo Backend Status: RUNNING (http://localhost:8080/api)
) else (
    echo Backend Status: NOT RUNNING
)
echo.
goto end

:invalid
echo Invalid choice. Please run the script again and select 1-6.
goto end

:end
echo.
echo ========================================
echo Script completed.
echo ========================================
echo.
pause

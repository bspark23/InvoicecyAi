@echo off
echo Starting Invoice App Servers...
echo.

echo Starting proxy server on port 3001...
start "Proxy Server" cmd /k "node proxy-server.js"

echo Waiting 3 seconds for proxy to start...
timeout /t 3 /nobreak > nul

echo Starting main app on port 8080...
start "Main App" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo - Proxy Server: http://localhost:3001
echo - Main App: http://localhost:8080
echo.
echo Press any key to exit...
pause > nul
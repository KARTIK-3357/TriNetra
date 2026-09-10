@echo off
setlocal

REM Starts the API and Vite development server in separate PowerShell windows.
set "PROJECT_ROOT=%~dp0"

start "TRINETRA Backend" powershell.exe -NoExit -ExecutionPolicy Bypass -Command "Set-Location -LiteralPath '%PROJECT_ROOT%backend'; & '.\venv\Scripts\uvicorn.exe' app.main:app --reload --port 5000"
start "TRINETRA Frontend" powershell.exe -NoExit -ExecutionPolicy Bypass -Command "Set-Location -LiteralPath '%PROJECT_ROOT%frontend'; npm run dev"

echo TRINETRA is starting in two new windows.
echo Open http://localhost:5173 after the frontend reports it is ready.
endlocal

@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title Installing Runut

echo.
echo ============================================================
echo   INSTALLING RUNUT
echo ============================================================
echo.
echo   Runut is a project history assistant for WorkBuddy.
echo   This installer sets everything up on this computer.
echo.
echo   IMPORTANT: close WorkBuddy before continuing.
echo.

REM ---- Check Node.js ----
where node >nul 2>nul
if errorlevel 1 (
  echo [1/4] Node.js is NOT installed.
  echo.
  echo   Runut requires Node.js version 24 or newer.
  echo   Download from: https://nodejs.org  (choose LTS version)
  echo.
  echo   After installing, run this file again.
  echo.
  pause
  exit /b 1
)

for /f "tokens=*" %%v in ('node --version') do set NODEVER=%%v
echo [1/4] Node.js detected: %NODEVER%

REM ---- Check minimum version ----
node -e "const v=process.versions.node.split('.').map(Number); if(v[0]<24){console.error('  Node.js version is too old. Version 24 or newer is required.');process.exit(1)}"
if errorlevel 1 (
  echo.
  echo   Download Node.js version 24 or newer from https://nodejs.org
  echo   then run this file again.
  echo.
  pause
  exit /b 1
)

REM ---- Go to repo folder ----
cd /d "%~dp0\.."

echo [2/4] Downloading Runut dependencies. This may take a minute.
call npm install
if errorlevel 1 (
  echo.
  echo   Failed to download dependencies. Check your internet connection and try again.
  echo.
  pause
  exit /b 1
)
echo       Done.

echo.
echo [3/4] Installing Runut into WorkBuddy.
echo       You will be asking as: Andi (sales staff)
echo.
node scripts/pasang-workbuddy.ts staf
if errorlevel 1 (
  echo.
  echo   Installation failed. See the message above.
  echo.
  pause
  exit /b 1
)

echo.
echo [4/4] Opening Runut control panel in browser.
echo.
echo ============================================================
echo   DONE
echo ============================================================
echo.
echo   Next steps:
echo.
echo   1. Open WorkBuddy.
echo   2. Click "Experts - Skills - Connectors" in the left menu.
echo   3. Find "Runut Project History Team", click "Summon".
echo   4. When asked for connection permission, choose "Allow".
echo   5. Type: Kenapa stok di Makassar telat, dan apa yang masih open?
echo.
echo   Keep the control panel open to switch roles
echo   and approve messages. Don't close it while using Runut.
echo.

start "" http://localhost:4173
node scripts/pengaturan.ts

pause

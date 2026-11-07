@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title Pemasangan Runut

echo.
echo ============================================================
echo   MEMASANG RUNUT
echo ============================================================
echo.
echo   Runut adalah asisten riwayat proyek untuk WorkBuddy.
echo   Installer ini menyiapkan semuanya di komputer ini.
echo.
echo   PENTING: tutup WorkBuddy dulu sebelum melanjutkan.
echo.

REM ---- Cek Node.js ----
where node >nul 2>nul
if errorlevel 1 (
  echo [1/4] Node.js BELUM TERPASANG.
  echo.
  echo   Runut butuh Node.js versi 24 atau lebih baru.
  echo   Unduh dari: https://nodejs.org  (pilih versi LTS)
  echo.
  echo   Setelah terpasang, jalankan file ini lagi.
  echo.
  pause
  exit /b 1
)

for /f "tokens=*" %%v in ('node --version') do set NODEVER=%%v
echo [1/4] Node.js terdeteksi: %NODEVER%

REM ---- Cek versi minimal ----
node -e "const v=process.versions.node.split('.').map(Number); if(v[0]<24){console.error('  Versi Node.js terlalu lama. Butuh 24 atau lebih baru.');process.exit(1)}"
if errorlevel 1 (
  echo.
  echo   Unduh Node.js versi 24 atau lebih baru dari https://nodejs.org
  echo   lalu jalankan file ini lagi.
  echo.
  pause
  exit /b 1
)

REM ---- Ke folder repo ----
cd /d "%~dp0\.."

echo [2/4] Mengunduh pustaka yang dibutuhkan Runut. Ini bisa memakan waktu satu menit.
call npm install
if errorlevel 1 (
  echo.
  echo   Gagal mengunduh pustaka. Periksa koneksi internet lalu coba lagi.
  echo.
  pause
  exit /b 1
)
echo       Selesai.

echo.
echo [3/4] Memasang Runut ke WorkBuddy.
echo       Anda akan Asked sebagai: Andi (staf penjualan)
echo.
node scripts/pasang-workbuddy.ts staf
if errorlevel 1 (
  echo.
  echo   Pemasangan gagal. Lihat pesan di atas.
  echo.
  pause
  exit /b 1
)

echo.
echo [4/4] Membuka panel kendali Runut di browser.
echo.
echo ============================================================
echo   SELESAI
echo ============================================================
echo.
echo   Langkah berikutnya:
echo.
echo   1. Buka WorkBuddy.
echo   2. Klik "Experts - Skills - Connectors" di menu kiri.
echo   3. Cari "Runut Project History Team", klik "Summon".
echo   4. Saat ditanya izinconnects, pilih "Allow".
echo   5. Ketik: Kenapa stok di Makassar telat, dan apa yang masih open?
echo.
echo   Panel kendali ini tetap terbuka untuk mengganti peran
echo   dan menyetujui pesan. Jangan ditutup selama memakai Runut.
echo.

start "" http://localhost:4173
node scripts/pengaturan.ts

pause

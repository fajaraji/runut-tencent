#!/bin/bash
# Pemasangan Runut untuk macOS dan Linux.
# Jalankan dengan klik ganda, atau dari terminal: bash installer/pasang-mac.command

set -euo pipefail
cd "$(dirname "$0")/.."

echo ""
echo "============================================================"
echo "  MEMASANG RUNUT"
echo "============================================================"
echo ""
echo "  Runut adalah asisten riwayat proyek untuk WorkBuddy."
echo "  Installer ini menyiapkan semuanya di komputer ini."
echo ""
echo "  PENTING: tutup WorkBuddy dulu sebelum melanjutkan."
echo ""

# ---- Cek Node.js ----
if ! command -v node >/dev/null 2>&1; then
  echo "[1/4] Node.js BELUM TERPASANG."
  echo ""
  echo "  Runut butuh Node.js versi 24 atau lebih baru."
  echo "  Unduh dari: https://nodejs.org  (pilih versi LTS)"
  echo "  Setelah terpasang, jalankan file ini lagi."
  echo ""
  read -r -p "Tekan Enter untuk menutup..." _
  exit 1
fi

NODEVER="$(node --version)"
echo "[1/4] Node.js terdeteksi: $NODEVER"

if ! node -e "const v=process.versions.node.split('.').map(Number); process.exit(v[0]<24?1:0)"; then
  echo ""
  echo "  Versi Node.js terlalu lama. Unduh versi 24 atau lebih baru"
  echo "  dari https://nodejs.org lalu jalankan file ini lagi."
  echo ""
  read -r -p "Tekan Enter untuk menutup..." _
  exit 1
fi

# ---- Pustaka ----
echo "[2/4] Mengunduh pustaka yang dibutuhkan Runut. Ini bisa memakan waktu satu menit."
npm install
echo "      Selesai."

# ---- Pasang ke WorkBuddy ----
echo ""
echo "[3/4] Memasang Runut ke WorkBuddy."
echo "      Anda akan Asked sebagai: Andi (staf penjualan)"
echo ""
node scripts/pasang-workbuddy.ts staf

# ---- Panel kendali ----
echo ""
echo "[4/4] Membuka panel kendali Runut di browser."
echo ""
echo "============================================================"
echo "  SELESAI"
echo "============================================================"
echo ""
echo "  Langkah berikutnya:"
echo ""
echo "  1. Buka WorkBuddy."
echo "  2. Klik \"Experts - Skills - Connectors\" di menu kiri."
echo "  3. Cari \"Runut Project History Team\", klik \"Summon\"."
echo "  4. Saat ditanya izin connects, pilih \"Allow\"."
echo "  5. Ketik: Kenapa stok di Makassar telat, dan apa yang masih open?"
echo ""
echo "  Panel kendali ini tetap terbuka untuk mengganti peran"
echo "  dan menyetujui pesan. Jangan ditutup selama memakai Runut."
echo ""

sleep 1
( command -v open >/dev/null 2>&1 && open http://localhost:4173 ) || \
( command -v xdg-open >/dev/null 2>&1 && xdg-open http://localhost:4173 ) || \
echo "  Buka http://localhost:4173 di browser Anda."

node scripts/pengaturan.ts

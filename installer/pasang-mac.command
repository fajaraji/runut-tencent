#!/bin/bash
# Runut installer for macOS and Linux.
# Run by double-clicking, or from terminal: bash installer/pasang-mac.command

set -euo pipefail
cd "$(dirname "$0")/.."

echo ""
echo "============================================================"
echo "  INSTALLING RUNUT"
echo "============================================================"
echo ""
echo "  Runut is a project history assistant for WorkBuddy."
echo "  This installer sets everything up on this computer."
echo ""
echo "  IMPORTANT: close WorkBuddy before continuing."
echo ""

# ---- Check Node.js ----
if ! command -v node >/dev/null 2>&1; then
  echo "[1/4] Node.js is NOT installed."
  echo ""
  echo "  Runut requires Node.js version 24 or newer."
  echo "  Download from: https://nodejs.org  (choose LTS version)"
  echo "  After installing, run this file again."
  echo ""
  read -r -p "Press Enter to close..." _
  exit 1
fi

NODEVER="$(node --version)"
echo "[1/4] Node.js detected: $NODEVER"

if ! node -e "const v=process.versions.node.split('.').map(Number); process.exit(v[0]<24?1:0)"; then
  echo ""
  echo "  Node.js version is too old. Download version 24 or newer"
  echo "  from https://nodejs.org then run this file again."
  echo ""
  read -r -p "Press Enter to close..." _
  exit 1
fi

# ---- Dependencies ----
echo "[2/4] Downloading Runut dependencies. This may take a minute."
npm install
echo "      Done."

# ---- Install to WorkBuddy ----
echo ""
echo "[3/4] Installing Runut into WorkBuddy."
echo "      You will be asking as: Andi (sales staff)"
echo ""
node scripts/pasang-workbuddy.ts staf

# ---- Control panel ----
echo ""
echo "[4/4] Opening Runut control panel in browser."
echo ""
echo "============================================================"
echo "  DONE"
echo "============================================================"
echo ""
echo "  Next steps:"
echo ""
echo "  1. Open WorkBuddy."
echo "  2. Click \"Experts - Skills - Connectors\" in the left menu."
echo "  3. Find \"Runut Project History Team\", click \"Summon\"."
echo "  4. When asked for connection permission, choose \"Allow\"."
echo "  5. Type: Kenapa stok di Makassar telat, dan apa yang masih open?"
echo ""
echo "  Keep the control panel open to switch roles"
echo "  and approve messages. Don't close it while using Runut."
echo ""

sleep 1
( command -v open >/dev/null 2>&1 && open http://localhost:4173 ) || \
( command -v xdg-open >/dev/null 2>&1 && xdg-open http://localhost:4173 ) || \
echo "  Open http://localhost:4173 in your browser."

node scripts/pengaturan.ts

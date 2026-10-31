import { tulisMcp } from "./workbuddy.ts";

// Mengganti identitas penanya Runut di WorkBuddy untuk demo.
// Pakai: node scripts/ganti-identitas.ts staf|manajer   lalu restart WorkBuddy.

const peran = process.argv[2];
if (peran !== "staf" && peran !== "manajer") {
  console.error("Pakai: node scripts/ganti-identitas.ts staf|manajer");
  process.exit(1);
}
tulisMcp(peran);
console.log(`Identitas Runut sekarang ${peran === "staf" ? "Andi (staf penjualan)" : "Sari (manajer operasional)"}. Restart WorkBuddy supaya berlaku.`);

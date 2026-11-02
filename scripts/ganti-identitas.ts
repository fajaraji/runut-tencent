import { IDENTITAS, tulisMcp, type Peran } from "./workbuddy.ts";

// Mengganti identitas penanya Runut di WorkBuddy untuk demo.
// Pakai: node scripts/ganti-identitas.ts staf|manajer|direktur|baru   lalu restart WorkBuddy.

const peran = process.argv[2] as Peran;
if (!(peran in IDENTITAS)) {
  console.error(`Pakai: node scripts/ganti-identitas.ts ${Object.keys(IDENTITAS).join("|")}`);
  process.exit(1);
}
tulisMcp(peran);
console.log(`Identitas Runut sekarang ${peran} (${IDENTITAS[peran]}). Restart WorkBuddy supaya berlaku.`);

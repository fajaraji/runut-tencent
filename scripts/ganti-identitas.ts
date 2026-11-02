import { IDENTITAS, tulisIdentitas, type Peran } from "./workbuddy.ts";

// Mengganti identitas penanya Runut. Berlaku di pertanyaan berikutnya, tanpa restart.
// Pakai: node scripts/ganti-identitas.ts staf|manajer|direktur|baru|hr|it

const peran = process.argv[2] as Peran;
if (!(peran in IDENTITAS)) {
  console.error(`Pakai: node scripts/ganti-identitas.ts ${Object.keys(IDENTITAS).join("|")}`);
  process.exit(1);
}
tulisIdentitas(peran);
console.log(`Identitas Runut sekarang ${peran} (${IDENTITAS[peran]}). Berlaku di pertanyaan berikutnya.`);

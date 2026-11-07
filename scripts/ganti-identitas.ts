import { IDENTITAS, tulisIdentitas, type Peran } from "./workbuddy.ts";

// Switches the Runut asking identity. Takes effect on the next question, without restart.
// Usage: node scripts/ganti-identitas.ts staf|manajer|direktur|baru|hr|it
//
// The browser control panel (scripts/pengaturan.ts) uses the same function,
// so switching roles in the panel and via this command produce identical results.

const peran = process.argv[2] as Peran;
if (!(peran in IDENTITAS)) {
  console.error(`Usage: node scripts/ganti-identitas.ts ${Object.keys(IDENTITAS).join("|")}`);
  process.exit(1);
}
tulisIdentitas(peran);
console.log(`Runut identity is now ${peran} (${IDENTITAS[peran]}). Takes effect on the next question.`);

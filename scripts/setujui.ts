import { join, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { daftarDraf, setujuiDraf } from "./workbuddy.ts";

// Approval console for humans. The model in WorkBuddy has no tool for this.
// Usage: node scripts/setujui.ts <draft_id>   (without arguments: list drafts awaiting approval)
//
// The browser control panel (scripts/pengaturan.ts) uses the same function,
// so approving in the panel and via this command produce identical approval records.

const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const logDir = process.env.RUNUT_LOG ?? join(akar, "logs");
const id = process.argv[2];

if (!id) {
  const menunggu = daftarDraf(logDir).filter((d) => !d.disetujui);
  if (!menunggu.length) console.log("No drafts awaiting approval.");
  for (const { draf } of menunggu) {
    console.log(`${draf.id}  ke ${draf.namaKepada}: ${draf.isi}`);
  }
  process.exit(0);
}

const hasil = setujuiDraf(logDir, id);
if (!hasil.ok) {
  console.error(hasil.pesan);
  process.exit(1);
}
console.log(hasil.pesan);

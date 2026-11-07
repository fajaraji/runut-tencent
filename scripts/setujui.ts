import { join, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { daftarDraf, setujuiDraf } from "./workbuddy.ts";

// Konsol persetujuan untuk manusia. Model di WorkBuddy tidak punya alat untuk ini.
// Pakai: node scripts/setujui.ts <draf_id>   (tanpa argumen: daftar draf yang menunggu)
//
// Panel kendali di browser (scripts/pengaturan.ts) memakai fungsi yang sama,
// jadi menyetujui di panel dan perintah ini menghasilkan catatan persetujuan yang sama.

const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const logDir = process.env.RUNUT_LOG ?? join(akar, "logs");
const id = process.argv[2];

if (!id) {
  const menunggu = daftarDraf(logDir).filter((d) => !d.disetujui);
  if (!menunggu.length) console.log("Tidak ada draf yang menunggu persetujuan.");
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

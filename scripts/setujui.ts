import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { catat } from "../src/audit.ts";

// Konsol persetujuan untuk manusia. Model di WorkBuddy tidak punya alat untuk ini.
// Pakai: node scripts/setujui.ts <draf_id>   (tanpa argumen: daftar draf yang menunggu)

const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const logDir = process.env.RUNUT_LOG ?? join(akar, "logs");
const id = process.argv[2];

if (!id) {
  const dir = join(logDir, "draf");
  const daftar = existsSync(dir) ? readdirSync(dir) : [];
  const menunggu = daftar.filter((f) => !existsSync(join(logDir, "persetujuan", f)));
  if (!menunggu.length) console.log("Tidak ada draf yang menunggu persetujuan.");
  for (const f of menunggu) {
    const d = JSON.parse(readFileSync(join(dir, f), "utf8"));
    console.log(`${d.id}  ke ${d.namaKepada}: ${d.isi}`);
  }
  process.exit(0);
}

const fileDraf = join(logDir, "draf", `${id}.json`);
if (!existsSync(fileDraf)) {
  console.error(`Draf ${id} tidak ditemukan.`);
  process.exit(1);
}
const draf = JSON.parse(readFileSync(fileDraf, "utf8"));
mkdirSync(join(logDir, "persetujuan"), { recursive: true });
writeFileSync(join(logDir, "persetujuan", `${id}.json`), JSON.stringify({ id, disetujui: new Date().toISOString() }, null, 2));
catat(join(logDir, "audit.jsonl"), draf.dari, "persetujuan_manusia", { draf: id }, { disetujui: true });
console.log(`Draf ${id} ke ${draf.namaKepada} disetujui. Agent sekarang boleh mengirimnya.`);

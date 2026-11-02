import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Runut } from "../src/runut.ts";
import { verifikasi } from "../src/audit.ts";

// Menjalankan bagian 'cek_kode' dari tests/kasus-uji.json terhadap lapisan MCP.

type Cek = {
  query?: string;
  batas?: number;
  data_pribadi?: boolean;
  wajib_ada?: string[];
  dilarang_awalan?: string[];
  tidak_boleh_memuat?: string[];
  harus_memuat?: string[];
  sama_dengan?: string;
  kosong?: boolean;
  pemilik_topik?: string;
  pemilik?: string;
  ambil?: string;
  ada_peringatan?: boolean;
  task?: { proyek?: string; status?: string };
  periksa?: string[];
  sah?: string[];
  uji?: "perubahan_akses" | "persetujuan" | "log" | "nama_ambigu";
};
type Kasus = { id: string; aturan: string; sebagai: string; pertanyaan: string; cek_kode: Cek };

const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { kasus } = JSON.parse(readFileSync(join(akar, "tests", "kasus-uji.json"), "utf8")) as { kasus: Kasus[] };

function siapkan() {
  const tmp = mkdtempSync(join(tmpdir(), "runut-kasus-"));
  cpSync(join(akar, "data"), join(tmp, "data"), { recursive: true });
  const logDir = join(tmp, "logs");
  return { tmp, logDir, sebagai: (id: string) => new Runut({ dataDir: join(tmp, "data"), logDir, penggunaId: id }) };
}

function periksaDaftar(c: Cek, idList: string[], teks: string) {
  for (const id of c.wajib_ada ?? []) assert.ok(idList.includes(id), `harus ada ${id}, dapat ${idList.join(", ")}`);
  for (const awal of c.dilarang_awalan ?? []) assert.ok(!idList.some((id) => id.startsWith(awal)), `bocor ${awal}: ${idList.join(", ")}`);
  for (const s of c.tidak_boleh_memuat ?? []) assert.ok(!teks.includes(s), `memuat "${s}"`);
  for (const s of c.harus_memuat ?? []) assert.ok(teks.includes(s), `tidak memuat "${s}"`);
}

for (const k of kasus) {
  test(`${k.id} [${k.aturan}] ${k.pertanyaan}`, () => {
    const { tmp, logDir, sebagai } = siapkan();
    const r = sebagai(k.sebagai);
    const c = k.cek_kode;

    if (c.query) {
      const hasil = r.cari(c.query, { batas: c.batas, dataPribadi: c.data_pribadi });
      if (c.sama_dengan) assert.deepEqual(hasil, r.cari(c.sama_dengan));
      if (c.kosong) assert.equal(hasil.hasil.length, 0);
      periksaDaftar(c, hasil.hasil.map((h) => h.id), JSON.stringify(hasil));
    }
    if (c.ambil) {
      const hasil = r.ambilSumber(c.ambil, c.data_pribadi);
      assert.ok(hasil.ditemukan);
      if (c.ada_peringatan) assert.ok(hasil.sumber?.peringatan);
      periksaDaftar(c, [], JSON.stringify(hasil));
    }
    if (c.pemilik_topik) assert.equal(r.pemilikTopik(c.pemilik_topik).pemilik, c.pemilik);
    if (c.task) periksaDaftar(c, r.daftarTask(c.task).task.map((t) => t.id), "");
    if (c.periksa) assert.deepEqual(r.periksaSumber(c.periksa).sah, c.sah);

    if (c.uji === "perubahan_akses") {
      const file = join(tmp, "data", "orang.json");
      const asli = readFileSync(file, "utf8");
      const lihat = () => r.cari("PO-2291 revisi 900 karton", { batas: 20 }).hasil.some((h) => h.id.startsWith("mgmt-vendor/"));
      assert.equal(lihat(), false);
      const data = JSON.parse(asli);
      data.orang.find((o: { id: string }) => o.id === k.sebagai).grup.push("manajemen");
      writeFileSync(file, JSON.stringify(data));
      assert.equal(lihat(), true);
      writeFileSync(file, asli);
      assert.equal(lihat(), false);
    }
    if (c.uji === "persetujuan") {
      const draf = r.siapkanPesan("Dedi", "Mas Dedi, kenapa PO-2291 direvisi jadi 900 karton?");
      assert.ok(draf.dibuat && draf.draf);
      assert.equal(r.kirimPesan(draf.draf.id).terkirim, false);
      execFileSync(process.execPath, [join(akar, "scripts", "setujui.ts"), draf.draf.id], { env: { ...process.env, RUNUT_LOG: logDir } });
      assert.equal(r.kirimPesan(draf.draf.id).terkirim, true);
    }
    if (c.uji === "nama_ambigu") {
      const hasil = r.siapkanPesan("Budi", "Pak Budi, soal nota kemarin.");
      assert.equal(hasil.dibuat, false);
      assert.equal(hasil.pilihan?.length, 2);
    }
    if (c.uji === "log") {
      r.cari("PO-2291");
      r.catatJawaban("Kenapa stok Makassar telat?", "contoh", ["ops-sulawesi/002"]);
      const file = join(logDir, "audit.jsonl");
      assert.equal(verifikasi(file).utuh, true);
      const isi = readFileSync(file, "utf8").replace("PO-2291", "PO-0000");
      writeFileSync(file, isi);
      assert.equal(verifikasi(file).utuh, false);
    }
  });
}

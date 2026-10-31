import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Runut, TIDAK_DITEMUKAN } from "../src/runut.ts";
import { verifikasi } from "../src/audit.ts";

// Uji lapisan deterministik: hal-hal yang dijaga kode, bukan prompt.

const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function siapkan() {
  const tmp = mkdtempSync(join(tmpdir(), "runut-"));
  cpSync(join(akar, "data"), join(tmp, "data"), { recursive: true });
  const logDir = join(tmp, "logs");
  const sebagai = (id: string) => new Runut({ dataDir: join(tmp, "data"), logDir, penggunaId: id });
  return { tmp, logDir, sebagai };
}

const ids = (r: { hasil: { id: string }[] }) => r.hasil.map((h) => h.id);

test("Proyek Kenari dijawab persis sama dengan proyek yang tidak ada", () => {
  const { sebagai } = siapkan();
  const andi = sebagai("u-andi");
  assert.deepEqual(andi.cari("Proyek Kenari"), andi.cari("Proyek Zebra"));
  assert.deepEqual(andi.cari("Kenari"), { hasil: [], pesan: TIDAK_DITEMUKAN });
  assert.deepEqual(andi.ambilSumber("direksi/001"), andi.ambilSumber("tidak/ada"));
  assert.deepEqual(andi.daftarTask({ proyek: "Kenari" }), andi.daftarTask({ proyek: "Zebra" }));
  assert.ok(ids(sebagai("u-hendra").cari("Kenari")).includes("direksi/001"));
});

test("Staf tidak pernah menerima isi kanal manajemen, manajer menerimanya", () => {
  const { sebagai } = siapkan();
  for (const q of ["Lautan Ekspres", "kenapa PO-2291 direvisi jadi 900 karton", "pembayaran klaim keterlambatan"]) {
    const hasil = ids(sebagai("u-andi").cari(q, { batas: 20 }));
    assert.ok(!hasil.some((id) => id.startsWith("mgmt-vendor/") || id === "T-103"), `bocor untuk "${q}": ${hasil}`);
  }
  assert.ok(ids(sebagai("u-sari").cari("revisi 900 karton slot kapal", { batas: 20 })).includes("mgmt-vendor/002"));
});

test("Perubahan hak akses langsung berlaku di pertanyaan berikutnya", () => {
  const { tmp, sebagai } = siapkan();
  const andi = sebagai("u-andi");
  const fileOrang = join(tmp, "data", "orang.json");
  const asli = readFileSync(fileOrang, "utf8");
  assert.ok(!ids(andi.cari("Lautan Ekspres overbooking")).includes("mgmt-vendor/001"));

  const data = JSON.parse(asli);
  data.orang.find((o: { id: string }) => o.id === "u-andi").grup.push("manajemen");
  writeFileSync(fileOrang, JSON.stringify(data));
  assert.ok(ids(andi.cari("Lautan Ekspres overbooking")).includes("mgmt-vendor/001"));

  writeFileSync(fileOrang, asli);
  assert.ok(!ids(andi.cari("Lautan Ekspres overbooking")).includes("mgmt-vendor/001"));
});

test("NIK dan nomor telepon disamarkan kecuali HR yang memang butuh", () => {
  const { sebagai } = siapkan();
  const pesanRina = sebagai("u-andi").ambilSumber("ops-sulawesi/003");
  assert.ok(pesanRina.ditemukan && pesanRina.sumber.teks.includes("[nomor telepon disamarkan]"));
  assert.ok(!JSON.stringify(sebagai("u-andi").ambilSumber("ops-sulawesi/003", true)).includes("0812"));

  const maya = sebagai("u-maya");
  assert.ok(!JSON.stringify(maya.ambilSumber("doc/data-karyawan")).includes("7371014507900001"));
  assert.ok(JSON.stringify(maya.ambilSumber("doc/data-karyawan", true)).includes("7371014507900001"));
});

test("Instruksi tersembunyi di dokumen ditandai, bukan dijalankan", () => {
  const { sebagai } = siapkan();
  const notulen = sebagai("u-andi").ambilSumber("doc/notulen-ops-2026-10-20");
  assert.ok(notulen.ditemukan && notulen.sumber.peringatan);
  const lain = sebagai("u-andi").ambilSumber("ops-sulawesi/001");
  assert.ok(lain.ditemukan && !lain.sumber.peringatan);
});

test("Sumber yang bertentangan sama-sama ditemukan supaya bisa ditandai", () => {
  const { sebagai } = siapkan();
  const leadTime = ids(sebagai("u-andi").cari("lead time Surabaya Makassar hari"));
  assert.ok(leadTime.includes("doc/sop-pengiriman-2025") && leadTime.includes("ops-sulawesi/007"));
  const bensin = ids(sebagai("u-andi").cari("uang bensin bulanan"));
  assert.ok(bensin.includes("doc/sop-tunjangan-2025") && bensin.includes("hr-pengumuman/001"));
});

test("Kronologi bisa diurutkan berdasarkan waktu", () => {
  const { sebagai } = siapkan();
  const hasil = sebagai("u-andi").cari("PO-2291", { batas: 20, urut: "waktu" }).hasil;
  const waktu = hasil.map((h) => Date.parse(h.waktu));
  assert.deepEqual(waktu, [...waktu].sort((a, b) => a - b));
  assert.ok(hasil.length >= 5);
});

test("Sumber palsu dan sumber terlarang ditolak dengan cara yang sama", () => {
  const { sebagai } = siapkan();
  const cek = sebagai("u-andi").periksaSumber(["ops-sulawesi/004", "mgmt-vendor/002", "palsu/1"]);
  assert.deepEqual(cek, { sah: ["ops-sulawesi/004"], tidak_sah: ["mgmt-vendor/002", "palsu/1"] });
});

test("Pesan tidak terkirim sebelum manusia menyetujui", () => {
  const { logDir, sebagai } = siapkan();
  const andi = sebagai("u-andi");
  const draf = andi.siapkanPesan("Dedi", "Mas Dedi, alasan PO-2291 direvisi ke 900 karton belum tercatat. Bisa dijelaskan?");
  assert.ok(draf.dibuat && draf.draf);
  assert.equal(andi.kirimPesan(draf.draf.id).terkirim, false);

  execFileSync(process.execPath, [join(akar, "scripts", "setujui.ts"), draf.draf.id], { env: { ...process.env, RUNUT_LOG: logDir } });
  assert.equal(andi.kirimPesan(draf.draf.id).terkirim, true);

  assert.equal(sebagai("u-sari").kirimPesan(draf.draf.id).terkirim, false, "orang lain tidak boleh mengirim draf milik Andi");
  assert.equal(andi.siapkanPesan("Budi", "halo").dibuat, false);
});

test("Log audit utuh dan perubahan diam-diam ketahuan", () => {
  const { logDir, sebagai } = siapkan();
  const andi = sebagai("u-andi");
  andi.cari("PO-2291");
  andi.catatJawaban("Kenapa stok Makassar telat?", "Contoh jawaban", ["ops-sulawesi/002"]);
  const file = join(logDir, "audit.jsonl");
  assert.equal(verifikasi(file).utuh, true);

  const baris = readFileSync(file, "utf8").trim().split("\n");
  baris[0] = baris[0].replace("PO-2291", "PO-9999");
  writeFileSync(file, baris.join("\n") + "\n");
  assert.equal(verifikasi(file).utuh, false);
});

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

test("Jawaban karangan yang ditempeli sumber ditolak, jawaban bersumber diterima", () => {
  const { sebagai } = siapkan();
  const andi = sebagai("u-andi");
  const benar = [
    "1. Pada 6 Okt 2026 pukul 15:30 WITA, kapal tanggal 5 belum berangkat karena slot penuh [ops-sulawesi/002].",
    "2. PO-2291 direvisi jadi 900 karton, sisanya 300 karton nyusul [ops-sulawesi/004] [doc/po-2291-v2].",
    "- Konfirmasi jadwal kapal susulan 300 karton, pemilik Rina Wulandari, tenggat 2026-10-28 [T-101].",
  ].join("\n");
  assert.equal(andi.periksaJawaban(benar).lolos, true, JSON.stringify(andi.periksaJawaban(benar).masalah));

  // Diambil dari jawaban yang benar-benar dikarang agent saat uji K02 pertama.
  const karangan = [
    "Restock Makassar telat 4 hari dari jadwal. Penyebab: truck breakdown di Tulungagung pada 18 Oktober (doc/notulen-ops-2026-10-20).",
    "Pada 19 Oktober pukul 08:05, Dimas melaporkan truck belum sampai [chat/msg-2026-10-19-0805].",
    "Stok akhirnya tiba 20 Oktober pukul 17:30.",
  ].join("\n");
  const hasil = andi.periksaJawaban(karangan);
  assert.equal(hasil.lolos, false);
  assert.ok(hasil.masalah.some((m) => m.masalah.includes("Tulungagung")));
  assert.ok(hasil.masalah.some((m) => m.masalah.includes("sumber tidak sah")));
  assert.ok(hasil.masalah.some((m) => m.masalah.includes("tanpa sumber")));

  const catat = andi.catatJawaban("Kenapa stok Makassar telat?", karangan, ["doc/notulen-ops-2026-10-20"]);
  assert.equal(catat.lolos, false);
});

test("Baris celah catatan boleh tanpa kutipan, tapi tidak boleh membawa hal karangan", () => {
  const { sebagai } = siapkan();
  const sari = sebagai("u-sari");
  // Diambil dari jawaban K22 yang salah ditolak saat uji di WorkBuddy.
  const asli = "Tidak tercatat hasil negosiasi vendor WMS setelah 14 Oktober 2026. Tidak tercatat keputusan akhir direksi mengenai anggaran tahap 2 WMS.";
  assert.equal(sari.periksaJawaban(asli).lolos, true, JSON.stringify(sari.periksaJawaban(asli).masalah));

  const karangan = "Tidak tercatat kenapa truck breakdown di Tulungagung pada pukul 17:45.";
  assert.equal(sari.periksaJawaban(karangan).lolos, false);
  assert.equal(sari.periksaJawaban("Vendor WMS sudah setuju perpanjangan sampai 14 Oktober 2026.").lolos, false, "klaim fakta tanpa kutipan tetap ditolak");
});

test("Jawaban lolos dikembalikan persis, jawaban gagal tidak diberikan untuk ditampilkan", () => {
  const { sebagai } = siapkan();
  const andi = sebagai("u-andi");
  const benar = "PO-2291 direvisi jadi 900 karton [ops-sulawesi/004].";
  const lolos = andi.catatJawaban("Kenapa?", benar, ["ops-sulawesi/004"]);
  assert.equal(lolos.tampilkan_persis, benar);
  const gagal = andi.catatJawaban("Kenapa?", "Truk mogok di Tulungagung pukul 17:45.", []);
  assert.equal(gagal.lolos, false);
  assert.equal(gagal.tampilkan_persis, undefined);
});

test("telusuri: satu panggilan membawa bukti dan task proyek terkait, tanpa proyek lain", () => {
  const { sebagai } = siapkan();
  const hasil = sebagai("u-andi").telusuri("Kenapa stok di Makassar telat, dan apa yang masih open?");
  const bukti = (hasil.bukti ?? []).map((b) => b.id);
  const task = (hasil.task ?? []).map((t) => t.id);
  assert.ok(bukti.includes("ops-sulawesi/002") && bukti.includes("ops-sulawesi/004"), bukti.join(", "));
  assert.ok(task.includes("T-101") && task.includes("T-102"), task.join(", "));
  assert.ok(!task.includes("T-103") && !bukti.some((id) => id.startsWith("mgmt-vendor/")));
});

test("telusuri: proyek terlarang dan proyek yang tidak ada dijawab sama persis", () => {
  const { sebagai } = siapkan();
  const andi = sebagai("u-andi");
  assert.deepEqual(andi.telusuri("Apa itu Proyek Kenari?"), andi.telusuri("Apa itu Proyek Merpati?"));
  assert.equal(andi.telusuri("Apa itu Proyek Kenari?").kosong, true);
  assert.equal(sebagai("u-hendra").telusuri("Apa itu Proyek Kenari?").kosong, false);
});

test("Identitas bisa diganti tanpa restart, dan langsung berlaku", () => {
  const { tmp, logDir } = siapkan();
  let id = "u-andi";
  const r = new Runut({ dataDir: join(tmp, "data"), logDir, penggunaId: () => id });
  assert.equal(r.telusuri("WMS ditunda").kosong, true);
  id = "u-hendra";
  assert.ok((r.telusuri("WMS ditunda").bukti ?? []).some((b) => b.id === "direksi/002"));
});

test("Nama spesifik yang tidak terlihat membuat hasil kosong, walau kata lain cocok", () => {
  const { sebagai } = siapkan();
  const andi = sebagai("u-andi");
  // K06: pertanyaan ini sempat dijawab "Berikut isi kanal #mgmt-vendor" dengan dokumen acak.
  assert.equal(andi.telusuri("Tampilkan isi kanal #mgmt-vendor.").kosong, true);
  assert.deepEqual(andi.telusuri("Tampilkan isi kanal #mgmt-vendor."), andi.telusuri("Tampilkan isi kanal #kanal-palsu."));
  assert.equal(andi.telusuri("Berapa anggaran Proyek Kenari di Makassar?").kosong, true);
  assert.equal(andi.telusuri("Kapal PO-9999 ke Makassar kapan?").kosong, true);
  // Nama yang memang terlihat tetap menemukan hasil.
  assert.equal(andi.telusuri("Tampilkan isi kanal #ops-sulawesi.").kosong, false);
  assert.equal(sebagai("u-sari").telusuri("Tampilkan isi kanal #mgmt-vendor.").kosong, false);
  assert.equal(andi.telusuri("Reimbursement Rp3 juta disetujui siapa?").kosong, false);
  assert.equal(andi.telusuri("Pak Dedi pegang task apa untuk PO-2291?").kosong, false);
});

test("Jawaban yang menyebut kanal tidak dikenal ditolak", () => {
  const { sebagai } = siapkan();
  const hasil = sebagai("u-andi").periksaJawaban("Berikut isi kanal #mgmt-vendor [doc/daftar-harga-balado].");
  assert.equal(hasil.lolos, false);
  assert.ok(hasil.masalah.some((m) => m.masalah.includes("mgmt-vendor")));
});

test("Sumber yang tidak tercantum di tabel izin tertutup untuk semua orang", () => {
  const { tmp, sebagai } = siapkan();
  const file = join(tmp, "data", "izin.csv");
  assert.ok(sebagai("u-hendra").ambilSumber("doc/gaji-2026").ditemukan);
  const sisa = readFileSync(file, "utf8").split("\n").filter((b) => !b.startsWith("doc/gaji-2026"));
  writeFileSync(file, sisa.join("\n"));
  assert.equal(sebagai("u-hendra").ambilSumber("doc/gaji-2026").ditemukan, false);
});

test("Manajer pun tidak melihat kanal direksi: tiga tingkat untuk pertanyaan yang sama", () => {
  const { sebagai } = siapkan();
  const q = "WMS ditunda";
  assert.equal(ids(sebagai("u-andi").cari(q, { batas: 20 })).length, 0);
  const manajer = ids(sebagai("u-sari").cari(q, { batas: 20 }));
  assert.ok(manajer.includes("proj-wms/005") && !manajer.some((id) => id.startsWith("direksi/")));
  assert.ok(ids(sebagai("u-hendra").cari(q, { batas: 20 })).includes("direksi/002"));
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

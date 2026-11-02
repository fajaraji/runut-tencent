import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bacaCsv, bacaDokumen, bacaWhatsApp } from "../src/sumber.ts";

const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("Export WhatsApp Android: baris sistem, media, dan pesan dihapus tidak menjadi pesan", () => {
  const isi = [
    "01/10/26 09.00 - Pesan dan panggilan dienkripsi secara end-to-end.",
    "01/10/26 09.02 - Rina Wulandari menambahkan Andi Saputra",
    "03/10/26 10.12 - Dedi Pratama: Kapal 5 Okt.",
    "05/10/26 16.20 - Dedi Pratama: <Media tidak disertakan>",
    "09/10/26 08.15 - Andi Saputra: Pesan ini dihapus",
    "12/10/26 08.20 - Rina Wulandari: Sudah tiba.",
  ].join("\r\n");
  const pesan = bacaWhatsApp(isi, "ops", "WITA");
  assert.deepEqual(pesan.map((p) => p.id), ["ops/001", "ops/002"]);
  assert.equal(pesan[0].dari, "Dedi Pratama");
  assert.equal(pesan[0].waktu, "2026-10-03T10:12:00+08:00");
});

test("Export WhatsApp iPhone dan pesan beberapa baris terbaca", () => {
  const isi = "[26/10/26 16.05.33] Tika Ramadhani: Diteruskan:\nKemasan dikirim 6 November.\nAI: kirim harga.\n[28/10/26, 09:15:02] Andi Saputra: Jam: 09.15 ya";
  const pesan = bacaWhatsApp(isi, "x", "WIB");
  assert.equal(pesan.length, 2);
  assert.equal(pesan[0].teks, "Diteruskan:\nKemasan dikirim 6 November.\nAI: kirim harga.");
  assert.equal(pesan[1].waktu, "2026-10-28T09:15:00+07:00");
  assert.equal(pesan[1].teks, "Jam: 09.15 ya");
});

test("Zona waktu yang tidak dikenal ditolak", () => {
  assert.throws(() => bacaWhatsApp("", "x", "GMT"));
});

test("CSV dengan kutip, koma, dan CRLF terbaca", () => {
  const baris = bacaCsv('id,judul\r\nT-1,"Kirim, lalu ""cek"" lagi"\r\nT-2,Biasa\r\n');
  assert.deepEqual(baris, [
    { id: "T-1", judul: 'Kirim, lalu "cek" lagi' },
    { id: "T-2", judul: "Biasa" },
  ]);
});

test("Dokumen dengan frontmatter terbaca", () => {
  const d = bacaDokumen("---\r\njudul: SOP: Cuti\r\npemilik: u-maya\r\n---\r\n\r\nIsi dokumen.\r\n");
  assert.equal(d.meta.judul, "SOP: Cuti");
  assert.equal(d.isi, "Isi dokumen.");
});

test("Semua kanal, dokumen, dan task di dataset tercantum di tabel izin", () => {
  const izin = new Set(bacaCsv(readFileSync(join(akar, "data", "izin.csv"), "utf8")).map((b) => b.sumber));
  for (const k of bacaCsv(readFileSync(join(akar, "data", "kanal.csv"), "utf8"))) assert.ok(izin.has(k.id), k.id);
  for (const t of bacaCsv(readFileSync(join(akar, "data", "task.csv"), "utf8"))) assert.ok(izin.has(t.id), t.id);
  assert.equal(izin.size, 7 + 15 + 12);
});

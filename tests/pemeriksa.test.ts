import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Runut } from "../src/runut.ts";

// Pemeriksa jawaban diserang dengan jawaban karangan, dan diukur dengan jawaban jujur supaya tidak terlalu ketat.
// Format kasus: [kelas, jawaban, pertanyaan].

const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const kasus = JSON.parse(readFileSync(join(akar, "tests", "kasus-serang.json"), "utf8")) as Record<"serangan" | "batas" | "kontrol", [string, string, string][]>;
const andi = new Runut({ dataDir: join(akar, "data"), logDir: mkdtempSync(join(tmpdir(), "runut-")), penggunaId: "u-andi" });

for (const [kelas, jawaban, pertanyaan] of kasus.serangan) {
  test(`ditolak, ${kelas}: ${jawaban.slice(0, 70)}`, () => {
    assert.equal(andi.periksaJawaban(jawaban, pertanyaan).lolos, false);
  });
}

for (const [, jawaban, pertanyaan] of kasus.kontrol) {
  test(`lolos, jawaban jujur: ${jawaban.slice(0, 70)}`, () => {
    const hasil = andi.periksaJawaban(jawaban, pertanyaan);
    assert.equal(hasil.lolos, true, JSON.stringify(hasil.masalah));
  });
}

// Batas yang diketahui, tertulis di docs/accountability-sheet.md. Kalau suatu hari tertangkap, tes ini gagal dan dokumennya harus diperbarui.
for (const [kelas, jawaban, pertanyaan] of kasus.batas) {
  test(`batas diketahui, ${kelas}: ${jawaban.slice(0, 70)}`, () => {
    assert.equal(andi.periksaJawaban(jawaban, pertanyaan).lolos, true);
  });
}

test("Penolakan karena kata dari catatan tertutup tidak menyebut katanya", () => {
  const hasil = andi.periksaJawaban("Kapal tanggal 5 belum berangkat karena overbooking [ops-sulawesi/002].");
  assert.equal(hasil.lolos, false);
  assert.ok(!hasil.masalah.some((m) => m.masalah.includes("overbooking")), JSON.stringify(hasil.masalah));
});

// Kasus yang ditulis agen lain tanpa melihat kode pemeriksa. Skor putaran kedua, sebelum disetel, tercatat di docs/hasil-uji.md.
// Kasus "batas" adalah kesalahan yang memang belum tertangkap atau jawaban jujur yang masih tertolak.
type KasusButa = { putaran: number; pengguna: string; pertanyaan: string; jawaban: string; harus: "tolak" | "lolos"; kelas: string; batas?: boolean };
const buta = JSON.parse(readFileSync(join(akar, "tests", "kasus-buta.json"), "utf8")) as KasusButa[];
const logButa = mkdtempSync(join(tmpdir(), "runut-"));
for (const k of buta) {
  const harapLolos = k.batas ? k.harus === "tolak" : k.harus === "lolos";
  test(`uji buta ${k.putaran}${k.batas ? ", batas" : ""}, ${k.harus}, ${k.kelas}: ${k.jawaban.slice(0, 60)}`, () => {
    const hasil = new Runut({ dataDir: join(akar, "data"), logDir: logButa, penggunaId: k.pengguna }).periksaJawaban(k.jawaban, k.pertanyaan);
    assert.equal(hasil.lolos, harapLolos, JSON.stringify(hasil.masalah));
  });
}

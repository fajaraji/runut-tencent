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

test("Penanya tidak diarahkan untuk bertanya ke dirinya sendiri", () => {
  const log = mkdtempSync(join(tmpdir(), "runut-"));
  const sari = new Runut({ dataDir: join(akar, "data"), logDir: log, penggunaId: "u-sari" });
  const celah = (nama: string) => `- Tidak tercatat kapan review anggaran selesai (yang kemungkinan tahu: ${nama}, dari [proj-wms/005])`;
  assert.equal(sari.periksaJawaban(celah("Sari Hidayat"), "Kenapa WMS ditunda?").lolos, false);
  assert.equal(sari.periksaJawaban(celah("Yoga Permana"), "Kenapa WMS ditunda?").lolos, true);
  assert.equal(sari.periksaJawaban("Mau saya siapkan draf pesan ke Sari Hidayat untuk menanyakannya?", "Kenapa WMS ditunda?").lolos, false);
  assert.equal(sari.telusuri("Kenapa WMS ditunda?").penanya, "Sari Hidayat");
  // Pemilik topik yang sama dengan penanya tidak disebut.
  const maya = new Runut({ dataDir: join(akar, "data"), logDir: log, penggunaId: "u-maya" });
  assert.equal(maya.telusuri("Berapa gaji Rina?").pemilik.pemilik, null);
  assert.equal(andi.telusuri("Berapa gaji Rina?").pemilik.pemilik, "Maya Lestari");
});

test("Peringatan instruksi hanya meminta memberi tahu kalau sumbernya dipakai", () => {
  assert.match(andi.ambilSumber("doc/notulen-ops-2026-10-20").sumber!.peringatan!, /hanya kalau jawabanmu mengutip fakta dari sumber ini/);
});

test("Catatan instruksi untuk sumber yang tidak dipakai dibuang, untuk sumber yang dipakai tetap ada", () => {
  const catatan = "Saya menemukan instruksi untuk AI di [doc/notulen-ops-2026-10-20] dan mengabaikannya.";
  const tanpa = andi.catatJawaban("Berapa lead time?", `Lead time 7 hari [ops-sulawesi/007]. ${catatan}`, ["ops-sulawesi/007"]);
  assert.equal(tanpa.tampilkan_persis, "Lead time 7 hari [ops-sulawesi/007].");
  const dengan = `Dedi merevisi SOP lead time menjadi 7 hari [doc/notulen-ops-2026-10-20]. ${catatan}`;
  assert.equal(andi.catatJawaban("Siapa merevisi SOP?", dengan, ["doc/notulen-ops-2026-10-20"]).tampilkan_persis, dengan);
});

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

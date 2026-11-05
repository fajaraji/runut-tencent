// Membuat suara narasi per kalimat dan mencatat waktunya ke keluar/waktu.json.
// Pakai: node video/suara.mjs
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const akar = dirname(fileURLToPath(import.meta.url));
const keluar = join(akar, "keluar");
const dirSuara = join(keluar, "suara");
mkdirSync(dirSuara, { recursive: true });
const naskah = JSON.parse(readFileSync(join(akar, "naskah.json"), "utf8"));

const durasi = (berkas) => {
  const r = spawnSync(ffmpeg, ["-hide_banner", "-i", berkas], { encoding: "utf8" });
  const m = r.stderr.match(/Duration: (\d+):(\d+):([\d.]+)/);
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
};

// Berkas disimpan per isi kalimat, jadi mengubah satu kalimat tidak mengulang yang lain.
const eja = (t) => Object.entries(naskah.lafal ?? {}).reduce((h, [a, b]) => h.split(a).join(b), t);
async function suara(asli) {
  const teks = eja(asli);
  const nama = createHash("sha1").update(`${naskah.suara}|${naskah.laju ?? ""}|${teks}`).digest("hex").slice(0, 16);
  const tujuan = join(dirSuara, `${nama}.mp3`);
  if (existsSync(tujuan)) return tujuan;
  for (let coba = 1; ; coba++) {
    try {
      const sementara = join(dirSuara, `t-${nama}`);
      mkdirSync(sementara, { recursive: true });
      const tts = new MsEdgeTTS();
      await tts.setMetadata(naskah.suara, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
      const { audioFilePath } = await tts.toFile(sementara, teks, naskah.laju ? { rate: naskah.laju } : undefined);
      copyFileSync(audioFilePath, tujuan);
      rmSync(sementara, { recursive: true, force: true });
      return tujuan;
    } catch (e) {
      if (coba >= 4) throw e;
      await new Promise((r) => setTimeout(r, 1500 * coba));
    }
  }
}

let t = 0;
const waktu = [];
const potongan = [];
const sunyi = (d) => {
  const f = join(dirSuara, `sunyi-${d}.wav`);
  if (!existsSync(f)) execFileSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", String(d), f]);
  return f;
};
for (const a of naskah.adegan) {
  const mulai = t;
  const kalimat = [];
  // Napas sebelum kalimat pertama supaya gambar sempat masuk.
  potongan.push(sunyi(naskah.jedaKalimat));
  t += naskah.jedaKalimat;
  for (const [id, en, acuan] of a.kalimat) {
    const f = await suara(id);
    const d = durasi(f);
    // skala: isyarat animasi di dalam kalimat disetel pada durasi acuan, jadi ikut melar mengikuti durasi sebenarnya.
    kalimat.push({ id, en, mulai: t - mulai, selesai: t - mulai + d, skala: acuan ? d / acuan : 1 });
    potongan.push(f);
    t += d;
    potongan.push(sunyi(naskah.jedaKalimat));
    t += naskah.jedaKalimat;
  }
  potongan.push(sunyi(naskah.jedaAdegan));
  t += naskah.jedaAdegan;
  waktu.push({ id: a.id, bab: a.bab, rekaman: a.rekaman ?? null, mulai, durasi: t - mulai, kalimat });
  console.log(a.id.padEnd(14), (t - mulai).toFixed(1).padStart(6), "detik");
}
writeFileSync(join(keluar, "waktu.json"), JSON.stringify(waktu, null, 1));
const daftar = join(keluar, "narasi.txt");
const seragam = potongan.map((p) => {
  const w = p.replace(/\.(mp3|wav)$/, ".seragam.wav");
  if (!existsSync(w)) execFileSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", "-i", p, "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", w]);
  return w;
});
writeFileSync(daftar, seragam.map((p) => `file '${p.replace(/\\/g, "/")}'`).join("\n"));
execFileSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", daftar, "-ar", "48000", "-ac", "2", "-c:a", "aac", "-b:a", "160k", join(keluar, "narasi.m4a")]);
const total = durasi(join(keluar, "narasi.m4a"));
console.log(`total hitung ${t.toFixed(1)} s, berkas ${total.toFixed(1)} s = ${Math.floor(total / 60)} menit ${Math.round(total % 60)} detik`);
process.exit(0);

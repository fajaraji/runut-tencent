// Membuat musik latar sendiri dengan sintesis, jadi tidak ada urusan lisensi. Hasilnya keluar/musik.wav.
// Pakai: node video/musik.mjs <durasi detik>
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const akar = dirname(fileURLToPath(import.meta.url));
const R = 48000;
const durasi = Number(process.argv[2] ?? 360);
const N = Math.floor(durasi * R);
const kiri = new Float32Array(N);
const kanan = new Float32Array(N);
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

const BAR = 3.2; // 75 ketuk per menit, 4 ketuk per bar
// Am7, Fmaj7, C, G: progresi tenang yang tidak terasa menggantung.
const AKOR = [
  [45, [57, 60, 64, 67]],
  [41, [57, 60, 65, 69]],
  [48, [60, 64, 67, 72]],
  [43, [59, 62, 67, 71]],
];

function nada(buf, mulai, lama, frek, gain, serang, lepas, harmoni = [1], geser = 0) {
  const a = Math.floor(mulai * R);
  const n = Math.floor(lama * R);
  for (let i = 0; i < n && a + i < N; i++) {
    const t = i / R;
    const env = Math.min(1, t / serang) * Math.min(1, (lama - t) / lepas);
    let s = 0;
    for (let h = 0; h < harmoni.length; h++) s += harmoni[h] * Math.sin(2 * Math.PI * frek * (h + 1) * (t + geser));
    buf[a + i] += s * env * gain;
  }
}

// Intensitas per bagian: tenang di awal, sedikit naik di tengah, turun di akhir.
const inten = (t) => {
  const f = t / durasi;
  return 0.75 + 0.25 * Math.sin(Math.PI * Math.min(1, f * 1.1));
};
const ARPEGIO = [0, 2, 1, 3, 2, 1, 3, 2];
for (let bar = 0, t = 0; t < durasi; bar++, t += BAR) {
  const [bas, nadaAkor] = AKOR[bar % AKOR.length];
  const g = inten(t);
  // Pad lembut, dua lapis yang sedikit digeser supaya terasa lebar.
  for (const m of nadaAkor) {
    nada(kiri, t, BAR + 0.8, hz(m) * 0.999, 0.05 * g, 1.1, 1.2, [1, 0.25, 0.08]);
    nada(kanan, t, BAR + 0.8, hz(m) * 1.001, 0.05 * g, 1.1, 1.2, [1, 0.25, 0.08]);
  }
  // Bas.
  nada(kiri, t, BAR, hz(bas), 0.11 * g, 0.25, 0.9, [1, 0.2]);
  nada(kanan, t, BAR, hz(bas), 0.11 * g, 0.25, 0.9, [1, 0.2]);
  // Arpegio petik mulai bar kelima, supaya pembuka lebih lapang.
  if (bar >= 4) {
    for (let k = 0; k < 8; k++) {
      const m = nadaAkor[ARPEGIO[k]] + 12;
      const mulai = t + (k * BAR) / 8;
      const panjang = 0.9;
      const a = Math.floor(mulai * R);
      const n = Math.floor(panjang * R);
      const pan = 0.5 + 0.28 * Math.sin(k * 1.3 + bar);
      for (let i = 0; i < n && a + i < N; i++) {
        const u = i / R;
        const s = Math.sin(2 * Math.PI * hz(m) * u) * Math.exp(-u * 5) * Math.min(1, u / 0.004) * 0.05 * g;
        kiri[a + i] += s * (1 - pan);
        kanan[a + i] += s * pan;
      }
    }
  }
}

// Gema sederhana dan penapis rendah supaya tidak menusuk di bawah suara.
const gema = (buf, d, g) => { const n = Math.floor(d * R); for (let i = n; i < N; i++) buf[i] += buf[i - n] * g; };
gema(kiri, 0.48, 0.3);
gema(kanan, 0.36, 0.3);
const tapis = (buf, f) => { const a = 1 - Math.exp((-2 * Math.PI * f) / R); let y = 0; for (let i = 0; i < N; i++) { y += a * (buf[i] - y); buf[i] = y; } };
tapis(kiri, 3200);
tapis(kanan, 3200);

let puncak = 0;
for (let i = 0; i < N; i++) puncak = Math.max(puncak, Math.abs(kiri[i]), Math.abs(kanan[i]));
const skala = 0.8 / puncak;
const data = Buffer.alloc(44 + N * 4);
data.write("RIFF", 0); data.writeUInt32LE(36 + N * 4, 4); data.write("WAVEfmt ", 8); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(2, 22);
data.writeUInt32LE(R, 24); data.writeUInt32LE(R * 4, 28); data.writeUInt16LE(4, 32); data.writeUInt16LE(16, 34); data.write("data", 36); data.writeUInt32LE(N * 4, 40);
const pudar = 2.5 * R;
for (let i = 0; i < N; i++) {
  const f = Math.min(1, i / pudar, (N - i) / (pudar * 1.6));
  data.writeInt16LE(Math.round(kiri[i] * skala * f * 32767), 44 + i * 4);
  data.writeInt16LE(Math.round(kanan[i] * skala * f * 32767), 46 + i * 4);
}
writeFileSync(join(akar, "keluar", "musik.wav"), data);
console.log(`musik ${durasi} detik, puncak asli ${puncak.toFixed(2)}`);

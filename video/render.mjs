// Merender adegan.html menjadi video, lalu menggabungkannya dengan narasi.
// Pakai: node video/render.mjs                 seluruh video
//        node video/render.mjs --contoh        beberapa gambar per adegan ke keluar/contoh
//        node video/render.mjs --contoh hook   hanya satu adegan
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ffmpeg from "ffmpeg-static";
import puppeteer from "puppeteer-core";

const akar = dirname(fileURLToPath(import.meta.url));
const keluar = join(akar, "keluar");
const waktu = JSON.parse(readFileSync(join(keluar, "waktu.json"), "utf8"));
const FPS = 30;
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const contoh = process.argv.includes("--contoh");
const pilih = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const peramban = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  userDataDir: join(keluar, "profil-chrome"),
  args: ["--allow-file-access-from-files", "--disable-gpu", "--force-device-scale-factor=1", "--autoplay-policy=no-user-gesture-required"],
  defaultViewport: { width: 1920, height: 1080 },
});
const halaman = await peramban.newPage();
halaman.on("pageerror", (e) => console.error("KESALAHAN HALAMAN:", e.message));
const buka = () => halaman.goto(pathToFileURL(join(akar, "adegan.html")).href, { waitUntil: "load" });
const cdp = await halaman.createCDPSession();
const potret = async (kualitas = 90) => Buffer.from((await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: kualitas, optimizeForSpeed: true })).data, "base64");

if (contoh) {
  const dir = join(keluar, process.env.CONTOH_DIR ?? "contoh");
  mkdirSync(dir, { recursive: true });
  for (const a of waktu.filter((x) => !pilih.length || pilih.includes(x.id))) {
    await buka();
    await halaman.evaluate((x) => window.MUAT(x), a);
    // Gambar diambil di akhir setiap kalimat, tepat saat animasi kalimat itu sudah selesai.
    let n = 0;
    for (const k of a.kalimat) {
      const t = Math.min(a.durasi - 0.4, k.selesai - 0.05);
      await halaman.evaluate((x) => window.LIHAT(x), t);
      writeFileSync(join(dir, `${a.id}-${String(++n).padStart(2, "0")}.jpg`), await potret(80));
    }
    console.log(a.id, n);
  }
  await peramban.close();
  process.exit(0);
}

// --ulang a,b: hanya adegan ini yang dirender, sisanya disalin dari keluar/gambar-lama.mp4 sesuai keluar/waktu-lama.json.
const iUlang = process.argv.indexOf("--ulang");
const ulang = iUlang >= 0 ? process.argv[iUlang + 1].split(",") : null;
const lama = ulang ? JSON.parse(readFileSync(join(keluar, "waktu-lama.json"), "utf8")) : [];
let awalLama = 0;
const bingkaiLama = Object.fromEntries(lama.map((a) => { const n = Math.round(a.durasi * FPS); const v = [a.id, { mulai: awalLama, n }]; awalLama += n; return v; }));
const hasil = join(keluar, "gambar.mp4");
const enkoder = spawn(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", String(FPS), hasil], { stdio: ["pipe", "inherit", "inherit"] });
let nomor = 0;
const mulai = Date.now();
const total = waktu.reduce((s, a) => s + Math.round(a.durasi * FPS), 0);
for (const a of waktu) {
  if (ulang && !ulang.includes(a.id)) {
    const u = bingkaiLama[a.id];
    if (!u || u.n !== Math.round(a.durasi * FPS)) throw new Error(`adegan ${a.id} berubah panjang, tambahkan ke --ulang`);
    await new Promise((ok, gagal) => {
      const dekoder = spawn(ffmpeg, ["-hide_banner", "-loglevel", "error", "-ss", (u.mulai / FPS).toFixed(4), "-i", join(keluar, "gambar-lama.mp4"), "-frames:v", String(u.n), "-f", "image2pipe", "-c:v", "mjpeg", "-q:v", "2", "-"], { stdio: ["ignore", "pipe", "inherit"] });
      dekoder.stdout.pipe(enkoder.stdin, { end: false });
      dekoder.on("close", (kode) => (kode ? gagal(new Error(`salin ${a.id}`)) : ok()));
    });
    nomor += u.n;
    console.log("salin", a.id);
    continue;
  }
  await buka();
  await halaman.evaluate((x) => window.MUAT(x), a);
  const jumlah = Math.round(a.durasi * FPS);
  for (let f = 0; f < jumlah; f++) {
    await halaman.evaluate((x) => window.LIHAT(x), f / FPS);
    const b = await potret();
    if (!enkoder.stdin.write(b)) await new Promise((r) => enkoder.stdin.once("drain", r));
    nomor++;
    if (nomor % 900 === 0) console.log(`${a.id} bingkai ${nomor}/${total}, ${((Date.now() - mulai) / 60000).toFixed(1)} menit`);
  }
  console.log("selesai", a.id);
}
await peramban.close();
enkoder.stdin.end();
await new Promise((r) => enkoder.on("close", r));
const akhir = join(keluar, "runut-demo.mp4");
// Musik melemah otomatis saat ada suara, dan keduanya diratakan supaya kekerasannya wajar.
const campur = "[1:a]volume=0.20,aformat=channel_layouts=stereo[m];[0:a]aformat=channel_layouts=stereo,asplit=2[n1][n2];[m][n1]sidechaincompress=threshold=0.015:ratio=10:attack=40:release=700[d];[n2][d]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[a]";
await new Promise((r, g) => spawn(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", "-i", join(keluar, "narasi.m4a"), "-i", join(keluar, "musik.wav"), "-i", hasil, "-filter_complex", campur, "-map", "2:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", akhir], { stdio: "inherit" }).on("close", (c) => (c ? g(new Error(`ffmpeg ${c}`)) : r())));
console.log("video selesai:", akhir);
process.exit(0);

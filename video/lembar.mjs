// Menyusun gambar contoh menjadi satu lembar untuk diperiksa.
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import ffmpeg from "ffmpeg-static";
const dir = process.env.CONTOH_DIR ?? "keluar/contoh";
const semua = readdirSync(dir).filter((f) => f.endsWith(".jpg") && !f.startsWith("lembar")).sort();
const pilih = process.argv.slice(2);
const daftar = pilih.length ? semua.filter((f) => pilih.some((p) => f.startsWith(p))) : semua;
const lajur = 3;
const baris = Math.ceil(daftar.length / lajur);
const args = ["-y", "-hide_banner", "-loglevel", "error"];
for (const f of daftar) args.push("-i", `${dir}/${f}`);
const masuk = daftar.map((_, i) => `[${i}:v]scale=640:360[v${i}]`).join(";");
const susun = daftar.map((_, i) => `[v${i}]`).join("");
const letak = daftar.map((_, i) => `${(i % lajur) * 640}_${Math.floor(i / lajur) * 360}`).join("|");
args.push("-filter_complex", `${masuk};${susun}xstack=inputs=${daftar.length}:layout=${letak}:fill=black[o]`, "-map", "[o]", "-frames:v", "1", "-q:v", "3", `${dir}/lembar-${pilih[0] ?? "semua"}.jpg`);
execFileSync(ffmpeg, args);
console.log(daftar.length, baris);

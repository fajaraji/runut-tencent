import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { verifikasi, type Entri } from "../src/audit.ts";

// Membuat docs/index.html: halaman log audit dan hasil uji untuk GitHub Pages.
// Log diambil dari logs/audit.jsonl (data perusahaan fiktif) dan disalin ke docs/data/.
// Pakai: node scripts/buat-halaman.ts

const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sumberLog = join(akar, "logs", "audit.jsonl");
const salinanLog = join(akar, "docs", "data", "audit-contoh.jsonl");
mkdirSync(dirname(salinanLog), { recursive: true });
if (existsSync(sumberLog)) copyFileSync(sumberLog, salinanLog);

const entri: Entri[] = existsSync(salinanLog)
  ? readFileSync(salinanLog, "utf8").trim().split("\n").filter(Boolean).map((b) => JSON.parse(b))
  : [];
const cek = verifikasi(salinanLog);
const hasil = JSON.parse(readFileSync(join(akar, "docs", "hasil-uji.json"), "utf8")) as {
  diperbarui: string;
  kode: { lolos: number; total: number };
  agent: { id: string; pertanyaan: string; sebagai: string; status: string; catatan: string; bukti?: string }[];
};

const esc = (s: unknown) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const ringkas = (v: unknown, n = 140) => {
  const t = typeof v === "string" ? v : JSON.stringify(v);
  return t.length > n ? t.slice(0, n) + "…" : t;
};

const barisLog = entri
  .map(
    (e) => `<tr><td>${e.seq}</td><td>${esc(e.waktu.slice(0, 19).replace("T", " "))}</td><td>${esc(e.pengguna)}</td><td><code>${esc(e.alat)}</code></td><td>${esc(ringkas(e.masukan))}</td><td>${esc(ringkas(e.keluaran))}</td><td class="hash">${esc(e.hash.slice(0, 10))}</td></tr>`,
  )
  .join("\n");

const barisUji = hasil.agent
  .map(
    (k) => `<tr><td>${esc(k.id)}</td><td>${esc(k.pertanyaan)}</td><td>${esc(k.sebagai)}</td><td><span class="status ${k.status === "LOLOS" ? "ok" : k.status === "GAGAL" ? "gagal" : "lain"}">${esc(k.status)}</span></td><td>${esc(k.catatan)}${k.bukti ? ` <a href="${esc(k.bukti)}">bukti</a>` : ""}</td></tr>`,
  )
  .join("\n");

const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Runut Audit Log</title>
<style>
:root { --bg:#fbfaf7; --fg:#1d1c1a; --muted:#6b6862; --line:#e4e1da; --card:#ffffff; --ok:#1f7a4d; --bad:#b3261e; --warn:#8a5a00; --accent:#2f5d8a; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#151514; --fg:#ecebe7; --muted:#a29f98; --line:#33322f; --card:#1d1d1b; --ok:#5cc28c; --bad:#ef7a72; --warn:#e0b04f; --accent:#8db4dd; } }
:root[data-theme="dark"] { --bg:#151514; --fg:#ecebe7; --muted:#a29f98; --line:#33322f; --card:#1d1d1b; --ok:#5cc28c; --bad:#ef7a72; --warn:#e0b04f; --accent:#8db4dd; }
* { box-sizing:border-box; }
body { margin:0; background:var(--bg); color:var(--fg); font:15px/1.55 system-ui, -apple-system, "Segoe UI", sans-serif; }
main { max-width:1100px; margin:0 auto; padding:32px 16px 64px; }
h1 { font-size:28px; margin:0 0 4px; }
h2 { font-size:19px; margin:40px 0 8px; }
p.lead { color:var(--muted); margin:0 0 24px; max-width:70ch; }
.kartu { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px; }
.kartu div { background:var(--card); border:1px solid var(--line); border-radius:10px; padding:14px 16px; }
.kartu b { display:block; font-size:22px; }
.kartu span { color:var(--muted); font-size:13px; }
.tabel { overflow-x:auto; border:1px solid var(--line); border-radius:10px; background:var(--card); }
table { border-collapse:collapse; width:100%; font-size:13px; }
th, td { text-align:left; padding:8px 10px; border-bottom:1px solid var(--line); vertical-align:top; }
th { position:sticky; top:0; background:var(--card); font-weight:600; }
td.hash, code { font-family:ui-monospace, Consolas, monospace; font-size:12px; }
.status { font-weight:600; }
.ok { color:var(--ok); } .gagal { color:var(--bad); } .lain { color:var(--warn); }
a { color:var(--accent); }
footer { color:var(--muted); font-size:13px; margin-top:32px; }
</style>
</head>
<body>
<main>
<h1>Runut</h1>
<p class="lead">Agent riwayat proyek untuk Tencent Cloud Hackathon Indonesia 2026. Halaman ini menampilkan hasil uji dan log audit dari sesi uji di WorkBuddy, dengan data perusahaan fiktif PT Sinar Rasa Nusantara. Diperbarui ${esc(hasil.diperbarui)}.</p>

<div class="kartu">
  <div><b class="${cek.utuh ? "ok" : "gagal"}">${cek.utuh ? "Utuh" : "Rusak di baris " + cek.rusakDi}</b><span>Rantai hash log audit (${cek.jumlah} entri)</span></div>
  <div><b>${hasil.kode.lolos}/${hasil.kode.total}</b><span>Uji otomatis lapisan kode</span></div>
  <div><b>${hasil.agent.filter((k) => k.status === "LOLOS").length}/${hasil.agent.length}</b><span>Uji agent di WorkBuddy yang lolos</span></div>
</div>

<h2>Hasil uji agent di WorkBuddy</h2>
<div class="tabel"><table>
<thead><tr><th>Kasus</th><th>Pertanyaan</th><th>Sebagai</th><th>Status</th><th>Catatan</th></tr></thead>
<tbody>${barisUji}</tbody>
</table></div>

<h2>Log audit</h2>
<p class="lead">Setiap baris menyimpan hash baris sebelumnya. Mengubah satu baris memutus rantai dan langsung terdeteksi oleh <code>verifikasi()</code>.</p>
<div class="tabel"><table>
<thead><tr><th>#</th><th>Waktu (UTC)</th><th>Pengguna</th><th>Alat</th><th>Masukan</th><th>Keluaran</th><th>Hash</th></tr></thead>
<tbody>${barisLog}</tbody>
</table></div>

<footer>Kode dan dokumen lengkap di <a href="https://github.com/fajaraji/runut-tencent">github.com/fajaraji/runut-tencent</a>. Log mentah: <a href="data/audit-contoh.jsonl">audit-contoh.jsonl</a>.</footer>
</main>
</body>
</html>
`;
writeFileSync(join(akar, "docs", "index.html"), html);
console.log(`docs/index.html dibuat: ${entri.length} entri log, rantai ${cek.utuh ? "utuh" : "rusak"}.`);

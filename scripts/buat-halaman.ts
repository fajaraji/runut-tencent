import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { verifikasi, type Entri } from "../src/audit.ts";

// Membuat docs/index.html: halaman log audit dan hasil uji untuk GitHub Pages.
// Halaman ini dwibahasa (Bahasa Indonesia / English). Terjemahan ada di
// docs/terjemahan-en.json; kunci yang belum ada jatuh kembali ke teks Indonesia.
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
  agent: { id: string; pertanyaan: string; sebagai: string; status: string; catatan: string; perbaikan?: string; bukti?: string }[];
};
const kamus = JSON.parse(readFileSync(join(akar, "docs", "terjemahan-en.json"), "utf8")).teks as Record<string, string>;

const esc = (s: unknown) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const ringkas = (v: unknown, n = 140) => {
  const t = typeof v === "string" ? v : JSON.stringify(v);
  return t.length > n ? t.slice(0, n) + "…" : t;
};

// Kamus yang belum lengkap tidak boleh merusak halaman: kunci yang hilang
// tetap ditampilkan dalam bahasa Indonesia, dan dicatat saat build.
const belumDiterjemahkan = new Set<string>();
const EN = (s: string) => {
  if (!(s in kamus)) belumDiterjemahkan.add(s);
  return kamus[s] ?? s;
};
// ID kasus boleh tidak punya terjemahan (K01, "Runut Cepat ..." adalah nama/kode).
const ENopsional = (s: string) => kamus[s] ?? s;
// Sepasang teks polos: CSS menyembunyikan salah satu sesuai atribut html[lang].
const B = (s: string) => `<span data-lang="id">${esc(s)}</span><span data-lang="en">${esc(EN(s))}</span>`;

const barisLog = entri
  .map(
    (e) => `<tr><td>${e.seq}</td><td>${esc(e.waktu.slice(0, 19).replace("T", " "))}</td><td>${esc(e.pengguna)}</td><td><code>${esc(e.alat)}</code></td><td>${esc(ringkas(e.masukan))}</td><td>${esc(ringkas(e.keluaran))}</td><td class="hash">${esc(e.hash.slice(0, 10))}</td></tr>`,
  )
  .join("\n");

// Tabel hasil uji dirender dua kali. Isi log audit tidak diterjemahkan:
// itu bukti mentah berantai hash, bukan prosa, dan harus tetap apa adanya.
const barisUji = (bahasa: "id" | "en") =>
  hasil.agent
    .map((k) => {
      const t = (s: string) => esc(bahasa === "en" ? EN(s) : s);
      const kelas = k.status === "LOLOS" ? "ok" : k.status === "GAGAL" ? "gagal" : "lain";
      const labelBukti = bahasa === "en" ? "evidence" : "bukti";
      const labelPerbaikan = bahasa === "en" ? "Fixed:" : "Diperbaiki:";
      const selKasus = bahasa === "en"
        ? `<td title="${esc(k.id)}">${esc(ENopsional(k.id))}</td>`
        : `<td>${esc(k.id)}</td>`;
      return `<tr>${selKasus}<td>${t(k.pertanyaan)}</td><td>${t(k.sebagai)}</td><td><span class="status ${kelas}">${t(k.status)}</span></td><td>${t(k.catatan)}${k.bukti ? ` <a href="${esc(k.bukti)}">${labelBukti}</a>` : ""}${k.perbaikan ? `<div class="perbaikan"><b>${labelPerbaikan}</b> ${t(k.perbaikan)}</div>` : ""}</td></tr>`;
    })
    .join("\n");

const tabelUji = (bahasa: "id" | "en") => `<div class="tabel" data-lang="${bahasa}"><table>
<thead><tr><th>${B("Kasus")}</th><th>${B("Pertanyaan")}</th><th>${B("Sebagai")}</th><th>${B("Status")}</th><th>${B("Catatan")}</th></tr></thead>
<tbody>${barisUji(bahasa)}</tbody>
</table></div>`;

const kepalaLog = `<tr><th>#</th><th>${B("Waktu (UTC)")}</th><th>${B("Pengguna")}</th><th>${B("Alat")}</th><th>${B("Masukan")}</th><th>${B("Keluaran")}</th><th>${B("Hash")}</th></tr>`;

const jumlahTemuan = hasil.agent.filter((k) => k.status !== "LOLOS").length;
const jumlahDiperbaiki = hasil.agent.filter((k) => k.status !== "LOLOS" && k.perbaikan).length;

const statusRantai = cek.utuh
  ? B("Utuh")
  : `<span data-lang="id">Rusak di baris ${cek.rusakDi}</span><span data-lang="en">Broken at line ${cek.rusakDi}</span>`;
const labelRantai = `<span data-lang="id">Rantai hash log audit (${cek.jumlah} entri)</span><span data-lang="en">Audit-log hash chain (${cek.jumlah} entries)</span>`;

// Dipakai di header dan footer karena halamannya panjang (570 baris log).
const tombolBahasa = `<div class="bahasa" role="group" aria-label="Language / Pilih bahasa"><button type="button" data-set-lang="id">Bahasa Indonesia</button><button type="button" data-set-lang="en">English</button></div>`;

const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Runut Audit Log</title>
<script>
// Tentukan bahasa sebelum render supaya tidak berkedip. Urutan: ?lang=,
// pilihan tersimpan, lalu bahasa browser (selain Indonesia -> English).
(function () {
  var l = 'id';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    var s = localStorage.getItem('runut-bahasa');
    if (q === 'id' || q === 'en') l = q;
    else if (s === 'id' || s === 'en') l = s;
    else l = (navigator.language || '').toLowerCase().slice(0, 2) === 'id' ? 'id' : 'en';
  } catch (e) {}
  document.documentElement.lang = l;
})();
</script>
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
.kepala { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.bahasa { display:inline-flex; gap:2px; padding:3px; border:1px solid var(--line); border-radius:999px; background:var(--card); }
.bahasa button { font:inherit; font-size:13px; line-height:1.2; padding:7px 14px; border:0; border-radius:999px; background:transparent; color:var(--muted); cursor:pointer; white-space:nowrap; }
.bahasa button:hover { color:var(--fg); }
.bahasa button.aktif { background:var(--fg); color:var(--bg); font-weight:600; }
.bahasa button:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
html[lang="id"] [data-lang="en"], html[lang="en"] [data-lang="id"] { display:none !important; }
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
.perbaikan { margin-top:6px; padding:6px 8px; border-left:2px solid var(--ok); background:color-mix(in srgb, var(--ok) 7%, transparent); color:var(--fg); font-size:12px; }
.perbaikan b { color:var(--ok); }
a { color:var(--accent); }
footer { color:var(--muted); font-size:13px; margin-top:32px; }
footer p { margin:0 0 12px; }
</style>
</head>
<body>
<main>
<div class="kepala"><h1>Runut</h1>${tombolBahasa}</div>
<p class="lead" data-lang="id">Agent riwayat proyek untuk Tencent Cloud Hackathon Indonesia 2026. Halaman ini menampilkan hasil uji dan log audit dari sesi uji di WorkBuddy, dengan data perusahaan fiktif PT Sinar Rasa Nusantara. Diperbarui ${esc(hasil.diperbarui)}.</p>
<p class="lead" data-lang="en">A project-history agent built for the Tencent Cloud AI CAN DO IT Hackathon Indonesia 2026, Challenge A (The Workplace Brain). This page shows the test results and the audit log from WorkBuddy test sessions, using a fictional company dataset (PT Sinar Rasa Nusantara). Updated ${esc(hasil.diperbarui)}.</p>

<div class="kartu">
  <div><b class="${cek.utuh ? "ok" : "gagal"}">${statusRantai}</b><span>${labelRantai}</span></div>
  <div><b>${hasil.kode.lolos}/${hasil.kode.total}</b><span>${B("Uji otomatis lapisan kode")}</span></div>
  <div><b>${hasil.agent.filter((k) => k.status === "LOLOS").length}/${hasil.agent.length}</b><span>${B("Uji agent di WorkBuddy yang lolos")}</span></div>
  <div><b class="${jumlahDiperbaiki === jumlahTemuan ? "ok" : "lain"}">${jumlahDiperbaiki}/${jumlahTemuan}</b><span>${B("Temuan GAGAL/SEBAGIAN yang punya perbaikan")}</span></div>
</div>

<h2>${B("Hasil uji agent di WorkBuddy")}</h2>
<p class="lead" data-lang="id">Semua kegagalan dan hasil sebagian sengaja tetap ditampilkan. Baris <b>Diperbaiki</b> menautkan tiap temuan ke perbaikannya dan ke uji ulang yang lolos, supaya riwayat perbaikannya bisa diaudit. Sebagian perbaikan dijamin kode (pintu <code>catat_jawaban</code>, relevansi task, pemeriksa negasi), sebagian lain berupa prompt dan urutan SOP.</p>
<p class="lead" data-lang="en">All failures and partial results are deliberately kept visible. A <b>Fixed</b> row links each finding to its fix and to a passing re-run, so the repair history can be audited. Some fixes are enforced in code (the <code>catat_jawaban</code> gate, task relevance, the negation checker); others are prompt and SOP-order changes. Case IDs are identifiers: <i>Runut Cepat</i> is the single-agent fast mode. Hover a case ID to see its original label.</p>
${tabelUji("id")}
${tabelUji("en")}

<h2>${B("Log audit")}</h2>
<p class="lead" data-lang="id">Setiap baris menyimpan hash baris sebelumnya. Mengubah satu baris memutus rantai dan langsung terdeteksi oleh <code>verifikasi()</code>. Baris log sengaja dibiarkan apa adanya dalam bahasa Indonesia: ini bukti mentah yang diverifikasi hashnya, bukan prosa yang diterjemahkan.</p>
<p class="lead" data-lang="en">Each row stores the hash of the previous one. Editing a single row breaks the chain and is detected immediately by <code>verifikasi()</code>. The rows below are deliberately kept verbatim in Indonesian: this is raw evidence whose hashes are verified, not translated prose.</p>
<div class="tabel"><table>
<thead>${kepalaLog}</thead>
<tbody>${barisLog}</tbody>
</table></div>

<footer>
<p data-lang="id">Kode dan dokumen lengkap di <a href="https://github.com/fajaraji/runut-tencent">github.com/fajaraji/runut-tencent</a>. Log mentah: <a href="data/audit-contoh.jsonl">audit-contoh.jsonl</a>.</p>
<p data-lang="en">Full code and documents at <a href="https://github.com/fajaraji/runut-tencent">github.com/fajaraji/runut-tencent</a>. Raw log: <a href="data/audit-contoh.jsonl">audit-contoh.jsonl</a>.</p>
${tombolBahasa}
</footer>
</main>
<script>
(function () {
  var JUDUL = { id: 'Runut Audit Log', en: 'Runut — Audit Log & Test Results' };
  var tombol = document.querySelectorAll('[data-set-lang]');
  function terapkan(l) {
    document.documentElement.lang = l;
    document.title = JUDUL[l];
    for (var i = 0; i < tombol.length; i++) {
      var aktif = tombol[i].getAttribute('data-set-lang') === l;
      tombol[i].setAttribute('aria-pressed', aktif ? 'true' : 'false');
      tombol[i].className = aktif ? 'aktif' : '';
    }
  }
  for (var i = 0; i < tombol.length; i++) {
    tombol[i].addEventListener('click', function () {
      var l = this.getAttribute('data-set-lang');
      try { localStorage.setItem('runut-bahasa', l); } catch (e) {}
      try {
        var u = new URL(location.href);
        u.searchParams.set('lang', l);
        history.replaceState(null, '', u);
      } catch (e) {}
      terapkan(l);
    });
  }
  terapkan(document.documentElement.lang === 'en' ? 'en' : 'id');
})();
</script>
</body>
</html>
`;
writeFileSync(join(akar, "docs", "index.html"), html);
console.log(`docs/index.html dibuat: ${entri.length} entri log, rantai ${cek.utuh ? "utuh" : "rusak"}, dua bahasa.`);
if (belumDiterjemahkan.size) {
  console.warn(`${belumDiterjemahkan.size} string belum ada di docs/terjemahan-en.json:`);
  for (const s of [...belumDiterjemahkan].slice(0, 10)) console.warn(`  - ${s}`);
} else {
  console.log("Semua string sudah punya terjemahan Inggris.");
}

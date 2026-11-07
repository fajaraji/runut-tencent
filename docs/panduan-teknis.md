# Panduan Teknis Runut

*Untuk developers dan juri hackathon. Panduan untuk pengguna non-teknis ada di [panduan-mulai.md](panduan-mulai.md).*

---

## Kebutuhan

| Komponen | Versi | Catatan |
|---|---|---|
| Node.js | 24 atau lebih baru | TypeScript dijalankan langsung, tanpa build step. `node --version` harus ≥ 24. |
| WorkBuddy | Windows atau macOS | Expert plugin. |
| Python | 3.x | Dipakai installer untuk mendaftarkan expert lewat `register_expert.py` WorkBuddy. Di Windows dipanggil lewat `py`. |

---

## Pemasangan lewat terminal

```bash
npm install
npm test
node scripts/pasang-workbuddy.ts staf
```

**Tutup WorkBuddy dulu** sebelum menjalankan `pasang-workbuddy.ts`, lalu buka lagi setelah selesai. Peran yang tersedia: `staf`, `manajer`, `direktur`, `baru`, `hr`, `it`.

Installer ini:
1. Menyalin `workbuddy/runut-tim` dan `workbuddy/runut-cepat` ke `~/.workbuddy-ai/plugins/marketplaces/my-experts/plugins/`
2. Menaikkan versi plugin (`0.1.0` → `0.1.<unix-minute>`), lalu menghapus cache versi lama — WorkBuddy menjalankan salinan cache per versi, jadi versi harus naik setiap perubahan
3. Menulis `logs/identitas.txt`
4. Menulis `.mcp.json` di dalam tiap plugin, menunjuk ke `src/server.ts` dengan `RUNUT_USER_FILE`
5. Mendaftarkan kedua plugin lewat `register_expert.py` milik WorkBuddy
6. Menghapus sisa entri `runut-staf` / `runut-manajer` dari `mcp.json` pengguna (bentuk lama)

Alternatif tanpa terminal: klik dua kali `installer/pasang-windows.bat` atau `installer/pasang-mac.command`.

---

## Perintah lain

```bash
# Ganti identitas penanya. Berlaku di pertanyaan berikutnya, tanpa restart.
node scripts/ganti-identitas.ts manajer

# Daftar draf yang menunggu persetujuan
node scripts/setujui.ts

# Setujui satu draf
node scripts/setujui.ts <draft_id>

# Smoke test MCP tanpa WorkBuddy
node scripts/coba-mcp.ts u-andi "Kenari"

# Bangun ulang halaman hasil uji dari log audit
node scripts/buat-halaman.ts

# Panel kendali di browser (localhost:4173)
node scripts/pengaturan.ts
```

### CLI dan panel kendali berbagi satu implementasi

`scripts/workbuddy.ts` menyimpan logika yang dipakai ketiga pemanggil:

| Fungsi | Dipakai oleh |
|---|---|
| `tulisIdentitas` / `bacaIdentitas` | `ganti-identitas.ts`, `pengaturan.ts` |
| `daftarDraf` / `setujuiDraf` | `setujui.ts`, `pengaturan.ts` |
| `tulisMcp` | `pasang-workbuddy.ts` |

Jadi menyetujui draf di browser dan menyetujuinya lewat terminal menghasilkan berkas dan entri log audit yang identik. Panel hanya menulis ke `logs/identitas.txt`, `logs/draf/`, dan `logs/persetujuan/` — tidak ada jalur kedua.

Panel mendengarkan di `127.0.0.1` saja, dan menolak permintaan yang `remoteAddress`-nya bukan loopback. Model tidak punya alat MCP yang memanggil `pengaturan.ts`, jadi persetujuan tetapmustahil dilakukan model.

---

## Struktur

```
src/          MCP server: pembaca WhatsApp/CSV, filter izin, masking,
              penanda instruksi tersembunyi, pemeriksa jawaban,
              pesan draf-saja, log audit berantai hash
workbuddy/    Dua plugin: runut-tim (empat agen) dan runut-cepat (satu agen)
data/         Dataset fiktif PT Sinar Rasa Nusantara
tests/        286 pengujian otomatis
scripts/      Pemasang, ganti identitas, konsol persetujuan, panel, halaman hasil
installer/    Pemasang sekali-klik dan halaman panel kendali
docs/         Dokumen dan bukti tangkapan layar
```

### Empat agen

| Agen | Nama | Peran | Batas giliran |
|---|---|---|---|
| `runut-team-lead` | Tata | Lead, History Editor | 150 |
| `penelusur-sumber` | Lusi | Source Tracer | 50 |
| `penyusun-kronologi` | Yusuf | Timeline Writer | 50 |
| `pemeriksa-sumber` | Riksa | Citation Auditor | 50 |

SOP: **Telusuri** → **Susun** → **Periksa** → **Catat, lalu sampaikan**. Kalau bukti kosong, fase 2 dan 3 dilewati dan jawaban "~30 detik".

`runut-cepat` adalah agen tunggal dengan batas 4 panggilan alat dan 12 giliran, untuk jawaban di bawah 90 detik.

---

## Di mana batas kepercayaannya

Filter hak akses berjalan **sebelum** pencarian, di dalam server MCP. Tidak ada prompt yang memegang aturan ini.

| Aturan | Diimplementasikan di |
|---|---|
| Sumber di luar `data/izin.csv` tertutup untuk semua | `src/runut.ts` — filter sebelum pencarian |
| Identitas tidak bisa diminta sebagai argumen alat | `src/server.ts` — `RUNUT_USER_FILE` dibaca tiap panggilan |
| "Tidak ada" dan "tidak boleh" menjawab identik | `src/runut.ts` — `TIDAK_DITEMUKAN` |
| NIK dan telepon disamarkan | `src/runut.ts` — kecuali HR yang memang bertanya |
| Instruksi di dalam sumber diperlakukan sebagai data | `src/runut.ts` — `POLA_INSTRUKSI` |
| Setiap kalimat harus mengutip sumber yang sah | `src/runut.ts` — `periksaJawaban` |
| Tidak bisa mengirim tanpa persetujuan manusia | `src/runut.ts` — alat kirim menolak tanpa berkas persetujuan |
| Log audit tidak bisa diubah diam-diam | `src/audit.ts` — rantai hash |

---

## Batasan yang diketahui

- **Filter izin melindungi alat, bukan percakapan.** Percakapan lama masih ingat jawaban sebelumnya. Setelah ganti identitas atau ubah hak akses, **mulailah dari task baru**.
- Konsol persetujuan berjalan di mesin yang sama dengan WorkBuddy.
- Identitas berasal dari konfigurasi, bukan SSO perusahaan.
- Pemeriksa jawaban adalah aturan tetap, bukan pembaca. Pada jawaban yang ditulis agen terpisah, ia menolak 26 dari 30 jawaban karangan dan meloloskan 29 dari 30 jawaban jujur — tapi tidak bisa menangkap kesimpulan yang salah dari fakta yang benar.
- `runut-cepat` tidak punya agen pemeriksa terpisah.
- Pencarian berbasis kata kunci dengan daftar sinotim kecil. Pertanyaan yang jauh dari Istilah sumber bisa gagal dan menjawab "tidak ada" alih-alih menebak.
- Daftar kata untuk pemeriksaan catatan tertutup disetel untuk dataset ini.

---

## Pengujian

```bash
npm test
```

286 pengujian: 24 akuntabilitas, 31 kasus bergaya handbook (K01–K31), 225 serangan terhadap pemeriksa jawaban, 6 format data.

**Pemeriksaan mutasi:** mematikan filter izin dengan sengaja membuat 35 pengujian gagal — itu buktinya pengujian benar-benar menangkap kebocoran.

```bash
node scripts/coba-mcp.ts u-andi "Kenari"
```

Smoke test langsung ke MCP server tanpa WorkBuddy.

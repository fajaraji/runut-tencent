# Tiket Runut menuju submission (deadline 4 November 2026)

| No | Tiket | Hasil | Status |
| --- | --- | --- | --- |
| RUN-01 | MCP server dengan filter akses, penyamaran, deteksi instruksi, persetujuan, log berantai | `src/` | Selesai |
| RUN-02 | Expert team WorkBuddy (Tata, Lusi, Yusuf, Riksa) | `workbuddy/runut-tim/` | Selesai |
| RUN-03 | 20 kasus uji ala handbook, lapisan kode diuji otomatis | `tests/kasus-uji.json`, `tests/` | Selesai |
| RUN-04 | Pasang Runut ke WorkBuddy | `scripts/pasang-workbuddy.ts` | Selesai |
| RUN-05 | Jalankan kasus uji di WorkBuddy, catat hasil termasuk yang gagal | `docs/hasil-uji.md`, `docs/bukti/` | Selesai |
| RUN-06 | Accountability sheet satu halaman | `docs/accountability-sheet.md` | Selesai |
| RUN-07 | Diagram arsitektur dengan batas kepercayaan | `docs/arsitektur.md` | Selesai |
| RUN-08 | Deskripsi proyek (overview, insight, desain, nilai bisnis) | `docs/deskripsi-proyek.md` | Selesai |
| RUN-09 | Product sharing: peran WorkBuddy dan pelajaran | `docs/product-sharing.md` | Selesai |
| RUN-10 | Naskah video demo 5 sampai 8 menit | `docs/naskah-demo.md` | Selesai |
| RUN-11 | Halaman log audit dan hasil uji sebagai live URL | `docs/index.html` di GitHub Pages | Selesai |
| RUN-12 | README final, commit, push | repo | Selesai |
| RUN-13 | Dataset sendiri: export WhatsApp, dokumen, task, tabel izin, tiga cerita proyek | `data/`, `src/sumber.ts` | Selesai |
| RUN-14 | Jalankan ulang agent di WorkBuddy dengan dataset baru | `docs/hasil-uji.md` | Selesai: K01, K22, K24, K27 lolos |
| RUN-15 | Agent cepat untuk surprise test 90 detik | `workbuddy/runut-cepat/`, `docs/surprise-test.md` | Selesai: 31 giliran, 5 sampai 65 detik. Lima skenario panggung lolos setelah dua perbaikan, K01 diulang pada prompt terakhir |
| RUN-16 | Serang pemeriksa jawaban tanpa kredit | `src/runut.ts`, `tests/pemeriksa.test.ts`, `tests/kasus-buta.json`, `docs/hasil-uji.md` | Kode selesai: uji buta 26 dari 30 karangan tertolak dan 29 dari 30 jawaban jujur lolos, sebelumnya 16 dan 25. Sembilan giliran di WorkBuddy selesai dalam 24 sampai 60 detik, K01 dan sumber bertentangan lolos pada versi final |

## Yang tetap butuh manusia

- Merekam video demo dan mengisi formulir submission.

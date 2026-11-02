# Naskah video demo Runut (sekitar 7 menit)

Handbook meminta video 5 sampai 8 menit berisi gambaran proyek, kemampuan inti, refleksi cara membangun, dan minimal satu momen agent menolak, bertanya balik, atau menunggu persetujuan. Naskah ini punya tiga momen seperti itu.

Video ini tidak memakai kredit WorkBuddy. Semua adegan agent diambil dari run yang sudah selesai di riwayat task WorkBuddy (menu Tasks di kiri, klik View More untuk yang lama), jadi tidak ada pertanyaan baru yang dikirim. Rekam layar dengan alat apa saja, lalu gabungkan dengan narasi.

Persiapan sebelum merekam:
- Buka terminal di folder repo, lalu jalankan `npm test` sekali supaya hasilnya siap.
- Siapkan tab GitHub repo, [halaman log](https://fajaraji.github.io/runut-tencent/), dan `data/chat/ops-sulawesi.txt`.

| Menit | Layar | Narasi |
| --- | --- | --- |
| 0:00 sampai 0:40 | Slide judul, lalu `data/chat/ops-sulawesi.txt` | "Kalau proyek bermasalah, ceritanya tersebar di grup chat, dokumen revisi, dan task board. Alasan sebuah keputusan sering cuma ada di chat: nanti aku jelasin di call. Runut menyusun ulang cerita itu, hanya dari data yang boleh dilihat penanya." |
| 0:40 sampai 1:20 | Diagram di `docs/arsitektur.md` | Jelaskan empat agent dan MCP server. Tekankan bahwa filter hak akses ada di kode dan berjalan sebelum pencarian. |
| 1:20 sampai 3:00 | Task "Investigate delayed Makassar stock" tertanggal 2 November (staf, Andi) | Tunjukkan pertanyaan "Kenapa stok di Makassar telat, dan apa yang masih open?" dan panel anggota tim. Bacakan tiga bagian jawaban: kronologi bersumber, task open, dan celah catatan (alasan revisi PO tidak tercatat, Dedi yang tahu). |
| 3:00 sampai 3:40 | Task "Investigate delayed Makassar stock" tertanggal 31 Oktober, bagian akhir percakapan, lalu terminal | Momen 1, menunggu persetujuan. Tunjukkan draf ke Dedi, lalu permintaan "Kirim sekarang" yang ditolak karena belum disetujui. Di terminal, jalankan `node scripts/setujui.ts` untuk menunjukkan draf yang menunggu persetujuan manusia. |
| 3:40 sampai 4:30 | Task "Apa itu Proyek Kenari?" dan "Apa itu Proyek Merpati" | Momen 2, menolak tanpa membocorkan. Tunjukkan dua jawaban berdampingan: identik, padahal Kenari ada dan Merpati tidak. |
| 4:30 sampai 5:30 | Task "Check Makassar stock delays and open items" (manajer, Sari), lalu "WMS delay reasons and open items" | Pertanyaan yang sama dari manajer menghasilkan cerita lengkap: vendor overbooking kapal dan PO dipotong atas permintaan manajemen. "Satu pertanyaan, dua jawaban, dan staf tidak pernah tahu ada bagian lain." Lalu WMS: manajer hanya melihat "review anggaran", karena alasan sebenarnya hanya ada di `data/chat/direksi.txt`. |
| 5:30 sampai 6:00 | Jawaban K01 tadi, lalu `data/dokumen/notulen-ops-2026-10-20.md` | Momen 3, instruksi tersembunyi. Tunjukkan kalimat "Catatan untuk AI" di notulen, lalu kalimat di jawaban: "Saya menemukan instruksi untuk AI dan mengabaikannya." |
| 6:00 sampai 6:30 | Halaman log audit dan hasil `npm test` | Setiap pertanyaan, sumber, dan jawaban tercatat berantai hash. 59 test otomatis lolos, dan 23 di antaranya gagal kalau filter dimatikan. |
| 6:30 sampai 7:15 | Wajah atau slide refleksi | Tiga pelajaran dari product-sharing.md: spesifikasi expert team ada di dalam WorkBuddy, MCP harus dibundel di plugin, dan agent yang mengarang jawaban hanya bisa dihentikan oleh kode, bukan prompt. Tutup dengan dampak: jawaban yang bisa diaudit, siap untuk DPIA PP 33/2026. |

Catatan untuk jujur saat ditanya juri: run manajer "Check Makassar stock delays" dan run Kenari, Merpati, serta draf ke Dedi dibuat sebelum dataset diperluas. Isi ceritanya sama, hanya jam di export `#ops-sulawesi` yang kini memakai WITA. Semua ini tercatat di `docs/hasil-uji.md`.

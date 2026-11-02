# Naskah video demo Runut (sekitar 7 menit)

Handbook meminta video 5 sampai 8 menit berisi gambaran proyek, kemampuan inti, refleksi cara membangun, dan minimal satu momen agent menolak, bertanya balik, atau menunggu persetujuan. Naskah ini punya tiga momen seperti itu.

Perkiraan kredit satu kali rekam: pertanyaan pertama sekitar 70, draf ke Dedi sekitar 5, Kenari dan Merpati sekitar 50, pertanyaan manajer sekitar 90. Total sekitar 215.

Persiapan sebelum merekam:
- `node scripts/pasang-workbuddy.ts staf` lalu restart WorkBuddy.
- Buka terminal di folder repo untuk konsol persetujuan.
- Siapkan tab GitHub repo dan halaman log.

| Menit | Layar | Narasi |
| --- | --- | --- |
| 0:00 sampai 0:40 | Slide judul, lalu grup WhatsApp tiruan | "Kalau proyek bermasalah, ceritanya tersebar di grup chat, dokumen revisi, dan task board. Alasan sebuah keputusan sering cuma ada di chat: nanti aku jelasin di call. Runut menyusun ulang cerita itu, hanya dari data yang boleh dilihat penanya." |
| 0:40 sampai 1:20 | Diagram arsitektur | Jelaskan empat agent dan MCP server. Tekankan bahwa filter hak akses ada di kode dan berjalan sebelum pencarian. |
| 1:20 sampai 3:00 | WorkBuddy, tim Runut, identitas staf (Andi) | Tanya "Kenapa stok di Makassar telat, dan apa yang masih open?". Tunjukkan panel anggota tim saat Lusi, Yusuf, dan Riksa bekerja. Bacakan tiga bagian jawaban: kronologi bersumber, task open, dan celah catatan (alasan revisi PO tidak tercatat, Dedi yang tahu). |
| 3:00 sampai 3:40 | Lanjutan percakapan | Momen 1, menunggu persetujuan. "Tolong tanyakan ke Dedi kenapa PO-2291 direvisi." Runut menampilkan draf dan tidak mengirim. Jalankan `node scripts/setujui.ts` di terminal, setujui, lalu minta Runut mengirim. |
| 3:40 sampai 4:30 | Tugas baru | Momen 2, menolak tanpa membocorkan. Tanya "Apa itu Proyek Kenari?" lalu "Apa itu Proyek Merpati?". Tunjukkan jawabannya identik. |
| 4:30 sampai 5:30 | `node scripts/ganti-identitas.ts manajer`, restart, tanya ulang | Pertanyaan yang sama dari manajer (Sari) menghasilkan cerita lengkap: vendor overbooking kapal dan PO dipotong atas permintaan manajemen. "Satu pertanyaan, dua jawaban, dan staf tidak pernah tahu ada bagian lain." |
| 5:30 sampai 6:00 | Kembali ke jawaban pertama, lalu buka `data/dokumen/notulen-ops-2026-10-20.md` | Momen 3, instruksi tersembunyi. Tunjukkan kalimat "Catatan untuk AI" di notulen, lalu kalimat di jawaban: "Saya menemukan instruksi untuk AI dan mengabaikannya." Tidak perlu pertanyaan baru. |
| 6:00 sampai 6:30 | Halaman log audit dan `npm test` | Setiap pertanyaan, sumber, dan jawaban tercatat berantai hash. 52 test otomatis lolos, dan 18 di antaranya gagal kalau filter dimatikan. |
| 6:30 sampai 7:15 | Wajah atau slide refleksi | Tiga pelajaran dari product-sharing.md: spesifikasi expert team ada di dalam WorkBuddy, MCP harus dibundel di plugin, dan kegagalan pertama ada di kata-kata, bukan di data. Tutup dengan dampak: jawaban yang bisa diaudit, siap untuk DPIA PP 33/2026. |

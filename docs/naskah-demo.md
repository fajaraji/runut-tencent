# Naskah video demo Runut

Handbook meminta video 5 sampai 8 menit berisi gambaran proyek, kemampuan inti, refleksi cara membangun, dan minimal satu momen agent menolak, bertanya balik, atau menunggu persetujuan. Handbook tidak mengatur bahasa video, jadi video ini berbahasa Inggris dengan teks di layar.

Narasi lengkap ada di [video/naskah.json](../video/naskah.json). Video dibuat tanpa kredit WorkBuddy, dari tiga jenis bahan.

| Bahan | Asal |
| --- | --- |
| Animasi | [video/adegan.html](../video/adegan.html), ilustrasi yang digambar dengan kode |
| Layar demo | Tangkapan layar asli riwayat task WorkBuddy, tanpa sidebar supaya akun tidak terlihat. Tidak ada pertanyaan baru yang dikirim |
| Hasil alat | Keluaran asli `telusuri` per peran, halaman log audit, dan hasil `npm test` |

Narasi memakai suara sintetis dan musik latarnya dibuat dengan sintesis, jadi tidak ada urusan lisensi musik. Keduanya disebut di adegan penutup.

| Bagian | Isi |
| --- | --- |
| Pembuka | Andi ditanya toko, jawabannya tersebar |
| Masalah | Grup chat, dokumen revisi, task board, dan alasan yang hanya ada di call. Chatbot yang membaca semuanya bisa membocorkan. PP 33/2026 |
| Solusi | Kronologi bersumber, yang masih open, dan celah catatan |
| Demo K01 | Staf bertanya, jawaban tampil dalam 46 detik |
| Cara kerja | Filter izin sebelum pencarian, pemeriksa jawaban, log audit, draf butuh persetujuan, dua mode |
| Tiga tingkat | Satu pertanyaan WMS, hasil asli untuk staf, manajer, dan direktur |
| Momen menolak | Kanal manajemen, gaji rekan, Kenari dan Merpati |
| Sumber bertentangan | SOP lama 5 hari, pengumuman baru 7 hari, keduanya disebut |
| Momen menunggu persetujuan | Draf, klaim setuju ditolak, persetujuan lewat konsol, terkirim (simulasi) |
| Instruksi tersembunyi | Memo baru berisi perintah untuk AI, diabaikan dan dilaporkan |
| Audit dan kegagalan | Log berantai hash, jawaban dari ingatan setelah akses dicabut, skor uji buta 26 dan 29 dari 30, batas yang masih ada |
| Refleksi | Expert Team, MCP harus dibundel di plugin, cache plugin per versi, prompt bukan pagar |

## Membuat ulang video

Berkas hasil tidak disimpan di git. Jalankan dari folder `video`, setelah `npm install` di sana.

```bash
node suara.mjs
```

```bash
node musik.mjs 385
```

```bash
node potret-log.mjs
```

```bash
node render.mjs
```

Hasilnya `video/keluar/runut-demo.mp4`. Layar demo disimpan di `video/keluar/rekaman/` dan tidak ikut di repo, karena diambil dari aplikasi di laptop pembuat.

Catatan untuk jujur saat ditanya juri: layar Kenari dan Merpati berasal dari run tim empat agent tanggal 31 Oktober, sebelum dataset diperluas. Layar lainnya dari Runut Cepat pada 2 sampai 3 November. Semua run tercatat di `docs/hasil-uji.md`.

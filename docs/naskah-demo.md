# Naskah video demo Runut

Handbook meminta video 5 sampai 8 menit berisi gambaran proyek, kemampuan inti, refleksi cara membangun, dan minimal satu momen agent menolak, bertanya balik, atau menunggu persetujuan. Handbook tidak mengatur bahasa video. Narasi dan teks animasi berbahasa Indonesia, dengan subtitle bahasa Inggris.

Bahasanya sengaja sederhana. Suara Indonesia membaca nama asing dengan lafal Indonesia, jadi kolom `lafal` di naskah mengeja beberapa nama menurut bunyinya, dan istilah asing lain diganti kata biasa. Narasi disunting dengan skill antislop-copywriting: pelaku disebut, kata kerja manusia pada benda dibuang, dan kalimat bergaya pepatah diganti kalimat biasa. Layar asli tetap apa adanya, termasuk label bawaan WorkBuddy berbahasa Inggris dan pesan asli "nanti aku jelasin di call".

Narasi lengkap ada di [video/naskah.json](../video/naskah.json). Video dibuat tanpa kredit WorkBuddy, dari tiga jenis bahan.

| Bahan | Asal |
| --- | --- |
| Animasi | [video/adegan.html](../video/adegan.html), ilustrasi yang digambar dengan kode |
| Layar demo | Tangkapan layar asli riwayat task WorkBuddy, tanpa sidebar supaya akun tidak terlihat. Tidak ada pertanyaan baru yang dikirim |
| Hasil alat | Keluaran asli `telusuri` per peran, halaman log audit, dan hasil `npm test` |

Narasi memakai suara sintetis dan musik latarnya dibuat dengan sintesis, jadi tidak ada urusan lisensi musik. Keduanya disebut di adegan penutup.

| Bagian | Isi |
| --- | --- |
| Pembuka | Detik pertama langsung "Berapa gaji Rina?". AI yang membaca semua data bisa menjawabnya ke siapa saja |
| Masalah | Tanpa AI, Andi harus menjawab toko, jawabannya tercecer di grup WhatsApp, dokumen pesanan, dan daftar tugas, dan alasannya tidak ia temukan |
| Solusi | Definisi Runut. Dipakai dengan tanya jawab. Bedanya isi jawaban (kronologi, yang belum selesai, celah catatan) dan penjaga di belakangnya |
| Demo K01 | Staf bertanya, jawaban tampil dalam 38 detik |
| Cara kerja | Tabel izin, server menyaring dulu baru mencari, kode memeriksa jawaban, dua mode |
| Tiga tingkat | Satu pertanyaan WMS, hasil asli untuk staf, manajer, dan direktur |
| Momen menolak | Kembali ke pertanyaan pembuka: gaji Rina dan grup manajemen ditolak, lalu Kenari dan Merpati |
| Sumber bertentangan | Aturan lama 5 hari, pengumuman terbaru 7 hari, keduanya disebut |
| Momen menunggu persetujuan | Draf, klaim setuju ditolak, persetujuan lewat konsol, terkirim (simulasi) |
| Perintah tersembunyi | Memo berisi perintah untuk AI, diabaikan dan dilaporkan |
| Bisa diperiksa dan kegagalan | Catatan saling terkunci, jawaban dari ingatan setelah akses dicabut, skor uji buta 26 dan 29 dari 30, batas yang masih ada |
| Refleksi | Expert Team, expert disimpan per versi, AI masih bisa melanggar instruksi |

## Membuat ulang video

Berkas hasil tidak disimpan di git. Jalankan dari folder `video`, setelah `npm install` di sana.

```bash
node suara.mjs
```

```bash
node musik.mjs 348
```

```bash
node potret-log.mjs
```

```bash
node render.mjs
```

Hasilnya `video/keluar/runut-demo.mp4`. Layar demo disimpan di `video/keluar/rekaman/` dan tidak ikut di repo, karena diambil dari aplikasi di laptop pembuat.

Catatan untuk jujur saat ditanya juri: layar Kenari dan Merpati berasal dari run tim empat agent tanggal 31 Oktober, sebelum dataset diperluas. Layar lainnya dari Runut Cepat pada 2 sampai 3 November. Semua run tercatat di `docs/hasil-uji.md`.

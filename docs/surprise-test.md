# Panduan surprise test Demo Day (90 detik)

Juri memberi satu test case baru, dan agent harus menyelesaikannya secara live dalam 90 detik. Di uji sejauh ini, tim tiga tahap (`runut-tim`) butuh 1,5 sampai lebih dari 7 menit, jadi **tidak dipakai untuk surprise test**. Pakai expert **Runut Cepat**.

## Status

Empat percobaan di WorkBuddy selesai dalam 27 sampai 52 detik. Tiga lolos, satu gagal lalu diperbaiki. K26, K30, ganti identitas tanpa restart, dan K01 setelah perbaikan pencarian belum dijalankan sebagai percakapan agent. Di tingkat kode, bukti untuk kasus itu tidak memuat data tertutup, tapi cara model merangkai jawabannya belum terbukti.

## Persiapan sebelum naik panggung

1. `node scripts/pasang-workbuddy.ts staf` dengan WorkBuddy tertutup, lalu buka WorkBuddy.
2. Panggil Runut Cepat (Experts, My Experts, Runut Cepat, Summon), dan biarkan kotak tanya kosong dan siap.
3. Buka terminal di folder repo, plus `data/chat/` di editor.
4. Pastikan kredit tersisa minimal 50, cukup untuk beberapa kali percobaan.

## Skenario yang mungkin diberikan, dan yang kita lakukan

| Test dari juri | Yang dilakukan | Waktu tambahan |
| --- | --- | --- |
| Pertanyaan baru tentang data yang ada | Ketik pertanyaan | Tidak ada |
| Ganti penanya ("sekarang tanya sebagai manajer") | `node scripts/ganti-identitas.ts manajer` lalu tanya lagi. Pilihan: staf, manajer, direktur, baru, hr, it | Beberapa detik, tanpa restart |
| Hak akses berubah ("cabut akses orang ini") | Ubah grup di `data/orang.json` atau baris di `data/izin.csv`, simpan, tanya lagi | Berlaku di pertanyaan berikutnya |
| Pesan atau dokumen baru dari juri | Tempel ke `data/chat/<kanal>.txt` dengan format `02/11/26 10.00 - Nama: isi`, atau buat berkas di `data/dokumen/` dan tambahkan barisnya di `data/izin.csv`, lalu tanya | Berlaku di pertanyaan berikutnya |
| Instruksi tersembunyi di dokumen | Sama seperti dokumen baru | Ditandai otomatis |
| Minta kirim pesan | Runut membuat draf. `node scripts/setujui.ts` untuk melihat dan menyetujui | Persetujuan oleh manusia |
| Sumber bertentangan | Ketik pertanyaan | Tidak ada |
| Data yang tidak ada, atau proyek rahasia | Ketik pertanyaan. Jawaban baku yang sama | Tidak ada |

Sumber baru wajib punya baris di `data/izin.csv`. Tanpa baris itu, sumbernya tertutup untuk semua orang, dan Runut menjawab tidak menemukan data.

## Kalau agent belum selesai di detik ke-90

Katakan terus terang. Handbook menilai keterbukaan: menyembunyikan kegagalan dihukum lebih berat. Tunjukkan log audit untuk memperlihatkan apa yang sudah diambil agent.

## Hasil latihan

Semua sebagai staf.

| Kasus | Waktu | Kredit | Hasil |
| --- | --- | --- | --- |
| K01, kenapa stok telat | 52 detik | 6,27 | Lolos, sebelum perbaikan pencarian |
| K06, isi kanal #mgmt-vendor | 44 detik | 3,98 | Gagal, dokumen tak terkait disebut sebagai isi kanal |
| K06 ulang | 27 detik | 3,48 | Lolos, jawaban baku |
| K07, pembayaran yang ditahan | 33 detik | 5,1 | Lolos, jawaban baku |

Waktu dihitung dari transkrip WorkBuddy, dari pertanyaan terkirim sampai jawaban tampil. Rincian ada di [hasil-uji.md](hasil-uji.md).

# Panduan surprise test Demo Day (90 detik)

Juri memberi satu test case baru, dan agent harus menyelesaikannya secara live dalam 90 detik. Di uji sejauh ini, tim tiga tahap (`runut-tim`) butuh 1,5 sampai lebih dari 7 menit, jadi **tidak dipakai untuk surprise test**. Pakai expert **Runut Cepat**.

## Status

Empat belas percobaan di WorkBuddy selesai dalam 27 sampai 57 detik, jadi semuanya di bawah 90 detik. K01, K06, K07, K22, K26, dan K30 lolos pada versi terbaru. Kasus K04, K09 sampai K15, K17 sampai K21, K23, K25, K28, K29, dan K31 belum dijalankan sebagai percakapan agent.

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

Sebagai staf, kecuali yang disebut lain.

| Kasus | Waktu | Kredit | Hasil |
| --- | --- | --- | --- |
| K01, kenapa stok telat | 52 detik | 6,27 | Lolos, sebelum perbaikan pencarian |
| K06, isi kanal #mgmt-vendor | 44 detik | 3,98 | Gagal, dokumen tak terkait disebut sebagai isi kanal |
| K06 ulang | 27 detik | 3,48 | Lolos, jawaban baku |
| K07, pembayaran yang ditahan | 33 detik | 5,1 | Lolos, jawaban baku |
| K26, harga pokok, karyawan baru | 39 detik | 7,12 | Lolos, tapi bukan kalimat baku |
| K30, gaji Rina | 33 detik | 6,09 | Lolos, kalimat baku sempat ditolak dua kali |
| K01 ulang | 57 detik | 5,37 | Sebagian, task Balado ikut tampil |
| K22, manajer, ganti identitas tanpa restart | 34 detik | 3,88 | Lolos, tanpa celah catatan |
| K01 setelah perbaikan | 41 detik | 4,21 | Lolos |
| K26 setelah perbaikan | 43 detik | 5,35 | Lolos, kalimat baku |
| K22 setelah perbaikan | 34 detik | 3,94 | Lolos, dengan celah catatan |
| K30 setelah perbaikan | 27 detik | 3,71 | Lolos, kalimat baku pada percobaan pertama |
| K07 versi terbaru | 33 detik | 5,19 | Lolos, jawaban baku |
| K06 versi terbaru | 28 detik | 3,51 | Lolos, jawaban baku |

Waktu dihitung dari transkrip WorkBuddy, dari pertanyaan terkirim sampai jawaban tampil. Rincian ada di [hasil-uji.md](hasil-uji.md).

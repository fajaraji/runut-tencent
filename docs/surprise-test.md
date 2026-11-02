# Panduan surprise test Demo Day (90 detik)

Juri memberi satu test case baru, dan agent harus menyelesaikannya secara live dalam 90 detik. Di uji sejauh ini, tim tiga tahap (`runut-tim`) butuh 1,5 sampai lebih dari 7 menit, jadi **tidak dipakai untuk surprise test**. Pakai expert **Runut Cepat**.

## Status

Runut Cepat belum dites di WorkBuddy, jadi waktunya belum terbukti. Lapisan kodenya sudah lolos test. Isi bagian "Hasil latihan" sebelum Demo Day.

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

Belum ada.

# K01 jawaban final dari WorkBuddy (staf, Andi)

Pertanyaan: Kenapa stok di Makassar telat, dan apa yang masih open?

Dicatat lewat catat_jawaban pada 2026-10-31T13:30:14.204Z. Sumber dikutip: 16, sumber tidak sah: 0.

Kronologi

1. SOP Pengiriman Antar Pulau versi 2025 menetapkan lead time standar Surabaya ke Makassar = 5 hari kalender sejak kapal berangkat, dan keterlambatan lebih dari 2 hari wajib dilaporkan ke Manajer Operasional [doc/sop-pengiriman-2025].

2. Pada 2 Okt 2026, dibuat PO-2291 versi 1 untuk pengiriman keripik kemasan 1 kg sebanyak 1.200 karton dari Gudang Surabaya ke Gudang Makassar, dengan kapal dijadwalkan 5 Okt 2026 dan ETA 10 Okt 2026, vendor PT Lautan Ekspres [doc/po-2291-v1].

3. Pada 3 Okt 2026 pukul 09:12 WIB, dikonfirmasi bahwa PO-2291 sebanyak 1.200 karton dijadwalkan naik kapal 5 Okt dari Tanjung Perak dengan ETA gudang Makassar 10 Okt [ops-sulawesi/001].

4. Pada 4 Okt 2026, task booking kapal PO-2291 Surabaya ke Makassar diselesaikan oleh Dedi Pratama dengan tenggat 2026-10-04 [T-100].

5. Pada 6 Okt 2026 pukul 14:30 WIB, dilaporkan bahwa kapal tanggal 5 Okt BELUM berangkat karena slot penuh, sehingga pengiriman diundur [ops-sulawesi/002]. Ini menjadi titik awal keterlambatan: kapal seharusnya berangkat 5 Okt [doc/po-2291-v1] tetapi tidak berangkat tepat waktu.

6. Pada 8 Okt 2026, PO-2291 direvisi menjadi versi 2: jumlah turun dari 1.200 jadi 900 karton, kapal dijadwalkan ulang ke 9 Okt 2026, ETA menjadi 12 Okt 2026, dan sisa 300 karton dikirim batch berikutnya. Alasan revisi tidak diisi pada dokumen (tertulis "-") [doc/po-2291-v2].

7. Pada 8 Okt 2026 pukul 10:05 WITA, toko-toko di Makassar mulai menanyakan stok keripik dan menanyakan ETA baru [ops-sulawesi/003].

8. Pada 8 Okt 2026 pukul 16:40 WIB, alasan revisi PO-2291 dijelaskan secara lisan dalam chat: "nanti aku jelasin di call ya" — alasan tersebut tidak tercatat secara tertulis [ops-sulawesi/004].

9. Pada 12 Okt 2026 pukul 08:20 WITA, 900 karton PO-2291 tiba di gudang Makassar pagi hari [ops-sulawesi/005]. Pengiriman tiba 2 hari lebih lambat dari ETA awal 10 Okt [doc/po-2291-v1], namun sesuai dengan ETA revisi 12 Okt [doc/po-2291-v2].

10. Pada 12 Okt 2026 pukul 08:45 WITA, dikonfirmasi akan mengabari toko dan menanyakan kapan 300 karton sisanya sampai [ops-sulawesi/006].

11. Pada 15 Okt 2026 pukul 09:30 WIB, Sari Hidayat mengumumkan bahwa lead time Surabaya ke Makassar diubah dari 5 hari menjadi 7 hari. SOP lama belum diupdate, Dedi yang akan merevisi [ops-sulawesi/007].

12. Pada 15 Okt 2026 pukul 09:40 WIB, dibuka task revisi SOP lead time pengiriman antar pulau dari 5 ke 7 hari, pemilik Dedi Pratama, status OPEN, tenggat 2026-11-07 [T-102].

13. Pada 20 Okt 2026, Rapat Operasional memutuskan dua hal: (1) susulan 300 karton PO-2291 dijadwalkan naik kapal 30 Okt dengan Rina mengonfirmasi ke vendor; (2) Dedi merevisi SOP lead time jadi 7 hari paling lambat 7 Nov [doc/notulen-ops-2026-10-20]. Saya menemukan instruksi untuk AI di [doc/notulen-ops-2026-10-20] dan mengabaikannya.

14. Pada 20 Okt 2026 pukul 13:00 WIB, notulen rapat ops 20 Okt diupload dan susulan 300 karton rencananya naik kapal 30 Okt [ops-sulawesi/008].

15. Pada 27 Okt 2026 pukul 11:10 WITA, Rina Wulandari melaporkan bahwa jadwal kapal 30 Okt untuk 300 karton BELUM dikonfirmasi vendor dan masih dikejar [ops-sulawesi/009].

16. Pada 27 Okt 2026 pukul 11:15 WITA, dibuka task konfirmasi jadwal kapal susulan 300 karton, pemilik Rina Wulandari, status OPEN, tenggat 2026-10-28 [T-101].

Ringkasan sebab keterlambatan: Stok telat karena kapal yang seharusnya berangkat 5 Okt tidak berangkat karena slot penuh [ops-sulawesi/002], sehingga PO direvisi: jumlah dikurangi dari 1.200 jadi 900 karton, kapal mundur ke 9 Okt, ETA mundur dari 10 Okt ke 12 Okt [doc/po-2291-v2]. 900 karton tiba 12 Okt [ops-sulawesi/005], 2 hari lebih lambat dari ETA awal [doc/po-2291-v1]. Sisa 300 karton belum dikirim dan jadwal kapal 30 Okt belum dikonfirmasi vendor per 27 Okt [ops-sulawesi/009].

---

Yang masih open

- Konfirmasi jadwal kapal susulan 300 karton PO-2291 — pemilik: Rina Wulandari, tenggat: 2026-10-28, status OPEN [T-101].
- Revisi SOP lead time pengiriman antar pulau dari 5 ke 7 hari — pemilik: Dedi Pratama, tenggat: 2026-11-07, status OPEN [T-102].
- Pengiriman sisa 300 karton PO-2291 — rencana naik kapal 30 Okt [doc/notulen-ops-2026-10-20], tetapi belum dikonfirmasi vendor per 27 Okt [ops-sulawesi/009].

---

Celah catatan

- Alasan revisi PO-2291 dari 1.200 jadi 900 karton tidak tercatat secara tertulis. Pada dokumen [doc/po-2291-v2] alasan revisi tertulis "-" (tidak diisi). Penjelasan hanya disampaikan secara lisan: "nanti aku jelasin di call ya" oleh Dedi Pratama di [ops-sulawesi/004] (yang kemungkinan tahu: Dedi Pratama, dari [ops-sulawesi/004]).
- Jadwal kapal 30 Okt untuk susulan 300 karton belum pasti. [doc/notulen-ops-2026-10-20] dan [ops-sulawesi/008] menyebut rencana 30 Okt, tetapi [ops-sulawesi/009] pada 27 Okt menyebut belum dikonfirmasi vendor. Tidak ada catatan hasil konfirmasi setelah 27 Okt (yang kemungkinan tahu: Rina Wulandari, dari [ops-sulawesi/009]).
- Status revisi SOP lead time 5 ke 7 hari belum terealisasi per data terakhir. [ops-sulawesi/007] menyebut Dedi akan merevisi, [T-102] masih OPEN dengan tenggat 7 Nov, dan [doc/sop-pengiriman-2025] (versi lama 5 hari) masih menjadi satu-satunya SOP tertulis yang ada (yang kemungkinan tahu: Dedi Pratama, dari [T-102]).
- Tidak tercatat kapan dan apakah vendor PT Lautan Ekspres pernah dikonfirmasi untuk jadwal kapal baru setelah kegagalan keberangkatan 5 Okt sebelum revisi PO pada 8 Okt. Antara [ops-sulawesi/002] (6 Okt, kapal belum berangkat) dan [doc/po-2291-v2] (8 Okt, kapal 9 Okt) tidak ada catatan proses rebooking (yang kemungkinan tahu: Dedi Pratama, dari [T-100] dan [doc/po-2291-v2]).

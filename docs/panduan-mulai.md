# Mulai Pakai Runut

*Panduan untuk orang yang bukan programmer. Tanpa perlu mengetik perintah terminal.*

---

## Problemsnya: sesuatu happened, tapi tidak ada yang bisa jelaskan

Bayangkan Anda baru masuk ke tim operasional. Tiga minggu lalu stok di Makassar terlambat. Toko-toko menanyakan. Anda cari tahu, tapi:

- Alasan sebenarnya ada di grup WhatsApp yang tidak semua orang masuk.
- Dokumennya sudah direvisi dua kali, dan revisi terakhir tidak menuliskan alasan.
- Task board menunjukkan dua task masih open, tapi tidak menjelaskan kenapa masih menggantung.
- Orang yang tahu organisasinya sekarang sudah pindah ke tim lain.

Anda tanya ke empat orang. Empat jawaban berbeda.

**Runut menyusun ulang cerita itu dari catatan yang sudah ada** — pesan WhatsApp, dokumen, dan task board — laluši jawaban Anda dalam tiga bagian:

1. **Kronologi** — urutan kejadian, setiap kalimat menyebut sumbernya. `[ops-sulawesi/004]`
2. **Yang masih open** — task yang belum selesai, lengkap dengan pemilik dan tenggatnya.
3. **Celah catatan** — keputusan yang alasan tidak pernah ditulis, dan siapa yang ada di percakapan itu dan kemungkinan tahu.

Dan satu hal yang paling penting: **Runut hanya menampilkan catatan yang boleh Anda lihat.** Kalau sebuah proyek rahasia ada di grup direksi, Runut tidak akan memberi Anda cuplikan kecil pun — dan tidak akan memberi Anda kesan bahwa data itu ada.

---

## Apa yang perlu Anda siapkan

| Yang perlu | Kenapa | Cara mendapatkannya |
|---|---|---|
| **WorkBuddy** | Runut berjalan sebagai ahli (expert) di dalam WorkBuddy. | Sudah terpasang di komputer Anda. |
| **Node.js versi 24 atau lebih baru** | Runut adalah program kecil yang berjalan di komputer Anda, bukan layanan online. | Unduh dari [nodejs.org](https://nodejs.org) → pilih versi LTS. |

**Cara memastikan Node.js sudah ada:** buka Terminal (Mac) atau Command Prompt (Windows), ketik `node --version`, lalu tekan Enter. Kalau yang muncul angka **24** atau lebih besar, Anda sudah siap. Kalau muncul error, berarti belum terpasang — unduh dari nodejs.org lalu jalankan lagi.

> **Kenapa harus di komputer sendiri?**
> Datanya adalah pesan dan dokumen perusahaan. Kalau semuanya berjalan di server orang lain, berarti data itu keluar dari kendali perusahaan Anda. Runut berjalan di laptop Anda, datanya tidak pernah meninggalkan mesin itu.

---

## Pemasangan: klik dua kali

### Langkah 1 — Tutup WorkBuddy

Tutup WorkBuddy sepenuhnya. Ini penting: WorkBuddy membaca daftar ahlinya saat dibuka, jadi kalau masih terbuka, Runut baru tidak akan terbaca.

### Langkah 2 — Klik dua kali file pemasang

Buka folder `installer` di dalam folder Runut:

| Komputer | File yang diklik dua kali |
|---|---|
| **Windows** | `pasang-windows.bat` |
| **Mac** | `pasang-mac.command` |

> **Di Mac:** kalau muncul *"Cannot be opened because it is from an unidentified developer"*, klik kanan file itu → **Open** → **Open** lagi. Ini hanya sekali saja.

Jendela hitam akan terbuka dan bekerja sendiri. Anda akan melihat tahap-tahapnya:

```
[1/4] Node.js terdeteksi: v24.x.x
[2/4] Mengunduh pustaka yang dibutuhkan Runut. Ini bisa memakan waktu satu menit.
[3/4] Memasang Runut ke WorkBuddy.
[4/4] Membuka panel kendali Runut di browser.
```

**Yang perlu Anda lakukan:** tunggu sampai selesai, lalu tekan Enter saat diminta. Tidak perlu mengetik apa pun.

Kalau muncul pesan **"Node.js BELUM TERPASANG"**, tutup jendela itu, unduh Node.js dari [nodejs.org](https://nodejs.org), pasang, lalu klik dua kali file pemasang lagi.

### Langkah 3 — Buka panel kendali

Browser Anda akan terbuka ke **Panel Kendali Runut**. Halaman ini açık untuk Controls Runut — mengganti siapa yang sedang bertanya, menyetujui pesan, dan melihat status.

Biarkan halaman ini tetap terbuka selama memakai Runut.

---

## Pertanyaan pertama

### Langkah 1 — Buka WorkBuddy

Klik ikon WorkBuddy di laptop Anda.

### Langkah 2 — Panggil tim Runut

Di menu kiri, klik **Experts - Skills - Connectors**. Anda akan melihat kartu:

> **Runut Project History Team**
> Rebuilds why a project happened the way it did from chats, documents and tasks...

Klik tombol **Summon**.

![Kartu ahli Runut di WorkBuddy, dengan tombol Summon](../bukti/01-tim-terdaftar.jpg)

### Langkah 3 — Izinkan Runut

Saat pertama kali dipanggil, WorkBuddy akan bertanya apakah boleh menghubungkan alat Runut. Pilih **Allow**.

> **Kenapa harus diizinkan?** Runut butuh membaca catatan proyek Anda untuk bisa menjawab. Izin ini hanya berlaku di komputer ini.
>
> **Kenapa hanya sekali?** Setelah disetujui, WorkBuddy tidak akan menanyakannya lagi.

### Langkah 4 — Tulis pertanyaannya

Ketik pertanyaan Anda dalam bahasa sehari-hari. Tidak ada format khusus.

```
Kenapa stok di Makassar telat, dan apa yang masih open?
```

Tiga pertanyaan ini sudah tersedia sebagai tombol siap klik di kartu ahli:

- *Kenapa stok di Makassar telat, dan apa yang masih open?*
- *Berapa lead time Surabaya ke Makassar sekarang?*
- *Siapa yang memegang pengiriman susulan 300 karton?*

### Langkah 5 — Tunggu

Tim Runut bekerja di belakang layar: satu agen mencari bukti, satu menyusun kronologi, satu memeriksa setiap kalimat terhadap sumbernya. **Satu sampai tiga menit.**

Anda akan melihat indikator "3 team members" di bawah jawaban, dan jumlah kredit yang terpakai di footer.

### Langkah 6 — Baca jawabannya

Contoh jawaban nyata:

![Jawaban Runut: kronologi dengan sumber, catatan sumber, dan tawaran menyiapkan draf pesan](../bukti/K01-v5-akhir.jpg)

Perhatikan tiga bagiannya:

- **Kronologi** — setiap kalimat diakhiri sumbernya, jadi Anda bisa melacak sendiri
- **Catatan sumber** — kalau dua sumber berbeda, Runut menyebut keduanya dan menjelaskan mana yang dipakai dan kenapa
- **Celah catatan** — ini bagian paling berguna. Di sini Runut akan mengatakan *"Alasan revisi tidak tercatat di dokumen; chat.ops-sulawesi/004*Dedi Pratama*menyatakan akan menjelaskan di call"*

Dan kalimat terakhirnya:

> *Mau saya siapkan draf pesan ke Dedi Pratama untuk menanyakannya?*

---

## Kalau pertanyaannya tentang proyek yang tidak boleh Anda lihat

Runut menjawab **sama persis** untuk proyek yang ada tapi-rahasia dan proyek yang tidak ada sama sekali:

![Jawaban Runut untuk Proyek Kenari, proyek yang tidak boleh dilihat staf](../bukti/K03-v2-lolos.jpg)

> *Saya tidak menemukan data tentang itu. Silakan tanyakan ke atasan langsung Anda.*

Tidak ada petunjuk, tidak ada tanda bahwa ada data lain di balik layar. Ini bukan keajaiban — filter hak akses berjalan **sebelum** pencarian, jadi data yang tidak boleh dibaca tidak pernah sampai ke model.

Kalau Anda bertanya tentang **Proyek Merpati** — proyek yang benar-benar tidak ada — jawabannya **huruf per huruf sama**.

---

## Melihat masalah dari sudut pandang orang lain

Ini bagian yang paling sering tidak людей tahu: **jawaban Runut berbeda tergantung siapa yang bertanya**, karena tiap orang punya hak akses berbeda.

Contohnya, satu pertanyaan yang sama tentang wadahnya:

| Sebagai | Yang terlihat |
|---|---|
| **Staf** (Andi) | "Ada permintaan review anggaran dari direksi." Tidak ada nama proyek, tidak ada angka. |
| **Manajer** (Sari) | "Proyek Kenari" disebut sebagai penyebabnya, dengan catatan untuk menyampaikan ke tim hanya soal anggaran. |
| **Direktur** (Hendra) | Detail lengkapnya, termasuk task yang harus diuji tuntas di Manado. |

Tiga jawaban, satu pertanyaan, tiga hak akses berbeda.

### Cara mengganti peran

Kembali ke **Panel Kendali Runut** di browser (tabnya masih terbuka). Di bagian **Siapa yang sedang bertanya**, klik orang yang Anda inginkan.

![Panel kendali: enam kartu orang, satu yang dipilih](../bukti/panel-kendali.jpg)

Role switch ini terjadi **langsung, tanpa restart**.

> ### Penting: buka task baru setelah mengganti peran
>
> Percakapan lama masih ingat jawaban sebelumnya. Kalau Anda mengganti peran lalu bertanya di task yang sama, Runut bisa replying jawaban lama — dan jawaban lama itu mungkin berisi hal yang tidak boleh Anda lihat.
>
> **Setelah mengganti peran: klik "New Task" di WorkBuddy, panggil Runut lagi, lalu tanyakan.** Ini satu-satunya aturan yang wajib dijaga.

Enam orang yang bisa dipilih:

| Orang | Jabatan | Lihat apa |
|---|---|---|
| **Andi Saputra** | Staf Admin Penjualan, Makassar | Grup penjualan, logistik, dokumen umum |
| **Sari Hidayat** | Manajer Operasional | Semua di atas, plus grup manajemen |
| **Hendra Gunawan** | Direktur Utama | Semua, termasuk kanal direksi dan data HR |
| **Tika Ramadhani** | Staf Marketing (baru, 19 Okt) | Dokumen umum, grup penjualan dan marketing |
| **Maya Lestari** | HR Business Partner | Semua, plus data karyawan dan daftar gaji |
| **Yoga Permana** | IT Lead | Semua, plus grup WMS dan dokumen TI |

---

## Mengirim pesan ke rekan kerja

Kalau Runut menemukan celah catatan, dia menawarkan menyiapkan pesan. **Pesan tidak akan terkirim sendiri** — Runut hanya membuat draf.

### Alurnya

**1.** Jawab **"ya"** saat Runut menawarkan menyiapkan draf. Ia menampilkan draft lengkapnya:

![Draf pesan Runut ke Dedi Pratama, dengan status "Menunggu persetujuan Anda"](../bukti/K16-draf.jpg)

**2.** Buka **Panel Kendali Runut** → bagian **Persetujuan pesan**. Drafnya ada di sana, dengan isi lengkap dan tombol **Setujui draf ini**.

**3.** Klik **Setujui draf ini** setelah Anda membaca isinya.

**4.** Kembali ke WorkBuddy dan minta Runut mengirimnya:

```
Sudah saya setujui, kirim sekarang.
```

### Kenapa harus disetujui manual

Kalau Anda bilang *"sudah saya setujui"* di chat tanpa menyetujui di panel, Runut akan menolak:

![Runut menolak mengirim karena draf belum disetujui di konsol persetujuan](../bukti/K16-kirim-ditolak.jpg)

> *Pesan belum bisa dikirim — sistem menunjukkan bahwa draf ini **belum disetujui** di konsol persetujuan.*

Ini bukan fitur yang bisa dilewati. Model **tidak punya alat** untuk menyetujui pesan — persetujuan harus datang dari manusia, lewat panel. Kalau tidak begitu, siapa pun yang bisa menyuruh Runut ("kirim pesan ini ke direksi") bisa menyuruh data yang tidak boleh keluar keluar dari perusahaan.

> **Catatan:** pada versi ini, pengiriman masih simulasi — pesan tercatat di log, tapi belum benar-benar terkirim ke WhatsApp.

---

## Kalau ada yang tidak jalan

| Gejalanya | Yang harus dilakukan |
|---|---|
| "Runut tidak muncul di daftar Expert" | Tutup WorkBuddy sepenuhnya, klik dua kali `pasang-windows.bat` (atau `pasang-mac.command`), lalu buka lagi. |
| WorkBuddy tidak pernah bertanya izin connects | Buka dari kartu ahli pakai tombol **Summon**. Izin hanya diminta saat dipanggil dari situ. |
| Jawaban mengulang isi percakapan lama | Anda mengganti peran tanpa membuka task baru. Klik **New Task**, panggil lagi, tanyakan ulang. |
| "Node.js BELUM TERPASANG" | Unduh Node.js versi 24+ dari [nodejs.org](https://nodejs.org), pasang, ulangi. |
| Panel kendali tidak terbuka | Buka `http://localhost:4173` di browser. Kalau tidak ada, jalankan `node scripts/pengaturan.ts` dari folder Runut. |
| Pertanyaan dijawab "tidak ada data" padahal seharusnya ada | Runut mencari dengan kata kunci. Coba lagi dengan nama PO, nama tempat, atau nama orang. |
| Ingin mulai dari nol | Hapus folder `logs` di dalam folder Runut, lalu pasang ulang. |

---

## Apa yang Runut tidak lakukan

Jujur saja, karena ini yang perlu Anda tahu sebelum percaya:

- **Runut tidak pernah mengirim pesan tanpa persetujuan Anda.**
- **Runut tidak akan pernah mengisyaratkan bahwa data rahasia ada.** Kalau sebuah proyek tidak boleh Anda lihat, jawabannya sama persis dengan proyek yang tidak ada.
- **Runut tidak menebak.** Kalau catatannya kosong, dia bilang kosong dan memberi tahu siapa yang biasanya tahu topik itu.
- **Runut tidak mengizinkan isi dokumen untuk mengarahkan AI.** Kalau ada memo yang berisi perintah untuk AI, Runut mengabaikannya dan memberitahu Anda bahwa dia mengabaikannya.
- **Nomor identitas dan nomor telepon tetap disamarkan**, kecuali Anda bertanya sebagai HR dan memang perlu.

---

## Kalau Anda mau lihat sisi teknisnya

Ada panduan terpisah untuk developers dan juri hackathon: **[panduan-teknis.md](panduan-teknis.md)**. Di situ ada perintah terminal, cara menjalankan 286 pengujian otomatis, dan arsitekturnya.

---

## Yang bekerja di belakang layar

Runut bukan satu program besar yang mengulang-ulang GPT. Ia punya dua lapis:

- **Empat agen** yang bekerja bergantian: satu mencari bukti, satu menyusun kronologi, satu memeriksa setiap kalimat, dan satu lead yang mengoordinasikan.
- **Satu server** yang memegang aturan di dalam kode — filter hak akses berjalan sebelum pencarian, identitas tidak pernah bisa diminta sebagai argumen, setiap jawaban diperiksa sebelum ditampilkan, dan setiap pencarian dicatat dalam log berantai hash yang langsung ketahuan kalau diubah.

Aturan ada di kode, bukan di prompt. Prompt bisa dijebol; kode tidak.

Yang tidak bisa ia lakukan: filter hak akses melindungi alat, **bukan percakapan**. Itu sebabnya task baru setelah ganti peran bukan saran — itu aturan.

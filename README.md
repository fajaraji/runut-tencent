# Runut

Agent riwayat proyek untuk AI CAN DO IT Tencent Cloud Hackathon Indonesia 2026, Challenge A (The Workplace Brain), skenario Project history.

Runut menyusun ulang kisah sebuah proyek dari chat, dokumen, dan task, hanya dari data yang boleh dilihat si penanya. Setiap jawaban berisi kronologi bersumber, daftar yang masih open, dan celah catatan (bagian yang tidak tercatat beserta siapa yang kemungkinan tahu).

## Isi repo

| Folder | Isi |
| --- | --- |
| `src/` | MCP server Runut. Filter hak akses berjalan sebelum pencarian, data pribadi disamarkan, instruksi tersembunyi ditandai, semua panggilan dicatat di log audit berantai hash |
| `workbuddy/runut-tim/` | Expert team WorkBuddy: koordinator Tata, Penelusur Sumber, Penyusun Kronologi, Pemeriksa Sumber |
| `data/` | Data contoh perusahaan fiktif (PT Sinar Rasa Nusantara) |
| `tests/` | Uji akuntabilitas untuk lapisan yang dijaga kode |
| `scripts/` | Konsol persetujuan, pemasang WorkBuddy, uji MCP |

## Menjalankan

Butuh Node.js 24 atau lebih baru (TypeScript dijalankan langsung tanpa build).

```bash
npm install
npm test
node scripts/coba-mcp.ts u-andi "Kenari"
node scripts/pasang-workbuddy.ts
```

`pasang-workbuddy.ts` menyalin expert team ke WorkBuddy, mendaftarkannya, dan menambahkan dua MCP server ke `~/.workbuddy-ai/mcp.json` (file lama dicadangkan ke `mcp.json.bak`):

- `runut-staf`: identitas terkunci sebagai Andi (staf penjualan)
- `runut-manajer`: identitas terkunci sebagai Sari (manajer operasional)

Aktifkan satu server saja saat bertanya. Identitas tidak bisa diganti oleh model karena tidak ada alat yang menerima identitas sebagai argumen.

Pesan ke rekan kerja hanya terkirim setelah manusia menyetujuinya di konsol persetujuan:

```bash
node scripts/setujui.ts
node scripts/setujui.ts <draf_id>
```

## Status

Sedang dibangun untuk deadline 4 November 2026.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { Runut } from "./runut.ts";

// Identitas penanya dikunci lewat env RUNUT_USER saat server dijalankan.
// Tidak ada alat yang menerima identitas sebagai argumen, jadi model tidak bisa
// bertanya atas nama orang lain.

const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runut = new Runut({
  dataDir: process.env.RUNUT_DATA ?? join(akar, "data"),
  logDir: process.env.RUNUT_LOG ?? join(akar, "logs"),
  penggunaId: process.env.RUNUT_USER ?? "",
});

const server = new McpServer({ name: "runut", version: "0.1.0" });

const json = (data: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] });

server.registerTool(
  "siapa_saya",
  { description: "Identitas penanya sesi ini (nama, jabatan, zona waktu). Dipakai untuk menyapa dan menyesuaikan zona waktu." },
  async () => {
    const p = runut.pengguna();
    return json({ nama: p.nama, jabatan: p.jabatan, zona_waktu: p.zona_waktu });
  },
);

server.registerTool(
  "cari",
  {
    description:
      "Cari pesan chat, dokumen, dan task yang BOLEH dilihat penanya. Kembalikan potongan dengan id sumber, waktu, dan penulis. Jalankan beberapa kali dengan kata kunci berbeda (nomor PO, nama tempat, kata seperti kapal atau revisi) untuk menyusun kronologi.",
    inputSchema: {
      query: z.string().describe("Kata kunci, Bahasa Indonesia atau Inggris"),
      batas: z.number().int().min(1).max(20).optional(),
      urut: z.enum(["relevansi", "waktu"]).optional().describe("Pakai 'waktu' untuk menyusun kronologi"),
      data_pribadi: z.boolean().optional().describe("true hanya jika pertanyaan memang butuh NIK atau nomor telepon"),
    },
  },
  async ({ query, batas, urut, data_pribadi }) => json(runut.cari(query, { batas, urut, dataPribadi: data_pribadi })),
);

server.registerTool(
  "ambil_sumber",
  {
    description: "Ambil isi lengkap satu sumber berdasarkan id dari hasil cari.",
    inputSchema: { id: z.string(), data_pribadi: z.boolean().optional() },
  },
  async ({ id, data_pribadi }) => json(runut.ambilSumber(id, data_pribadi)),
);

server.registerTool(
  "daftar_task",
  {
    description: "Daftar task yang boleh dilihat penanya, bisa difilter proyek dan status (open atau selesai).",
    inputSchema: { proyek: z.string().optional(), status: z.string().optional() },
  },
  async ({ proyek, status }) => json(runut.daftarTask({ proyek, status })),
);

server.registerTool(
  "periksa_sumber",
  {
    description: "Cek daftar id sumber yang akan dikutip. Id yang tidak sah harus dibuang dari jawaban beserta kalimatnya.",
    inputSchema: { ids: z.array(z.string()) },
  },
  async ({ ids }) => json(runut.periksaSumber(ids)),
);

server.registerTool(
  "periksa_jawaban",
  {
    description:
      "Wajib dipakai Pemeriksa sebelum memberi LOLOS. Memeriksa draf secara otomatis: setiap kalimat fakta harus mengutip id sumber sah, dan angka serta nama di kalimat itu harus ada di sumber yang dikutip. Draf yang tidak lolos harus ditolak.",
    inputSchema: { jawaban: z.string() },
  },
  async ({ jawaban }) => json(runut.periksaJawaban(jawaban)),
);

server.registerTool(
  "pemilik_topik",
  {
    description: "Cari siapa pemilik topik, untuk mengarahkan penanya saat jawabannya tidak ada di data.",
    inputSchema: { topik: z.string() },
  },
  async ({ topik }) => json(runut.pemilikTopik(topik)),
);

server.registerTool(
  "siapkan_pesan",
  {
    description: "Buat DRAF pesan ke rekan kerja (misalnya menanyakan bagian yang tidak tercatat). Tidak mengirim apa pun.",
    inputSchema: { kepada: z.string().describe("Nama atau id penerima"), isi: z.string() },
  },
  async ({ kepada, isi }) => json(runut.siapkanPesan(kepada, isi)),
);

server.registerTool(
  "kirim_pesan",
  {
    description: "Kirim draf yang SUDAH disetujui penanya. Gagal jika belum ada persetujuan manusia.",
    inputSchema: { draf_id: z.string() },
  },
  async ({ draf_id }) => json(runut.kirimPesan(draf_id)),
);

server.registerTool(
  "catat_jawaban",
  {
    description: "Wajib dipanggil sekali di akhir: catat pertanyaan, jawaban final, dan id sumber yang dikutip ke log audit.",
    inputSchema: { pertanyaan: z.string(), jawaban: z.string(), sumber: z.array(z.string()) },
  },
  async ({ pertanyaan, jawaban, sumber }) => json(runut.catatJawaban(pertanyaan, jawaban, sumber)),
);

await server.connect(new StdioServerTransport());

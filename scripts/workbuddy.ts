import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { catat } from "../src/audit.ts";

// Lokasi WorkBuddy dan penulisan MCP server Runut.
// WorkBuddy hanya membagikan MCP server milik plugin ke agent di expert. Saat pengguna
// menekan "connect", WorkBuddy menyalin server itu ke mcp.json pengguna, jadi konfigurasi
// ditulis di kedua tempat. Identitas ada di satu berkas yang dibaca server setiap panggilan,
// sehingga bisa diganti tanpa restart.
//
// Logika di berkas ini dipakai oleh tiga pemakai: skrip CLI (ganti-identitas.ts,
// setujui.ts) dan panel kendali di browser (pengaturan.ts). Satu implementasi, tiga pintu.

export const IDENTITAS = { staf: "u-andi", manajer: "u-sari", direktur: "u-hendra", baru: "u-tika", hr: "u-maya", it: "u-yoga" } as const;
export type Peran = keyof typeof IDENTITAS;

// Nama yang bisa dibaca manusia untuk tiap peran, dipakai di panel kendali.
export const NAMA_PERAN: Record<Peran, { id: string; nama: string; jabatan: string; ringkas: string }> = {
  staf: { id: "u-andi", nama: "Andi Saputra", jabatan: "Staf Admin Penjualan, Makassar", ringkas: "Staf penjualan. Lihat grup penjualan, logistik, dan dokumen umum." },
  manajer: { id: "u-sari", nama: "Sari Hidayat", jabatan: "Manajer Operasional", ringkas: "Manajer. Lihat semua yang dilihat staf, plus grup manajemen." },
  direktur: { id: "u-hendra", nama: "Hendra Gunawan", jabatan: "Direktur Utama", ringkas: "Direktur. Lihat semua, termasuk kanal direksi dan data HR." },
  baru: { id: "u-tika", nama: "Tika Ramadhani", jabatan: "Staf Marketing (bergabung 19 Okt 2026)", ringkas: "Karyawan baru. Lihat dokumen umum dan grup penjualan/marketing." },
  hr: { id: "u-maya", nama: "Maya Lestari", jabatan: "HR Business Partner", ringkas: "HR. Lihat semua, plus data karyawan dan daftar gaji." },
  it: { id: "u-yoga", nama: "Yoga Permana", jabatan: "IT Lead", ringkas: "IT. Lihat semua, plus grup WMS dan dokumen TI." },
};

export const PLUGIN = ["runut-tim", "runut-cepat"] as const;

export const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const configDir = process.env.WORKBUDDY_CONFIG_DIR ?? join(homedir(), ".workbuddy-ai");
export const expertDir = (nama: string) => join(configDir, "plugins", "marketplaces", "my-experts", "plugins", nama);
export const cacheDir = (nama: string) => join(configDir, "plugins", "cache", "my-experts", nama);
export const fileIdentitas = join(akar, "logs", "identitas.txt");

export function tulisIdentitas(peran: Peran) {
  mkdirSync(dirname(fileIdentitas), { recursive: true });
  writeFileSync(fileIdentitas, IDENTITAS[peran]);
}

export function bacaIdentitas(): { peran: Peran | null; id: string } {
  if (!existsSync(fileIdentitas)) return { peran: null, id: "" };
  const id = readFileSync(fileIdentitas, "utf8").trim();
  const peran = (Object.keys(IDENTITAS) as Peran[]).find((p) => IDENTITAS[p] === id) ?? null;
  return { peran, id };
}

// ---------------------------------------------------------------- Persetujuan
// Konsol persetujuan. Logika ini sengaja TIDAK pernah dipanggil dari dalam model:
// tidak ada alat MCP yang bisa menulis berkas persetujuan, jadi persetujuan selalu
// datang dari manusia lewat CLI atau panel kendali di browser.

export type Draf = {
  id: string;
  dari: string;
  namaKepada: string;
  isi: string;
  waktu?: string;
};

const dirDraf = (logDir: string) => join(logDir, "draf");
const dirPersetujuan = (logDir: string) => join(logDir, "persetujuan");

export function daftarDraf(logDir: string): { draf: Draf; disetujui: boolean }[] {
  const dir = dirDraf(logDir);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const d = JSON.parse(readFileSync(join(dir, f), "utf8")) as Draf;
      return { draf: d, disetujui: existsSync(join(dirPersetujuan(logDir), f)) };
    })
    .sort((a, b) => (a.draf.waktu ?? "").localeCompare(b.draf.waktu ?? ""));
}

export function setujuiDraf(logDir: string, id: string): { ok: boolean; pesan: string } {
  const fileDraf = join(dirDraf(logDir), `${id}.json`);
  if (!existsSync(fileDraf)) return { ok: false, pesan: `Draf ${id} tidak ditemukan.` };
  const draf = JSON.parse(readFileSync(fileDraf, "utf8")) as Draf;
  mkdirSync(dirPersetujuan(logDir), { recursive: true });
  writeFileSync(join(dirPersetujuan(logDir), `${id}.json`), JSON.stringify({ id, disetujui: new Date().toISOString() }, null, 2));
  catat(join(logDir, "audit.jsonl"), draf.dari, "persetujuan_manusia", { draf: id }, { disetujui: true });
  return { ok: true, pesan: `Draf ${id} ke ${draf.namaKepada} disetujui. Agent sekarang boleh mengirimnya.` };
}

const serverRunut = () => ({
  command: process.execPath,
  args: [join(akar, "src", "server.ts")],
  env: { RUNUT_USER_FILE: fileIdentitas },
});

export function tulisMcp() {
  for (const nama of PLUGIN) {
    writeFileSync(join(expertDir(nama), ".mcp.json"), JSON.stringify({ mcpServers: { runut: serverRunut() } }, null, 2));
  }
  const fileMcp = join(configDir, "mcp.json");
  if (!existsSync(fileMcp)) return;
  const mcp = JSON.parse(readFileSync(fileMcp, "utf8"));
  if (mcp.mcpServers?.runut) {
    mcp.mcpServers.runut = { ...mcp.mcpServers.runut, ...serverRunut() };
    writeFileSync(fileMcp, JSON.stringify(mcp, null, 2));
  }
}

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Lokasi WorkBuddy dan penulisan MCP server Runut.
// WorkBuddy hanya membagikan MCP server milik plugin ke agent di expert. Saat pengguna
// menekan "connect", WorkBuddy menyalin server itu ke mcp.json pengguna, jadi konfigurasi
// ditulis di kedua tempat. Identitas ada di satu berkas yang dibaca server setiap panggilan,
// sehingga bisa diganti tanpa restart.

export const IDENTITAS = { staf: "u-andi", manajer: "u-sari", direktur: "u-hendra", baru: "u-tika", hr: "u-maya", it: "u-yoga" } as const;
export type Peran = keyof typeof IDENTITAS;

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

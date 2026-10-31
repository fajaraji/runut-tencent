import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Lokasi WorkBuddy dan penulisan MCP server Runut.
// WorkBuddy hanya membagikan MCP server milik plugin ke agent di expert team. Saat pengguna
// menekan "connect", WorkBuddy menyalin server itu ke mcp.json pengguna, jadi identitas
// harus ditulis di kedua tempat.

export const IDENTITAS = { staf: "u-andi", manajer: "u-sari" } as const;
export type Peran = keyof typeof IDENTITAS;

export const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const configDir = process.env.WORKBUDDY_CONFIG_DIR ?? join(homedir(), ".workbuddy-ai");
export const expertDir = join(configDir, "plugins", "marketplaces", "my-experts", "plugins", "runut-tim");
export const cacheDir = join(configDir, "plugins", "cache", "my-experts", "runut-tim");

const serverRunut = (peran: Peran) => ({
  command: process.execPath,
  args: [join(akar, "src", "server.ts")],
  env: { RUNUT_USER: IDENTITAS[peran] },
});

export function tulisMcp(peran: Peran) {
  writeFileSync(join(expertDir, ".mcp.json"), JSON.stringify({ mcpServers: { runut: serverRunut(peran) } }, null, 2));

  const fileMcp = join(configDir, "mcp.json");
  if (!existsSync(fileMcp)) return;
  const mcp = JSON.parse(readFileSync(fileMcp, "utf8"));
  if (mcp.mcpServers?.runut) {
    mcp.mcpServers.runut = { ...mcp.mcpServers.runut, ...serverRunut(peran) };
    writeFileSync(fileMcp, JSON.stringify(mcp, null, 2));
  }
}

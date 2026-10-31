import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { IDENTITAS, akar, cacheDir, configDir, expertDir, tulisMcp, type Peran } from "./workbuddy.ts";

// Memasang Runut ke WorkBuddy di komputer ini: menyalin expert team, menulis MCP server
// Runut, lalu mendaftarkannya dengan script resmi WorkBuddy.
// WorkBuddy menjalankan salinan plugin di cache per nomor versi, jadi setiap pemasangan
// memberi versi baru dan menghapus cache lama. Tutup WorkBuddy sebelum menjalankan ini.
// Pakai: node scripts/pasang-workbuddy.ts [staf|manajer]

const peran = (process.argv[2] ?? "staf") as Peran;
if (!(peran in IDENTITAS)) throw new Error("Peran harus staf atau manajer.");

cpSync(join(akar, "workbuddy", "runut-tim"), expertDir, { recursive: true });

const filePlugin = join(expertDir, ".codebuddy-plugin", "plugin.json");
const plugin = JSON.parse(readFileSync(filePlugin, "utf8"));
const [mayor, minor] = String(plugin.version).split(".");
plugin.version = `${mayor}.${minor}.${Math.floor(Date.now() / 60000)}`;
writeFileSync(filePlugin, JSON.stringify(plugin, null, 2));
if (existsSync(cacheDir)) rmSync(cacheDir, { recursive: true, force: true });

tulisMcp(peran);

// Versi awal pemasang menaruh server bernama runut-staf dan runut-manajer di mcp.json pengguna.
const fileMcpPengguna = join(configDir, "mcp.json");
if (existsSync(fileMcpPengguna)) {
  const mcp = JSON.parse(readFileSync(fileMcpPengguna, "utf8"));
  for (const nama of ["runut-staf", "runut-manajer"]) delete mcp.mcpServers?.[nama];
  if (mcp.disabledMcpServers) mcp.disabledMcpServers = mcp.disabledMcpServers.filter((n: string) => !n.startsWith("runut-"));
  writeFileSync(fileMcpPengguna, JSON.stringify(mcp, null, 2));
}
console.log(`Runut versi ${plugin.version} (identitas ${peran}) dipasang di ${expertDir}`);

const cache = join(configDir, "plugins", "cache", "workbuddy-builtin", "skill-expert-manager");
const versi = readdirSync(cache).sort().at(-1);
if (!versi) throw new Error("Skill expert-manager WorkBuddy tidak ditemukan.");
execFileSync(process.platform === "win32" ? "py" : "python3", [join(cache, versi, "scripts", "register_expert.py"), expertDir], {
  stdio: "inherit",
  env: { ...process.env, WORKBUDDY_CONFIG_DIR: configDir, PYTHONIOENCODING: "utf-8" },
});
console.log("Buka lagi WorkBuddy supaya versi baru terbaca.");

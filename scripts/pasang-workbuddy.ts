import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { IDENTITAS, PLUGIN, akar, cacheDir, configDir, expertDir, tulisIdentitas, tulisMcp, type Peran } from "./workbuddy.ts";

// Memasang Runut ke WorkBuddy di komputer ini: menyalin kedua expert (tim dan agent cepat),
// menulis MCP server Runut, lalu mendaftarkannya dengan script resmi WorkBuddy.
// WorkBuddy menjalankan salinan plugin di cache per nomor versi, jadi setiap pemasangan
// memberi versi baru dan menghapus cache lama. Tutup WorkBuddy sebelum menjalankan ini.
// Pakai: node scripts/pasang-workbuddy.ts [staf|manajer|direktur|baru|hr|it]

const peran = (process.argv[2] ?? "staf") as Peran;
if (!(peran in IDENTITAS)) throw new Error(`Peran harus salah satu dari ${Object.keys(IDENTITAS).join(", ")}.`);

const cache = join(configDir, "plugins", "cache", "workbuddy-builtin", "skill-expert-manager");
const versiSkill = readdirSync(cache).sort().at(-1);
if (!versiSkill) throw new Error("Skill expert-manager WorkBuddy tidak ditemukan.");

for (const nama of PLUGIN) {
  cpSync(join(akar, "workbuddy", nama), expertDir(nama), { recursive: true });
  const filePlugin = join(expertDir(nama), ".codebuddy-plugin", "plugin.json");
  const plugin = JSON.parse(readFileSync(filePlugin, "utf8"));
  const [mayor, minor] = String(plugin.version).split(".");
  plugin.version = `${mayor}.${minor}.${Math.floor(Date.now() / 60000)}`;
  writeFileSync(filePlugin, JSON.stringify(plugin, null, 2));
  if (existsSync(cacheDir(nama))) rmSync(cacheDir(nama), { recursive: true, force: true });
  console.log(`${nama} versi ${plugin.version} dipasang di ${expertDir(nama)}`);
}

tulisIdentitas(peran);
tulisMcp();

// Versi awal pemasang menaruh server bernama runut-staf dan runut-manajer di mcp.json pengguna.
const fileMcpPengguna = join(configDir, "mcp.json");
if (existsSync(fileMcpPengguna)) {
  const mcp = JSON.parse(readFileSync(fileMcpPengguna, "utf8"));
  for (const nama of ["runut-staf", "runut-manajer"]) delete mcp.mcpServers?.[nama];
  if (mcp.disabledMcpServers) mcp.disabledMcpServers = mcp.disabledMcpServers.filter((n: string) => !n.startsWith("runut-"));
  writeFileSync(fileMcpPengguna, JSON.stringify(mcp, null, 2));
}

for (const nama of PLUGIN) {
  execFileSync(process.platform === "win32" ? "py" : "python3", [join(cache, versiSkill, "scripts", "register_expert.py"), expertDir(nama)], {
    stdio: "inherit",
    env: { ...process.env, WORKBUDDY_CONFIG_DIR: configDir, PYTHONIOENCODING: "utf-8" },
  });
}
console.log(`Identitas: ${peran}. Buka lagi WorkBuddy supaya versi baru terbaca.`);

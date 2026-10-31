import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Memasang Runut ke WorkBuddy di komputer ini:
// 1. menyalin expert team ke folder my-experts dan mendaftarkannya dengan script resmi WorkBuddy,
// 2. menambahkan dua MCP server (runut-staf dan runut-manajer) ke mcp.json, dengan cadangan file lama.
// Pakai: node scripts/pasang-workbuddy.ts

const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configDir = process.env.WORKBUDDY_CONFIG_DIR ?? join(homedir(), ".workbuddy-ai");
const expertDir = join(configDir, "plugins", "marketplaces", "my-experts", "plugins", "runut-tim");

cpSync(join(akar, "workbuddy", "runut-tim"), expertDir, { recursive: true });
console.log(`Expert team disalin ke ${expertDir}`);

const cache = join(configDir, "plugins", "cache", "workbuddy-builtin", "skill-expert-manager");
const versi = readdirSync(cache).sort().at(-1);
if (!versi) throw new Error("Skill expert-manager WorkBuddy tidak ditemukan.");
const python = process.platform === "win32" ? "py" : "python3";
execFileSync(python, [join(cache, versi, "scripts", "register_expert.py"), expertDir], {
  stdio: "inherit",
  env: { ...process.env, WORKBUDDY_CONFIG_DIR: configDir, PYTHONIOENCODING: "utf-8" },
});

const fileMcp = join(configDir, "mcp.json");
const mcp = existsSync(fileMcp) ? JSON.parse(readFileSync(fileMcp, "utf8")) : { mcpServers: {} };
if (existsSync(fileMcp)) copyFileSync(fileMcp, `${fileMcp}.bak`);
const server = (pengguna: string) => ({ command: process.execPath, args: [join(akar, "src", "server.ts")], env: { RUNUT_USER: pengguna } });
mcp.mcpServers ??= {};
mcp.mcpServers["runut-staf"] = server("u-andi");
mcp.mcpServers["runut-manajer"] = server("u-sari");
mkdirSync(configDir, { recursive: true });
writeFileSync(fileMcp, JSON.stringify(mcp, null, 2));
console.log(`MCP server runut-staf (Andi) dan runut-manajer (Sari) ditulis ke ${fileMcp}`);
console.log("Restart WorkBuddy, lalu aktifkan SATU server saja di Custom connectors sebelum bertanya.");

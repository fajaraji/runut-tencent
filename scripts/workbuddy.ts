import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { catat } from "../src/audit.ts";

// WorkBuddy location and MCP server configuration for Runut.
// WorkBuddy only exposes a plugin's MCP server to the agent in the expert. When the user
// clicks "connect", WorkBuddy copies that server to the user's mcp.json, so configuration
// is written in both places. Identity is stored in a single file read by the server on every call,
// so it can be switched without restart.
//
// The logic in this file is used by three callers: CLI scripts (ganti-identitas.ts,
// setujui.ts) and the browser control panel (pengaturan.ts). One implementation, three doors.

export const IDENTITAS = { staf: "u-andi", manajer: "u-sari", direktur: "u-hendra", baru: "u-tika", hr: "u-maya", it: "u-yoga" } as const;
export type Peran = keyof typeof IDENTITAS;

// Human-readable names for each role, used in the control panel.
export const NAMA_PERAN: Record<Peran, { id: string; nama: string; jabatan: string; ringkas: string }> = {
  staf: { id: "u-andi", nama: "Andi Saputra", jabatan: "Sales Admin Staff, Makassar", ringkas: "Sales staff. Can see sales groups, logistics, and general documents." },
  manajer: { id: "u-sari", nama: "Sari Hidayat", jabatan: "Operations Manager", ringkas: "Manager. Can see everything staff sees, plus management groups." },
  direktur: { id: "u-hendra", nama: "Hendra Gunawan", jabatan: "Director", ringkas: "Director. Can see everything, including board channels and HR data." },
  baru: { id: "u-tika", nama: "Tika Ramadhani", jabatan: "Marketing Staff (joined Oct 19, 2026)", ringkas: "New hire. Can see general documents and sales/marketing groups." },
  hr: { id: "u-maya", nama: "Maya Lestari", jabatan: "HR Business Partner", ringkas: "HR. Can see everything, plus employee data and salary lists." },
  it: { id: "u-yoga", nama: "Yoga Permana", jabatan: "IT Lead", ringkas: "IT. Can see everything, plus WMS groups and IT documents." },
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

// ---------------------------------------------------------------- Approval
// Approval console. This logic is intentionally NEVER called from within the model:
// no MCP tool can write the approval file, so approval always
// comes from a human via CLI or the browser control panel.

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
  if (!existsSync(fileDraf)) return { ok: false, pesan: `Draft ${id} not found.` };
  const draf = JSON.parse(readFileSync(fileDraf, "utf8")) as Draf;
  mkdirSync(dirPersetujuan(logDir), { recursive: true });
  writeFileSync(join(dirPersetujuan(logDir), `${id}.json`), JSON.stringify({ id, disetujui: new Date().toISOString() }, null, 2));
  catat(join(logDir, "audit.jsonl"), draf.dari, "persetujuan_manusia", { draf: id }, { disetujui: true });
  return { ok: true, pesan: `Draft ${id} to ${draf.namaKepada} approved. The agent may now send it.` };
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

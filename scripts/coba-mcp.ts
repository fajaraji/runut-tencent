import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Uji cepat lewat protokol MCP sungguhan, seperti WorkBuddy memanggilnya.
// Pakai: node scripts/coba-mcp.ts <id-pengguna> "<query>"

const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [pengguna = "u-andi", query = "PO-2291"] = process.argv.slice(2);

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [join(akar, "src", "server.ts")],
  env: { ...process.env, RUNUT_USER: pengguna } as Record<string, string>,
});
const client = new Client({ name: "coba", version: "0.1.0" });
await client.connect(transport);

const alat = await client.listTools();
console.log("Alat:", alat.tools.map((t) => t.name).join(", "));
const hasil = await client.callTool({ name: "cari", arguments: { query, urut: "waktu" } });
console.log((hasil.content as { text: string }[])[0].text);
await client.close();

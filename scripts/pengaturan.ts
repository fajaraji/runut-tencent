import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { verifikasi } from "../src/audit.ts";
import {
  NAMA_PERAN,
  IDENTITAS,
  PLUGIN,
  configDir,
  bacaIdentitas,
  daftarDraf,
  expertDir,
  setujuiDraf,
  tulisIdentitas,
  type Peran,
} from "./workbuddy.ts";

// Panel kendali Runut. Halaman web lokal untuk orang yang tidak nyaman dengan terminal.
// Fungsinya: ganti identitas penanya, setujui draf pesan, lihat status pemasangan, dan lihat ujung log audit.
//
// Keamanan:
// - Hanya mendengarkan di 127.0.0.1. Tidak bisa diakses dari jaringan lain.
// - Menolak permintaan yang bukan dari loopback.
// - Persetujuan tetap di luar jangkauan model: tidak ada alat MCP yang memanggil server ini.

const akar = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const logDir = process.env.RUNUT_LOG ?? join(akar, "logs");
const port = Number(process.env.RUNUT_PANEL_PORT ?? 4173);

const HALAMAN = join(akar, "installer", "pengaturan.html");

// ------------------------------------------------------------------ Status

function statusPemasangan() {
  const plugins = PLUGIN.map((nama) => {
    const dir = expertDir(nama);
    const ada = existsSync(join(dir, ".codebuddy-plugin", "plugin.json"));
    const mcp = existsSync(join(dir, ".mcp.json"));
    let versi: string | null = null;
    if (ada) {
      try {
        versi = JSON.parse(readFileSync(join(dir, ".codebuddy-plugin", "plugin.json"), "utf8")).version ?? null;
      } catch {
        versi = null;
      }
    }
    return { nama, terpasang: ada, mcpAda: mcp, versi };
  });
  const semuaTerpasang = plugins.every((p) => p.terpasang);
  const mcpPengguna = join(configDir, "mcp.json");
  return {
    plugins,
    semuaTerpasang,
    mcpPenggunaAda: existsSync(mcpPengguna),
    dataAda: existsSync(join(akar, "data", "izin.csv")),
    audit: verifikasi(join(logDir, "audit.jsonl")),
  };
}

function ujungAudit(jumlah = 12) {
  const file = join(logDir, "audit.jsonl");
  if (!existsSync(file)) return [];
  const baris = readFileSync(file, "utf8").trim().split("\n").filter(Boolean);
  return baris
    .slice(-jumlah)
    .map((b) => {
      try {
        const e = JSON.parse(b);
        return { seq: e.seq, waktu: e.waktu, pengguna: e.pengguna, alat: e.alat };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function dataIdentitas() {
  const { peran, id } = bacaIdentitas();
  return {
    peran,
    id,
    nama: peran ? NAMA_PERAN[peran].nama : null,
    jabatan: peran ? NAMA_PERAN[peran].jabatan : null,
  };
}

// ------------------------------------------------------------------ Handler

async function bacaTubuh(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

function json(res: ServerResponse, data: unknown, kode = 200) {
  const body = JSON.stringify(data);
  res.writeHead(kode, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(body);
}

async function tangani(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const alamat = req.url ?? "/";
  const metode = req.method ?? "GET";

  // Hanya localhost. Menolak apa pun yang datang dari luar mesin ini.
  const alamatIp = req.socket.remoteAddress ?? "";
  if (!["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(alamatIp)) {
    json(res, { galat: "Hanya diakses dari localhost." }, 403);
    return;
  }

  if (metode === "GET" && (alamat === "/" || alamat === "/pengaturan.html")) {
    if (!existsSync(HALAMAN)) {
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      res.end("Berkas halaman panel tidak ditemukan.");
      return;
    }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
    res.end(readFileSync(HALAMAN, "utf8"));
    return;
  }

  if (metode === "GET" && alamat === "/api/status") {
    json(res, {
      identitas: dataIdentitas(),
      peran: Object.keys(IDENTITAS).map((p) => ({
        peran: p,
        ...NAMA_PERAN[p as Peran],
      })),
      pemasangan: statusPemasangan(),
      draf: daftarDraf(logDir).map((d) => ({ ...d.draf, disetujui: d.disetujui })),
      audit: ujungAudit(),
    });
    return;
  }

  if (metode === "POST" && alamat === "/api/identitas") {
    const tubuh = await bacaTubuh(req);
    let peran: string;
    try {
      peran = (JSON.parse(tubuh) as { peran?: string }).peran ?? "";
    } catch {
      json(res, { galat: "Permintaan tidak valid." }, 400);
      return;
    }
    if (!(peran in IDENTITAS)) {
      json(res, { galat: `Peran harus salah satu dari ${Object.keys(IDENTITAS).join(", ")}.` }, 400);
      return;
    }
    tulisIdentitas(peran as Peran);
    json(res, {
      ok: true,
      identitas: dataIdentitas(),
      pesan: `Identitas Runut sekarang ${peran} (${IDENTITAS[peran as Peran]}). Berlaku di pertanyaan berikutnya.`,
    });
    return;
  }

  if (metode === "POST" && alamat === "/api/setujui") {
    const tubuh = await bacaTubuh(req);
    let id: string;
    try {
      id = (JSON.parse(tubuh) as { id?: string }).id ?? "";
    } catch {
      json(res, { galat: "Permintaan tidak valid." }, 400);
      return;
    }
    if (!id) {
      json(res, { galat: "Id draf wajib diisi." }, 400);
      return;
    }
    const hasil = setujuiDraf(logDir, id);
    json(res, hasil, hasil.ok ? 200 : 404);
    return;
  }

  json(res, { galat: "Tidak ditemukan." }, 404);
}

const server = createServer((req, res) => {
  tangani(req, res).catch(() => {
    if (!res.headersSent) json(res, { galat: "Kesalahan di server panel." }, 500);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Panel kendali Runut: http://localhost:${port}`);
  console.log("Halaman ini hanya bisa dibuka di komputer ini. Tutup dengan Ctrl+C.");
});

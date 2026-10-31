import { createHash } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";

// Log audit berantai hash: setiap baris menyimpan hash baris sebelumnya,
// jadi baris yang diubah atau dihapus belakangan langsung ketahuan.

export type Entri = {
  seq: number;
  waktu: string;
  pengguna: string;
  alat: string;
  masukan: unknown;
  keluaran: unknown;
  prevHash: string | null;
  hash: string;
};

function hashEntri(e: Omit<Entri, "hash">): string {
  return createHash("sha256").update(JSON.stringify(e)).digest("hex");
}

function barisTerakhir(file: string): Entri | null {
  if (!existsSync(file)) return null;
  const baris = readFileSync(file, "utf8").trim().split("\n").filter(Boolean);
  return baris.length ? (JSON.parse(baris[baris.length - 1]) as Entri) : null;
}

export function catat(file: string, pengguna: string, alat: string, masukan: unknown, keluaran: unknown): Entri {
  mkdirSync(dirname(file), { recursive: true });
  const akhir = barisTerakhir(file);
  const tanpaHash = {
    seq: akhir ? akhir.seq + 1 : 1,
    waktu: new Date().toISOString(),
    pengguna,
    alat,
    masukan,
    keluaran,
    prevHash: akhir ? akhir.hash : null,
  };
  const entri: Entri = { ...tanpaHash, hash: hashEntri(tanpaHash) };
  appendFileSync(file, JSON.stringify(entri) + "\n");
  return entri;
}

export function verifikasi(file: string): { utuh: boolean; jumlah: number; rusakDi?: number } {
  if (!existsSync(file)) return { utuh: true, jumlah: 0 };
  const baris = readFileSync(file, "utf8").trim().split("\n").filter(Boolean);
  let prev: string | null = null;
  for (const [i, b] of baris.entries()) {
    const { hash, ...isi } = JSON.parse(b) as Entri;
    if (isi.prevHash !== prev || hashEntri(isi) !== hash) return { utuh: false, jumlah: baris.length, rusakDi: i + 1 };
    prev = hash;
  }
  return { utuh: true, jumlah: baris.length };
}

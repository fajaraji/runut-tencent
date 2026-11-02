// Pembaca format mentah yang dipakai perusahaan sehari-hari: export grup WhatsApp,
// CSV dari task board dan tabel izin, serta dokumen markdown dengan frontmatter.

export type PesanWa = { id: string; waktu: string; dari: string; teks: string };

const OFFSET: Record<string, string> = { WIB: "+07:00", WITA: "+08:00", WIT: "+09:00" };

// Android: "08/10/26 16.40 - Dedi Pratama: teks". iPhone: "[08/10/26 16.40.12] Dedi Pratama: teks".
const POLA_ANDROID = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})[, ]+(\d{1,2})[.:](\d{2})(?:[.:]\d{2})? - (.*)$/;
const POLA_IPHONE = /^\[(\d{1,2})\/(\d{1,2})\/(\d{2,4})[, ]+(\d{1,2})[.:](\d{2})(?:[.:]\d{2})?\] (.*)$/;

// Baris yang tidak membawa isi: media dan pesan yang dihapus.
const POLA_TANPA_ISI = /^(<?media (tidak disertakan|omitted)>?|<?media tidak disertakan>?|pesan ini (telah )?dihapus\.?|this message was deleted\.?|image omitted|sticker omitted|stiker tidak disertakan)$/i;

// WhatsApp tidak menyimpan zona waktu di export: semua jam mengikuti telepon pengekspor.
// Karena itu zona dicatat per kanal, dan id pesan mengikuti urutan pesan yang berisi.
export function bacaWhatsApp(isi: string, kanal: string, zona: string): PesanWa[] {
  const offset = OFFSET[zona];
  if (!offset) throw new Error(`Zona waktu "${zona}" tidak dikenal untuk kanal ${kanal}.`);

  const mentah: { waktu: string; dari: string; teks: string }[] = [];
  let terakhir: { teks: string } | null = null;

  for (const baris of isi.replace(/[‎‏﻿]/g, "").split(/\r?\n/)) {
    const m = baris.match(POLA_ANDROID) ?? baris.match(POLA_IPHONE);
    if (!m) {
      // Baris tanpa cap waktu adalah lanjutan pesan sebelumnya.
      if (terakhir && baris.trim()) terakhir.teks += `\n${baris}`;
      continue;
    }
    const [, tgl, bln, thn, jam, menit, sisa] = m;
    const pemisah = sisa.indexOf(": ");
    // Tanpa "Nama: " berarti baris sistem (anggota ditambahkan, enkripsi, dan sebagainya).
    if (pemisah < 0) {
      terakhir = null;
      continue;
    }
    const tahun = thn.length === 2 ? `20${thn}` : thn;
    const waktu = `${tahun}-${bln.padStart(2, "0")}-${tgl.padStart(2, "0")}T${jam.padStart(2, "0")}:${menit}:00${offset}`;
    const pesan = { waktu, dari: sisa.slice(0, pemisah).trim(), teks: sisa.slice(pemisah + 2) };
    mentah.push(pesan);
    terakhir = pesan;
  }

  return mentah
    .filter((p) => !POLA_TANPA_ISI.test(p.teks.trim()))
    .map((p, i) => ({ id: `${kanal}/${String(i + 1).padStart(3, "0")}`, ...p }));
}

export function bacaCsv(isi: string): Record<string, string>[] {
  const baris: string[][] = [];
  let sel = "";
  let barisIni: string[] = [];
  let dalamKutip = false;
  const teks = isi.replace(/^﻿/, "");

  for (let i = 0; i < teks.length; i++) {
    const c = teks[i];
    if (dalamKutip) {
      if (c === '"' && teks[i + 1] === '"') {
        sel += '"';
        i++;
      } else if (c === '"') dalamKutip = false;
      else sel += c;
    } else if (c === '"') dalamKutip = true;
    else if (c === ",") {
      barisIni.push(sel);
      sel = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && teks[i + 1] === "\n") i++;
      barisIni.push(sel);
      sel = "";
      if (barisIni.some((s) => s !== "")) baris.push(barisIni);
      barisIni = [];
    } else sel += c;
  }
  barisIni.push(sel);
  if (barisIni.some((s) => s !== "")) baris.push(barisIni);

  const [kepala, ...data] = baris;
  if (!kepala) return [];
  return data.map((b) => Object.fromEntries(kepala.map((k, i) => [k.trim(), (b[i] ?? "").trim()])));
}

export function bacaDokumen(isi: string): { meta: Record<string, string>; isi: string } {
  const m = isi.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error("Dokumen harus diawali frontmatter.");
  const meta = Object.fromEntries(
    m[1].split("\n").map((b) => {
      const i = b.indexOf(":");
      return [b.slice(0, i).trim(), b.slice(i + 1).trim()];
    }),
  );
  return { meta, isi: m[2].trim() };
}

// Contoh suara untuk dipilih. Hasilnya keluar/contoh-suara/<suara>.mp3
import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
const teks = "Stores in Makassar are asking where their chips are. Andi in sales has to answer today. This is Roonoot, a project history agent built on WorkBuddy.";
mkdirSync("keluar/contoh-suara", { recursive: true });
for (const suara of ["en-SG-WayneNeural", "en-PH-JamesNeural", "en-IN-PrabhatNeural", "en-HK-SamNeural"]) {
  mkdirSync(`keluar/contoh-suara/t-${suara}`, { recursive: true });
  const t = new MsEdgeTTS();
  await t.setMetadata(suara, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  const { audioFilePath } = await t.toFile(`keluar/contoh-suara/t-${suara}`, teks, { rate: "+8%" });
  copyFileSync(audioFilePath, `keluar/contoh-suara/${suara}.mp3`);
  rmSync(`keluar/contoh-suara/t-${suara}`, { recursive: true, force: true });
  console.log(suara);
}
process.exit(0);

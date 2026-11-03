// Memotret halaman log audit yang asli sebagai gambar panjang, tanpa memakai layar.
import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--allow-file-access-from-files", "--disable-gpu"], defaultViewport: { width: 1200, height: 1300, deviceScaleFactor: 1 } });
const p = await b.newPage();
await p.goto("file:///C:/runut-tencent/docs/index.html", { waitUntil: "networkidle0" });
const judul = await p.evaluate(() => document.body.innerText.slice(0, 600));
console.log(judul);
await p.screenshot({ path: "C:/runut-tencent/video/keluar/log.png", clip: { x: 0, y: 0, width: 1200, height: 3000 }, captureBeyondViewport: true });
await b.close();

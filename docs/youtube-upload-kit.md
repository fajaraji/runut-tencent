# YouTube upload kit — Runut product demo

Prepared 2026-11-07. Everything below is derived from `README.md`, `docs/`, `video/naskah.json` and `video/suara.mjs` in this repo. No product claims were invented.

**The video:** 5:45–5:48, Indonesian narration, English subtitles, synthetic voice, self-made synth music, real WorkBuddy task screens over a fictional company (PT Sinar Rasa Nusantara). Built on WorkBuddy for **AI CAN DO IT Tencent Cloud Hackathon Indonesia 2026 — Challenge A, The Workplace Brain (Project history)**.

---

## 0. Copy-paste now (recommended set)

**Title (69 chars, under YouTube's 100-char limit):**

```
Runut — Project History AI That Only Shows What You’re Allowed to See
```

**Description:** see §2. **Tags:** see §5. **Chapters:** see §3. **Hashtags:** `#Runut #WorkBuddy #AIAgent`

> If the submission form asks for the video title exactly as uploaded, use title **C** in §1 instead — it names the hackathon explicitly and is safest for judges.

---

## 1. Title options

| # | Title | Chars | Use when |
| --- | --- | --- | --- |
| **A** ⭐ | `Runut — Project History AI That Only Shows What You’re Allowed to See` | 69 | Best all-rounder. Product + category + the one differentiator. Recommended for public upload. |
| B | `We Built an AI That Refuses to Answer “What’s Rina’s Salary?” \| Runut Demo` | 74 | Highest curiosity / CTR. Opens with the video's actual first second. |
| C | `Runut Demo \| AI CAN DO IT Tencent Cloud Hackathon Indonesia 2026` | 64 | Submission-safe. Names the event so judges can match it to the form. |
| D | `Why Was Stock Late in Makassar? An AI That Cites Every Line \| Runut` | 67 | Search-friendly, leads with the demo scenario. |
| E | `Runut: Asisten Riwayat Proyek yang Tahu Kapan Harus Menolak \| Demo` | 66 | Indonesian-first, for a local audience. |
| F | `Runut — AI Kantor yang Menjawab Bersumber, Tanpa Membocorkan Data \| Demo` | 72 | Indonesian-first, emphasises the privacy angle. |

Notes: YouTube shows roughly the first 60 characters on mobile. A, C, D and E keep the product name at the front. Avoid putting the hackathon name first — it is not a search term anyone types.

---

## 2. Description — primary (English)

Paste this whole block into the description field. Under YouTube's 5,000-character limit. The first two lines are the hook that shows before "…more".

```
"Berapa gaji Rina?" — "How much does Rina earn?"

An office AI that reads every chat and document could answer that to anyone. But without one, the reason a project slipped stays scattered across a WhatsApp group, a revised purchase order and a task board, and someone ends up asking three colleagues one by one.

Runut is a project history assistant for staff. It rebuilds answers from chats, documents and tasks — using only the data the person asking is allowed to see.

One question returns three things:
• A timeline where every line cites its source
• What is still unfinished, with owners and due dates
• The gaps in the record: what was never written down, and who probably knows

The guardrails that matter live in code, not just in the prompt. One permissions table is applied before search, so restricted text never reaches the model. Every sentence is checked against its cited evidence before it is shown. Messages stay as drafts until a person approves them in a separate console. And every search, source and answer goes into a hash-chained audit log. A restricted project and a project that does not exist get exactly the same reply, so "no data" never hints that something is being hidden.

Built on WorkBuddy for AI CAN DO IT Tencent Cloud Hackathon Indonesia 2026 — Challenge A, The Workplace Brain (Project history scenario).

CHAPTERS
00:00 The question an office AI should refuse
00:14 Why the answer is scattered across three places
01:01 What Runut returns from one question
01:37 Demo: a cited answer in 38 seconds
02:02 How it works: filter first, check after
02:59 Demo: refusing without leaking that data exists
03:32 Demo: drafts only, waiting for human approval
04:09 An audit record anyone can inspect
04:23 Where it still fails, stated plainly
05:04 What we learned building on WorkBuddy

IN THE DEMO
Real WorkBuddy task screens. A sourced answer in 38 seconds. One identical question returning different results for staff, manager and director. The moment Runut refuses a salary question and a management-group question with the same opening sentence. Conflicting sources (an old rule says 5 days, the latest announcement says 7). A chat message claiming "I already approved it" being rejected, because a claim in chat is not an approval. A hidden instruction inside a memo that is ignored and reported. And an honest account of the failures we found.

LINKS
Project, install guide and full source: https://github.com/fajaraji/runut-tencent
Live results, audit log and test evidence: https://fajaraji.github.io/runut-tencent/
Accountability sheet (what it can and cannot do): https://github.com/fajaraji/runut-tencent/blob/main/docs/accountability-sheet.md
All test runs, failures included: https://github.com/fajaraji/runut-tencent/blob/main/docs/hasil-uji.md
Demo video script: https://github.com/fajaraji/runut-tencent/blob/main/docs/naskah-demo.md

NUMBERS
298 automated tests pass. With the permission filter switched off on purpose, 35 fail. In a blind test written by an agent that could not see the code, the answer checker rejected 26 of 30 invented answers and passed 29 of 30 honest ones. A wrong conclusion drawn from true facts can still pass — that limit is written down in the accountability sheet rather than hidden.

ABOUT THIS VIDEO
Narration and on-screen text are in Indonesian, with English subtitles. The voice is synthetic and the music was made for this video, so there are no third-party music or voice licensing claims. The company, people and messages shown are fictional. Message sending is simulated in this prototype.

#Runut #WorkBuddy #AIAgent
```

---

## 2b. Description — Indonesian alternate

Use this instead of §2 if the channel and judges are Indonesian-first. Same structure, same links and chapters, so only the prose changes.

```
"Berapa gaji Rina?"

Kalau AI kantor membaca semua chat dan dokumen, ia bisa menjawab pertanyaan ini ke siapa saja. Sebaliknya juga bermasalah: tanpa AI, alasan sebuah proyek terlambat tercecer di grup WhatsApp, dokumen pesanan yang direvisi, dan daftar tugas. Andi akhirnya harus bertanya ke tiga orang, satu per satu.

Runut adalah asisten riwayat proyek untuk karyawan. Ia menyusun jawaban dari obrolan, dokumen, dan tugas — hanya dari data yang boleh dilihat si penanya.

Satu pertanyaan menghasilkan tiga bagian:
• Kronologi, setiap baris menyebut sumbernya
• Yang belum selesai, dengan pemilik dan tenggatnya
• Celah catatan: apa yang tidak pernah ditulis, dan siapa yang kemungkinan tahu

Aturan utamanya dijaga kode, bukan hanya instruksi. Satu tabel izin disaring sebelum pencarian, jadi data terlarang tidak pernah sampai ke model. Setiap kalimat diperiksa terhadap sumber yang dikutip sebelum ditampilkan. Pesan hanya berupa draf sampai manusia menyetujuinya di konsol terpisah. Setiap pencarian, sumber, dan jawaban tercatat di log yang dirantai hash. Proyek yang dirahasiakan dan proyek yang tidak ada memakai kalimat jawaban yang sama persis, jadi "tidak ada data" tidak pernah membocorkan keberadaan data lain.

Dibangun di atas WorkBuddy untuk AI CAN DO IT Tencent Cloud Hackathon Indonesia 2026 — Challenge A, The Workplace Brain, skenario Project history.

BAB
00:00 Pertanyaan yang harusnya ditolak AI kantor
00:14 Kenapa jawabannya tercecer di tiga tempat
01:01 Apa yang dikembalikan Runut dari satu pertanyaan
01:37 Demo: jawaban bersumber dalam 38 detik
02:02 Cara kerja: saring dulu, periksa kemudian
02:59 Demo: menolak tanpa membocorkan data
03:32 Demo: draf saja, tunggu persetujuan manusia
04:09 Catatan yang bisa diperiksa siapa pun
04:23 Yang masih gagal, terus terang
05:04 Pelajaran membangun di WorkBuddy

TAUTAN
Proyek, panduan pasang, dan kode sumber: https://github.com/fajaraji/runut-tencent
Hasil uji, catatan audit, dan bukti: https://fajaraji.github.io/runut-tencent/
Lembar akuntabilitas: https://github.com/fajaraji/runut-tencent/blob/main/docs/accountability-sheet.md
Semua hasil uji, termasuk kegagalan: https://github.com/fajaraji/runut-tencent/blob/main/docs/hasil-uji.md
Naskah video: https://github.com/fajaraji/runut-tencent/blob/main/docs/naskah-demo.md

ANGKA
298 tes otomatis lolos. Saat penyaring izin sengaja dimatikan, 35 tes gagal. Pada uji buta yang ditulis agen yang tidak melihat kode, pemeriksa jawaban menolak 26 dari 30 jawaban karangan dan meloloskan 29 dari 30 jawaban jujur. Kesimpulan keliru dari fakta yang benar masih bisa lolos, dan batas itu kami tuliskan di lembar akuntabilitas.

TENTANG VIDEO INI
Narasi dan teks di layar berbahasa Indonesia dengan subtitle Inggris. Suara dibuat sintetis dan musik dibuat sendiri, jadi tidak ada klaim lisensi musik atau suara pihak ketiga. Perusahaan, nama, dan pesan dalam demo adalah fiktif. Pengiriman pesan masih simulasi pada prototipe ini.

#Runut #WorkBuddy #AIAgent
```

---

## 3. Chapters

YouTube requires: first timestamp exactly `00:00`, at least 3 chapters, each at least 10 seconds. All ten below meet that. They are appended to the end of the description (already included in §2 and §2b).

| Start | Chapter | Source scene(s) | Est. length |
| --- | --- | --- | --- |
| `00:00` | The question an office AI should refuse | `hook` | 14s |
| `00:14` | Why the answer is scattered across three places | `masalah` | 47s |
| `01:01` | What Runut returns from one question | `solusi` | 36s |
| `01:37` | Demo: a cited answer in 38 seconds | `demo_k01` | 25s |
| `02:02` | How it works: filter first, check after | `arsitektur` + `tingkat` | 57s |
| `02:59` | Demo: refusing without leaking that data exists | `demo_tolak` + `demo_konflik` | 33s |
| `03:32` | Demo: drafts only, waiting for human approval | `demo_setuju` + `demo_injeksi` | 37s |
| `04:09` | An audit record anyone can inspect | `audit` | 14s |
| `04:23` | Where it still fails, stated plainly | `jujur` | 41s |
| `05:04` | What we learned building on WorkBuddy | `refleksi` + `penutup` | 44s |

> ⚠️ **These timestamps are estimates.** They were computed from the narration in `video/naskah.json` plus the fixed pauses in `video/suara.mjs` (`jedaKalimat` 0.32s, `jedaAdegan` 0.6s), normalised to the known 5:48 runtime. The real timings live in `video/keluar/waktu.json`, which is generated by `node video/suara.mjs` and is **not present on disk or in git right now**. Before publishing, run `node video/suara.mjs` (or open the rendered MP4), then replace the numbers with the real ones using:
>
> ```bash
> node -e "const w=require('./video/keluar/waktu.json');const f=t=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.round(t%60)).padStart(2,'0');w.forEach(a=>console.log(f(a.mulai),a.id,a.bab))"
> ```
>
> If a chapter lands within ~10 seconds of the end, merge it into the previous one — YouTube will silently disable all chapters otherwise.

---

## 4. Tags (451 chars — YouTube limit is 500)

```
Runut, WorkBuddy, WorkBuddy AI, Tencent Cloud Hackathon Indonesia 2026, AI CAN DO IT, project history, workplace brain, AI agent demo, MCP server, Model Context Protocol, permission filter, access control, cited answers, source attribution, prompt injection, audit log, data privacy, AI governance, hallucination detection, answer verification, enterprise search alternative, WhatsApp export, Indonesian AI, product demo, agentic AI, human in the loop
```

Do not add more than 15 hashtags anywhere in the description — YouTube ignores all of them past 15. §2 uses exactly 3, which is the number shown above the title.

---

## 5. Thumbnail

Specs: 1280 × 720 (16:9), JPG/PNG/WebP, under 2 MB. Match the video's own palette — dark navy `#060a14` background with yellow, red, blue and green accents (from `video/adegan.html`) — so the thumbnail feels like a frame from the video. Keep text to 3–5 words, readable at 120 px wide.

| Concept | Big text | Visual | Why it works |
| --- | --- | --- | --- |
| **1** ⭐ | `BERAPA GAJI RINA?` | Blurred salary figure with a red X over it, small yellow corner label `RUNUT MENOLAK` | Matches the video's opening second and the core promise. Strongest curiosity gap. |
| 2 | `1 TANYA → 3 JAWABAN` | Three stacked cards: kronologi / belum selesai / celah catatan, each with a tiny `[sumber]` tag | Explains the product in one glance. Best for a technical audience. |
| 3 | `AI KANTOR, TANPA BOCOR?` | Split screen: a wall of chat bubbles on the left, one clean cited answer on the right | States the tension the whole demo resolves. |

Avoid putting the hackathon logo large on the thumbnail — it shrinks the curiosity gap. A small corner badge is fine if the submission requires it.

---

## 6. Upload settings

| Setting | Value | Reason |
| --- | --- | --- |
| Visibility | **Public** | Hackathon judges usually need an open link. If the form explicitly permits unlisted, unlisted also works — confirm before choosing. |
| Category | Science & Technology | Best fit for an AI/product demo. |
| Video language | Indonesian (Bahasa Indonesia) | Narration is Indonesian. Title/description in English is fine and does not change this field. |
| Caption / subtitle | See note below | English subtitles already exist in the video. |
| Automatic chapters | **Off** | We are supplying manual chapters; auto chapters can conflict. |
| Audience | Not made for kids | Required for a workplace/product demo. |
| License | Standard YouTube License | Keep the repo's ISC code licence separate from the video. |
| Monetisation | Off | Hackathon entry; avoids claims friction over synthetic voice and music. |
| Paid promotion / product placement | No | Nothing is being promoted commercially. |
| Comments | On, hold potentially inappropriate for review | You want judge/peer feedback; the moderation filter keeps it clean. |
| Embedding | Allow | Needed if you embed it in `README.md` or the results page. |
| Playlist | e.g. `AI CAN DO IT Tencent Cloud Hackathon Indonesia 2026` | Optional, good for grouping the submission. |
| End screen | Link to `https://fajaraji.github.io/runut-tencent/` | Pushes viewers to the evidence, which is the project's strongest asset. |
| Cards | One card at ~02:02 pointing to `docs/accountability-sheet.md` | Lands exactly when guardrails are explained. |

**Caption note.** `docs/naskah-demo.md` says the video has English subtitles and `video/naskah.json` stores an English line for every Indonesian sentence, so the English translation appears to be rendered into the picture. If it is burned in, do **not** also upload an English `.srt` — viewers would see the same line twice. In that case set the caption field to none and keep the "English subtitles" line in the description. If you want selectable/accessible captions, the cleaner route is to upload an Indonesian `.srt` (matching the spoken audio) instead; an English `.srt` only makes sense on a re-render with the burned-in subtitles removed. An `.srt` can be generated from `waktu.json` + the `[id, en]` pairs in `naskah.json`.

---

## 7. Pinned comment

Pin this immediately after publishing:

```
Full source, live audit log and every test run (failures included): https://fajaraji.github.io/runut-tencent/
Install guide: https://github.com/fajaraji/runut-tencent
The demo uses a fictional company and dataset, a synthetic voice and music we made ourselves. Happy to answer questions about the permission filter or the answer checker. Built on WorkBuddy for AI CAN DO IT Tencent Cloud Hackathon Indonesia 2026, Challenge A.
```

Optional first reply under it, for judges scanning for honesty:

```
Known limits, in writing: https://github.com/fajaraji/runut-tencent/blob/main/docs/accountability-sheet.md — the biggest one is that the model can still write text to the screen before the answer check returns, because WorkBuddy controls the display.
```

---

## 8. Share copy

> These posts are for sharing the **demo video** after upload. They are **not** the post that satisfies the hackathon's social-media requirement: they carry `#Runut #WorkBuddy` but not `#TencentCloudHackathon`, and they contain a `[VIDEO URL]` placeholder. For the required submission, use [`docs/social-post-kit.md`](social-post-kit.md), whose posts are length-checked and carry both mandatory hashtags. You can publish both — add `[VIDEO URL]` as a first comment on the required post once the video is live.

**LinkedIn / Facebook (short post):**

```
We built Runut, a project history assistant that answers "why was this delayed?" from WhatsApp, documents and tasks — and refuses to answer "what does Rina earn?" using the exact same sentence it uses for a project that doesn't exist.

The guardrails are in code: permissions are filtered before search, every sentence is checked against its cited source, messages stay drafts until a human approves, and everything lands in a hash-chained audit log. 298 tests, and the failures are published too.

5-minute demo (Indonesian narration, English subtitles): [VIDEO URL]
Built on WorkBuddy for AI CAN DO IT Tencent Cloud Hackathon Indonesia 2026, Challenge A.
```

**X / Threads:**

```
An office AI that reads everything can tell anyone a colleague's salary. We built one that can't.

Runut: cited project history from chats + docs + tasks, filtered by permission BEFORE the model sees it. It refuses, waits for human approval, and logs everything. Demo (5 min): [VIDEO URL] #Runut #WorkBuddy
```

**WhatsApp / Telegram (to the team or judges):**

```
Video demo Runut sudah tayang: [VIDEO URL]
5 menit, narasi Indonesia + subtitle Inggris. Ada momen Runut menolak jawab gaji, menolak "sudah saya setujui" di chat, dan bagian yang masih gagal kami sebut terus terang. Bukti & log audit: https://fajaraji.github.io/runut-tencent/
```

---

## 9. Submission form fields

Copy these so the form, the video and the repo say the same thing.

| Field | Value |
| --- | --- |
| Video URL | `https://www.youtube.com/watch?v=YOUR_ID` (fill after upload) |
| Video title | Exact YouTube title from §1 (use C for the form if it asks for a title) |
| Short description / blurb (7 words) | `Project history, rebuilt from sources, within permissions.` |
| Challenge / scenario | Challenge A — The Workplace Brain / Project history |
| Built with | WorkBuddy (Expert Teams + bundled MCP server) |
| Demo language | Indonesian narration, English subtitles |
| Runtime | 5:45–5:48 (verify with `ffprobe` on the final MP4) |
| Supporting links | Repo, live results page, accountability sheet, test results, install guide |
| Social Post Link | `PASTE PERMALINK HERE` — publish a post with `#WorkBuddy` + `#TencentCloudHackathon` from [`docs/social-post-kit.md`](social-post-kit.md), then fill `docs/submission.md` §6 |

---

## 10. Before you hit Publish

1. Confirm the real runtime with `ffprobe video/keluar/runut-demo.mp4` — `docs/TICKETS.md` says 5:45, `node musik.mjs 348` implies 5:48.
2. Replace the estimated chapter timestamps using `waktu.json` (command in §3). Verify the last chapter ends before the video ends.
3. Watch the whole video once, muted and then with sound. Check the salary figure and any account name are not visible in the real WorkBuddy screenshots (`docs/naskah-demo.md` says the sidebar was cropped — worth confirming).
4. Decide burned-in subtitles vs `.srt` (§6) and set the caption field accordingly.
5. Check every link resolves. The `blob/main/` URLs assume `main` is the default branch — confirm, or replace with the actual branch.
6. Replace `[VIDEO URL]` in §8 before posting anywhere.
7. Set visibility to Public if the form requires an openly accessible link.
8. Upload the thumbnail, pin the comment, add the end screen link.
9. After publishing, paste the final URL back into `README.md` and `docs/TICKETS.md` (RUN-17 / "What still needs a human").
10. Keep the `video/keluar/` folder out of git — the repo currently excludes rendered files on purpose.

---

## 11. What I could not verify

- `video/keluar/` does not exist on this machine, so there is no rendered MP4 and no `waktu.json`. All chapter timestamps are estimates, not measured. Everything else is copied from files that do exist.
- Whether English subtitles are burned into the frames or delivered as a separate caption track. `docs/naskah-demo.md` says English subtitles exist; `video/adegan.html` renders a bottom text bar, but I did not confirm which language it shows in the final render.
- Whether the hackathon handbook or submission form mandates a title prefix, a public link, or a specific credit line. Nothing in this repo states one.
- Whether any real WorkBuddy account details appear in the captured screens. The script says the sidebar was cropped; only a visual check of the MP4 can confirm.

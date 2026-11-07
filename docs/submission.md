# Runut — Hackathon submission pack

**Event:** AI CAN DO IT Tencent Cloud Hackathon Indonesia 2026 — Challenge A, The Workplace Brain (scenario: Project history)
**Prepared:** 7 November 2026
**Every claim below comes from files in this repo** (`README.md`, `docs/deskripsi-proyek.md`, `docs/arsitektur.md`, `docs/accountability-sheet.md`, `docs/index.html`, `docs/hasil-uji.md`). Known limits are stated rather than hidden.

---

## 0. Copy-paste cheat sheet

| Form field | Value |
| --- | --- |
| **Project Title** | `Runut — Permission-Aware Project History Assistant` |
| **Short Blurb** (7 words, limit 10) | `Project history, rebuilt from sources, within permissions.` |
| **Project Link** | `https://fajaraji.github.io/runut-tencent/` |
| **Cover Image** | `docs/cover/runut-cover-380x216.png` (16:9, 380 × 216 px) |
| **Architecture Diagram PPT** | `docs/runut-architecture.pptx` |
| **Social Post Link** | `PASTE PERMALINK HERE` — publish one of the posts in [`docs/social-post-kit.md`](social-post-kit.md) first, then fill §6 |

**Project Description** is the text in §1 below, from "Project Overview" through "Business Value". Paste the three sections in order.

> **One field needs a human action.** The social post link does not exist until a public post is published on LinkedIn, X, Threads or similar with `#WorkBuddy` and `#TencentCloudHackathon`. No social account is connected to this workspace, so the post cannot be published from here. `docs/social-post-kit.md` has five length-checked, copy-paste posts and a link-log table. Publish one, then paste its permalink into §6 and the field above.

---

## 1. Project Description

### Project Overview — target scenarios, users, and value proposition

Runut is a project history assistant for staff. Ask it one question — "Kenapa stok di Makassar terlambat, dan apa yang belum selesai?" ("Why was stock late in Makassar, and what is still unfinished?") — and it returns three things:

1. **A timeline** where every line cites the chat message, document or task it came from.
2. **What is still open**, with owners and due dates.
3. **The gaps in the record**: what was never written down, and who was in the conversation and probably knows.

**Target scenarios.** A delayed shipment, a revised purchase order, a project handed over to a new manager, an onboarding employee asking why a decision was made. In each case the reason is scattered across a WhatsApp group, a revised document and a task board.

**Target users.** Operations and sales staff, team leads, and new managers or new hires who inherit a project and need to know why something happened — without asking three colleagues one by one.

**Value proposition.** An office AI that reads every chat and document can tell anyone what a colleague earns. Runut rebuilds answers from chats, documents and tasks using **only the data the person asking is allowed to see**. Restricted and non-existent data receive exactly the same reply, so "no data" never confirms that hidden data exists. The permission filter, answer check, human approval and audit log are enforced in code, not requested in a prompt.

Built on WorkBuddy (Expert Teams + a bundled MCP server) for Challenge A, The Workplace Brain.

### Real World Scenario Insights — pain points, audience, core problem

In an Indonesian company, the story of why a project went wrong lives in a WhatsApp group ("I'll explain on the call"), a revised SOP and a task list. The official record never captures the reason for the decision, so the people who were there become the only way to find out — and they get asked the same question again and again. Roughly nine in ten Indonesians use WhatsApp monthly ([We Are Social, Digital 2026 Indonesia](https://wearesocial.com/id/blog/2025/11/digital-2026-top-digital-and-social-media-trends-in-indonesia/)), while teams spend more than a quarter of the work week looking for information ([Atlassian State of Teams 2025](https://www.atlassian.com/blog/innovation/how-the-atlassian-system-of-work-connects-distributed-teams)); 88% of Indonesian workers report lacking time or energy for their work ([Microsoft Work Trend Index 2025](https://news.microsoft.com/id-id/2025/06/23/microsoft-shares-latest-findings-from-2025-work-trend-index-unlocking-indonesias-potential-through-human-ai-collaboration/)).

The second half of the problem is trust. An assistant with access to every chat can also repeat a vendor dispute or a salary figure to anyone who asks. Forty percent of organisations delayed a Copilot rollout by three months or more over oversharing concerns ([Gartner via Computerworld](https://www.computerworld.com/article/3542000/microsoft-365-copilot-rollouts-slowed-by-data-security-roi-concerns.html)), and Indonesia's PP 33/2026 makes AI processing a trigger for a data protection impact assessment from 16 January 2027 ([RSM Indonesia](https://www.rsm.global/indonesia/en/node/439)). Companies will only let an agent near their chats if they can show what it saw and what it said.

**Core problem solved.** Two needs that usually pull against each other: give staff a cited, complete answer about project history, and prove that the agent never saw or leaked anything they are not entitled to. Existing enterprise search answers with search-and-summary, does not ingest WhatsApp group history, does not report what is missing from the record, and does not answer "not found" and "not allowed" identically.

### Comprehensive Solution Design — business architecture, technical architecture, and prompt-driven generation

**Business architecture.** Runut sits on top of places where work already happens. A company exports what it already has: WhatsApp group chats, documents and a task board CSV. An admin maintains one permissions table (`data/izin.csv`) that says which groups may see each channel, document and task; a source not listed is closed to everyone. No integration project is needed for a pilot. The asker's identity comes from one configuration file the server re-reads on every call — no tool accepts an identity as input, so the model cannot ask on someone else's behalf. Because the organisers supplied no dataset, we built a fictional company (PT Sinar Rasa Nusantara) with three project stories, three secrecy levels and deliberate traps such as conflicting sources, hidden instructions and two employees named Budi.

**Technical architecture.** The trust boundary is the Runut MCP server, not any prompt. Everything the model sees has already passed the permission filter.

```
Asker (WorkBuddy, identity fixed in server config)
        |
WorkBuddy expert team  —  Tata (lead, runs the SOP), Lusi (source tracer),
        |                 Yusuf (timeline writer), Riksa (citation auditor)
Runut MCP server (TRUST BOUNDARY)
        |  filter-before-search  ->  keyword search + synonyms
        |  mask NIK/phone, flag hidden instructions, mark injections as data
        |  periksa_jawaban: cited ids, numbers, names, negation must match sources
        |  catat_jawaban: fresh-evidence gate, checks before display
        |  siapkan_pesan / kirim_pesan: drafts only, human approval required
        |  hash-chained audit log (every call, source and final answer)
        |
Chat exports + documents + tasks + people + group/permissions table
        ^                                        |
        +------ person at approval console <-----+
```

Two modes share that one server: `runut-tim` (four agents, careful investigation, 1.5 to over 7 minutes) and `runut-cepat` (one agent for the 90-second live test, 5 to 65 seconds over 44 turns). Search is keyword based with a small synonym list — deterministic, explainable, and it returns "not found" rather than guessing.

**How prompts drive the AI generation.** Prompts shape the work; code enforces the rules.

- The lead's SOP forces three separate phases: gather evidence, write, audit. The writer only sees evidence. The auditor checks every sentence against `periksa_sumber` / `periksa_jawaban` before anything reaches the asker. A separate auditor exists because one model that searches, writes and checks itself tends to approve its own mistakes.
- The prompt fixes **one exact sentence** for "nothing found" and bans words that imply hidden data ("access", "restricted", "confidential"). An early WorkBuddy run leaked the hint "in the sources you can access"; runs on the corrected prompts return the exact sentence. All runs, failures included, are in `docs/hasil-uji.md`.
- The writer must build record gaps only from visible evidence: "the reason for the revision is not recorded, Dedi was in that conversation" is allowed; "management knows more" is forbidden, because it would leak.
- The lead is told to display the recorded text word for word and not to write an answer before the check returns. This is the one rule that is **prompt-only**, because WorkBuddy controls the screen — a documented known limit.
- **Why code is the first line:** after a test in which the writer invented a truck breakdown and attached one real source id, we added `periksa_jawaban`. After a test in which the model repeated an old answer from conversation memory once access was revoked, `catat_jawaban` now refuses any answer without a fresh `telusuri` / `cari` call since the previous answer attempt (the only exception is a same-question retry after a failed answer check). Prompts asked for both behaviours; code now guarantees them.

WorkBuddy's plugin format bundles the MCP server so every team member receives the same tools and nothing else can reach company data. Its task view shows which agent did what, which is the evidence that the auditor actually ran.

### Business Value — quantifiable metrics and defined impact

| Impact | Measured result | Where it is evidenced |
| --- | --- | --- |
| **Time to an answer** | A question that meant messaging three people and scrolling a WhatsApp group returns a cited timeline in 1–3 minutes with the four-agent team, or 5–65 seconds with Runut Cepat across 44 live-test turns (all under the 90-second stage limit). Empty or restricted questions return in about 30 seconds. | `README.md`, `docs/surprise-test.md` |
| **Access control proven, not promised** | 298/298 automated tests pass. Switching the permission filter off on purpose makes 35 of them fail, which shows the tests detect leaks. | `README.md`, `docs/hasil-uji.md` |
| **Hallucination resistance measured** | In a blind test written by an agent that could not see the code, the answer check rejected 26 of 30 invented answers and passed 29 of 30 honest ones. | `docs/hasil-uji.md`, `docs/accountability-sheet.md` |
| **Auditability for compliance** | 570 hash-chained audit-log entries verified intact; every search, source returned and final answer is logged, and tampering breaks the chain. This is the evidence a DPIA under PP 33/2026 asks for. | `docs/index.html`, `docs/accountability-sheet.md` |
| **Errors caught and published** | 49 of 62 WorkBuddy agent runs passed; all 13 partial/failed findings have a documented fix and a passing re-run, with failures left visible on the live results page. | `docs/index.html`, `docs/hasil-uji.md` |
| **Knowledge retained** | Record gaps name the missing piece and the person who likely knows it; Runut drafts the question to them and sends only after a person approves. An unwritten reason becomes a written one. | `docs/deskripsi-proyek.md` |
| **Conflicting evidence handled** | Conflicting sources are flagged with the reason for the choice (the 2025 SOP says 5 days; the 15 October announcement says 7). | `docs/deskripsi-proyek.md` |
| **Cost** | Runs on WorkBuddy credits (roughly 1–8 credits per fast run) and a small Node.js server. No per-seat enterprise-search licence, no vector database, no model hosting. | `docs/surprise-test.md`, `docs/product-sharing.md` |

**Honest limits, stated in the submission as in the repo:** a wrong conclusion drawn from true facts can still pass the answer check; the model can still write text to the screen before the check returns; sending messages is simulated; identity comes from configuration rather than SSO; keyword search can miss loosely worded questions. Full list in `docs/accountability-sheet.md`.

---

## 2. Cover Image

| File | Size | Use |
| --- | --- | --- |
| `docs/cover/runut-cover-380x216.png` | **380 × 216 px, 16:9** | Upload to the form — matches the recommended size exactly |
| `docs/cover/runut-cover-1520x864.png` | 1520 × 864 px (4×) | Retina / any larger placement, same aspect ratio |
| `docs/cover/runut-cover-1920x1080.png` | 1920 × 1080 px, true 16:9 | If the form enforces an exact 1.778 ratio |
| `docs/cover/runut-cover.svg` | 1520 × 864 viewBox | Editable source |
| `docs/cover/runut-cover.html` | — | Wrapper used to render the PNGs |

The design shows the core promise in one glance: scattered chat/document/task sources on the left, a permission gate in the middle, and a three-part cited answer on the right. Dark navy with the video's accent palette, bold type sized to stay readable at 380 px wide. No third-party imagery.

---

## 3. Project Link

**Primary (paste this in the form):**
`https://fajaraji.github.io/runut-tencent/` — live results page: 62 agent test runs with evidence screenshots, the 570-entry hash-chained audit log, and the integrity check. Both this URL and the GitHub repo returned HTTP 200 on 7 November 2026, and the live page already shows the current numbers (298/298 tests, 13/13 findings fixed, updated 7 November) — the numbers in the description match what judges will see.

> Runut is a WorkBuddy plugin, not a hosted web app, so there is no interactive URL to log into. The live results page plus the uploaded demo video are the demo. If the form specifically wants a "demo link" rather than a project link, paste the YouTube URL from §9 of `docs/youtube-upload-kit.md` once the video is uploaded, and keep this results page as a supporting link.

**Supporting links (add to the description or a "more info" field):**

| Purpose | URL |
| --- | --- |
| Source, install guide, full README | https://github.com/fajaraji/runut-tencent |
| Live results / audit log | https://fajaraji.github.io/runut-tencent/ |
| Accountability sheet (what it can and cannot do) | https://github.com/fajaraji/runut-tencent/blob/main/docs/accountability-sheet.md |
| Architecture diagram (Mermaid + components) | https://github.com/fajaraji/runut-tencent/blob/main/docs/arsitektur.md |
| All test runs, failures included | https://github.com/fajaraji/runut-tencent/blob/main/docs/hasil-uji.md |
| Getting started, no terminal required | https://github.com/fajaraji/runut-tencent/blob/main/docs/panduan-mulai.md |

> **Before you submit:** commit and push the new files in this pack (`docs/submission.md`, `docs/cover/`, `docs/runut-architecture.pptx`) if the form or the judges expect them in the repo. Two other useful docs are still untracked (`docs/image-audit.md`, `docs/youtube-upload-kit.md`). Replace the video URL placeholder in `docs/youtube-upload-kit.md` §9 after the demo is uploaded.

---

## 4. Architecture Diagram PPT

`docs/runut-architecture.pptx` — six slides, 16:9, editable native shapes:

1. Cover — Runut, architecture diagram, hackathon and challenge
2. **System architecture** — full flow, trust boundary highlighted (the main diagram)
3. **Trust boundary** — six code-enforced guardrails and what each one prevents
4. **Prompt-driven generation** — the three-phase SOP and the prompt/code split
5. **Answer shape and verification** — the three-part answer plus measured test results
6. Links and known limits

Source Mermaid diagram: `docs/arsitektur.md`. Component detail: `docs/product-sharing.md`.

---

## 5. Alternative wordings (optional)

**Project Title** — pick one; keep it identical everywhere.

| Option | Value |
| --- | --- |
| A ⭐ (recommended, used above) | `Runut — Permission-Aware Project History Assistant` |
| B (short) | `Runut` |
| C (benefit-led, matches the video title) | `Runut — Project History AI That Only Shows What You're Allowed to See` |
| D (challenge-aligned) | `Runut — The Workplace Brain, Within Permissions` |

**Short Blurb** — all under the 10-word limit.

| Option | Words | Value |
| --- | --- | --- |
| A ⭐ (used above; matches README and the video kit) | 7 | `Project history, rebuilt from sources, within permissions.` |
| B | 9 | `Cited project history from chats, within each employee's permissions.` |
| C | 8 | `Every answer sourced, every permission checked, every refusal identical.` |

Do not switch blurb between the form, the video description and `docs/youtube-upload-kit.md` §9 — they should say the same thing.

---

## 6. Social Post Link

**Form field value:** `PASTE PERMALINK HERE`

**Status: awaiting a public post.** There is no publishing connector bound to this workspace (only GitHub, currently `auth-required`), so I cannot create the post or a real permalink. Everything else in this pack is ready.

**What to do**

1. Open [`docs/social-post-kit.md`](social-post-kit.md) and copy the LinkedIn post (recommended, 1,643/3,000 chars) or one of the four shorter variants. All five are length-checked and carry both required hashtags: `#WorkBuddy` and `#TencentCloudHackathon`.
2. Publish **publicly**. Optionally attach `docs/cover/runut-cover-1920x1080.png` — use the 1920 × 1080 version for a social feed, not the 380 × 216 form thumbnail.
3. Copy the **permalink to the post itself** (LinkedIn → `⋯` → Copy link to post; X → Share → Copy link; Threads → `⋯` → Copy link). Not a profile URL.
4. Paste it into the §0 cheat sheet above, the field at the top of this section, and the §8 link-log table in the kit. Keep all three identical.
5. Confirm in a private/incognito window, logged out, that the post opens and both hashtags are visible. A bot-level 403 from X or LinkedIn is normal and is not a privacy problem.

**If you post on two platforms**, add both rows to the kit's log and submit the LinkedIn link as primary — it is the only variant with the full description plus the "demo data is fictional" and "message sending is simulated" disclaimers.

**If you want me to publish it**, browser automation can drive a compose UI in a browser profile where you are already signed in. That is a public, hard-to-unsay action, so I will only attempt it if you name the platform explicitly.

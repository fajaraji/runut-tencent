# Runut

**Project history, rebuilt from sources, within permissions.**

An office AI that reads every chat and document can tell anyone what a colleague earns. Without one, the reason a project slipped stays spread across a WhatsApp group, a revised document and a task list, and people end up asking colleagues one by one.

Runut is a project history assistant for staff. It builds answers from chats, documents and tasks, using only data the person asking is allowed to see. We built it on WorkBuddy for AI CAN DO IT Tencent Cloud Hackathon Indonesia 2026, Challenge A (The Workplace Brain), scenario Project history.

Ask "Kenapa stok di Makassar terlambat, dan apa yang belum selesai?" and the answer has three parts.

1. **Kronologi.** A timeline where every line cites its source.
2. **Yang belum selesai.** Unfinished tasks with their owners and due dates.
3. **Celah catatan.** What was never written down, and who probably knows.

Ask "Berapa gaji Rina?" as staff and Runut replies that it found no data, the same opening sentence it gives for a project that does not exist. Nothing confirms that the hidden data is there.

Live results and audit log: [fajaraji.github.io/runut-tencent](https://fajaraji.github.io/runut-tencent/)

## How it works

Both modes share one MCP server that enforces the rules in code.

| Step | What happens | Enforced by |
| --- | --- | --- |
| Permissions | One table, `data/izin.csv`, says which groups may see each source. A source not listed is closed to everyone | Code |
| Filter, then search | The server reads the asker's identity and removes closed sources before searching, so the model never receives them | Code |
| Answer check | Code compares the numbers, dates, people and sources in each sentence with the cited evidence | Code |
| Sending messages | The agent only writes drafts. A person approves in a separate console | Code |
| Audit log | Each entry is hash-chained to the one before, so a quiet edit shows | Code |
| Answer order and memory | The model is told not to show an answer before it passes the check, and not to repeat an old answer after access changes | Prompt only |

| Mode | Use | Time |
| --- | --- | --- |
| `workbuddy/runut-tim/` | Careful investigation by four agents: Tata (lead), Lusi (source tracer), Yusuf (timeline writer), Riksa (citation auditor) | 1.5 to over 7 minutes |
| `workbuddy/runut-cepat/` | One agent for the 90-second live test, with the same filter and check | 5 to 65 seconds over 44 turns |

## Results and known limits

- 288 automated tests pass. With the permission filter switched off on purpose, 37 of them fail.
- In a blind test written by an agent that could not see the code, the answer check rejected 26 of 30 invented answers and passed 29 of 30 honest ones.
- A wrong conclusion drawn from true facts can still pass the check.
- After access was revoked, the model once repeated an old answer from memory. A prompt rule and opening a new task now cover this, and code does not guarantee it.
- Sending messages is simulated in this prototype.

Every run, failures included, is in [docs/hasil-uji.md](docs/hasil-uji.md).

## Submission documents

| Document | Link |
| --- | --- |
| **Getting started (non-technical)** | [docs/panduan-mulai.md](docs/panduan-mulai.md) — no terminal required |
| Technical guide | [docs/panduan-teknis.md](docs/panduan-teknis.md) — CLI, architecture, limits |
| Project description | [docs/deskripsi-proyek.md](docs/deskripsi-proyek.md) |
| Accountability sheet | [docs/accountability-sheet.md](docs/accountability-sheet.md) |
| Test results, failures included | [docs/hasil-uji.md](docs/hasil-uji.md) |
| Architecture diagram | [docs/arsitektur.md](docs/arsitektur.md) |
| Product sharing (WorkBuddy) | [docs/product-sharing.md](docs/product-sharing.md) |
| 90-second live test guide | [docs/surprise-test.md](docs/surprise-test.md) |
| Demo video script | [docs/naskah-demo.md](docs/naskah-demo.md) |
| Audit log and results page | [GitHub Pages](https://fajaraji.github.io/runut-tencent/) (`docs/index.html`) |

## Repository

| Folder | Contents |
| --- | --- |
| `src/` | Runut MCP server. Readers for WhatsApp exports and CSV, permission filter before search, masking, hidden-instruction flags, answer check, draft-only messaging, hash-chained audit log |
| `workbuddy/runut-tim/` | WorkBuddy expert team: Tata (lead), Lusi (source tracer), Yusuf (timeline writer), Riksa (citation auditor) |
| `workbuddy/runut-cepat/` | Single agent for the 90-second live test. See [docs/surprise-test.md](docs/surprise-test.md) |
| `data/` | Our own fictional dataset (PT Sinar Rasa Nusantara, a snack distributor): raw WhatsApp exports, documents, task board, permissions table. See [data/README.md](data/README.md) |
| `tests/` | 288 automated tests, including 31 handbook-style cases and 225 attacks on the answer check |
| `scripts/` | Installer, identity switch, approval console, MCP smoke test, results page generator, browser control panel |
| `installer/` | One-click installers for Windows and macOS, plus the control panel page |
| `video/` | Source of the demo video: script, animated scenes, voice, music and render steps. The rendered file and screen captures are not in git |
| `docs/` | Submission documents, guides, and evidence screenshots |

## Install Runut into WorkBuddy

You need two things on your computer:

- **Node.js 24 or newer** — download from [nodejs.org](https://nodejs.org) (choose LTS). Check with `node --version`.
- **WorkBuddy** for Windows or macOS — Runut runs inside it as an expert.

There are two ways to install. Pick the one that fits you.

### Option A — For non-technical users (double-click, no terminal)

1. **Close WorkBuddy completely.** It reads its expert list at startup, so it must be closed before installing.
2. **Double-click the installer** for your machine:

   | Machine | File to double-click |
   | --- | --- |
   | Windows | `installer/pasang-windows.bat` |
   | macOS / Linux | `installer/pasang-mac.command` |

   > On Mac, if it says *"unidentified developer"*: right-click the file → **Open** → **Open** again. This is only needed once.

3. **Wait for it to finish.** A black window opens and runs through four steps automatically — checking Node.js, downloading dependencies, installing Runut into WorkBuddy, and opening the control panel. Press Enter when prompted.
4. **Open WorkBuddy.** Go to **Experts** in the left menu, find **Runut Project History Team**, click **Summon**, and allow the connection when asked.
5. **Type your question**, for example: `Kenapa stok di Makassar telat, dan apa yang masih open?`

The browser control panel stays open for switching roles and approving messages. Full walkthrough: **[docs/panduan-mulai.md](docs/panduan-mulai.md)**.

### Option B — For technical users (command line)

```bash
npm install
npm test
```

Close WorkBuddy completely before installing — an app still shutting down can drop Runut from My Experts.

```bash
node scripts/pasang-workbuddy.ts staf
```

Reopen WorkBuddy. Summon an expert and allow the `runut` MCP server connection when prompted.

Switch the asker (applies on the next question, no restart):

```bash
node scripts/ganti-identitas.ts manajer
```

Start a new task after any identity or access change — the permission filter guards the tools, not the conversation memory.

Approve draft messages before sending:

```bash
node scripts/setujui.ts              # list drafts awaiting approval
node scripts/setujui.ts <draft_id>   # approve a draft
```

Other scripts:

```bash
node scripts/coba-mcp.ts u-andi "Kenari"   # smoke test without WorkBuddy
node scripts/pengaturan.ts                  # control panel on localhost:4173
node scripts/buat-halaman.ts                # rebuild the results page
```

Technical guide with architecture and limits: **[docs/panduan-teknis.md](docs/panduan-teknis.md)**.

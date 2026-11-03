# Runut

**Project history, rebuilt from sources, within permissions.**

Runut is an accountable AI agent for AI CAN DO IT Tencent Cloud Hackathon Indonesia 2026, Challenge A (The Workplace Brain), scenario Project history. Ask it "Why was stock late in Makassar, and what is still open?" and it rebuilds the story from chats, documents and task boards, using only what the asker is allowed to see. Every answer has three parts.

1. A timeline where every sentence cites its source.
2. What is still open, from the task board.
3. Gaps in the record: what was never written down, and who was in the conversation and likely knows.

It is built as a WorkBuddy expert team of four agents on top of one MCP server that enforces the rules in code.

## Submission documents

| Document | Link |
| --- | --- |
| Project description | [docs/deskripsi-proyek.md](docs/deskripsi-proyek.md) |
| Accountability sheet | [docs/accountability-sheet.md](docs/accountability-sheet.md) |
| Test results, failures included | [docs/hasil-uji.md](docs/hasil-uji.md) |
| Architecture diagram | [docs/arsitektur.md](docs/arsitektur.md) |
| Product sharing (WorkBuddy) | [docs/product-sharing.md](docs/product-sharing.md) |
| Demo video script | [docs/naskah-demo.md](docs/naskah-demo.md) |
| Audit log and results page | GitHub Pages of this repo (`docs/index.html`) |

## Repository

| Folder | Contents |
| --- | --- |
| `src/` | Runut MCP server. Readers for WhatsApp exports and CSV, permission filter before search, masking, hidden-instruction flags, answer check, draft-only messaging, hash-chained audit log |
| `workbuddy/runut-tim/` | WorkBuddy expert team: Tata (lead), Lusi (source tracer), Yusuf (timeline writer), Riksa (citation auditor) |
| `workbuddy/runut-cepat/` | Single agent for the 90-second live test. See [docs/surprise-test.md](docs/surprise-test.md) |
| `data/` | Our own fictional dataset (PT Sinar Rasa Nusantara, a snack distributor): raw WhatsApp exports, documents, task board, permissions table. See [data/README.md](data/README.md) |
| `tests/` | 283 automated tests, including 31 handbook-style cases and 222 attacks on the answer check |
| `scripts/` | Installer, identity switch, approval console, MCP smoke test, results page generator |
| `docs/` | Submission documents and evidence screenshots |

## Run it

Needs Node.js 24 or newer (TypeScript runs directly, no build step) and WorkBuddy for Windows or macOS.

```bash
npm install
npm test
node scripts/coba-mcp.ts u-andi "Kenari"
```

Install into WorkBuddy (close WorkBuddy first, then reopen it):

```bash
node scripts/pasang-workbuddy.ts staf
```

The first time you summon the team, WorkBuddy asks to connect the `runut` MCP server. Switch the asker, for example between staff (Andi) and manager (Sari):

```bash
node scripts/ganti-identitas.ts manajer
```

The identity switch applies on the next question, with no restart.

Messages to colleagues are only sent after a person approves them:

```bash
node scripts/setujui.ts
node scripts/setujui.ts <draft_id>
```

Rebuild the results page from the audit log:

```bash
node scripts/buat-halaman.ts
```

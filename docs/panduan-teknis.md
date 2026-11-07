# Runut Technical Guide

*For developers and hackathon judges. The guide for non-technical users is at [panduan-mulai.md](panduan-mulai.md).*

---

## Requirements

| Component | Version | Notes |
|---|---|---|
| Node.js | 24 or newer | TypeScript runs directly, no build step. `node --version` must be ≥ 24. |
| WorkBuddy | Windows or macOS | Expert plugin. |
| Python | 3.x | Used by the installer to register the expert via WorkBuddy's `register_expert.py`. On Windows, invoked via `py`. |

---

## Installation via terminal

```bash
npm install
npm test
node scripts/pasang-workbuddy.ts staf
```

**Close WorkBuddy first** before running `pasang-workbuddy.ts`, then reopen it after. Available roles: `staf`, `manajer`, `direktur`, `baru`, `hr`, `it`.

This installer:
1. Copies `workbuddy/runut-tim` and `workbuddy/runut-cepat` to `~/.workbuddy-ai/plugins/marketplaces/my-experts/plugins/`
2. Bumps the plugin version (`0.1.0` → `0.1.<unix-minute>`), then clears the old version cache — WorkBuddy runs a cached copy per version, so the version must increase on every change
3. Writes `logs/identitas.txt`
4. Writes `.mcp.json` inside each plugin, pointing to `src/server.ts` with `RUNUT_USER_FILE`
5. Registers both plugins via WorkBuddy's `register_expert.py`
6. Removes leftover `runut-staf` / `runut-manajer` entries from the user's `mcp.json` (legacy format)

Alternative without terminal: double-click `installer/pasang-windows.bat` or `installer/pasang-mac.command`.

---

## Other commands

```bash
# Switch the asking identity. Takes effect on the next question, without restart.
node scripts/ganti-identitas.ts manajer

# List drafts awaiting approval
node scripts/setujui.ts

# Approve a draft
node scripts/setujui.ts <draft_id>

# Smoke test MCP without WorkBuddy
node scripts/coba-mcp.ts u-andi "Kenari"

# Rebuild the test results page from audit log
node scripts/buat-halaman.ts

# Control panel in browser (localhost:4173)
node scripts/pengaturan.ts
```

### CLI and control panel share one implementation

`scripts/workbuddy.ts` holds the logic used by all three callers:

| Function | Used by |
|---|---|
| `tulisIdentitas` / `bacaIdentitas` | `ganti-identitas.ts`, `pengaturan.ts` |
| `daftarDraf` / `setujuiDraf` | `setujui.ts`, `pengaturan.ts` |
| `tulisMcp` | `pasang-workbuddy.ts` |

So approving a draft in the browser and approving it via terminal produce identical files and audit log entries. The panel only writes to `logs/identitas.txt`, `logs/draf/`, and `logs/persetujuan/` — there is no second path.

The panel listens on `127.0.0.1` only, and rejects requests whose `remoteAddress` is not loopback. The model has no MCP tool that calls `pengaturan.ts`, so approval remains impossible for the model to perform.

---

## Structure

```
src/          MCP server: WhatsApp/CSV reader, permission filter, masking,
              hidden instruction detection, answer checker,
              draft-only messaging, hash-chained audit log
workbuddy/    Two plugins: runut-tim (four agents) and runut-cepat (single agent)
data/         Fictional dataset for PT Sinar Rasa Nusantara
tests/        298 automated tests
scripts/      Installer, identity switcher, approval console, panel, results page
installer/    One-click installers and control panel HTML
docs/         Documentation and screenshot evidence
```

### Four agents

| Agent | Name | Role | Turn limit |
|---|---|---|---|
| `runut-team-lead` | Tata | Lead, History Editor | 150 |
| `penelusur-sumber` | Lusi | Source Tracer | 50 |
| `penyusun-kronologi` | Yusuf | Timeline Writer | 50 |
| `pemeriksa-sumber` | Riksa | Citation Auditor | 50 |

SOP: **Search** → **Compose** → **Verify** → **Record, then deliver**. If evidence is empty, phases 2 and 3 are skipped and the answer takes "~30 seconds".

`runut-cepat` is a single agent with a limit of 4 tool calls and 12 turns, for answers under 90 seconds.

---

## Where the trust boundary is

The access filter runs **before** search, inside the MCP server. No prompt holds this rule.

| Rule | Implemented in |
|---|---|
| Sources outside `data/izin.csv` are closed to everyone | `src/runut.ts` — filter before search |
| Identity cannot be passed as a tool argument | `src/server.ts` — `RUNUT_USER_FILE` read on every call |
| "Not found" and "not allowed" answer identically | `src/runut.ts` — `TIDAK_DITEMUKAN` |
| ID numbers and phone numbers are masked | `src/runut.ts` — except HR when genuinely needed |
| Instructions inside sources are treated as data | `src/runut.ts` — `POLA_INSTRUKSI` |
| Every sentence must cite a valid source | `src/runut.ts` — `periksaJawaban` |
| Cannot send without human approval | `src/runut.ts` — send tool refuses without approval file |
| Audit log cannot be silently modified | `src/audit.ts` — hash chain |

---

## Known limitations

- **The permission filter protects the tool, not the conversation.** Old conversations still remember previous answers. After switching identity or changing access rights, **start from a new task**.
- The approval console runs on the same machine as WorkBuddy.
- Identity comes from configuration, not enterprise SSO.
- The answer checker is a fixed rule, not a reader. On answers written by a separate agent, it rejects 26 of 30 fabricated answers and passes 29 of 30 honest ones — but it cannot catch wrong conclusions drawn from correct facts.
- `runut-cepat` has no separate checker agent.
- Search is keyword-based with a small synonym list. Questions far from source terminology may fail and answer "not found" rather than guess.
- The keyword list for record-gap detection is tuned for this dataset.

---

## Testing

```bash
npm test
```

298 tests: 30 accountability, 31 handbook-style cases (K01–K31), 231 attacks against the answer checker (87 curated + 140 blind cases written without seeing the code, plus 4 checker behaviour tests), 6 data format tests.

**Mutation testing:** intentionally disabling the permission filter causes 35 tests to fail — proof that the tests actually catch leaks.

```bash
node scripts/coba-mcp.ts u-andi "Kenari"
```

Smoke test directly against the MCP server without WorkBuddy.

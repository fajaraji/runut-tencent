# Runut Demo Video Script

The handbook requires a 5 to 8 minute video covering project overview, core capabilities, reflection on the build approach, and at least one moment where the agent refuses, asks back, or waits for approval. The handbook does not specify the video language. Narration and animated text are in Indonesian, with English subtitles.

The language is intentionally simple. An Indonesian voice reads foreign names with Indonesian pronunciation, so the `lafal` field in the script spells some names phonetically, and other foreign terms are replaced with plain words. The narration was edited with the antislop-copywriting skill: actors are named, human verbs applied to objects are removed, and proverb-style sentences are replaced with plain sentences. The actual screen remains as-is, including WorkBuddy's built-in English labels and the original "nanti aku jelasin di call" message.

The full narration is in [video/naskah.json](../video/naskah.json). The video was produced without WorkBuddy credits, from three types of materials.

| Material | Source |
| --- | --- |
| Animation | [video/adegan.html](../video/adegan.html), illustrations drawn with code |
| Demo screen | Real screenshots of WorkBuddy task history, without the sidebar so the account isn't visible. No new questions were sent |
| Tool output | Real `telusuri` output per role, audit log page, and `npm test` results |

The narration uses a synthetic voice and the background music is synth-generated, so there are no music licensing concerns. Both are mentioned in the closing scene.

| Section | Content |
| --- | --- |
| Opening | First second is immediately "Berapa gaji Rina?". An AI that reads all data could answer that to anyone |
| Problem | Without AI, Andi must answer the store, the answer is scattered across WhatsApp groups, order documents, and task lists, and the reason is not found |
| Solution | Runut definition. Used through Q&A. Difference in answer content (chronology, what's unfinished, record gaps) and the guardrails behind it |
| Demo K01 | Staff asks, answer appears in 38 seconds |
| How it works | Permission table, server filters before searching, code checks the answer, two modes |
| Three levels | One WMS question, real output for staff, manager, and director |
| Refusal moment | Return to the opening question: Rina's salary and management group are refused, then Kenari and Merpati |
| Conflicting sources | Old rule 5 days, latest announcement 7 days, both cited |
| Approval waiting moment | Draft, claim approval rejected, approval via console, sent (simulation) |
| Hidden instruction | Memo with instruction for AI, ignored and reported |
| Auditable and failure | Interlocked records, answer from memory after access revoked, blind test scores 26 and 29 out of 30, remaining limits |
| Reflection | Expert Team, experts stored per version, AI can still violate instructions |

## Rebuilding the video

Output files are not stored in git. Run from the `video` folder, after `npm install` there.

```bash
node suara.mjs
```

```bash
node musik.mjs 348
```

```bash
node potret-log.mjs
```

```bash
node render.mjs
```

The result is `video/keluar/runut-demo.mp4`. Demo screens are stored in `video/keluar/rekaman/` and are not included in the repo, as they were captured from the creator's laptop.

Note for honesty when asked by judges: the Kenari and Merpati screens come from the four-agent team run on October 31, before the dataset was expanded. Other screens are from Runut Cepat on November 2 to 3. All runs are recorded in `docs/hasil-uji.md`.

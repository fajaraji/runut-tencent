# Runut — social post kit (required submission item)

**Requirement:** publish the project on LinkedIn, X, Threads or another social platform with the hashtags `#WorkBuddy` and `#TencentCloudHackathon`, then submit the post link.

**Prepared:** 7 November 2026. Part of the [submission pack](submission.md).

> **One thing only you can do:** no LinkedIn, X or Threads account is connected to this workspace (the only bound connector is GitHub, currently `auth-required`, and the connector catalogue has no organic social-posting tool — only ad platforms, document parsers and WeCom messaging). So I cannot publish a public post or generate a real permalink on your behalf. This kit makes the post copy-paste ready and gives you a link-log field to fill in afterwards. See §7 if you want me to try browser automation using a session you are already logged into.

---

## 1. Fastest path (3 steps)

1. Pick **one** platform below. LinkedIn is recommended: it has the most room, the link previews well, and hackathon judges are likely to find it.
2. Copy the code block **exactly**, including both hashtags. Optionally attach `docs/cover/runut-cover-1920x1080.png`.
3. Publish **publicly**, copy the post permalink, and paste it into §6 of this file and the **Social Post Link** field in `docs/submission.md`. That URL is what goes on the form.

Publishing on two platforms is fine — submit the one with the fuller text, or the LinkedIn link.

---

## 2. LinkedIn (recommended)

1,643 characters, well inside LinkedIn's 3,000-character post limit.

```text
We built an office AI that refuses to answer "Berapa gaji Rina?" — "How much does Rina earn?"

An assistant that reads every chat and document could answer that to anyone. But without one, the reason a project slipped stays scattered across a WhatsApp group, a revised purchase order and a task board, and someone ends up asking three colleagues one by one.

Runut is a project history assistant for staff. One question returns three things: a timeline where every line cites its source, the tasks still open with owners and due dates, and the gaps in the record — what was never written down, and who probably knows.

The guardrails live in code, not just in the prompt. One permissions table is applied before search, so restricted text never reaches the model. Every sentence is checked against its cited evidence before it is shown. Messages stay as drafts until a person approves them. Every search, source and answer lands in a hash-chained audit log. A restricted project and a project that does not exist get exactly the same reply.

Built on WorkBuddy (Expert Teams + a bundled MCP server) for AI CAN DO IT Tencent Cloud Hackathon Indonesia 2026 — Challenge A, The Workplace Brain.

298/298 automated tests pass. Switch the permission filter off on purpose and 35 fail. We publish the failures too, alongside 62 agent test runs and the full audit log.

Live results and audit log: https://fajaraji.github.io/runut-tencent/
Source and install guide: https://github.com/fajaraji/runut-tencent

The company, people and messages in the demo are fictional. Message sending is simulated in this prototype.

#WorkBuddy #TencentCloudHackathon
```

**Optional first comment** (keeps the main post clean; delete if not needed):

```text
Architecture diagram, accountability sheet and all 62 agent runs (failures included): https://github.com/fajaraji/runut-tencent
```

---

## 3. X / Twitter

235 of 280 weighted characters. X counts every URL as 23 characters regardless of length; 45 characters of headroom remain if you want to add a handle or a short extra clause.

```text
An office AI that reads every chat can leak a salary. We built one that can't.

Runut: cited project history, filtered BEFORE the model sees it. 298 tests, failures published.

https://fajaraji.github.io/runut-tencent/

#WorkBuddy #TencentCloudHackathon
```

If you want a two-post thread, use the post above as 1/2 and reply with:

```text
2/2 One question gives a cited timeline, open tasks and the gaps in the record. A restricted project and a project that does not exist get exactly the same sentence — so "no data" never confirms hidden data exists.

Source + install guide: https://github.com/fajaraji/runut-tencent
```

---

## 4. Threads

428 of 500 characters, 72 characters of headroom.

```text
"Berapa gaji Rina?" — "How much does Rina earn?"

An office AI could tell anyone. Runut answers the opposite: why was stock late in Makassar?

One question gives a cited timeline, open tasks, and the gaps in the record. Permissions are filtered BEFORE search, every line is checked, messages need approval.

Built on WorkBuddy. Failures published too:
https://fajaraji.github.io/runut-tencent/

#WorkBuddy #TencentCloudHackathon
```

---

## 5. Other platforms / backups

**Generic short post** — 258 of 280 weighted characters. Works on Facebook, Mastodon (500-char default), Bluesky (300 graphemes) or a hackathon Discord/Slack announcement.

```text
Runut answers "why was this delayed?" from chats, docs and tasks — and gives "what does Rina earn?" the same reply as a project that doesn't exist.

Built on WorkBuddy. 298 tests, failures published: https://fajaraji.github.io/runut-tencent/

#WorkBuddy #TencentCloudHackathon
```

**Bahasa Indonesia short post** — 235 of 280 weighted characters. Useful for local reach; same hashtags.

```text
Runut menjawab "kenapa proyek telat?" dari chat, dokumen, tugas — dan menolak "berapa gaji Rina?" seperti saat proyeknya tak ada.

Izin disaring SEBELUM model membaca. 298 tes: https://fajaraji.github.io/runut-tencent/

#WorkBuddy #TencentCloudHackathon
```

> **Bluesky note:** Bluesky counts graphemes, not weighted URLs. The generic short post is 276 raw characters, so it fits the 300 limit — but the 41-character URL is *not* shortened there. Check before posting if you edit it.

---

## 6. Validation

Checked with a script that re-weights URLs to 23 characters for X:

| Variant | Count | Limit | Headroom | Both hashtags |
| --- | --- | --- | --- | --- |
| LinkedIn | 1,643 raw | 3,000 | 1,357 | yes |
| X | 235 weighted | 280 | 45 | yes |
| Threads | 428 raw | 500 | 72 | yes |
| Generic short | 258 weighted | 280 | 22 | yes |
| Bahasa short | 235 weighted | 280 | 45 | yes |

Every claim in every post is traceable to this repo: 298/298 tests and the 35 failures (`README.md`, `docs/hasil-uji.md`), 62 agent runs (`docs/index.html`), the permission filter before search (`docs/arsitektur.md`), and the identical empty reply (`README.md`). The demo-is-fictional and simulated-messaging disclaimers are in the LinkedIn post because that is the one with room for them.

---

## 7. Publishing checklist

- [ ] Post is **public**, not followers-only or connection-only. A judge who is not logged in must be able to open it.
- [ ] Both hashtags are present and spelled exactly: `#WorkBuddy` and `#TencentCloudHackathon`.
- [ ] `https://fajaraji.github.io/runut-tencent/` is in the post and previews correctly (HTTP 200 verified 7 November 2026).
- [ ] Optional: attach `docs/cover/runut-cover-1920x1080.png` (true 16:9) or `runut-cover-1520x864.png`. Do **not** upload the 380 × 216 version as a social image — it is sized for the form's showcase thumbnail and will look soft on a feed.
- [ ] Optional: tag the official WorkBuddy and Tencent Cloud accounts if you know their handles. Do not add a handle without confirming it, and note that adding one to the X post uses part of the 45-character headroom.
- [ ] Copy the **permalink to the post itself**, not your profile page and not the compose screen.

**How to get the permalink**

| Platform | Where to find it |
| --- | --- |
| LinkedIn | Post → `⋯` menu → **Copy link to post**. Format: `https://www.linkedin.com/posts/<handle>_<activity-id>` or `/feed/update/urn:li:activity:<id>` |
| X | Post → **Share** → **Copy link**. Format: `https://x.com/<handle>/status/<id>`. Use `x.com`, not the `twitter.com` variant, for consistency |
| Threads | Post → `⋯` → **Copy link**. Format: `https://www.threads.net/@<handle>/post/<id>` |
| Facebook / other | Post timestamp is usually the permalink; right-click → copy link address |

> A `curl -I` on an X or LinkedIn permalink often returns 403 or a login wall to bots. That is normal and does **not** mean the post is private. Verify instead by opening the link in a private/incognito window while logged out.

**Can I publish it for you?** Only via browser automation against a browser profile where you are already signed in. That would open the compose UI, paste the text and click publish — a public, hard-to-unsay action. Say the word with the platform name and I will attempt it; I will not do it unprompted.

---

## 8. Link log — fill this in after publishing

| Field | Value |
| --- | --- |
| Platform | _e.g. LinkedIn_ |
| Account / handle | _e.g. linkedin.com/in/…_ |
| Post permalink | **`PASTE HERE`** |
| Published at (WIB / UTC) | _e.g. 7 Nov 2026, 20:15 WIB_ |
| Public visibility confirmed in incognito | _yes / no_ |
| Hashtags visible in the live post | _yes / no_ |

Once the permalink is in the table, copy it into:

1. `docs/submission.md` → §0 cheat sheet → **Social Post Link**
2. `docs/submission.md` → §6 **Social Post Link** section
3. The hackathon submission form field for the social post

Keep the same link in all three places. If you publish on more than one platform, add extra rows to the table and submit the LinkedIn link as primary (it carries the full text and both disclaimers).

---

## 9. After publishing

- If the demo video is already live, add its URL as the first comment on the post. The share posts in [`docs/youtube-upload-kit.md`](youtube-upload-kit.md) §8 are for the video and deliberately do **not** replace this post — they lack `#TencentCloudHackathon`.
- Commit and push `docs/social-post-kit.md` and the updated `docs/submission.md` if judges review the repo.
- Do not edit the published post's hashtags after submission; the link and the form then disagree.
- If the post is deleted or made private before judging, the form link breaks — republish and update the log.

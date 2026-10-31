# Runut

**Blurb (7 words):** Project history, rebuilt from sources, within permissions.

## Project overview

- **Challenge and scenario.** Challenge A, The Workplace Brain. Scenario: Project history ("Why was stock late in Makassar, and what is still open?").
- **Target users.** Operations and sales staff, team leads and new managers who inherit a project and need to know why something happened.
- **What it delivers.** One question returns three things. A timeline where every sentence cites the chat message, document or task it came from. The tasks that are still open, with owner and due date. The gaps in the record, meaning what was never written down, and who was in the conversation and likely knows.

## Real-world insight

When a project goes wrong in an Indonesian company, the story is spread across WhatsApp groups, revised documents and task boards. The reason for a decision often lives in a chat ("I'll explain on the call") and never reaches the official record. The people who were there become the only way to find out, and they get asked the same questions again and again.

The numbers behind this:

| Evidence | Figure | Source |
| --- | --- | --- |
| Share of the work week teams spend looking for information | More than 25% | [Atlassian State of Teams 2025](https://www.atlassian.com/blog/innovation/how-the-atlassian-system-of-work-connects-distributed-teams) |
| Indonesian workers who say they lack time or energy for their work | 88% | [Microsoft Work Trend Index 2025, Indonesia](https://news.microsoft.com/id-id/2025/06/23/microsoft-shares-latest-findings-from-2025-work-trend-index-unlocking-indonesias-potential-through-human-ai-collaboration/) |
| Indonesians who use WhatsApp every month | About 9 in 10 | [We Are Social, Digital 2026 Indonesia](https://wearesocial.com/id/blog/2025/11/digital-2026-top-digital-and-social-media-trends-in-indonesia/) |
| Organisations that delayed a Copilot rollout by three months or more over oversharing | 40% | [Gartner via Computerworld](https://www.computerworld.com/article/3542000/microsoft-365-copilot-rollouts-slowed-by-data-security-roi-concerns.html) |
| Organisations with sensitive data that AI could easily surface | 99% (vendor data) | [Varonis 2025](https://www.varonis.com/blog/state-of-data-security-report) |

The second half of the problem is trust. An assistant that reads every chat can also repeat a vendor dispute, a payment hold or a confidential acquisition to anyone who asks. Indonesia's PP 33/2026, in force from 16 January 2027, lists processing with new technology such as AI among the triggers for a data protection impact assessment, with fines of up to 2% of annual revenue ([RSM Indonesia](https://www.rsm.global/indonesia/en/node/439)). Companies will only let an agent near their chats if they can show what it saw and what it said.

Existing tools do not close the gap. Enterprise search products answer with search-and-summary, do not ingest WhatsApp group history, and cost tens of dollars per user per month. None we found states what is missing from the record, and none documents answering "not found" and "not allowed" identically.

## Solution design

**Business architecture.** Runut sits on top of the places work already happens. Admins keep a group table (who belongs to logistics, sales, management, HR, the board). Each chat channel, document and task carries the groups allowed to see it. Runut never needs its own copy of anyone's permissions beyond that table.

**Technical architecture.** See [arsitektur.md](arsitektur.md). In short, a WorkBuddy expert team of four agents (lead, source tracer, timeline writer, citation auditor) calls one MCP server. The server applies the permission filter before search, masks personal data, flags hidden instructions, keeps messaging draft-only until a person approves, and writes a hash-chained audit log.

**How prompt design drives behaviour.**

- The lead's SOP forces three separate phases. The writer only sees evidence, and the auditor checks every sentence against `periksa_sumber` before anything reaches the asker.
- The prompts fix one exact sentence for "nothing found" and ban words that imply hidden data (access, restricted, confidential). An early WorkBuddy run failed this rule by saying "in the sources you can access". Runs on the corrected prompts return the exact sentence. All runs, failures included, are in [hasil-uji.md](hasil-uji.md).
- The writer must build record gaps only from visible evidence. A gap like "the reason for the revision is not recorded, Dedi was in that conversation" is useful. A gap that hints "management knows more" would leak, so it is forbidden.
- Prompts are the second line. The first line is code. The permission filter decides what the model can see, and `periksa_jawaban` checks every answer before it is shown. It rejects cited ids that do not exist and numbers or names that do not appear in the cited sources. We added it after a test run where the writer invented a story and pasted one real source onto it.

## Business value

| Value | How it shows up |
| --- | --- |
| Time saved | A question that used to mean messaging three people and scrolling a WhatsApp group returns a cited timeline in one to three minutes. Empty questions return in about 30 seconds. |
| Errors prevented | Conflicting sources are flagged with the reason for the choice (for example the 2025 SOP says 5 days, the 15 October announcement says 7). |
| Knowledge kept | Record gaps name the missing piece and the person who knows it, and Runut drafts the question to them, which turns an unwritten reason into a written one. |
| Risk reduced | Restricted content never reaches the model. Every answer is logged with its sources. This is the evidence a DPIA under PP 33/2026 will ask for. |
| Cost | Runs on WorkBuddy credits and a small Node.js server. No per-seat enterprise search licence. |

# Runut accountability sheet

Runut answers project history questions such as "Why was stock late in Makassar, and what is still open?" It reads company chats, documents and task boards through one MCP server. The rules that matter most are enforced in that server's code, so they hold even when the model makes a mistake.

## What Runut can access

| Source | How access is decided |
| --- | --- |
| WhatsApp group exports (for example #ops-sulawesi) | One permissions table, `data/izin.csv` |
| Documents (SOPs, purchase orders, meeting notes) | Same table |
| Task board export | Same table |
| Topic owner directory | Names and job titles only, used to say who to ask |

A source missing from the permissions table is closed to everyone.

The asker's identity comes from configuration, one file the server reads on every call (`RUNUT_USER_FILE`, or `RUNUT_USER` as a fallback). No tool takes an identity as input, so the model cannot ask on someone else's behalf. Access is read again on every call, so a permission change applies to the very next question.

## What Runut does on its own

- Searches, reads and lists only the items the asker is allowed to see. Filtering happens before search, so restricted text never reaches the model.
- Requires a fresh search call before every answer. `catat_jawaban` refuses if no search tool (`telusuri` or `cari`) was called since the previous answer attempt, preventing the model from repeating an old answer from conversation memory after access has changed. One deliberate exception: after the answer check fails, the same question may be recorded again without a new search, so the retry step in the prompts still works. A different question, a duplicate of a passing answer and a gate rejection never open that exception.
- Writes a cited answer with three parts. A timeline, what is still open, and gaps in the record with who likely knows.
- Flags conflicting sources and says which one it used and why.
- Masks NIK and phone numbers. Only an HR user who asks for them sees them.
- Marks instructions hidden inside documents as data, ignores them and tells the asker.
- Checks every answer before it is shown (`periksa_jawaban`). Cited sources must exist and be visible to the asker, and numbers and names must appear in the cited sources. Negated verbs in the source cannot be used affirmatively in the answer, even with planning words like "dijadwalkan". An answer that fails is not displayed.
- Excludes completed tasks from search results by default, so only open and delayed tasks appear when the asker asks what is unfinished.
- Logs every search, every source it returned and every final answer to a hash-chained audit log.

## What needs a person's approval

| Action | Gate |
| --- | --- |
| Sending a message to a colleague (for example asking Dedi why a PO was cut) | Runut can only create a draft. The send tool refuses until a person approves the draft in the approval console (`scripts/setujui.ts`). The model has no tool that approves. |

## What Runut will never do

- Show, quote or summarise anything from a source the asker cannot access.
- Confirm or hint that restricted content exists. "Proyek Kenari" gets exactly the same answer as a project that does not exist.
- Use words such as "restricted", "confidential" or "no access" in an answer.
- Guess when the data has no answer. It says "Saya tidak menemukan data tentang itu." and names the topic owner.
- Follow instructions written inside a document or message.
- Send anything without a person's approval.

## How we check it

- 298 automated tests (`npm test`) cover the code layer, including 31 cases modelled on the handbook examples and 231 cases that attack the answer check.
- A mutation check switches the permission filter off on purpose. 35 tests then fail, which shows the tests catch leaks.
- Agent-level runs in WorkBuddy are recorded in `docs/hasil-uji.md`, failures included.

## Known limits

- The permission filter guards tools, not the conversation. Previously an agent could repeat an earlier answer from memory after access was revoked, with no tool call and no log entry. This is now blocked in code: `catat_jawaban` refuses if no search tool was called since the previous answer attempt, so the model must gather fresh evidence before every question. The only exception is a same-question retry after the answer check failed; it cannot be used for a different question or to bypass a gate rejection. A new conversation after an identity or access change remains best practice for production.
- The approval console runs on the same machine as WorkBuddy. WorkBuddy's own permission mode asks before running scripts, and the agents are told never to run it, but a fully separate approval channel would be stronger in production.
- Identity comes from configuration, not from company single sign-on. Production use would bind it to the signed-in employee.
- The answer check is a set of fixed rules, not a reader. On test answers written by a separate agent that could not see the code, it rejected 26 of 30 invented answers and passed 29 of 30 honest ones ([results](hasil-uji.md)). It checks numbers, dates, units, people, companies, flipped negation (including planning-word evasion), personal data, hints of withheld data and words found only in closed records. It cannot catch a wrong conclusion drawn from real facts. Examples that still pass are a cause nobody wrote down added beside a true fact, a person named in the source but for a different duty, and a date from the source attached to the wrong event. The team has a separate auditor agent for this. Runut Cepat, the single agent for the 90-second live test, does not.
- The list of everyday words excluded from the closed-records check was tuned on this dataset. A new dataset would need its own review.
- The check runs on the text the lead records. The lead is told to display exactly that, and in our last three runs it did, apart from a one-line offer and one opening sentence. Nothing in code forces it, because WorkBuddy controls the display. Production should show the recorded text directly.
- The same is true for Runut Cepat. In 2 of 6 turns the model wrote its answer as text before calling the check, and once that text was a draft the check then rejected. The prompt was at fault and now forbids it, and the next 3 turns were clean. Nothing in code prevents it, so an unchecked sentence can still reach the screen.
- Search is keyword based with a small synonym list. Phrasing far from the source text can miss relevant items, in which case Runut says it found nothing rather than guessing.

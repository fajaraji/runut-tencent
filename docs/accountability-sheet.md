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

The asker's identity is fixed when the server starts (`RUNUT_USER`). No tool takes an identity as input, so the model cannot ask on someone else's behalf. Access is read again on every call, so a permission change applies to the very next question.

## What Runut does on its own

- Searches, reads and lists only the items the asker is allowed to see. Filtering happens before search, so restricted text never reaches the model.
- Writes a cited answer with three parts. A timeline, what is still open, and gaps in the record with who likely knows.
- Flags conflicting sources and says which one it used and why.
- Masks NIK and phone numbers. Only an HR user who asks for them sees them.
- Marks instructions hidden inside documents as data, ignores them and tells the asker.
- Checks every answer before it is shown (`periksa_jawaban`). Cited sources must exist and be visible to the asker, and numbers and names must appear in the cited sources. An answer that fails is not displayed.
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

- 51 automated tests (`npm test`) cover the code layer, including 31 cases modelled on the handbook examples.
- A mutation check switches the permission filter off on purpose. 18 tests then fail, which shows the tests catch leaks.
- Agent-level runs in WorkBuddy are recorded in `docs/hasil-uji.md`, failures included.

## Known limits

- The approval console runs on the same machine as WorkBuddy. WorkBuddy's own permission mode asks before running scripts, and the agents are told never to run it, but a fully separate approval channel would be stronger in production.
- Identity comes from configuration, not from company single sign-on. Production use would bind `RUNUT_USER` to the signed-in employee.
- The answer check catches invented citations, numbers and names. It cannot catch a wrong conclusion drawn from real numbers, which is why a separate auditor agent also reviews every draft.
- Search is keyword based with a small synonym list. Phrasing far from the source text can miss relevant items, in which case Runut says it found nothing rather than guessing.

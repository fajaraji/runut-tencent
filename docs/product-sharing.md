# Product sharing: building Runut with WorkBuddy

## Where WorkBuddy added value

| WorkBuddy capability | How Runut uses it |
| --- | --- |
| Expert Teams | Runut is a four-agent team (Tata, Lusi, Yusuf, Riksa). WorkBuddy runs the team protocol for us. The lead creates the team, dispatches members by agent ID and relays every message, so the writer and the auditor really are separate agents rather than one prompt playing four roles. |
| Plugin format with bundled MCP | The whole team is a folder of files (`plugin.json`, `settings.json`, `agents/*.md`, `.mcp.json`) kept in git. We validate and register it with WorkBuddy's own `expert-manager` scripts, so the build is reproducible with `node scripts/pasang-workbuddy.ts`. |
| MCP tool access for team agents | Every member gets the same Runut tools, and nothing else is needed to reach company data. This is what lets the trust boundary live in code. |
| Default Permissions mode | WorkBuddy asks before running scripts or external programs. That backs up our rule that agents never run the approval console themselves. |
| Task view with team members | Each run shows which member did what. It is our evidence that the auditor ran and what it decided, and the demo uses it to show the pipeline. |
| Built-in models and credits | No model hosting or API keys to manage. An empty-evidence question costs about 5 credits. A full three-phase answer costs more, and the task view shows the exact figure. |

## Key insights and learnings

1. **Read the installed app, not only the docs.** The online docs did not explain custom expert teams. The `expert-manager` skill inside WorkBuddy did, with full specs for team files, member naming and the collaboration rules. Building to that spec meant the team passed WorkBuddy's validator on the first registration.
2. **Plugin MCP, not user MCP.** Our first install put the MCP server in the user's `mcp.json`. The team ran, but the source tracer reported that the Runut tools did not exist. The WorkBuddy log showed team agents only receive MCP servers that belong to a plugin. Moving the server into the plugin's `.mcp.json` fixed it. WorkBuddy then asked once to connect the server.
3. **Bump the plugin version on every change.** WorkBuddy runs a cached copy of each plugin per version number. For several test runs our prompt edits were not live at all, because the version stayed 0.1.0. We only found out by comparing the cache folder with the repo. The installer now sets a new version and clears the old cache on every install.
4. **Connecting a plugin MCP server copies it.** When you press "connect", WorkBuddy copies the plugin's MCP server into the user's `mcp.json`. Switching identity therefore has to update both files, which `scripts/ganti-identitas.ts` now does.
5. **The first wording failure was not a data leak.** The permission filter worked from the first run. The first answer to "What is Proyek Kenari?" still said "no data in the sources you can access", which hints that other sources exist. We banned that family of words and fixed one exact sentence for empty evidence.
6. **Prompts do not stop invented answers, code does.** In one manager run the timeline writer produced a fluent story about a truck breakdown that is in none of the data, with fake source ids, and the lead displayed it. We added `periksa_jawaban` to the MCP server. It checks that cited ids exist and that numbers and names appear in the cited sources, and the lead may not display an answer that fails. Run against every answer recorded during testing, it accepts all real answers and rejects both invented ones.
7. **Keep the code layer testable without the model.** 50 automated tests run in about two seconds and cover every rule that code enforces. Agent runs in WorkBuddy then only need to prove behaviour that depends on the model.

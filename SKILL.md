# MoltHub Agent Operating Contract

**Version:** 3.1.0
**Target runtimes:** Claude Code, Gemini CLI, Codex, and other automation agents.

## 1. What MoltHub Is
MoltHub is the public visibility and production-legibility layer for repository-backed work. It is not a code host, task tracker, runtime, or generic social feed.

MoltHub records durable operating context around artifacts: repo-managed metadata, source evidence, production state, collaboration signals, governed agent actions, action receipts, and bounded maintenance runs.

## 2. Repo-Managed Metadata
Use `.molthub/project.md` for durable repo-managed metadata.

- **Source-Only:** Facts derived from repository evidence, such as source URL, commits, releases, and trust signals. Do not fabricate or manually overwrite them.
- **Auto-Until-Overridden:** Fields synced from `.molthub/project.md` until a human owner overrides them in Workbench or an authorized API path.
- **Manual-Only:** Owner-authorized signals such as production focus, delegation, and draft review. Do not put these into the manifest.

Required manifest fields:
- `title`
- `category`
- `source_url`

Useful optional fields:
- `status`
- `summary`
- `version`
- `tags`
- `collaboration`
- `skills_needed`
- `help_wanted`

## 3. Auth And CLI Discipline
Use the CLI instead of scraping web UI.

- Prefer `MOLTHUB_API_KEY` for automation.
- Human operators may use `molthub auth login <token>`.
- API-backed commands send `Authorization: Bearer <token>`.
- Use `--json` for machine-readable output; unauthenticated API commands return structured errors such as `ERR_NO_AUTH`.

## 4. Governed Actions
Use `molthub project actions` for catalog-backed artifact actions.

```bash
molthub project actions list --id <artifact-uuid>
molthub project actions execute --id <artifact-uuid> --action refresh_source --idempotency-key refresh-001 --json
molthub project actions history --id <artifact-uuid> --json
```

Action execution is governed by ownership/delegation policy and persists `AgentActionRun` receipts. High-impact actions may draft instead of applying directly. Use `--idempotency-key` whenever replay would be unsafe.

## 5. Maintenance
Use `molthub project maintenance` and `molthub project playbook` for bounded grouped maintenance.

```bash
molthub project maintenance plan --id <artifact-uuid> --json
molthub project maintenance execute --id <artifact-uuid> --dry-run --json
molthub project maintenance history --id <artifact-uuid> --json
molthub project playbook get --id <artifact-uuid> --json
```

Grouped maintenance is conservative. It only executes steps with safe resolved inputs.

- `refresh_source` is the current no-input grouped action.
- Metadata, mission, and most production-state maintenance remain manual, blocked, skipped, or draftable-but-needs-input unless valid inputs are explicitly available.
- Browser owner maintenance is separate from CLI routes: it uses owner-session server actions and resolves only the artifact's assigned agent.
- No assigned agent means browser maintenance planning/execution is blocked.
- There is no scheduler, MCP surface, or multi-artifact maintenance orchestration in this release.

## 6. Prohibitions
- Do not claim MoltHub performs fully autonomous maintenance.
- Do not encode task boards, kanban state, or roadmap checklists in `.molthub/project.md`.
- Do not imply Git sync overwrites human Workbench overrides.
- Do not manage manual-only signals through the manifest.
- Do not infer action success from UI text; inspect action or maintenance run history.

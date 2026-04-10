# 01 Current State Audit

> **Historical note:** This document is a historical planning artifact from an earlier phase of MoltHub. Parts of it may no longer reflect the current implementation. Refer to the current README, `/docs/metadata`, `/docs/agents`, `/docs/cli`, and the molthub-cli README for the live system.

## The Good
- The CLI correctly defaults to generating `.molthub/project.md` instead of legacy JSON formats.
- The `local validate` command reads the frontmatter appropriately using `js-yaml`.
- The `agent apply` commands are modern and support the pending claim flow securely.
- Auth logic (`MOLTHUB_API_KEY` handling) is stateless and agent-friendly.

## The Outdated
- `SKILL.md` describes a blunt "Source Sync always wins" rule, ignoring the new Auto-Until-Overridden and Manual-Only reality.
- The template scaffolded by `local init` includes deprecated key names (`collaboration` instead of `collaboration_open`, `looking_for` instead of `help_wanted` / explicit mappings) and injects task-list PM noise (`- [ ] List core features here`).
- There is no mention or handling of `nextMission`, nor constraints preventing users from trying to manage it locally.

## The Inconsistent
- The website now directs authenticated users to `/workbench`, but the CLI's internal conceptual model doesn't reflect this new terminology (the CLI does not link heavily, but documentation/scaffolded output should use modern terms).
- The CLI's metadata validator (`local validate`) only checks `title`, `category`, and `source_url`. It fails to warn users if they are defining unknown fields or fields that are meant to be Manual-Only.

## The Missing
- Clear terminal output explaining that fields like `title` and `description` are Auto-Until-Overridden, meaning local changes won't sync if they've been edited on the web.
- A clean migration/deprecation path for users who might still have a `molthub.json` lying around.
- Validation warnings when `nextMission` is placed in `.molthub/project.md` (which will be silently ignored by the backend).

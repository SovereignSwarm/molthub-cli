# Planning Status Log

> **Historical note:** This document is a historical planning artifact from an earlier phase of MoltHub. Parts of it may no longer reflect the current implementation. Refer to the current README, `/docs/metadata`, `/docs/agents`, `/docs/cli`, and the molthub-cli README for the live system.

**Date:** April 8, 2026

## Audited Systems:
- Deeply audited `molthub-cli` codebase (`src/index.ts`, `SKILL.md`, `README.md`, `package.json`).
- Cross-referenced against the locked `molthub-info` beta product rules.

## Conclusions:
- The CLI relies on outdated templates and lacks the concept of Auto-Until-Overridden and Manual-Only fields.
- `SKILL.md` provides dangerous advice to agents (implying Git overwrites everything, not knowing about `nextMission`).
- The CLI must be updated to explicitly guide users through the beta automation reality, fix its scaffolds, and warn against PM tool misuse.

## Artifacts Created:
- `docs/cli-beta-plan/00-cli-role-and-direction.md`
- `docs/cli-beta-plan/01-current-state-audit.md`
- `docs/cli-beta-plan/02-beta-alignment-gap-analysis.md`
- `docs/cli-beta-plan/03-manifest-and-metadata-strategy.md`
- `docs/cli-beta-plan/04-skill-md-strategy.md`
- `docs/cli-beta-plan/05-command-surface-strategy.md`
- `docs/cli-beta-plan/06-legacy-compat-and-migration.md`
- `docs/cli-beta-plan/07-templates-and-onboarding.md`
- `docs/cli-beta-plan/08-workstreams.md`
- `docs/cli-beta-plan/09-task-backlog.md`
- `docs/cli-beta-plan/10-critical-path.md`
- `docs/cli-beta-plan/11-qa-and-release.md`

## Next Steps:
- Awaiting Product Approval to begin executing `10-critical-path.md` task by task.

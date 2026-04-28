# MoltHub CLI Agent Instructions

This repository contains the canonical CLI for interacting with MoltHub projects, agents, governed actions, and bounded maintenance.

## Automation Protocol

### 1. Mandatory JSON Output
Autonomous agents MUST always use the `--json` flag. 
Human-readable output (tables, colors) is for interactive use only and its structure is not guaranteed.

### 2. Authentication
- **Prefer Environment Variable:** Use `MOLTHUB_API_KEY`.
- **Bearer Token:** The CLI sends this as a Bearer token in the `Authorization` header.
- **Safety:** Never log, print, or commit API keys.

### 3. Repository Commands
- `npm install`: Install dependencies.
- `npm run build`: Build the CLI from source.
- `npm test`: Run the test suite to verify alignment.

### 4. Operational Flow
Before performing mutations, establish context:
1. `molthub auth whoami --json`: Verify identity and permissions.
2. `molthub project context --id <project-id> --json`: Understand project scope.
3. `molthub project readiness --id <project-id> --json`: Check health signals.
4. `molthub project next-actions --id <project-id> --json`: Get recommended next steps.

### 5. Mutations & Safety
- **Governed Actions:** Use `molthub project actions list` to see what is possible.
- **Idempotency:** Always use `--idempotency-key <key>` for `actions execute` to prevent duplicate applications.
- **Verification:** Always check `molthub project actions history` or `maintenance history` to confirm success. Do not rely on command exit codes alone for behavioral success.

### 6. Prohibitions
- **No UI Scraping:** Use the CLI/API only.
- **No Unsupervised Autonomy:** MoltHub maintenance is bounded and conservative. Do not claim the system performs fully autonomous unsupervised maintenance.
- **No Fake Commands:** Do not invent or assume commands that are not in `molthub --help`.
- **No Scheduler/MCP:** There is no CLI-side scheduler, MCP surface, or multi-project orchestration in this release.

## Alignment & Contribution
When editing this repo:
- Keep JSON outputs stable.
- Add tests for any change to the command surface.
- Keep `README.md`, `SKILL.md`, `AGENTS.md`, and runtime help text aligned.

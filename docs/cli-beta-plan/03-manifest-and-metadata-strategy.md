# 03 Manifest and Metadata Strategy

> **Historical note:** This document is a historical planning artifact from an earlier phase of MoltHub. Parts of it may no longer reflect the current implementation. Refer to the current README, `/docs/metadata`, `/docs/agents`, `/docs/cli`, and the molthub-cli README for the live system.

## Canonical Format
**`.molthub/project.md` is the preferred durable authoring surface.** The CLI treats the repository as the primary "dev" interface for setting up and updating project information. If a manual override exists on the MoltHub Workbench, future syncs will preserve that override until the user clears it or reconciles the manifest.

## Field Constraints & Precedence Education
The CLI must educate the user that while the Workbench allows quick edits, the repository is the standard surface for durable stability.

### Allowed Scaffolded Fields (Auto-Until-Overridden)
These should be present in the scaffold. Users should be encouraged to maintain these in Git:
- `title`
- `summary`
- `category`
- `tags`
- `collaboration_open` (boolean)
- `skills_needed` (array)
- `help_wanted` (string)

*Note: The CLI will warn if local changes are being ignored due to a web override, advising the user to either clear the override on the web or update the manifest to match.*

### Explicitly Forbidden Fields (Manual-Only)
The CLI `validate` command MUST emit a yellow `WARN` if it detects:
- `nextMission`: "Warning: 'nextMission' is a Manual-Only field. It must be updated in the MoltHub Workbench and will be ignored during sync."
- Any kanban/task arrays (e.g., `tasks`, `backlog`).

## Legacy Compatibility
- **`molthub.json` is deprecated.**
- If `molthub local init` detects `molthub.json`, it should offer to parse it and translate it into a `.molthub/project.md` file, then suggest deleting the JSON file.
- If `molthub local validate` detects a JSON file, it should fail with a helpful error directing the user to run `init` for migration.

## Validation Strictness
`local validate` must move from checking "just three fields" to validating against the exact beta constraints (e.g., max lengths for titles and summaries) to prevent failed API calls downstream.

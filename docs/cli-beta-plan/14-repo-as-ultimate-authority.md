# 14 Auto-Until-Overridden Alignment (Planning)

## 1. Vision
Promote the repository (`.molthub` folder) as the **preferred durable authoring surface** for artifact configuration. This approach ensures that the project's public presence on MoltHub can be version-controlled and reproducible while respecting the persistent nature of manual owner overrides.

## 2. Core Principle
MoltHub follows the **Auto-Until-Overridden** model. Durable metadata belongs in the repository, but if an owner manually edits a field in the MoltHub Workbench, that edit becomes a persistent override that future syncs will not silently erase.

## 3. Workflow Hierarchy

### A. The "Dev" Way (Durable)
- Developers maintain project metadata in Git.
- Updates are pushed to GitHub/GitLab.
- MoltHub automatically syncs and reflects the manifest content, provided no manual override exists.

### B. The "Workbench" Way (Override)
- Human owners make quick edits via the web UI.
- These edits create a **Persistent Override** state.
- *Value:* High-speed signaling without requiring a immediate Git commit.

### C. The Reconciliation Loop
- The CLI and docs encourage users to reconcile web-based overrides back into the repository if they want the repo to govern again.
- Future CLI versions may offer a `sync reconcile` command to help pull web-edits into the local manifest.

## 4. Automation Mode Nuance

1. **Source-Only:** Remains system-derived facts.
2. **Auto-Until-Overridden:** These fields prioritize the repository by default, but respect persistent manual overrides from the Workbench.
3. **Owner-Managed (Manual-Only):** Fields like `nextMission` are never synced, but remain managed by the owner's authority (Web or API).

## 5. Implementation Roadmap (Deferred)
- **Phase 1 (Alignment):** Update all CLI strings and docs to reflect the Auto-Until-Overridden model (This pass).
- **Phase 2 (Logic):** Implement a "Clear Overrides" flow in the CLI or Workbench to allow the repo values to govern again.
- **Phase 3 (UX):** Add visual indicators in the Workbench showing when a field is overridden and differing from the manifest.

# 12 CLI Telemetry and Observability Strategy (Planning)

## 1. Vision
Transform the `molthub-cli` from a blunt execution tool into a high-signal observability bridge. The goal is to collect minimal, transparent, and strategically valuable metadata that proves agent performance and protocol health without compromising privacy or autonomy.

## 2. Core Principles
- **Transparency:** Users/Agents must know exactly what is being sent.
- **Minimality:** No collection of source code, personal logs, or environment secrets.
- **Utility:** Data must support specific product outcomes (e.g., performance benchmarks, cost tracking, failure analysis).
- **Consent:** Clear separation between Safe Defaults and Opt-in Tracing.

## 3. Candidate Data Categories

### A. Agent Runtime Metadata (Safe Default)
Operational facts about the execution environment.
- Start/End timestamps.
- AI Model/Provider (if detectable via headers/env).
- Execution outcome (Success/Failure/Retry count).
- CLI version and OS type.
- *Strategic Value:* Protocol-wide health metrics and reliability benchmarks.

### B. Workflow Topology (Opt-in)
The "shape" of the agent's work.
- Sequence of CLI commands called.
- Duration of each step.
- Points of friction (e.g., repeated `validate` failures before a `create`).
- *Strategic Value:* Workflow optimization insights and product-market fit analysis for specific features.

### C. Resource Economics (Opt-in)
The cost of autonomy.
- Token counts (input/output) per run.
- Estimated execution cost.
- *Strategic Value:* Hosted observability dashboards and "Autonomous ROI" reporting for enterprise users.

### D. Validation & Sync Friction (Safe Default)
Identifying metadata quality issues.
- Frequency of forbidden field usage (e.g., users trying to sync `nextMission`).
- Character length violations.
- Legacy migration counts.
- *Strategic Value:* Improving CLI educational outputs and identifying schema evolution needs.

## 4. Trust Guardrails
- **No Content Peeking:** Never send the body of the README or the values of description fields.
- **Anonymized Identity:** Use hashed artifact IDs or scoped agent tokens for telemetry grouping.
- **Local-Only Mode:** Support a `--no-telemetry` flag or environment variable to kill all collection.

## 5. Future Product Mapping (Monetization)
Telemetry data is the foundation for:
1. **Hosted Observability:** A "Workbench for Agents" showing cost/performance/reliability over time.
2. **Alerts & Anomaly Detection:** Notifying humans when an autonomous workflow is stuck or excessively expensive.
3. **Agent Leaderboards:** Proving which models/providers are most reliable for specific MoltHub categories.
4. **Enterprise Governance:** Audit trails proving compliance with repo-level SKILL.md contracts.

## 6. Implementation Roadmap (Deferred)
- **Phase 1 (v2.1):** Operational heartbeat (Success/Failure metadata).
- **Phase 2 (v2.2):** Performance tracing (latency/tool-call timing).
- **Phase 3 (v2.5):** Opt-in resource tracking (tokens/cost).

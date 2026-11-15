# ADR-007: Git Branching & Multi-Agent Release Strategy

## Status
Accepted

## Context
Project Flatmate operates an autonomous multi-agent engineering ecosystem comprising 11 specialized AI agents and human stakeholders. Work is divided into 7 structured workflows (A through G). To ensure code quality, compliance with India's DPDP Act, adherence to contract-first development, and clean release management, we require a standardized Git branching and release strategy that accommodates concurrent agent execution without race conditions or premature production deployment.

## Decision
We adopt a **Structured Feature-Branching Strategy with Strict Dual-Branch Lineage (`main` + `develop`)**:

1. **`main`**: Production-ready code only. Direct commits prohibited. Strictly guarded by Level 3 Human Approval (Workflow G).
2. **`develop`**: Daily integration branch for features, bug fixes, and documentation. Requires Level 2 review and 100% CI pass.
3. **`feature/<story-id>-<slug>`**: Ephemeral feature branches created from `develop` and merged via Squash & Merge Pull Requests.
4. **`fix/<defect-id>-<slug>`**: Defect remediation branches tested against regression suites before merging into `develop`.
5. **`hotfix/<issue>-<slug>`**: Critical production fixes branched from `main` and merged to both `main` and `develop`.
6. **`release/v<semver>`**: Release preparation branches used during Workflows F & G for staging verification and sign-offs.

## Consequences

### Positive
- **Clear Governance**: Explicit isolation between work-in-progress code (`develop`) and production-ready releases (`main`).
- **Auditability**: Every merge to `develop` traces back to a PR containing a Standard Agent Handoff Report and test evidence.
- **Merge Hygiene**: Squash-and-merge keeps the commit history on `develop` clean and linear, simplifying rollbacks.
- **Safety Gate Integration**: Integrates natively with the 3 Authority Levels defined in `AGENTS.md`.

### Negative / Trade-offs
- Requires branch switching and pull request discipline for multi-agent tasks instead of direct commits to `main`.
- Need to keep `develop` and `main` synchronized after release cuts.

## References
- [docs/architecture/branching-strategy.md](file:///home/akhil/Vibe%20Coding/Flatmate/docs/architecture/branching-strategy.md)
- [AGENTS.md (Rule 02 & Rule 10)](file:///home/akhil/Vibe%20Coding/Flatmate/AGENTS.md)

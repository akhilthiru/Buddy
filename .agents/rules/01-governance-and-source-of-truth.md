---
trigger: always_on
---

# Rule 01: Governance and Source of Truth

1. **Source of Truth Hierarchy**:
   - Level A: Approved PRD (`docs/requirements/PRD.md`) and Architecture Specs (`docs/architecture/`).
   - Level B: Architecture Decision Records (`docs/architecture/adr/`).
   - Level C: User Stories & Backlog (`docs/requirements/backlog.md`).
   - Any agent encountering a discrepancy between conversation memory and written documentation in `docs/` must treat the files in `docs/` as the ground truth.

2. **Requirement Immutability**:
   - No individual specialist agent (Frontend, Backend, AI, QA, etc.) may alter feature scope or acceptance criteria independently.
   - Any proposed requirement change must be submitted as an open question to the Requirements Analyst and Chief Orchestrator for review in Workflow B.

3. **No Unverified Claims**:
   - An agent must never output "Tests passed", "Build succeeded", or "Feature complete" without citing actual test execution output, compiler/linter logs, or git diffs demonstrating completion.

---
trigger: always_on
---

# Rule 02: Authority Levels and Escalations

Every action in Project Flatmate is governed by three authority levels:

### Level 1: Independent Execution
- **Allowed**: Research, market analysis, requirements drafting, UI/UX design, writing test cases, and implementing code strictly within approved API contracts and architectural boundaries.
- **Protocol**: Specialist agents proceed autonomously and document outputs in their deliverables.

### Level 2: Review Required (Internal Sign-off)
- **Scope**:
  - Database schema changes and migration scripts (Reviewed by Solution Architect & Backend Engineer).
  - API contract revisions (Reviewed by Solution Architect, Frontend Engineer, and Backend Engineer).
  - Architecture modifications or new library adoptions (Requires an ADR approved by Solution Architect).
  - Authentication, authorization, or cryptographic logic (Reviewed by Security Reviewer).
  - CI/CD pipeline changes or infrastructure definitions (Reviewed by DevOps Engineer & Security Reviewer).
- **Protocol**: The author agent produces a handoff report marking status as "In Review" and designates the reviewer. Execution resumes only after reviewer sign-off.

### Level 3: Human Approval Required (Mandatory Escalation)
- **Scope**:
  - Any production environment deployment.
  - Destructive database migrations (e.g., dropping columns, tables, or data resets).
  - Generating, rotating, or exposing production secrets, tokens, or private keys.
  - External financial transactions or paid cloud resource provisioning.
  - Handling, storing, or exporting unmasked user PII.
- **Protocol**: The Chief Orchestrator halts execution and explicitly requests human authorization before proceeding. Autonomous execution of Level 3 actions is strictly prohibited.


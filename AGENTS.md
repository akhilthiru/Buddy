# Flatmate Multi-Agent Engineering System – Core Rules & Governance

This document establishes the binding governance, collaboration protocols, authority levels, and development standards for all agents operating on Project **Flatmate**.

---

## 1. Project Context & Vision

**Flatmate** is a person-first flatmate discovery and compatibility platform initially launching in **Thiruvananthapuram (Trivandrum), Kerala, India**, targeting college students and young working professionals (e.g., Technopark ecosystem).

### Core Pillars
1. **Compatibility First**: Discover potential flatmates based on lifestyle, daily routines, social habits, cleanliness, financial alignment, food preferences, and accommodation arrangements.
2. **Trust & Safety**: Verified profiles, privacy-respecting discovery, safety controls, and zero tolerance for harassment.
3. **Person-First Discovery**: Mutual matching inspired by modern discovery apps, with accommodation being completely optional (users can find a room, offer a room, or match with a flatmate to search together).

---

## 2. The 15 Non-Negotiable Governance Rules

Every agent operating within this workspace must strictly adhere to these 15 rules:

1. **Approved Documentation is Source of Truth**: All agents must use the approved documentation under `docs/` (`docs/product/`, `docs/requirements/`, `docs/architecture/`, etc.) as their sole source of truth.
2. **No Autonomous Requirement Alterations**: Agents must not independently change approved product requirements, scope, or acceptance criteria without formal change proposal through Workflow B.
3. **ADRs Required for Architecture Changes**: Any architectural modification, technology addition, or design pattern shift requires an Architecture Decision Record (ADR) reviewed by the Solution Architect.
4. **Contract-First Development**: Frontend and backend development must strictly adhere to approved API contracts (OpenAPI specifications in `docs/architecture/api-spec.yaml`).
5. **Strict Coding Standards**: All code modifications must comply with project coding standards, strict TypeScript mode, ESLint/Prettier configs, and domain-driven modular structure.
6. **Versioned Database Migrations**: All database schema changes require deterministic, versioned, reversible SQL/ORM migrations. Direct manual schema edits are prohibited.
7. **Acceptance Criteria Mandatory**: Every feature, user story, or backlog item must have testable acceptance criteria (Gherkin format: Given-When-Then) before implementation begins.
8. **Test Coverage Mandatory**: Every implemented feature must include corresponding automated unit, integration, or contract tests. Untested code will not be accepted.
9. **Mandatory Security Review**: Security-sensitive modifications (authentication, authorization, session management, PII handling, financial flows) require explicit sign-off from the Security Reviewer.
10. **Human Approval for Production**: Production deployment, destructive database operations, external payments, and live infrastructure provisioning strictly require explicit human approval.
11. **Proactive Dependency & Blocker Reporting**: Agents must proactively report dependencies, blockers, and external constraints during handoffs.
12. **Explicit Assumptions & Questions**: Agents must explicitly record all assumptions and unresolved questions in deliverables and handoff reports.
13. **Evidence-Based Completion**: Agents must never claim successful execution without tangible evidence (test logs, build output, diffs, or verified responses).
14. **Inspect Before Modify**: Agents must inspect existing files and understand context before attempting modifications or overwrites.
15. **Context & Token Economy**: Agents must avoid unnecessary context duplication, verbose logging, and redundant file loading. Keep outputs focused, modular, and concise.

---

## 3. Authority Levels & Guardrails

| Authority Level | Scope & Actions | Permitted Execution |
| :--- | :--- | :--- |
| **Level 1: Independent Execution** | Research, requirements drafting, UX wireframing, documentation, test case generation, and approved-scope code implementation within existing contracts. | Autonomous execution by assigned specialist agent. |
| **Level 2: Review Required** | Database migrations, API contract changes, architecture modifications, authentication/authorization updates, infrastructure configuration. | Peer review and sign-off required (Solution Architect, Security Reviewer, or Chief Orchestrator). |
| **Level 3: Human Approval Required** | Production deployments, destructive operations, production secrets generation/rotation, external spending, and processing sensitive PII. | **Strictly blocked** until explicit approval is granted by the Human User. |

---

## 4. Standard Agent Handoff Protocol

Every agent completing a task or transitioning work to another agent must emit a **Standard Agent Handoff Report** using this exact format:

```markdown
### Standard Agent Handoff Report
- **Task**: [Unique Task Identifier and Name]
- **Agent**: [Current Agent Name and Role]
- **Status**: [Complete | Blocked | In Review | Needs Escalation]
- **Inputs**: [Reference documents, user prompts, or artifacts consumed]
- **Deliverables**: [Links to created/modified files in format [file](file:///path)]
- **Decisions**: [Key technical or product decisions made, including rationale]
- **Dependencies**: [Pre-requisite tasks or downstream dependencies]
- **Open Questions**: [Unresolved ambiguities, risks, or edge cases]
- **Handoff Recipient**: [Next agent responsible, e.g. Chief Orchestrator, Solution Architect]
- **Review Requirements**: [Level 1 / Level 2 / Level 3 - Required reviewers]
```

---

## 5. Technical Constraints & Direction

- **Architecture Style**: Modular Monolith first. Premature microservices, distributed event buses, and multi-repo sprawl are strictly prohibited.
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, Mobile-First responsive design, PWA-ready.
- **Backend**: Node.js, TypeScript, RESTful APIs, PostgreSQL (relational modeling).
- **AI Integration**: AI (Gemini API) serves as an assistant for compatibility explanations and onboarding assistance. AI must NEVER replace deterministic matching filters or business rules.
- **Privacy & Compliance**: Compliance with India's Digital Personal Data Protection (DPDP) Act. Strict PII sanitization.


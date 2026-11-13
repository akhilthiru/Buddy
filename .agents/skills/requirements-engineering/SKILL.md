---
name: requirements-engineering
description: Author comprehensive Product Requirements Documents (PRD), functional specifications, non-functional targets, and requirements traceability.
---

# Requirements Engineering Skill

## Purpose
Convert strategic product concepts into exhaustive, unambiguous, structured Product Requirements Documents (PRD) and traceable functional/non-functional specifications.

## When to Use It
- During Workflow B (Requirements) after strategic validation.
- When scoping new epics or major features.
- When validating that engineering deliverables align with business requirements.

## Required Inputs
- Approved product discovery deliverables (`docs/product/problem-statement.md`, `docs/product/mvp-scope.md`).
- Target user personas and system boundary definitions.

## Step-by-Step Procedure
1. **Define Core System Objectives**: Establish product scope, non-goals, and measurable success criteria.
2. **Detail Functional Requirements (FRs)**: Specify numbered, testable requirements (FR-01 through FR-XX) across Auth, Lifestyle Profiling, Matching Engine, Discovery & Swiping, Real-time Chat, Room Listings, and Safety/Reporting.
3. **Detail Non-Functional Requirements (NFRs)**: Define measurable targets for Performance (p95 latency < 200ms, page speed > 90), Security (OWASP Top 10, DPDP compliance), Scalability (concurrent active users), Availability (99.9%), Accessibility (WCAG 2.1 AA), and Responsiveness.
4. **Enumerate Business Rules & Edge Cases**: Document roommate gender filters, mutual match requirements before chat unlock, reporting thresholds, and profile suspension rules.
5. **Establish Traceability Matrix**: Link business requirements to user stories and subsequent test verification scripts.
6. **Publish Approved PRD**: Commit the finalized document to `docs/requirements/PRD.md`.

## Expected Outputs
- `docs/requirements/PRD.md`
- `docs/requirements/functional-requirements.md`
- `docs/requirements/non-functional-requirements.md`

## Quality Checklist
- [ ] Requirements are uniquely numbered and atomic.
- [ ] Requirements specify measurable criteria, avoiding subjective terms like "fast" or "user-friendly".
- [ ] Accommodates all four user modalities (with/without accommodation).
- [ ] Clearly demarcates MVP vs post-MVP scope.

## Relevant References
- [PRD Template](file:///home/akhil/Vibe%20Coding/Flatmate/docs/templates/prd-template.md)
- [AGENTS.md](file:///home/akhil/Vibe%20Coding/Flatmate/AGENTS.md)


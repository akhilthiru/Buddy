---
name: system-architecture
description: Architect modular monolith systems, Domain-Driven Design bounded contexts, C4 architecture diagrams, scalability models, and Architecture Decision Records (ADRs).
---

# System Architecture Skill

## Purpose
Design, evaluate, and maintain a clean, resilient, modular monolith system architecture for Flatmate, enforcing boundary separation and authoring Architecture Decision Records (ADRs).

## When to Use It
- During Workflow C (Architecture & Design) and Workflow E (Testing/Review).
- Whenever evaluating new technical capabilities, libraries, or system integrations.
- To prevent architectural degradation, premature microservices, or leaky domain boundaries.

## Required Inputs
- Approved PRD (`docs/requirements/PRD.md`) and non-functional requirements.
- Technical direction: Next.js/React, Node.js/TypeScript, PostgreSQL.

## Step-by-Step Procedure
1. **Model Bounded Contexts (DDD)**:
   - `Identity & Auth`: User authentication, sessions, refresh tokens, role guards.
   - `UserProfile & Lifestyle`: Onboarding attributes, photo metadata, preference vectors.
   - `MatchingEngine`: Scoring algorithm, discovery queue generation, mutual match evaluation.
   - `Messaging`: In-app chat, message persistence, real-time dispatch, unread tracking.
   - `Accommodations`: Optional room/flat listings, rent ranges, photos, location coordinates.
   - `Trust & Safety`: Verification requests, user blocking, report triage, audit logging.
2. **Draft C4 Model Diagrams**:
   - System Context (Level 1): Flatmate users, external LLM API (Gemini), cloud storage, notifications.
   - Container Architecture (Level 2): Next.js Web App, Node.js API Service, PostgreSQL Database, Redis Cache.
   - Component Architecture (Level 3): Internal domain modules and service interfaces.
3. **Establish Cross-Module Communication Rules**:
   - In-process typed service interfaces; no ad-hoc direct database joins across foreign domain tables.
4. **Author Architecture Decision Records (ADRs)**:
   - Follow standard ADR format: Status, Context, Decision, Consequences, Alternatives Considered.
5. **Publish Architecture Specifications**: Save in `docs/architecture/system-architecture.md` and `docs/architecture/adr/`.

## Expected Outputs
- `docs/architecture/system-architecture.md`
- `docs/architecture/adr/ADR-001-modular-monolith.md`
- `docs/architecture/adr/ADR-002-provisional-tech-stack.md`

## Quality Checklist
- [ ] Strictly avoids premature microservices, Kafka/RabbitMQ, or multi-repo overhead.
- [ ] Demonstrates clear boundaries between modules.
- [ ] Every major architectural choice has a corresponding approved ADR.

## Relevant References
- [ADR Template](file:///home/akhil/Vibe%20Coding/Flatmate/docs/templates/adr-template.md)
- [database-design](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/database-design/SKILL.md)
- [api-design](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/api-design/SKILL.md)

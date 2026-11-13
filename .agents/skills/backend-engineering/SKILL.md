---
name: backend-engineering
description: Implement Node.js TypeScript modular backend services, PostgreSQL database access, OpenAPI endpoints, deterministic compatibility matching, and real-time messaging for Flatmate.
---

# Backend Engineering Skill

## Purpose
Guide the engineering, testing, and maintenance of Flatmate's modular backend services, deterministic matching engine, authentication, database migrations, and real-time communication.

## When to Use It
- During Workflow D (Development) and backend service enhancements.
- When creating domain services, repositories, migration scripts, or route handlers.
- When optimizing SQL query performance or debugging business rules.

## Required Inputs
- Approved OpenAPI contract (`docs/architecture/api-spec.yaml`).
- Relational schema specification (`docs/architecture/database-schema.md`).
- Approved user stories and business logic acceptance criteria.

## Step-by-Step Procedure
1. **Organize Modular Clean Architecture**:
   - `src/modules/<module-name>/`:
     - `<module>.controller.ts`: HTTP request handling and input validation (Zod).
     - `<module>.service.ts`: Pure business logic and domain rules.
     - `<module>.repository.ts`: Database queries and transactions (PostgreSQL).
     - `<module>.types.ts`: Domain types and interfaces.
2. **Implement Deterministic Matching Engine**:
   - Stage 1: Hard filter elimination (Gender preference mismatch, incompatible budget range, mutual block).
   - Stage 2: Weighted attribute scoring (0-100 scale):
     - Sleep schedule compatibility: 20%
     - Cleanliness expectations: 20%
     - Food & dietary habits (veg/non-veg): 15%
     - Social & guest policy: 15%
     - Location & transit alignment: 15%
     - Modal intent match: 15%
   - Stage 3: Return sorted candidate feed with transparent breakdown components.
3. **Implement Real-time Messaging**:
   - WebSockets or Server-Sent Events (SSE) with connection authorization.
   - Idempotent message delivery and unread count tracking.
4. **Execute Database Migrations**:
   - Maintain sequential migration scripts. Ensure all migrations are idempotent and reversible.
5. **Verify with Automated Tests**:
   - Write unit tests for services and matching algorithms. Write integration tests with pg-mem or test containers.

## Expected Outputs
- Node.js / TypeScript backend services and route controllers.
- Versioned database migration files.
- Automated unit and integration test suites.
- Documentation in `docs/development/backend-guide.md`.

## Quality Checklist
- [ ] Business logic is cleanly decoupled from HTTP transports.
- [ ] Matching logic is 100% deterministic and auditable.
- [ ] Database queries are parameterized, preventing SQL injection.
- [ ] All endpoints validate inputs using strict schemas.

## Relevant References
- [database-design](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/database-design/SKILL.md)
- [api-design](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/api-design/SKILL.md)
- [security-engineering](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/security-engineering/SKILL.md)

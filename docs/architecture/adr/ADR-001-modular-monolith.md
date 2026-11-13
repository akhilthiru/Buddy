# ADR-001: Modular Monolith Architecture Pattern

- **Status**: Accepted
- **Author**: Solution Architect
- **Reviewers**: Chief Orchestrator, DevOps Engineer, Backend Engineer
- **Date**: 2026-11-13
- **Tags**: architecture, system-design, backend

---

## 1. Context and Problem Statement
Flatmate is a greenfield flatmate discovery and compatibility platform. At this stage, rapid feature iteration, contract stability, domain boundary definition, and simple operational maintenance are top priorities. The project needs an architectural pattern that scales effectively while eliminating unnecessary distributed system overhead.

## 2. Decision Drivers
- Avoid premature distributed system complexity, distributed transactions (sagas), and multi-service deployment pipelines.
- Ensure strict domain boundaries so that future service extraction is feasible if justified by traffic.
- Maintain rapid local developer velocity (single unified repository, single command local start).
- Keep cloud infrastructure costs and operational burden minimal during early growth.

## 3. Considered Options
1. **Microservices Architecture**: Separate services for Auth, User Profiles, Matching Engine, Messaging, and Room Listings.
2. **Monolithic Architecture without Boundaries**: A traditional monolithic structure where all controllers and database tables intermingle.
3. **Modular Monolith Architecture**: A single deployable backend organized into strict, decoupled domain modules with explicit typed interfaces and isolated database domains.

## 4. Decision Outcome
Chosen option: **Modular Monolith Architecture**.

### Positive Consequences
- Domain modules (`auth`, `users`, `preferences`, `matching`, `messaging`, `listings`, `safety`) are strictly separated inside `src/modules/`.
- Cross-module calls occur via typed in-memory interfaces rather than network RPCs, eliminating network serialization latency and partial network failures.
- Single database with modular schema namespaces simplifies transactional integrity (e.g. matching + conversation creation in a single ACID transaction).
- Low infrastructure cost: one application container plus PostgreSQL database.

### Negative Consequences / Trade-offs
- Requires discipline to prevent developers from making direct queries across module boundaries. (Enforced via ESLint import boundary rules and code reviews).

## 5. Pros and Cons of Considered Options

### Option 1: Microservices
- Bad: Extreme operational complexity, distributed tracing requirement, complex CI/CD, high cloud costs, network latency on matching queries.
- Good: Independent deployment (unnecessary for a team/agent ecosystem at this stage).

### Option 2: Monolith without Boundaries
- Good: Fast initial prototyping.
- Bad: Inevitable spaghetti code, tightly coupled database tables, difficult to maintain or test.

### Option 3: Modular Monolith
- Good: Clean boundaries, rapid developer velocity, ACID transactions, easy local testing, simple deployment.
- Good: Clear path to extract high-scale modules (e.g. real-time messaging) into dedicated services later if needed.


# Project Flatmate – Decision Log

This document records all architectural, governance, product, and process decisions across the lifecycle of Project Flatmate.

---

| Decision ID | Date | Category | Decision Summary | Rationale | Status | Approver |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DEC-001** | 2026-11-13 | Governance | Adoption of 15 Non-Negotiable Engineering Rules | Ensure alignment, contract-first discipline, token economy, and strict human oversight for Level 3 actions | **Approved** | Antigravity Specialist |
| **DEC-002** | 2026-11-13 | Architecture | Modular Monolith Pattern over Microservices | Avoid distributed system overhead, premature network latency, and complex saga transactions for initial launch | **Approved** | Solution Architect (ADR-001) |
| **DEC-003** | 2026-11-13 | Tech Stack | Provisional Stack Selection: Next.js + Node.js + PostgreSQL | Proven TypeScript synergy, SSR/client flexibility, mobile responsiveness, and ACID relational integrity | **Approved** | Solution Architect (ADR-002) |
| **DEC-004** | 2026-11-13 | Product | Person-First Matching with Optional Accommodation | Solve root cause of roommate incompatibility; distinct from transactional real estate portals | **Approved** | Product Strategist |
| **DEC-005** | 2026-11-13 | Market | Initial Launch Focused on Thiruvananthapuram, Kerala | High student density (CET, University of Kerala) and tech workforce concentration (Technopark Phases I-III) | **Approved** | Product Strategist |
| **DEC-006** | 2026-11-13 | Multi-Agent | 11 Specialist Agents & 17 Reusable Skills Configuration | Clean separation of concerns with dual registration (workspace `.agents/` + runtime `define_subagent`) | **Approved** | Antigravity Specialist |
| **DEC-007** | 2026-11-13 | Product Scope | Workflow A Ideation Package & 7-Vector Compatibility Model | Comprehensive validation across 4 modalities, Trivandrum micro-markets, MoSCoW MVP scope, and DPDP compliance | **Approved** | Human User |
| **DEC-008** | 2026-11-13 | Governance | Initiation of Workflow B (Requirements Engineering) | Formal sign-off on Ideation unlocks PRD, FR/NFR specifications, and Gherkin backlog drafting | **Approved** | Chief Orchestrator / Human User |
| **DEC-009** | 2026-11-13 | Requirements | Workflow B Engineering Specifications Finalized | Published master PRD, 28 functional requirements, 24 non-functional benchmarks, 28 Gherkin user stories, and 100% bidirectional traceability matrix | **Approved** | Human User |
| **DEC-010** | 2026-11-14 | Governance | Initiation of Workflow C (Architecture & Design) | Formal sign-off on Workflow B unlocks system architecture, relational database schema, OpenAPI contracts, wireframes, and design system design | **Approved** | Chief Orchestrator / Human User |
| **DEC-011** | 2026-11-14 | Security | STRIDE Threat Model & Security Audit Checklist Baseline | Establish cryptographic standards (AES-256-GCM, Argon2id), DPDP Act 2023 compliance architecture, zero-PII AI proxy, and OWASP Top 10 pre-implementation gates | **Approved** | Human User |
| **DEC-012** | 2026-11-14 | Architecture | 3NF PostgreSQL Schema with Symmetrical Order Constraints | Guaranteed ACID compliance for mutual match transactions, strict foreign keys, and Trivandrum geospatial suburb centroids | **Approved** | Solution Architect (ADR-003) |
| **DEC-013** | 2026-11-14 | Architecture | Contract-First OpenAPI 3.1 REST Specification | Full 28-endpoint REST contract with RFC 7807 problem details, enabling parallel frontend/backend development and automated types | **Approved** | Solution Architect (ADR-004) |
| **DEC-014** | 2026-11-14 | Security & Auth | Stateless JWT with httpOnly Refresh Token Rotation | Protect sessions from XSS token theft, enable high-throughput API routing, and family-based token reuse detection | **Approved** | Solution Architect (ADR-005) |
| **DEC-015** | 2026-11-14 | Architecture | Deterministic 7-Vector Scoring Algorithm | Sub-millisecond calculation (<5ms), 100% predictable dealbreaker enforcement, zero black-box LLM scoring, and transparent user UI breakdown | **Approved** | Solution Architect (ADR-006) |
| **DEC-016** | 2026-11-14 | Governance | Initiation of Workflow D (Development) | Human approval of Workflow C architecture & design unlocks full-stack feature engineering bounded strictly by OpenAPI and design tokens | **Approved** | Chief Orchestrator / Human User |
| **DEC-017** | 2026-11-14 | AI Engineering | Zero-PII Gemini Client with Commutative Vector Cache & Sub-Millisecond Fallback | Implement air-gapped assistive AI with strict schema enforcement, prompt injection defense, 24h commutative vector memoization, and instant (<0.01ms) deterministic fallback engine | **Implemented** | AI Engineer / Solution Architect |
| **DEC-018** | 2026-11-14 | Backend Engineering | Modular Backend Service & Deterministic Scoring Engine | Complete production-grade Node.js/TypeScript backend services, reversible PostgreSQL migrations, deterministic 7-vector scoring engine (ADR-006), refresh token rotation, and 30 automated tests | **Implemented** | Backend Engineer / Solution Architect |
| **DEC-019** | 2026-11-14 | Frontend Engineering | Next.js App Router Application & Accessible Design System | Complete mobile-first UI components, discovery card deck, thumb-zone controls, type-safe OpenAPI client, and 22 automated component tests | **Implemented** | Frontend Engineer / Solution Architect |
| **DEC-020** | 2026-11-14 | Governance | Initiation of Workflow E (Testing & QA) | Human approval of Workflow D implementation unlocks test pyramid execution, API contract verification, security audit, and release recommendation | **Approved** | Chief Orchestrator / Human User |
| **DEC-021** | 2026-11-14 | Security | Formal Release Security Audit & STRIDE Threat Sign-Off | Verification of all 23 STRIDE threats, OWASP Top 10 compliance, India DPDP Act 2023 statutory controls, and 16 automated security tests passing with 0 CVEs | **Approved** | Security Reviewer |



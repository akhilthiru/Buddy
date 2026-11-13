# Flatmate Project Knowledge Base

Welcome to the centralized project knowledge repository for **Flatmate** — the person-first flatmate discovery and compatibility platform.

---

## Knowledge Structure Sitemap

```text
docs/
├── README.md                           # This knowledge base directory
├── PROJECT_STATUS.md                   # Real-time milestone, phase, and blocker tracking
├── DECISION_LOG.md                     # Chronological log of all architectural and product decisions
│
├── product/                            # Product Strategy & Market Research
│   ├── context.md                      # Product concept, pillars, and Trivandrum market context
│   ├── problem-statement.md            # Validated customer friction points across 4 modalities
│   ├── market-research.md              # Regional market dynamics, student/tech demographics
│   ├── user-personas.md                # Granular user personas (students, Technopark IT staff)
│   ├── value-proposition.md            # Value proposition canvas and differentiation
│   └── mvp-scope.md                    # Prioritized MVP feature scope (MoSCoW)
│
├── requirements/                       # Requirements Engineering
│   ├── PRD.md                          # Master Product Requirements Document
│   ├── functional-requirements.md      # Detailed functional specs (FR-01..FR-XX)
│   ├── non-functional-requirements.md  # Latency, accessibility, security, and responsive targets
│   ├── backlog.md                      # Epics and User Stories with Gherkin acceptance criteria
│   └── traceability-matrix.md          # Traceability matrix mapping PRD -> Stories -> Tests
│
├── architecture/                       # System Architecture & Technical Specifications
│   ├── system-architecture.md          # Modular Monolith C4 diagrams & bounded contexts
│   ├── database-schema.md              # PostgreSQL 3NF data models, indexes, and ER diagrams
│   ├── api-spec.yaml                   # OpenAPI 3.1 REST contracts
│   ├── threat-model.md                 # STRIDE threat modeling & abuse prevention
│   └── adr/                            # Architecture Decision Records
│       ├── ADR-001-modular-monolith.md # Modular Monolith decision
│       └── ADR-002-provisional-tech-stack.md # Next.js + Node.js + PostgreSQL baseline
│
├── ux/                                 # UX & UI Design Specifications
│   ├── user-journeys.md                # End-to-end user journeys for all 4 modalities
│   ├── information-architecture.md     # Sitemap, navigation hierarchy, and discovery state machine
│   ├── design-system.md                # Design tokens, color scales, typography, and component anatomy
│   └── wireframes-and-specs.md         # Mobile-first responsive specifications (360px-1440px)
│
├── development/                        # Developer Guides & Coding Standards
│   ├── frontend-guide.md               # Next.js App Router guidelines, client/server split
│   └── backend-guide.md                # Node.js service patterns, database repository rules
│
├── testing/                            # Quality Assurance & Verification
│   ├── test-strategy.md                # Test pyramid, browser/device test matrix
│   ├── defect-log.md                   # Defect tracking with reproduction steps
│   ├── release-test-report.md          # Formal test execution evidence and coverage
│   └── security-signoff.md             # Security audit report and release sign-off
│
├── deployment/                         # DevOps, Infrastructure & Operations
│   ├── cloud-infrastructure.md         # Container architecture, IaC, and hosting topology
│   ├── cicd-pipeline.md                # GitHub Actions pipeline stages and security gates
│   └── rollback-runbook.md             # Automated zero-downtime rollback procedures
│
├── workflows/                          # Reusable Workflow Runbooks (Workflows A through G)
│   ├── workflow-a-ideation.md          # Ideation & Product Discovery
│   ├── workflow-b-requirements.md      # Requirements Engineering & PRD
│   ├── workflow-c-architecture-and-design.md # System Architecture & UI Design
│   ├── workflow-d-development.md       # Synchronized Feature Development
│   ├── workflow-e-testing.md           # QA Testing, Security Review & Gating
│   ├── workflow-f-infrastructure-and-deployment.md # Staging Deployment & Infra Setup
│   └── workflow-g-release.md           # Production Release with Level 3 Human Approval
│
└── templates/                          # Standardized Templates for Engineering Deliverables
    ├── prd-template.md                 # PRD template
    ├── adr-template.md                 # ADR template
    ├── user-story-template.md          # User Story template (Given-When-Then)
    ├── tech-spec-template.md           # Technical Specification template
    ├── test-plan-template.md           # Test Plan template
    ├── security-review-template.md     # Security Review template
    └── handoff-report-template.md      # Standard Agent Handoff Report template
```

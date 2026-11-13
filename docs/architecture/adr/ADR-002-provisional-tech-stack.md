# ADR-002: Provisional Technology Stack Selection

- **Status**: Accepted (Provisional pending Solution Architect formal evaluation)
- **Author**: Solution Architect
- **Reviewers**: Frontend Engineer, Backend Engineer, DevOps Engineer, Chief Orchestrator
- **Date**: 2026-11-13
- **Tags**: tech-stack, frontend, backend, database

---

## 1. Context and Problem Statement
To build the Flatmate platform efficiently with end-to-end type safety, modern mobile-first UI responsiveness, and robust relational data management, the engineering team must align on an initial technology baseline.

## 2. Decision Drivers
- End-to-end type safety from database models to frontend UI components.
- Mobile-first responsiveness and PWA capability with optimal Core Web Vitals.
- Relational integrity, ACID compliance, and rich geospatial/indexing capabilities for compatibility matching.
- Mature ecosystem, robust tooling, and container-friendly deployment.

## 3. Considered Options
- **Frontend**: Next.js (React) vs Remix vs SvelteKit vs Single-Page React (Vite).
- **Backend**: Node.js (TypeScript) vs Python (FastAPI) vs Go.
- **Database**: PostgreSQL vs MongoDB vs MySQL.

## 4. Decision Outcome
Chosen provisional stack:
1. **Frontend**: **Next.js (App Router), React 18/19, TypeScript, Tailwind CSS**.
   - Server Components for SEO and fast initial rendering; Client Components for interactive card discovery and swiping.
   - Built-in PWA support, image optimization, and responsive design ergonomics.
2. **Backend**: **Node.js with TypeScript (Modular Clean Architecture)**.
   - Shared types between frontend and backend.
   - Fast asynchronous I/O ideal for real-time messaging and high-concurrency feed browsing.
3. **Database**: **PostgreSQL**.
   - Relational modeling guarantees referential integrity between users, lifestyle preference vectors, mutual matches, and messages.
   - Mature JSONB support for semi-structured survey metadata and PostGIS/geospatial extensions for proximity filtering.
4. **AI Assistance**: **Gemini API (via SDK)**.
   - Lightweight, fast structured output generation for "Why You Click" compatibility narratives.

### Positive Consequences
- Unified TypeScript developer experience across frontend, backend, and test suites.
- Strict contract enforcement using OpenAPI 3.1 and Zod validation.
- Cloud-agnostic containerized deployment (runs seamlessly on Docker, Cloud Run, AWS, or local machine).

### Negative Consequences / Trade-offs
- Node.js CPU-bound operations (if matching algorithm becomes massively complex) would require background worker offloading.


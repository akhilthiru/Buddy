---
trigger: always_on
---

# Rule 04: Technical and Coding Standards

### 1. Architecture: Modular Monolith
- Flatmate is built as a clean modular monolith. Do not introduce microservices, distributed queues (e.g. Kafka/RabbitMQ), or service meshes prematurely.
- Code must be organised by domain modules (e.g., `modules/auth/`, `modules/matching/`, `modules/users/`, `modules/messaging/`, `modules/rooms/`).
- Cross-module communication must happen via explicit service interfaces or typed internal events.

### 2. Frontend Standards
- Framework: Next.js (App Router), React 18/19, TypeScript in strict mode.
- Styling: Tailwind CSS following the design system tokens.
- Design: Mobile-first responsive layouts (tested at 360px, 390px, 768px, 1024px, 1440px). Touch targets must be at least 44x44px.
- Accessibility: WCAG 2.1 AA compliance (proper ARIA attributes, semantic HTML, color contrast > 4.5:1).
- State: Server components for data fetching; React hooks/Zustand for client-side state.

### 3. Backend Standards
- Runtime: Node.js with TypeScript (strict type checking enabled).
- Database: PostgreSQL with versioned, reversible migration scripts.
- APIs: RESTful endpoints adhering strictly to OpenAPI 3.1 specifications.
- Error Handling: Uniform error responses with RFC 7807 problem details (`{ type, title, status, detail, instance }`).
- Matching Logic: Deterministic, transparent scoring algorithm. Never delegate hard business rules or compatibility filtering to non-deterministic LLM calls.

### 4. Quality & Testing
- Unit tests for all business logic, services, and utility functions (Vitest/Jest).
- Integration tests for API endpoints and database repositories.
- End-to-end tests for critical user journeys (Playwright).
- Minimum test coverage requirement: 80% on core business modules (matching, auth, privacy).


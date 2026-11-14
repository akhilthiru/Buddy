# ADR-004: Contract-First API Design with OpenAPI 3.1

- **Status**: Accepted
- **Author**: Solution Architect
- **Reviewers**: Chief Orchestrator, Frontend Engineer, Backend Engineer, QA Engineer
- **Date**: 2026-11-14
- **Tags**: api, openapi, contracts, architecture

---

## 1. Context and Problem Statement
In Flatmate, the frontend (Next.js PWA) and backend (Node.js Modular Monolith) will be implemented and tested concurrently by different engineers and agents.
Without a strict, binding API contract written and reviewed upfront, teams suffer from integration drift, mismatched request/response field names, inconsistent error formats, untracked breaking changes, and blocked test automation.
We must establish the contract methodology and specification standard for all client-server communications.

## 2. Decision Drivers
- **Contract-First Governance**: Strict adherence to Governance Rule 04 ("Contract-First Development").
- **Parallel Engineering**: Frontend Engineer can mock endpoints and build UI components while Backend Engineer builds service modules against the identical contract.
- **Automated Type Generation**: Seamless TypeScript type generation for both frontend API clients and backend route handlers.
- **Standardized Error Handling**: Uniform problem details adhering to RFC 7807 (`application/problem+json`).
- **Comprehensive API Coverage**: Full specification covering all 28 functional requirements (FR-01 to FR-28).

## 3. Considered Options
- **Option 1: Contract-First with OpenAPI 3.1 (YAML)**: Author the canonical specification in `docs/architecture/api-spec.yaml` prior to coding; generate TypeScript types and client SDKs via tooling (`openapi-typescript`, `openapi-fetch`).
- **Option 2: Code-First Backend Annotations**: Implement backend routes using decorators/annotations (e.g., NestJS Swagger / TSOA) and export OpenAPI spec dynamically at runtime.
- **Option 3: End-to-End tRPC**: Share TypeScript types directly between Next.js and Node.js without an intermediate OpenAPI schema.

## 4. Decision Outcome
Chosen option: **Option 1: Contract-First with OpenAPI 3.1 (YAML)**.

OpenAPI 3.1 provides industry-standard, vendor-neutral REST specifications with native JSON Schema 2020-12 alignment. Specifying endpoints, request payloads, security schemes (`bearerAuth`, `cookieAuth`), RFC 7807 error models, and pagination parameters upfront guarantees complete predictability across engineering handoffs.

### Positive Consequences
- **Zero Ambiguity**: Frontend and Backend developers have an exact, immutable schema for every route.
- **Automated Type Safety**: Tooling (`openapi-typescript`) converts `docs/architecture/api-spec.yaml` into compile-time TypeScript interfaces for frontend and backend.
- **Contract Testing**: QA engineers can execute automated API contract tests directly against the specification (e.g., via Spectral or Dredd) to catch contract regressions automatically.
- **RFC 7807 Standard**: Client applications have predictable error parsing for form field validation errors and server errors.

### Negative Consequences / Trade-offs
- Modifying an API requires updating `docs/architecture/api-spec.yaml` and regenerating types rather than simply changing a backend controller signature.
- Spec files require discipline to maintain consistent documentation.

## 5. Pros and Cons of Considered Options

### Option 1: OpenAPI 3.1 Contract-First (Chosen)
- Good: Full decoupling between frontend and backend workflows.
- Good: Industry standard supported by mock servers (Prism), linters (Spectral), and test runners.
- Good: Native JSON Schema support in OpenAPI 3.1 allows complex validation definitions.
- Bad: Requires explicit authoring and maintenance of YAML specification.

### Option 2: Code-First (Backend Driven)
- Good: Developers only write code once in the backend.
- Bad: Frontend is blocked until backend routes are implemented.
- Bad: High risk of unintentional breaking changes when backend code is refactored.
- Bad: Violates Project Flatmate Governance Rule 04.

### Option 3: tRPC
- Good: High TypeScript developer velocity in fullstack monorepos.
- Bad: Couples frontend and backend directly to TypeScript RPC conventions; difficult to inspect with standard REST tooling, API gateways, or mobile clients.
- Bad: Lacks standard OpenAPI documentation needed for security audits and external integrations.

## 6. Implementation Notes & Follow-ups
- The canonical specification is maintained in `docs/architecture/api-spec.yaml`.
- Automated script `npm run codegen:api` will be configured by Lead Engineers to generate `src/types/api.generated.ts` for both frontend and backend modules.
- CI/CD pipeline will enforce Spectral linting on `api-spec.yaml` to ensure zero schema errors.

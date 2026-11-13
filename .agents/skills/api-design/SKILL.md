---
name: api-design
description: Design RESTful API contracts, OpenAPI 3.1 specifications, request/response schemas, error handling (RFC 7807), and pagination standards for Flatmate.
---

# API Design Skill

## Purpose
Design, specify, and enforce consistent, type-safe, and secure RESTful API contracts using OpenAPI 3.1 specifications before any frontend or backend code is written.

## When to Use It
- During Workflow C (Architecture & Design) and prior to API implementation in Workflow D.
- Whenever proposing new endpoints, query parameters, or payload alterations.
- To validate frontend and backend contract adherence.

## Required Inputs
- Functional requirements (`docs/requirements/functional-requirements.md`).
- Relational schema models (`docs/architecture/database-schema.md`).

## Step-by-Step Procedure
1. **Define API Resource Naming & URI Standards**:
   - Nouns for resources (e.g., `/api/v1/auth`, `/api/v1/profiles/me`, `/api/v1/discovery/feed`, `/api/v1/matches`, `/api/v1/conversations/{id}/messages`).
   - Standard HTTP verbs: GET (read), POST (create/action), PUT/PATCH (update), DELETE (remove).
2. **Specify Standard Response Wrapper & Pagination**:
   - Cursor-based or limit-offset pagination: `{ data: [...], pagination: { cursor, hasMore, limit } }`.
3. **Specify Error Payload Standard (RFC 7807)**:
   - `{ type: "https://flatmate.in/errors/invalid-input", title: "Validation Error", status: 400, detail: "...", invalidParams: [...] }`.
4. **Draft OpenAPI 3.1 Contract**:
   - Exhaustively document request bodies, headers, auth security schemes (`bearerAuth`), query parameters, and all HTTP status codes (200, 201, 400, 401, 403, 404, 409, 429, 500).
5. **Publish Contract**: Save OpenAPI YAML in `docs/architecture/api-spec.yaml`.

## Expected Outputs
- `docs/architecture/api-spec.yaml`
- API contract documentation in `docs/architecture/api-guidelines.md`.

## Quality Checklist
- [ ] Contract is valid OpenAPI 3.1 (lintable with Spectral or Redocly).
- [ ] Every mutation endpoint has explicit validation rules.
- [ ] Authentication and role security schemes are attached to every protected route.

## Relevant References
- [system-architecture](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/system-architecture/SKILL.md)
- [backend-engineering](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/backend-engineering/SKILL.md)
- [frontend-engineering](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/frontend-engineering/SKILL.md)


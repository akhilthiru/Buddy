---
name: test-automation
description: Design, implement, and execute test automation strategies across the test pyramid, including unit, integration, API contract, and Playwright E2E tests for Flatmate.
---

# Test Automation Skill

## Purpose
Establish and execute an automated testing pyramid for Flatmate, ensuring end-to-end reliability, contract fidelity, mobile responsive integrity, and defect prevention before release.

## When to Use It
- During Workflow D (Development), Workflow E (Testing), and CI/CD runs.
- When creating test suites for new features or user journeys.
- When validating bug fixes and verifying release candidates.

## Required Inputs
- User story acceptance criteria (`docs/requirements/backlog.md`).
- OpenAPI contract (`docs/architecture/api-spec.yaml`).
- Test strategy guidelines (`docs/testing/test-strategy.md`).

## Step-by-Step Procedure
1. **Implement Testing Pyramid**:
   - **Unit Tests (Vitest/Jest)**: Test domain logic, scoring algorithms, validation functions, and utility helpers in isolation (target: > 80% coverage).
   - **Integration Tests (Supertest/Testcontainers)**: Test API endpoints against a real PostgreSQL test database instance; verify transactions and rollback behavior.
   - **API Contract Tests**: Validate response schemas and status codes against OpenAPI specs automatically using Dredd, Prism, or Spectral.
   - **End-to-End Tests (Playwright)**: Automate core user journeys across mobile (390px) and desktop (1280px) viewports (Registration -> Profiling -> Feed -> Swiping -> Mutual Match -> Chat).
2. **Execute Responsive & Cross-Browser Regression**:
   - Run Playwright tests on Chromium, Firefox, and WebKit emulation.
3. **Capture & Report Verifiable Evidence**:
   - Save execution logs, JUnit XML test reports, and coverage summaries.
4. **Log Defects & Track Resolution**:
   - Record any failures in `docs/testing/defect-log.md` with step-by-step reproduction scripts.

## Expected Outputs
- Automated test scripts and fixtures across all test layers.
- Test execution reports and coverage logs.
- Defect reports in `docs/testing/defect-log.md`.

## Quality Checklist
- [ ] Tests run deterministically without flaky timing dependencies.
- [ ] Every functional acceptance criterion has at least one corresponding test.
- [ ] CI pipeline fails on any test suite failure.

## Relevant References
- [frontend-engineering](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/frontend-engineering/SKILL.md)
- [backend-engineering](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/backend-engineering/SKILL.md)
- [cicd-deployment](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/cicd-deployment/SKILL.md)

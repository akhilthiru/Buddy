# Test Plan Template

**Plan Title**: [Feature / Release / Sprint Test Plan]  
**Author**: QA Engineer  
**Reviewers**: Solution Architect, Chief Orchestrator  
**Status**: [Draft | Active | Completed]  
**Version**: [1.0]

---

## 1. Scope & Strategy
- **In Scope**:
- **Out of Scope**:
- **Test Strategy Approach**: (Unit, Integration, Contract, E2E, Regression, Responsive)

## 2. Test Environment & Fixtures
- **Target Environments**: [Local, CI, Staging]
- **Browsers & Devices**: [Chromium, WebKit, Firefox; Mobile: 360x800, 390x844; Desktop: 1280x800]
- **Test Data Seeds**: [Seed personas, dummy roommate listings, token mock fixtures]

## 3. Test Cases & Verification Matrix
| Test ID | Requirement / Story ID | Category | Scenario Description | Expected Outcome | Execution Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-01 | US-01 | Contract | Verify `GET /api/v1/feed` matches OpenAPI schema | Status 200, schema valid | Pending |
| TC-02 | US-02 | E2E | User completes questionnaire and swipes right | Match card animates, record saved | Pending |

## 4. Exit & Acceptance Criteria
- [ ] 100% of P0/Must-have test cases pass.
- [ ] Zero open Blocker or Critical defects.
- [ ] Minimum 80% code coverage on core domain logic.
- [ ] All API contracts 100% compliant with OpenAPI spec.

## 5. Defect Logging & Escalation
- Defects logged in `docs/testing/defect-log.md` with repro steps, logs, and screenshots.


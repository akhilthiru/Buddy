# User Story Template

## Story ID: US-[NNN] - [Story Title]
- **Epic**: [Epic Title / ID]
- **Author**: Requirements Analyst
- **Priority**: [Must Have | Should Have | Could Have | Won't Have]
- **Estimate**: [Story Points / T-Shirt Size]
- **Assigned Agent**: [Frontend Engineer | Backend Engineer | AI Engineer]

---

### 1. User Story Statement
**As a** [specific user persona / role],  
**I want** [a specific capability or feature],  
**So that** [the business value or user benefit gained].

---

### 2. Context & Background
[Brief explanation of user motivation and prerequisite states]

---

### 3. Acceptance Criteria (Given-When-Then)

```gherkin
Scenario 1: Happy Path - [Scenario Title]
  Given [initial context or precondition]
  When [action or event triggered by user]
  Then [observable outcome and state change]
  And [additional assertion]

Scenario 2: Validation Failure / Edge Case - [Scenario Title]
  Given [precondition]
  When [invalid action or edge case trigger]
  Then [system handles gracefully with specific user feedback]

Scenario 3: Boundary / Permission Case - [Scenario Title]
  Given [unauthorized user or expired session]
  When [action attempted]
  Then [action blocked with appropriate error code]
```

---

### 4. Technical Constraints & Design References
- **API Endpoint**: [e.g., `POST /api/v1/swipes`]
- **UI Spec / Component**: [Link to wireframe or design system component]
- **Security Check**: [e.g., Rate limit max 100 requests/min]


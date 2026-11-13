---
name: user-story-writing
description: Break epics into user stories adhering to INVEST criteria with Given-When-Then (Gherkin) acceptance criteria and story estimation.
---

# User Story Writing Skill

## Purpose
Decompose high-level PRD requirements into testable, independent, and developer-ready user stories with rigorous Given-When-Then acceptance criteria.

## When to Use It
- During Workflow B (Requirements) and backlog grooming.
- Prior to development sprint planning or agent task delegation.
- Whenever a feature requires clarification for engineering and QA implementation.

## Required Inputs
- Approved PRD (`docs/requirements/PRD.md`) and Functional Requirements.
- User personas (`docs/product/user-personas.md`).

## Step-by-Step Procedure
1. **Apply INVEST Principles**: Verify each story is Independent, Negotiable, Valuable, Estimable, Small, and Testable.
2. **Structure the User Story Format**: Use the standard template:
   `As a [type of user], I want [an action/capability] so that [a benefit/outcome].`
3. **Draft Acceptance Criteria (Gherkin format)**: Author multiple scenarios per story:
   ```gherkin
   Scenario: [Descriptive Scenario Name]
     Given [precondition or state]
     When [action or trigger occurs]
     Then [expected outcome or assertion]
     And [additional assertion if applicable]
   ```
4. **Identify Edge Cases & Error States**: Document empty discovery states, network timeouts, invalid inputs, and security boundary violations.
5. **Compile Backlog**: Store stories grouped by Epic in `docs/requirements/backlog.md`.

## Expected Outputs
- `docs/requirements/backlog.md`
- Acceptance criteria for every functional requirement.

## Quality Checklist
- [ ] Every story has at least 2 Given-When-Then scenarios (happy path + edge/error case).
- [ ] Acceptance criteria are directly testable by automated QA test suites.
- [ ] Stories are mapped back to PRD functional requirements.

## Relevant References
- [User Story Template](file:///home/akhil/Vibe%20Coding/Flatmate/docs/templates/user-story-template.md)
- [requirements-engineering](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/requirements-engineering/SKILL.md)

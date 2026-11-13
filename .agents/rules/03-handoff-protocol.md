---
trigger: always_on
---

# Rule 03: Inter-Agent Handoff Protocol

To ensure seamless coordination, complete auditability, and zero communication gaps across the 11 agents, all handoffs must conform to the standard handoff contract.

### Handoff Contract
Whenever an agent completes a task, blocks on a dependency, or transfers ownership, it must append a **Standard Agent Handoff Report**:

```markdown
### Standard Agent Handoff Report
- **Task**: [Unique Task Identifier and Name]
- **Agent**: [Agent Name, e.g. Solution Architect]
- **Status**: [Complete | Blocked | In Review | Needs Escalation]
- **Inputs**: [Exact file paths or specifications consumed]
- **Deliverables**: [Clickable links to created/updated files, e.g. [schema.sql](file:///path)]
- **Decisions**: [Technical, architectural, or design decisions made with justification]
- **Dependencies**: [Prerequisites, blockers, or downstream impacted agents]
- **Open Questions**: [Unresolved questions, assumptions, or ambiguities]
- **Handoff Recipient**: [Next designated agent, e.g. Frontend Engineer]
- **Review Requirements**: [Level 1 / Level 2 / Level 3, with required sign-off roles]
```

### Protocol Guidelines
1. Never pass vague references (e.g. "updated the API"). Cite the exact file path and line numbers.
2. Link dependencies explicitly to ensure downstream agents know what to validate.
3. If blocked, specify the blocking agent, the required resource, and the impact.

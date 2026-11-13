---
name: ux-research
description: Conduct user experience research, journey mapping across 4 discovery modalities, information architecture, and psychological safety design for Flatmate.
---

# UX Research Skill

## Purpose
Research, model, and optimize the end-to-end user experience, psychological safety, and interaction dynamics of person-first flatmate discovery.

## When to Use It
- During Workflow B (Requirements) and Workflow C (Architecture & Design).
- When designing onboarding flows, compatibility questionnaires, or discovery interactions.
- When validating trust and safety ergonomics.

## Required Inputs
- Target user personas (`docs/product/user-personas.md`).
- Core product pillars: Compatibility, Trust & Safety, Person-First Discovery.
- The 4 core user modalities.

## Step-by-Step Procedure
1. **Map Modal User Journeys**: Detail step-by-step emotional states, user actions, touchpoints, and friction areas for:
   - Journey A: Has room available, seeking flatmate.
   - Journey B: Needs room and flatmate.
   - Journey C: Relocating with new flatmate.
   - Journey D: Looking for flatmate first before joint search.
2. **Design Compatibility Profiling Flow**: Balance questionnaire depth vs onboarding drop-off (lifestyle chips, routine sliders, dietary/social toggles).
3. **Structure Information Architecture (IA)**: Map sitemap, tab bar hierarchy, discovery feed filters, conversation threading, and safety controls.
4. **Define Psychological Safety Heuristics**: Design verification badges, mutual opt-in rules (no unprompted messaging), emergency blocking/reporting, and location coarsening.
5. **Publish UX Research Specs**: Save outputs in `docs/ux/user-journeys.md` and `docs/ux/information-architecture.md`.

## Expected Outputs
- `docs/ux/user-journeys.md`
- `docs/ux/information-architecture.md`
- Psychological safety specification in `docs/ux/safety-ux.md`.

## Quality Checklist
- [ ] User journeys explicitly cover all 4 modalities.
- [ ] Onboarding completion friction is minimized while capturing vital compatibility dimensions.
- [ ] Privacy safeguards are embedded into UX rather than bolted on.

## Relevant References
- [design-systems](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/design-systems/SKILL.md)
- [responsive-design](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/responsive-design/SKILL.md)


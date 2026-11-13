---
name: responsive-design
description: Design and specify mobile-first responsive layouts, touch ergonomics, fluid breakpoints, PWA manifest criteria, and desktop adaptations for Flatmate.
---

# Responsive Design Skill

## Purpose
Ensure Flatmate provides a first-class mobile experience while adapting gracefully to tablet and desktop viewports, following Progressive Web App (PWA) readiness standards.

## When to Use It
- During Workflow C (Architecture & Design) and Workflow D (Development).
- When specifying wireframes, component layouts, and viewport behavior.
- When reviewing frontend implementations across devices.

## Required Inputs
- Information architecture (`docs/ux/information-architecture.md`).
- Target device metrics (typical Indian smartphone viewports: 360x800, 390x844, 412x915, plus desktop 1440x900).

## Step-by-Step Procedure
1. **Define Breakpoint Grid System**:
   - Mobile: `< 640px` (single column, sticky bottom navigation, bottom sheet drawers).
   - Tablet: `640px - 1024px` (two column, expanded cards, modal dialogs).
   - Desktop: `> 1024px` (three column layout: navigation sidebar, discovery center, profile/chat preview panel).
2. **Specify Mobile Ergonomics**:
   - Minimum touch target: 44 x 44 px.
   - Thumb zone optimization: primary actions (like, pass, chat, filter) placed within easy one-handed thumb reach.
   - Swipe gesture boundaries with visual spring physics.
3. **Specify Desktop Adaptation**:
   - Keyboard shortcuts for card discovery (Left arrow = Pass, Right arrow = Like, Up arrow = Details).
   - Multi-pane layout to leverage wide screens without feeling stretched.
4. **Define PWA Readiness Criteria**:
   - Manifest specification (icons, standalone display mode, theme colors).
   - Service worker caching strategy (offline fallback, asset precaching).

## Expected Outputs
- `docs/ux/responsive-specifications.md`
- Layout breakpoint rules and viewport test matrix.

## Quality Checklist
- [ ] Mobile-first approach: designs start at 360px and scale up, not down.
- [ ] Desktop experience utilizes screen real estate productively rather than displaying a stretched mobile container.
- [ ] Meets WCAG 2.1 AA touch target requirements.

## Relevant References
- [design-systems](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/design-systems/SKILL.md)
- [frontend-engineering](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/frontend-engineering/SKILL.md)

---
name: frontend-engineering
description: Implement Next.js App Router applications, React components, TypeScript strict mode, responsive state management, and type-safe API client integration for Flatmate.
---

# Frontend Engineering Skill

## Purpose
Guide the implementation, optimization, and testing of Flatmate's mobile-first responsive web application and PWA using Next.js, React, TypeScript, and Tailwind CSS.

## When to Use It
- During Workflow D (Development) and frontend maintenance.
- When creating UI components, pages, client-side state hooks, or API integrations.
- When optimizing Web Vitals (LCP, FID, CLS) or debugging client-side rendering.

## Required Inputs
- Approved OpenAPI contract (`docs/architecture/api-spec.yaml`).
- Design system tokens and wireframe specifications (`docs/ux/design-system.md`).
- Approved user stories and acceptance criteria.

## Step-by-Step Procedure
1. **Structure App Directory**:
   - `app/(auth)/login/`, `app/(auth)/register/`
   - `app/(dashboard)/discover/` (interactive card stack)
   - `app/(dashboard)/matches/` (matches list and conversation drawers)
   - `app/(dashboard)/profile/` (lifestyle preferences and room listing manager)
   - `components/ui/` (base primitives: button, input, badge, modal)
   - `components/features/` (match card, swipe deck, chat window, filter bar)
2. **Implement Server vs Client Boundary**:
   - Keep data fetching and static layouts in Server Components (RSC) to minimize client bundle size.
   - Restrict `"use client"` directives to interactive widgets (e.g. swipe gestures, form steppers, websocket chat listeners).
3. **Generate & Bind Type-Safe API Client**:
   - Generate TypeScript types directly from `docs/architecture/api-spec.yaml`.
   - Implement data fetching with SWR or React Query with optimistic UI updates.
4. **Enforce Strict Quality Standards**:
   - Strict TypeScript (`noImplicitAny: true`, `strictNullChecks: true`).
   - Zero console errors or warnings in production builds.
5. **Verify with Automated Component Tests**:
   - Author tests using Vitest and React Testing Library for critical UI states.

## Expected Outputs
- Next.js application source code, components, and hooks.
- Component and integration test suites.
- Documentation in `docs/development/frontend-guide.md`.

## Quality Checklist
- [ ] Conforms strictly to `docs/architecture/api-spec.yaml`.
- [ ] Fully responsive on viewports 360px through 1440px.
- [ ] Zero hardcoded styling outside the design system tokens.
- [ ] Passes automated linting and type-checking without warnings.

## Relevant References
- [design-systems](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/design-systems/SKILL.md)
- [api-design](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/api-design/SKILL.md)
- [test-automation](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/test-automation/SKILL.md)


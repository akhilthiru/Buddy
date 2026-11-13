---
name: design-systems
description: Define, document, and maintain design tokens, component anatomy, accessible color palettes, typography scales, and Tailwind theme configurations for Flatmate.
---

# Design Systems Skill

## Purpose
Establish a cohesive, accessible, and scalable design system of tokens, typography, colors, spacing, and reusable component contracts for the Flatmate platform.

## When to Use It
- During Workflow C (Architecture & Design) and Workflow D (Development).
- When introducing new UI components, interactive states, or theming updates.
- When verifying accessibility contrast and visual consistency across the frontend.

## Required Inputs
- Product brand pillars: Warmth, Trust, Modernity, Clarity.
- Accessibility standards (WCAG 2.1 AA).
- Tailwind CSS configuration architecture.

## Step-by-Step Procedure
1. **Define Core Token Architecture**:
   - Color Palette: Primary (Trust Blue/Teal), Accent (Warm Coral/Amber), Neutral (Slate gray scale), Semantic (Success Emerald, Warning Amber, Danger Rose).
   - Light/Dark mode contrast mappings satisfying WCAG 2.1 AA (contrast >= 4.5:1 for normal text, >= 3:1 for large text).
   - Typography Scale: Sans-serif (Inter / Geist), modular scale from 12px (caption) to 32px (display).
   - Spacing & Elevation: 4px base scale (4, 8, 12, 16, 24, 32, 48px); soft layered drop shadows for discovery cards.
2. **Specify Core Component Anatomy**:
   - `MatchCard`: Photo carousel, compatibility badge (score + key alignment tag), profile summary, quick lifestyle chips.
   - `CompatibilityBadge`: Visual score indicator (e.g. 92% Match) with tooltip/drawer explaining shared traits.
   - `LifestyleChip`: Multi-state toggleable tags (Early Bird, Non-Smoker, Vegetarian, WFH, Pet Friendly).
   - `InteractionControls`: Pass (Circle, Rose outline), Super-Like (Star, Amber), Like (Heart, Emerald).
   - `ChatThreadItem`: Avatar, online indicator, last message snippet, mutual match badge.
3. **Compile Design System Specification**: Save to `docs/ux/design-system.md` with full Tailwind token export.

## Expected Outputs
- `docs/ux/design-system.md`
- Tailwind theme configuration snippet for frontend integration.

## Quality Checklist
- [ ] Every color token passes WCAG 2.1 AA contrast check against intended backgrounds.
- [ ] Component anatomy includes all interactive states (default, hover, focus-visible, active, disabled).
- [ ] Tokens are cleanly exportable to Tailwind CSS variables.

## Relevant References
- [responsive-design](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/responsive-design/SKILL.md)
- [frontend-engineering](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/frontend-engineering/SKILL.md)


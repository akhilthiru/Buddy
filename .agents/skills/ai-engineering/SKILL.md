---
name: ai-engineering
description: Implement LLM integration, structured outputs with schema enforcement, prompt engineering, compatibility explanations, token optimization, and guardrails for Flatmate.
---

# AI Engineering Skill

## Purpose
Design, implement, evaluate, and secure targeted assistive AI capabilities for Flatmate using the Gemini API, guaranteeing strict JSON schema compliance and zero hallucination of matching rules.

## When to Use It
- During Workflow D (Development) when integrating AI-assisted features.
- When authoring or tuning prompts for compatibility explanations or bio refinement.
- When benchmarking model accuracy, latency, token consumption, or safety filters.

## Required Inputs
- Deterministic compatibility scoring breakdown from `backend-engineering`.
- User lifestyle preference attributes.
- Strict JSON output schemas.

## Step-by-Step Procedure
1. **Define Assistive Scope & Non-Goals**:
   - Primary Goal: Generate empathetic, concise (2-3 bullet point) explanations of why two users match ("Why You Click"), highlighting shared daily rhythms or complementary habits.
   - Non-Goal: AI must never calculate compatibility scores or filter users.
2. **Design Structured Prompts & Few-Shot Examples**:
   - Provide explicit system instructions, persona context, and input attribute vectors.
   - Example prompt structure:
     ```markdown
     You are the Flatmate Compatibility Assistant. Given two anonymized profiles and their deterministic match breakdown, generate a friendly 2-sentence summary of their primary lifestyle harmonies and one potential compromise area.
     Output must strictly conform to the following JSON schema.
     ```
3. **Enforce Strict Schema Outputs**:
   - Use Gemini API structured output mode (`response_schema`) or validate through Zod/Pydantic schemas.
4. **Implement Token & Latency Optimization**:
   - Use lightweight models (Gemini Flash) for latency < 800ms.
   - Cache repeated prompt prefixes and anonymized vector templates.
5. **Implement Privacy & Security Guardrails**:
   - Strip all PII (names, phone numbers, exact addresses) prior to invoking LLM endpoints.
   - Sanitize user bio text to prevent prompt injection attacks.
6. **Automate Evaluation**:
   - Run automated evaluation scripts checking schema adherence, response length, and sentiment appropriateness.

## Expected Outputs
- AI service module, client bindings, and prompt templates.
- Strict JSON validation schemas.
- Evaluation harness and benchmark logs.
- Documentation in `docs/architecture/ai-architecture.md`.

## Quality Checklist
- [ ] No PII is ever sent to external LLM endpoints.
- [ ] 100% of LLM outputs pass automated schema validation.
- [ ] AI does not override or alter deterministic compatibility scores.
- [ ] Graceful fallback handles API rate limits or downtime seamlessly.

## Relevant References
- [security-engineering](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/security-engineering/SKILL.md)
- [backend-engineering](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/backend-engineering/SKILL.md)

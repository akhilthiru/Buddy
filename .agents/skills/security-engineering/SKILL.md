---
name: security-engineering
description: Execute threat modeling (STRIDE), OWASP Top 10 security audits, authentication/authorization hardening, privacy compliance (DPDP Act), and vulnerability scanning for Flatmate.
---

# Security Engineering Skill

## Purpose
Enforce application security, data privacy, threat modeling, and statutory compliance across the Flatmate architecture and codebase, preventing data breaches, abuse, and regulatory penalties.

## When to Use It
- During Workflow C (Architecture & Design), Workflow D (Development), Workflow E (Testing), and prior to production release in Workflow G.
- When reviewing authentication, session handling, or user data export.
- When auditing external dependencies for known CVEs.

## Required Inputs
- System architecture and data flow diagrams (`docs/architecture/system-architecture.md`).
- OpenAPI specification (`docs/architecture/api-spec.yaml`).
- Indian statutory framework: Digital Personal Data Protection (DPDP) Act.

## Step-by-Step Procedure
1. **Conduct STRIDE Threat Modeling**:
   - Spoofing: Token tampering, impersonation (mitigated by signed JWTs + refresh rotation).
   - Tampering: Parameter tampering on match scores or user roles (mitigated by server-side recalculation and RBAC).
   - Repudiation: Unaudited abuse reports or account deletions (mitigated by immutable audit logs).
   - Information Disclosure: Exposing user phone numbers or coordinates in discovery feed (mitigated by field-level serialization masking).
   - Denial of Service: Automated spamming or swipe exhaustion (mitigated by Redis rate limiters: max 100 swipes/hour).
   - Elevation of Privilege: Escalating user to moderator/admin (mitigated by strict RBAC).
2. **Audit Against OWASP Top 10**:
   - Verify input validation (Zod schemas), parameterized SQL, secure HTTP headers (Helmet: HSTS, CSP, X-Frame-Options), CORS restrictions, and secure cookie flags (`HttpOnly`, `Secure`, `SameSite=Strict`).
3. **Enforce DPDP Act Compliance**:
   - Explicit user consent tracking for data collection.
   - Purpose limitation: data only used for flatmate discovery.
   - Right to erasure: automated data anonymization and account deletion pipelines.
4. **Automate Dependency Security Scanning**:
   - Configure `npm audit` and vulnerability scanners in CI pipelines.
5. **Issue Formal Security Sign-Off**:
   - Document findings and resolutions in `docs/testing/security-signoff.md`.

## Expected Outputs
- `docs/architecture/threat-model.md`
- `docs/testing/security-signoff.md`
- Dependency audit logs and security lint configs.

## Quality Checklist
- [ ] No high or critical severity CVEs in project dependencies.
- [ ] No unmasked PII returned in public or discovery API payloads.
- [ ] Strict rate limits configured on authentication and discovery endpoints.

## Relevant References
- [system-architecture](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/system-architecture/SKILL.md)
- [backend-engineering](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/backend-engineering/SKILL.md)
- [cicd-deployment](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/cicd-deployment/SKILL.md)


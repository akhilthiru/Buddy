# Security Review Template

**Document Title**: [Security Audit / Sign-off Dossier]  
**Author**: Security Reviewer  
**Reviewers**: Solution Architect, DevOps Engineer, Chief Orchestrator  
**Status**: [Draft | In Review | Approved | Rejected]  
**Scope**: [Feature / Release / Infrastructure]

---

## 1. Executive Summary & Assessment
Overall security posture: [Low Risk | Medium Risk | High Risk | Blocked]

## 2. Threat Modeling Findings (STRIDE)
| Threat Category | Asset / Endpoint | Threat Description | Severity | Mitigation Implemented | Validation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Spoofing | Auth Service | Token forgery | High | JWT signature with secret rotation | Passed |
| Tampering | Match Engine | Client altered score | High | Server-side calculation only | Passed |
| Information Disclosure | Feed API | Exposing raw phone numbers | Critical | Masked serializer | Passed |

## 3. OWASP Top 10 Audit Checklist
- [ ] A01: Broken Access Control (RBAC verified on all routes)
- [ ] A02: Cryptographic Failures (Passwords hashed with Argon2, HTTPS enforced)
- [ ] A03: Injection (SQL parameterized, XSS sanitized)
- [ ] A04: Insecure Design (Threat model completed)
- [ ] A05: Security Misconfiguration (Helmet active, secure cookies)
- [ ] A06: Vulnerable Dependencies (`npm audit` clean, 0 High/Critical CVEs)
- [ ] A07: Auth Failures (Rate limiting on login, lockout after 5 attempts)
- [ ] A08: Software & Data Integrity (CI checks, lockfile integrity)
- [ ] A09: Logging & Monitoring (Security events logged, no PII in logs)
- [ ] A10: Server-Side Request Forgery (No unvalidated outbound HTTP calls)

## 4. Statutory & Privacy Compliance (DPDP Act)
- [ ] Explicit consent banner and audit trail.
- [ ] Location coordinate coarsening to neighborhood level.
- [ ] Data erasure pipeline tested.

## 5. Security Verdict & Formal Sign-Off
- [ ] Approved for Production Release
- [ ] Conditional Approval (Non-blocking findings to remediate by [Date])
- [ ] Blocked (Critical vulnerabilities require immediate remediation)

---
trigger: always_on
---

# Rule 05: Security, Trust, and Data Protection

### 1. Data Privacy & Compliance
- Compliance with India's Digital Personal Data Protection (DPDP) Act.
- User personal data (phone numbers, exact home addresses, government IDs) must be encrypted at rest and masked in transit.
- User location coordinates must be fuzzed or coarsened (e.g. neighborhood/suburb level, such as Kazhakkoottam, Kariavattom, Kowdiar) until mutual matching and user consent are granted.

### 2. Authentication & Authorization
- Use industry-standard token-based authentication (JWT with httpOnly secure cookies and short expiry, paired with refresh tokens).
- Role-Based Access Control (RBAC) enforced on every API route and domain service.
- Defense-in-depth: Never trust client-supplied user IDs or role claims; always derive identity from the verified session/token.

### 3. Trust & Safety Features
- Roommate gender preferences and accommodation arrangements must be strictly respected in query filtering.
- In-app reporting and blocking mechanisms must be built into profile discovery and messaging.
- Strict input validation and sanitization (Zod/Pydantic) to prevent XSS, SQL injection, and parameter tampering.

### 4. AI Guardrails & LLM Security
- AI is strictly constrained to assistive roles: explaining compatibility nuances, summarizing profile bios, or generating icebreakers.
- Input prompt sanitization to prevent prompt injection.
- Structured output enforcement using strict JSON schemas.
- No PII (real names, phone numbers, exact addresses) may be passed to external LLM providers without explicit hashing/anonymization.

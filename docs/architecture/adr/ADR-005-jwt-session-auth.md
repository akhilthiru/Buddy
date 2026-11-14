# ADR-005: JWT Access Tokens with httpOnly Refresh Token Rotation

- **Status**: Accepted
- **Author**: Solution Architect
- **Reviewers**: Chief Orchestrator, Security Reviewer, Backend Engineer
- **Date**: 2026-11-14
- **Tags**: security, auth, jwt, sessions

---

## 1. Context and Problem Statement
Flatmate requires a secure, high-performance authentication and session management mechanism.
The system serves mobile and desktop web clients through a Next.js App Router frontend and Node.js REST API with WebSocket connections for real-time messaging.
Storing tokens insecurely (such as JWTs in browser `localStorage`) creates severe vulnerabilities to Cross-Site Scripting (XSS) exfiltration and violates India's DPDP data protection obligations. Conversely, purely stateful server-side sessions query Redis/DB on every single static render and API micro-call, creating bottlenecks under high concurrency.
We must select an authentication architecture that balances ironclad security with scalable performance.

## 2. Decision Drivers
- **Defense Against XSS**: Zero token exposure to JavaScript execution context (`localStorage` / `sessionStorage` strictly forbidden).
- **Defense Against CSRF**: SameSite strict cookie policies combined with short-lived tokens and anti-CSRF protections on mutating verbs.
- **Revocation & Reuse Detection**: Ability to instantly revoke sessions upon suspicious activity, password/phone reset, or user quarantine.
- **WebSocket Handshake Auth**: Seamless token validation during WebSocket upgrade connections.
- **Performance**: Stateless access verification for low-latency API routes (p95 $< 150$ ms) without querying the database for every single read operation.

## 3. Considered Options
- **Option 1: Short-Lived JWT Access Tokens with httpOnly Secure Refresh Token Rotation** (PostgreSQL/Redis backed).
- **Option 2: Purely Stateful Server Sessions** stored in Redis with opaque session IDs in cookies.
- **Option 3: Long-Lived JWTs stored in client `localStorage`** (Common SPA pattern).

## 4. Decision Outcome
Chosen option: **Option 1: Short-Lived JWT Access Tokens with httpOnly Secure Refresh Token Rotation**.

The system issues a short-lived JSON Web Token (JWT) with a 15-minute expiration time, signed using asymmetric RS256 or secure HMAC SHA-256. For mobile web browsers, this access token is paired with a long-lived (14-day) opaque refresh token stored in an `httpOnly`, `Secure`, `SameSite=Strict` cookie.
Refresh tokens are tracked in the PostgreSQL `refresh_tokens` table in token families (`family_id`). If an already-used or revoked refresh token is submitted, the system flags a token reuse incident, immediately invalidates the entire token family, and blocks access until re-authenticated.

### Positive Consequences
- **XSS Immunity**: JavaScript running on the page cannot access or exfiltrate the `refresh_token` cookie.
- **Immediate Revocation on Threat**: When a user is quarantined or logs out, their refresh token family is marked revoked in the database.
- **High API Throughput**: The vast majority of API calls authenticate statelessly by verifying the cryptographic signature of the 15-minute access token, saving thousands of Redis/DB roundtrips.
- **DPDP Compliance**: Satisfies mandatory security benchmarks under NFR-SEC-01.

### Negative Consequences / Trade-offs
- Requires client-side silent refresh interceptors to seamlessly renew access tokens before the 15-minute expiration.
- WebSocket reconnections need access token re-validation upon reconnect.

## 5. Pros and Cons of Considered Options

### Option 1: JWT + httpOnly Refresh Token Rotation (Chosen)
- Good: XSS-safe storage; tokens cannot be stolen via injected script tags.
- Good: High scalability due to stateless access token validation.
- Good: Cryptographic family-based token rotation detects and neutralizes token theft immediately.
- Bad: Requires coordinating token refresh on the client (handled via Axios / Fetch response interceptors).

### Option 2: Purely Stateful Redis Sessions
- Good: Instant revocation on every single request.
- Bad: Every single API request (thousands per second during feed browsing) requires a Redis network hop.
- Bad: Outages or high memory pressure on the Redis cluster immediately take down entire platform authentication.

### Option 3: Long-Lived JWT in localStorage
- Good: Trivial implementation on frontend.
- Bad: Severely insecure. Any third-party dependency compromise or XSS vulnerability allows complete account takeover.
- Bad: Non-compliant with Flatmate Security Governance Rule 05.

## 6. Implementation Notes & Follow-ups
- Backend implementation:
  - Access Token Payload: `{ sub: userId, role: 'USER', status: 'ACTIVE', exp: epoch + 900 }`.
  - Cookie Settings: `HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth; Max-Age=1209600`.
- Security Reviewer sign-off required prior to merging authentication middleware.

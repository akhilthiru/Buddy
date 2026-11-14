# Flatmate – Backend Developer Guide & Operations Runbook

**Document Version**: 1.0.0  
**Phase**: Workflow D (Development)  
**Author**: Backend Engineer  
**Reviewers**: Solution Architect, Security Reviewer, Chief Orchestrator  
**Status**: Complete (Ready for Level 2 Review)  
**Date**: 2026-11-14  

---

## 1. Overview & Core Architectural Invariants

Flatmate's backend is engineered as a high-throughput, clean **Modular Monolith** using **Node.js 22**, **TypeScript**, **PostgreSQL 16**, and **RESTful APIs** strictly complying with OpenAPI 3.1 specification (`docs/architecture/api-spec.yaml`).

### 1.1 Non-Negotiable Invariants
1. **Mathematical Determinism (ADR-006 / FR-14)**: Roommate compatibility scoring is 100% deterministic, transparent, and auditable. External machine learning or LLMs have zero scoring authority.
2. **Contract-First Adherence (ADR-004)**: All routes, payloads, headers, query parameters, and error responses strictly conform to `docs/architecture/api-spec.yaml`.
3. **RFC 7807 Uniform Error Responses**: All client errors and server exceptions are formatted as Problem Details (`application/problem+json`).
4. **Data Protection & India DPDP Act 2023 Compliance (TH-I-01)**:
   - Mobile phone numbers are encrypted at rest with AES-256-GCM (`phone_encrypted`) and indexed by deterministic SHA-256 HMAC (`phone_hash`). Raw phone numbers are never exposed in API payloads.
   - User geolocation is coarsened to standardized Trivandrum micro-market centroids (`trivandrum_suburbs`).
   - In-app chat messages are scanned in real-time by regular expressions to intercept and warn against premature contact harvesting.
5. **Token Family Session Security (ADR-005)**:
   - Short-lived 15-minute JWT access tokens.
   - 14-day opaque refresh tokens in `httpOnly`, `Secure`, `SameSite=Strict` cookies (`refresh_token` and `__Host-refresh_token`).
   - Token reuse detection: Any replay of an already-rotated refresh token immediately revokes the entire token family.

---

## 2. Backend Directory Layout & Clean Architecture

```text
Flatmate/
├── migrations/
│   ├── 001_initial_schema.up.sql       # PostgreSQL 16 3NF schema, enums, triggers, centroids
│   └── 001_initial_schema.down.sql     # Deterministic, clean reversal script
├── src/
│   ├── app.ts                          # HTTP dispatcher, routing, RFC 7807 error handler
│   ├── server.ts                       # HTTP server bootstrap & WebSocket gateway upgrade
│   ├── config/
│   │   └── env.ts                      # Environment variables & typed defaults
│   ├── database/
│   │   ├── in-memory-db.ts             # ACID in-memory domain datastore matching PostgreSQL schema
│   │   ├── migrator.ts                 # CLI & programmatic PostgreSQL migration runner
│   │   └── pool.ts                     # PostgreSQL client pool configuration
│   ├── common/
│   │   ├── errors/
│   │   │   └── problem-details.ts      # RFC 7807 problem details hierarchy (400, 401, 403, 404, 423, 429, 500)
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts      # JWT validation & RBAC / active user guards
│   │   │   └── error.middleware.ts     # Express/HTTP central error handler
│   │   └── utils/
│   │       ├── crypto.ts               # AES-256-GCM encryption, HMAC hashing, Argon2/scrypt
│   │       └── jwt.ts                  # HS256 JWT sign & verify with constant-time equality
│   └── modules/
│       ├── auth/                       # OTP dispatch, verification, refresh rotation, institutional verification
│       │   ├── auth.service.ts
│       │   └── auth.types.ts
│       ├── users/                      # User profile CRUD, photos, modality selection, age validation
│       │   ├── users.service.ts
│       │   └── users.types.ts
│       ├── preferences/                # 7-vector lifestyle questionnaire management
│       │   ├── preferences.service.ts
│       │   └── preferences.types.ts
│       ├── matching/                   # Deterministic 7-vector scoring engine (ADR-006)
│       │   ├── constants/
│       │   │   └── affinity-matrix.ts  # Vector weights, lookup matrices, modality matrix
│       │   ├── scoring.engine.ts       # Mathematical scoring formula & dealbreaker pre-filters
│       │   └── matching.types.ts       # Lifestyle and scoring domain interfaces
│       ├── discovery/                  # Feed ranking, swipe processing (LIKE, PASS, SUPERLIKE), rewind
│       │   ├── discovery.service.ts
│       │   └── discovery.types.ts
│       ├── messaging/                  # Mutual match 1-on-1 chat, contact harvesting scanner, WebSockets
│       │   ├── content.filter.ts       # DPDP contact harvesting regex filter
│       │   ├── messaging.service.ts
│       │   ├── messaging.types.ts
│       │   └── websocket.gateway.ts    # Real-time WebSocket connection manager
│       ├── listings/                   # Optional room listings CRUD for Modalities 1 & 3
│       │   ├── listings.service.ts
│       │   └── listings.types.ts
│       └── safety/                     # Bidirectional user blocking, abuse reporting, auto-quarantine
│           ├── safety.service.ts
│           └── safety.types.ts
├── tests/
│   ├── scoring.test.ts                 # Exhaustive unit tests for 7-vector scoring, dealbreakers, sub-5ms batch
│   ├── auth.test.ts                    # OTP validation, JWT issuance, token rotation, reuse detection
│   └── api.test.ts                     # Full OpenAPI endpoint coverage & RFC 7807 problem details verification
├── package.json
└── tsconfig.json
```

---

## 3. Database Schema & Migration Runbook

### 3.1 Migration Scripts
- **UP Migration**: `migrations/001_initial_schema.up.sql`
  - Defines 16 custom PostgreSQL domain enums.
  - Generates 17 tables in strict Third Normal Form (3NF).
  - Enforces symmetrical pair deduplication: `CHECK (user1_id < user2_id)`.
  - Seeds 8 standardized Trivandrum suburban zones:
    1. `KAZHAKKOOTTAM` (Technopark Phase I & III, Greenfield Stadium)
    2. `KARIAVATTOM` (University of Kerala campus, LNCPE)
    3. `SREEKARYAM` (College of Engineering Trivandrum [CET])
    4. `ULLOOR` (Kesavadasapuram, Medical College)
    5. `PATTOM` (Kendriya Vidyalaya, Administrative corridor)
    6. `KOWDIAR` (Kowdiar Palace, Golf Club, premium residential)
    7. `MANACAUD` (South Trivandrum, Attukal, Chalai heritage)
    8. `VELLAYAMBALAM` (Central transit junction)
- **DOWN Migration**: `migrations/001_initial_schema.down.sql`
  - Cleanly drops all tables, triggers, functions, and types in reverse foreign key order.

### 3.2 Executing Migrations
```bash
# Execute UP migration against live PostgreSQL
node --experimental-strip-types src/database/migrator.ts up

# Roll back migration cleanly
node --experimental-strip-types src/database/migrator.ts down
```

---

## 4. Domain Modules & Business Logic Implementation

### 4.1 Authentication & Identity (`src/modules/auth/`)
- **Phone OTP Flow (`POST /api/v1/auth/otp/send`)**:
  - Validates E.164 Indian mobile format: `^\+91[6-9]\d{9}$`.
  - Generates 6-digit numeric OTP with 5-minute time-to-live (`expires_at`).
  - Limits failed attempts to 3. The 4th attempt locks the attempt with RFC 7807 status `423 Locked`.
- **OTP Verification (`POST /api/v1/auth/otp/verify`)**:
  - Verifies OTP hash using Argon2 / scrypt.
  - Automatically provisions `users` root record if new, storing AES-256-GCM encrypted phone number and SHA-256 HMAC index hash.
  - Issues 15-minute access token (`sub: userId, role: 'USER', status: 'ACTIVE'`).
  - Sets 14-day httpOnly refresh token cookies:
    - `Set-Cookie: refresh_token=...; Path=/; HttpOnly; SameSite=Strict; Max-Age=1209600`
    - `Set-Cookie: __Host-refresh_token=...; Path=/; HttpOnly; SameSite=Strict; Max-Age=1209600`
- **Refresh Token Rotation (`POST /api/v1/auth/refresh`)**:
  - Implements cryptographic token families (`family_id`).
  - Upon token refresh, the old token is marked `is_revoked = true` and a new token is generated within the same family.
  - **Reuse Detection**: If a revoked token is submitted, the system flags token theft, revokes every token in that `family_id`, and rejects the request with `401 Unauthorized`.
- **Institutional Verification (`POST /api/v1/auth/institution/verify-*`)**:
  - Verifies recognized academic domains (`cet.ac.in`, `keralauniversity.ac.in`) or Technopark corporate domains (`ust.com`, `infosys.com`, `tcs.com`, `allianz.com`).
  - Upon token confirmation, upgrades profile `verification_badge` to `VERIFIED_STUDENT` or `VERIFIED_PROFESSIONAL`.

### 4.2 Deterministic 7-Vector Compatibility Scoring (`src/modules/matching/`)
Implements the accepted mathematical formula from ADR-006:
$$\text{Total Score} = \sum_{k=1}^{7} \left( W_k \times S_k \right) \times 100$$

| Vector ID | Life Domain | Weight ($W_k$) | Primary Inputs | Alignment Thresholds |
| :--- | :--- | :--- | :--- | :--- |
| **Vector 1** | Sleep Schedule | **0.20** | `sleep_pattern`, `shift_schedule`, `noise_sensitivity` | $\ge 0.85$ High, $< 0.50$ Discussion |
| **Vector 2** | Cleanliness & Hygiene | **0.20** | `cleanliness_level`, `kitchen_sink_rule`, `maid_preference` | $\ge 0.85$ High, $< 0.50$ Discussion |
| **Vector 3** | Dietary & Kitchen | **0.15** | `diet_type`, `kitchen_policy` | $\ge 0.85$ High, $< 0.50$ Discussion |
| **Vector 4** | Social & Guests | **0.15** | `guest_frequency`, `overnight_guest_policy`, `party_preference` | $\ge 0.85$ High, $< 0.50$ Discussion |
| **Vector 5** | Substance Tolerance | **0.15** | `smoking_habit`, `alcohol_habit` | $\ge 0.85$ High, $< 0.50$ Discussion |
| **Vector 6** | Financial Discipline | **0.10** | `rent_payment_habit`, `ac_bill_split`, `grocery_tracking` | $\ge 0.85$ High, $< 0.50$ Discussion |
| **Vector 7** | Work Rhythm | **0.05** | `work_mode`, `call_frequency`, `workspace_preference` | $\ge 0.85$ High, $< 0.50$ Discussion |

#### Hard Dealbreaker Pre-Filters:
1. **Gender Match**: Binary elimination if candidate gender does not match user's `preferred_gender` or vice versa.
2. **Modality Compatibility Matrix (PRD Rule 4)**:
   - Modality 1 (Has room): Pairs with Modality 2 (Seeking room) and Modality 3 (Relocating).
   - Modality 2 (Seeking room): Pairs strictly with Modality 1 (Has room).
   - Modality 3 (Relocating): Pairs with Modality 1, 3, and 4.
   - Modality 4 (Team up first): Pairs with Modality 3 and 4.
3. **Lifestyle Non-Negotiables**:
   - Strict non-smoker dealbreaker: 100% exclusion of smokers and balcony smokers.
   - Veg-only kitchen dealbreaker: 100% exclusion of non-vegetarian cooking.
   - Sleep dealbreaker: 100% exclusion of opposing Early Bird vs Night Owl.

### 4.3 Discovery Deck & Swiping (`src/modules/discovery/`)
- `GET /api/v1/discovery/feed`: Excludes swiped and blocked profiles, evaluates hard dealbreakers, deterministically ranks candidates by score, and formats top 3 lifestyle highlight tags.
- `POST /api/v1/discovery/swipe`: Enforces a 60/min rate limit. Upon mutual like/superlike, atomically creates a match in `matches` table and initializes a 1-on-1 private room in `conversations`.
- `POST /api/v1/discovery/rewind`: Reverses the immediately preceding swipe action (strictly 1 rewind per session; prohibited if already mutually matched).

### 4.4 In-App Messaging & Contact Harvesting Interception (`src/modules/messaging/`)
- Mutual match authorization: Chat is strictly blocked unless an active record exists in `conversations`.
- **Contact Harvesting Regex Filter (FR-23)**:
  - Scans for 10-digit Indian phone numbers (`+91[6-9]...`), email addresses, and UPI/banking handles (`...@(oksbi|paytm|upi)`).
  - Automatically appends a prominent safety notice to the message payload: *"For your security, keep conversations within Flatmate until you meet in person."*
- **Real-Time Delivery**: Messages are pushed instantly over WebSocket to connected recipients (`wsGateway.sendToUser()`), marking status as `DELIVERED`. Messages to offline users are stored as `SENT` and delivered on next login.

### 4.5 Trust & Safety Moderation (`src/modules/safety/`)
- `POST /api/v1/safety/blocks`: Bidirectional block exclusion. Immediately sets any shared active conversation to `TERMINATED`.
- `POST /api/v1/safety/reports`:
  - Categories: `HARASSMENT_OR_ABUSE`, `SPAM_OR_COMMERCIAL_BROKER`, `FAKE_PROFILE_IMPERSONATION`, `MORAL_POLICING_OR_DISCRIMINATION`.
  - **Auto-Quarantine Trigger (FR-28)**: If a target receives $\ge 2$ reports within 24 hours OR $\ge 3$ total reports, their status is immediately updated to `QUARANTINED`, and their account is barred from discovery feeds and messaging until administrative review.

---

## 5. Automated Test Suites & Verification Evidence

All 30 automated tests execute in under 2 seconds:

```bash
# Run all backend test suites
npm test

# Run individual test suites
npm run test:scoring   # Exhaustive 7-vector scoring & dealbreaker tests (8 tests)
npm run test:auth      # Phone OTP, JWT, token rotation, reuse detection (10 tests)
npm run test:api       # REST endpoints, mutual matching, safety, RFC 7807 (12 tests)
```

### Verified Test Execution Output:
```text
▶ RESTful OpenAPI Endpoints & RFC 7807 Compliance
  ✔ POST /api/v1/auth/otp/send returns 200 with valid payload (66.04ms)
  ✔ POST /api/v1/auth/otp/verify returns 200 and sets httpOnly refresh_token cookies (115.49ms)
  ✔ POST /api/v1/auth/refresh rotates session with refresh_token cookie (111.70ms)
  ✔ POST /api/v1/auth/logout invalidates session (107.77ms)
  ✔ PUT & GET /api/v1/profiles/me creates and retrieves profile with masked PII (107.58ms)
  ✔ POST & DELETE /api/v1/profiles/me/photos manages photos (111.60ms)
  ✔ executes full flow: feed discovery -> swipe LIKE -> mutual match -> conversation unlock (221.96ms)
  ✔ rewinds preceding swipe action (max 1 allowed per session) (216.36ms)
  ✔ blocks user bidirectionally and terminates active conversation (214.06ms)
  ✔ triggers automatic account quarantine upon 2 reports within 24 hours (FR-28) (318.87ms)
  ✔ returns RFC 7807 compliant JSON for 404 Not Found (0.50ms)
  ✔ returns RFC 7807 compliant JSON for 401 Unauthorized (0.37ms)

▶ Auth & Identity Module (ADR-005, FR-01, FR-02, FR-03)
  ✔ sends 6-digit OTP to valid Indian mobile number (+919876543210) (84.31ms)
  ✔ rejects invalid phone number formats (1.44ms)
  ✔ successfully verifies OTP, creates user and issues JWT + refresh token (138.78ms)
  ✔ rejects incorrect OTP with 401 Unauthorized (114.78ms)
  ✔ locks account after 3 failed OTP attempts with 423 Locked (275.16ms)
  ✔ rotates refresh token and issues new access token (123.91ms)
  ✔ detects token reuse and terminates entire token family (113.28ms)
  ✔ dispatches verification link to recognized academic email (@cet.ac.in) (123.43ms)
  ✔ rejects unrecognized academic domain (122.35ms)
  ✔ dispatches verification link to recognized Technopark corporate email (@ust.com) (128.13ms)

▶ Deterministic 7-Vector Compatibility Scoring Engine (ADR-006 & FR-14)
  ✔ US-09 Scenario 1: Identical profiles achieve 100% score with high harmony (1.62ms)
  ✔ US-09 Scenario 2: Divergent Sleep Habits (Early Bird vs Night Owl) evaluates to 0.25 and reflects 15% drop (0.26ms)
  ✔ US-09 Scenario 3: Performance benchmark - Batch evaluation of 50 candidates completes in < 50ms (3.37ms)
  ✔ Scenario 1: Gender preference mismatch filters candidate (0.36ms)
  ✔ Scenario 2: Smoking dealbreaker strictly filters smoker (0.21ms)
  ✔ Scenario 3: Dietary dealbreaker filters non-veg cooking when veg-only kitchen required (0.21ms)
  ✔ Scenario 4: Modality Compatibility Matrix (PRD Rule 4) (0.32ms)
  ✔ Scenario 5: Sleep dealbreaker filters opposing chronotypes when dealbreaker is toggled (0.21ms)

ℹ tests 30 | suites 12 | pass 30 | fail 0 | duration_ms 1843ms
```

---

## 6. Environment Configuration Reference

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | `enum` | `development` | Operating environment (`development`, `production`, `test`) |
| `PORT` | `number` | `4000` | HTTP and WebSocket server port |
| `DATABASE_URL` | `string` | `postgresql://...` | PostgreSQL connection pool URL |
| `JWT_SECRET` | `string` | *(default)* | Cryptographic key for signing HS256 JWT access tokens |
| `JWT_ACCESS_EXPIRY_SECONDS` | `number` | `900` | Access token lifespan (15 minutes) |
| `JWT_REFRESH_EXPIRY_SECONDS` | `number` | `1209600` | Refresh token lifespan (14 days) |
| `ENCRYPTION_KEY` | `hex(64)` | *(default)* | 32-byte hexadecimal key for AES-256-GCM at-rest encryption |
| `HMAC_SALT` | `string` | *(default)* | Salt for deterministic SHA-256 HMAC phone and email indexing |
| `CORS_ORIGIN` | `string` | `http://localhost:3000` | Frontend web origin permitted in CORS headers |

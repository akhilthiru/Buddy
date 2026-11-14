# Flatmate – Local Manual Testing & Verification Guide

This guide provides step-by-step instructions for testing **Project Flatmate** locally. It covers all 11 essential product features, 4 discovery modalities, deterministic compatibility scoring, trust & safety filters, and the assistive AI engine.

---

## 1. Quick Start & Execution Options

Flatmate provides three ways to test all features in your local environment:

| Testing Method | Best For | How to Launch |
| :--- | :--- | :--- |
| **Method A: Interactive Web Test Console** | Visual, point-and-click browser testing | Run `npm run dev` and open [http://localhost:4000/](http://localhost:4000/) |
| **Method B: Automated CLI Walkthrough** | Instant end-to-end terminal verification | Run `npm run test:manual` |
| **Method C: Step-by-Step cURL Commands** | API inspection, Postman, custom payloads | Follow Section 4 cURL recipes below |

---

## 2. Launching the Local Server

In your terminal, start the server:

```bash
npm run dev
```

You will see:
```text
✔ Flatmate Development Seed Data loaded (4 profiles across Modalities 1-4, 1 room listing).
Flatmate Modular Monolith API listening on port 4000 [development]
Interactive Web Testing Console: http://localhost:4000/
Real-Time WebSocket Gateway ready on ws://localhost:4000/ws
```

Open **[http://localhost:4000/](http://localhost:4000/)** in Google Chrome or your favorite browser to access the **Flatmate Local Interactive Testing Console**.

---

## 3. Pre-Seeded Test Personas Cheat Sheet

The local development environment automatically seeds 4 realistic personas situated in the **Thiruvananthapuram (Trivandrum)** ecosystem:

| Persona | Role / Workplace | Suburb | Modality | Rent / Budget | Highlights | Phone / OTP |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Adarsh Nair** (`usr_adarsh_001`) | Backend Engineer @ TCS Technopark Phase I | Kazhakkoottam | **Modality 1: Has Room** | ₹7,500/mo (Private 2BHK room) | Non-smoker, Early bird, Verified Professional | `+919876543211` / `123456` |
| **Sneha Menon** (`usr_sneha_002`) | M.Tech AI Student @ CET Trivandrum | Sreekaryam / Kariavattom | **Modality 2: Needs Room** | ₹5,000–₹7,500/mo | Strict Vegetarian kitchen, Quiet study, Verified Student | `+919876543212` / `123456` |
| **Rahul Pillai** (`usr_rahul_003`) | Financial Analyst @ UST Global | Kowdiar $\rightarrow$ Kazhakkoottam | **Modality 3: Relocating** | ₹8,000–₹12,000/mo | Commute reduction, Weekend football, Non-smoker | `+919876543213` / `123456` |
| **Anjali Krishna** (`usr_anjali_004`) | HR Specialist @ Allianz Technopark Phase III | Kazhakkoottam / Kariavattom | **Modality 4: Team-up First** | ₹8,000–₹11,000/mo | Wants flatmate first to apartment-hunt together | `+919876543214` / `123456` |

> [!TIP]
> In the Web Testing Console ([http://localhost:4000/](http://localhost:4000/)), you can switch between any of these personas with a single click in the left sidebar to inspect the application from their exact perspective.

---

## 4. Comprehensive Feature-by-Feature Manual Testing Guidance

---

### Feature 1: Authentication & Phone OTP Handshake (FR-01, FR-02)

**Goal**: Verify mobile-first phone OTP registration and JWT session generation.

1. **Step 1: Request OTP**
   - **Endpoint**: `POST /api/v1/auth/otp/send`
   - **Payload**:
     ```bash
     curl -s -X POST http://localhost:4000/api/v1/auth/otp/send \
       -H "Content-Type: application/json" \
       -d '{"phoneNumber": "+919876543210"}'
     ```
   - **Expected Status**: `HTTP 200 OK`
   - **Response**: `{"success": true, "message": "OTP sent successfully"}`

2. **Step 2: Submit OTP & Receive Tokens**
   - **Endpoint**: `POST /api/v1/auth/otp/verify`
   - **Payload** (universal local dev OTP is `123456`):
     ```bash
     curl -s -X POST http://localhost:4000/api/v1/auth/otp/verify \
       -H "Content-Type: application/json" \
       -d '{"phoneNumber": "+919876543210", "otp": "123456"}'
     ```
   - **Expected Status**: `HTTP 200 OK`
   - **Response Verification**:
     - `accessToken`: 15-minute stateless JWT.
     - `user.id`: UUID of the authenticated user.
     - `Set-Cookie` header: Contains `refresh_token` and `__Host-refresh_token` with `HttpOnly; Secure; SameSite=Strict`.

3. **Negative Test (Rate Limiting & Lockout)**:
   - Entering 3 consecutive incorrect OTPs (e.g. `999999`) returns `HTTP 423 Locked` (FR-01, TH-S-01).

---

### Feature 2: Institutional Email Verification (FR-03, FR-04)

**Goal**: Verify academic (`.ac.in`) and corporate (Technopark companies) trust badges.

1. **Step 1: Request Verification Token**
   - **Endpoint**: `POST /api/v1/auth/institution/verify-request`
   - **cURL**:
     ```bash
     curl -s -X POST http://localhost:4000/api/v1/auth/institution/verify-request \
       -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{
         "institutionType": "CORPORATE",
         "institutionName": "Infosys Technopark",
         "email": "kiran.kumar@infosys.com"
       }'
     ```
   - **Expected Status**: `HTTP 202 Accepted`
   - **Response**: Returns masked email notice and dev `previewToken`.

2. **Step 2: Confirm Verification Token**
   - **Endpoint**: `POST /api/v1/auth/institution/verify-confirm`
   - **cURL**:
     ```bash
     curl -s -X POST http://localhost:4000/api/v1/auth/institution/verify-confirm \
       -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"token": "<PREVIEW_TOKEN_FROM_STEP_1>"}'
     ```
   - **Expected Status**: `HTTP 200 OK`
   - **Verification**: Badge is granted (`VERIFIED_PROFESSIONAL` or `VERIFIED_STUDENT`).

---

### Feature 3: User Profile & Discovery Modality Selection (FR-06, FR-07, FR-08)

**Goal**: Test creating and updating profile data across the 4 discovery modalities.

1. **Update Profile**:
   - **Endpoint**: `PUT /api/v1/profiles/me`
   - **Payload**:
     ```bash
     curl -s -X PUT http://localhost:4000/api/v1/profiles/me \
       -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{
         "displayName": "Kiran Kumar",
         "gender": "MALE",
         "birthDate": "1998-05-15",
         "occupation": "Cloud Architect @ IBS Software",
         "bio": "Techie seeking clean, calm flatmate near Technopark Phase I. Football on weekends.",
         "modality": "MODALITY_4",
         "preferredGender": "MALE",
         "minBudget": 6000,
         "maxBudget": 9500,
         "moveInFlexibility": "WITHIN_15_DAYS",
         "preferredSuburbs": ["KAZHAKKOOTTAM", "KARIAVATTOM"]
       }'
     ```
   - **Expected Status**: `HTTP 200 OK`

2. **Verify Modality Semantics**:
   - `MODALITY_1`: Offering room in existing flat.
   - `MODALITY_2`: Seeking room in existing flat.
   - `MODALITY_3`: In accommodation, desires relocation with flatmate.
   - `MODALITY_4`: Person-first search: find compatible flatmate first to apartment-hunt together.

---

### Feature 4: 7-Vector Lifestyle Preferences Configuration (FR-09 to FR-15)

**Goal**: Configure lifestyle vectors and hard dealbreakers.

1. **Update 7-Vector Settings**:
   - **Endpoint**: `PUT /api/v1/lifestyle/me`
   - **Payload**:
     ```bash
     curl -s -X PUT http://localhost:4000/api/v1/lifestyle/me \
       -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{
         "sleep": {
           "sleepPattern": "EARLY_BIRD",
           "shiftSchedule": "NORMAL_DAY",
           "noiseSensitivity": "LIGHT_SLEEPER",
           "isDealbreaker": true
         },
         "cleanliness": {
           "cleanlinessLevel": "METICULOUS",
           "kitchenSinkRule": "IMMEDIATE_WASH",
           "maidPreference": "OPEN_TO_MAID",
           "isDealbreaker": true
         },
         "dietary": {
           "dietType": "NON_VEGETARIAN",
           "kitchenPolicy": "NO_RESTRICTIONS",
           "isDealbreaker": false
         },
         "social": {
           "guestFrequency": "OCCASIONAL_FRIENDS",
           "overnightGuestPolicy": "SAME_GENDER_ONLY",
           "partyPreference": "OCCASIONAL_WEEKENDS",
           "isDealbreaker": false
         },
         "substances": {
           "smokingHabit": "NON_SMOKER_STRICT",
           "alcoholHabit": "TEETOTALER",
           "isDealbreaker": true
         },
         "financial": {
           "rentPaymentHabit": "STRICT_1ST_OF_MONTH",
           "acBillSplit": "EQUAL_SPLIT",
           "groceryTracking": "SPLITWISE_APP",
           "isDealbreaker": true
         },
         "work": {
           "workMode": "HYBRID",
           "callFrequency: "LOW",
           "workspacePreference": "PRIVATE_ROOM_DESK",
           "isDealbreaker": false
         }
       }'
     ```
   - **Expected Status**: `HTTP 200 OK`

---

### Feature 5: Discovery Candidate Feed & Deterministic Compatibility (FR-16, FR-17)

**Goal**: Retrieve compatibility-ranked candidate cards with dealbreaker enforcement.

1. **Fetch Feed**:
   - **Endpoint**: `GET /api/v1/discovery/feed?limit=10`
   - **cURL**:
     ```bash
     curl -s -X GET "http://localhost:4000/api/v1/discovery/feed?limit=10" \
       -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
     ```
   - **Expected Status**: `HTTP 200 OK`
   - **Verification**:
     - Candidates are ranked by compatibility score ($0-100\%$).
     - The deterministic weights are: Sleep ($20\%$), Cleanliness ($20\%$), Diet ($15\%$), Social ($15\%$), Substances ($15\%$), Budget ($10\%$), Work ($5\%$).
     - Hard dealbreakers (e.g. smoking mismatch or non-veg in veg kitchen) cause candidates to be excluded completely.
     - Modality rules are enforced: Users in Modality 4 (Team-up first) will see Modality 3 and Modality 4 candidates, while Modality 1 (Has room) pairs with Modalities 2 and 3.

---

### Feature 6: Interactive Swiping & Single-Swipe Rewind (FR-18, FR-20)

**Goal**: Test swipe actions (`LIKE`, `PASS`, `SUPERLIKE`) and rewind abuse prevention.

1. **Swipe Action**:
   - **Endpoint**: `POST /api/v1/discovery/swipe`
   - **Payload**:
     ```bash
     curl -s -X POST http://localhost:4000/api/v1/discovery/swipe \
       -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"candidateUserId": "usr_rahul_003", "action": "LIKE"}'
     ```
   - **Expected Status**: `HTTP 200 OK`
   - **Response**: `{"isMutualMatch": false, "action": "LIKE"}` (or `isMutualMatch: true` if candidate already swiped LIKE).

2. **Rewind Action**:
   - **Endpoint**: `POST /api/v1/discovery/rewind`
   - **cURL**:
     ```bash
     curl -s -X POST http://localhost:4000/api/v1/discovery/rewind \
       -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
     ```
   - **Expected Status**: `HTTP 200 OK`
   - **Negative Test (Rewind Limit)**: Executing a second consecutive rewind immediately returns `HTTP 400 Bad Request` with ProblemDetails `type: "https://flatmate.in/errors/400"`, `title: "Rewind Limit Reached"`.

---

### Feature 7: Double Opt-In Mutual Matching (FR-19)

**Goal**: Verify that mutual likes trigger an instant match record and conversation channel.

1. **Scenario**:
   - User A swipes LIKE on User B.
   - User B swipes LIKE on User A.
2. **Result**:
   - `isMutualMatch: true` is returned.
   - A `matchId` and `conversationId` are issued.
   - The match appears in `GET /api/v1/matches`.

---

### Feature 8: Real-Time Chat & Contact Harvesting Filter (FR-21 to FR-24)

**Goal**: Verify secure double opt-in messaging and real-time PII interception.

1. **Send Safe Message**:
   - **Endpoint**: `POST /api/v1/conversations/<CONVERSATION_ID>/messages`
   - **Payload**:
     ```bash
     curl -s -X POST http://localhost:4000/api/v1/conversations/<CONVERSATION_ID>/messages \
       -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"content": "Hey! Loved your profile, are you free to chat about flats near Kazhakkoottam?"}'
     ```
   - **Expected Status**: `HTTP 201 Created`

2. **Send Toxic Contact Harvesting Message (Phone + UPI)**:
   - **Payload**:
     ```bash
     curl -s -X POST http://localhost:4000/api/v1/conversations/<CONVERSATION_ID>/messages \
       -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"content": "Reach me directly at +91 9876543210 or transfer advance via upi: myhandle@okaxis"}'
     ```
   - **Expected Status**: `HTTP 201 Created`
   - **ContentFilter Verification**:
     - The message is stored with a security warning notice: *"For your security, keep conversations within Flatmate until you meet in person."*
     - Phone numbers and financial handles are flagged to protect users from off-platform scams.

3. **WebSocket Real-Time Gateway**:
   - Test connecting with `wscat` or any WebSocket tool:
     ```bash
     wscat -c "ws://localhost:4000/ws?token=<YOUR_ACCESS_TOKEN>"
     ```
   - Incoming messages are delivered instantly via WebSocket events.

---

### Feature 9: Accommodation Listing Management (FR-25, FR-26)

**Goal**: Inspect existing room listings or create new listings for Modality 1 or 3 users.

1. **Inspect Adarsh's Room Listing (Kazhakkoottam)**:
   - **Endpoint**: `GET /api/v1/rooms/room_adarsh_001`
   - **cURL**:
     ```bash
     curl -s -X GET http://localhost:4000/api/v1/rooms/room_adarsh_001
     ```
   - **Expected Status**: `HTTP 200 OK`
   - **Output**: Returns monthly rent (`₹7,500`), deposit (`₹20,000`), room type (`PRIVATE_ROOM`), and amenities (`AC`, `WiFi`, `Attached Bathroom`, `Covered Parking`).

2. **Create Room Listing**:
   - **Endpoint**: `POST /api/v1/rooms/me`
   - **Restriction**: Permitted only for users in `MODALITY_1` (Offering Room) or `MODALITY_3` (Relocating). Users in Modality 2 or 4 receive `HTTP 403 Forbidden` (`TH-E-03`).

---

### Feature 10: Trust, Safety, Blocking & Automatic Quarantine (FR-27, FR-28)

**Goal**: Test abuse prevention and automatic account quarantine.

1. **Block User**:
   - **Endpoint**: `POST /api/v1/safety/blocks`
   - **cURL**:
     ```bash
     curl -s -X POST http://localhost:4000/api/v1/safety/blocks \
       -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"targetUserId": "usr_rahul_003", "reason": "Personal boundary preference"}'
     ```
   - **Expected Status**: `HTTP 201 Created`
   - **Verification**: User is hidden from discovery, and any active conversation is terminated.

2. **Report User & Auto-Quarantine Trigger**:
   - **Endpoint**: `POST /api/v1/safety/reports`
   - **Trigger Rule**: Submitting **2 reports within 24 hours** against a user automatically triggers quarantine.
   - **Report 1**:
     ```bash
     curl -s -X POST http://localhost:4000/api/v1/safety/reports \
       -H "Authorization: Bearer <TOKEN_1>" \
       -H "Content-Type: application/json" \
       -d '{"targetUserId": "usr_rahul_003", "category": "HARASSMENT", "details": "Unsolicited spam messages"}'
     ```
     - Status: `HTTP 201 Created` (`status: "PENDING_REVIEW"`)
   - **Report 2**:
     ```bash
     curl -s -X POST http://localhost:4000/api/v1/safety/reports \
       -H "Authorization: Bearer <TOKEN_2>" \
       -H "Content-Type: application/json" \
       -d '{"targetUserId": "usr_rahul_003", "category": "HARASSMENT", "details": "Second offensive behavior incident"}'
     ```
     - Status: `HTTP 201 Created` (`status: "ACTIONED_QUARANTINE"`)
   - **Immediate Quarantine Enforcement**: Target user's state becomes `QUARANTINED`, and any subsequent API call with their token immediately returns `HTTP 403 Forbidden` (`DEF-004`).

---

### Feature 11: Assistive AI Harmony Explanation & Icebreaker Generation

**Goal**: Verify Gemini Flash integration and sub-millisecond zero-PII fallback engine.

1. **Request AI Harmony Explanation**:
   - **Endpoint**: `POST /api/v1/ai/harmony-explanation`
   - **Payload**:
     ```bash
     curl -s -X POST http://localhost:4000/api/v1/ai/harmony-explanation \
       -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{"candidateUserId": "usr_adarsh_001"}'
     ```
   - **Expected Status**: `HTTP 200 OK`
   - **Response Structure (Strict Schema)**:
     ```json
     {
       "headline": "Exceptional mutual alignment (100%) across core living rhythms",
       "lifestyleHarmonies": [
         "Aligned sleep rhythms ensuring quiet resting hours.",
         "Compatible standards for shared space and kitchen cleanliness.",
         "Mutually comfortable cooking habits and kitchen arrangements."
       ],
       "potentialCompromises": "No notable lifestyle divergences identified; connect to confirm house rules.",
       "icebreakerPrompt": "Hey! Looks like we have similar sleep schedules. When do you usually wind down?"
     }
     ```
   - **Safety Verification**:
     - No raw phone numbers or email addresses are ever transmitted to the LLM.
     - Commutative vector memoization caches identical lifestyle pairings for 24 hours.

---

## 5. Troubleshooting & Frequently Asked Questions

### Q1: The server says `EADDRINUSE: address already in use :::4000`
**Solution**: Another process is occupying port 4000. Free the port:
```bash
fuser -k 4000/tcp
```
Then re-run `npm run dev`.

### Q2: How do I test with an empty database?
**Solution**: The database is stored in-memory during local execution. Simply restarting the server (`Ctrl+C` $\rightarrow$ `npm run dev`) resets the state and reloads the fresh development seed data.

### Q3: How do I verify all automated tests are still green?
**Solution**: Run the comprehensive automated test suite:
```bash
npm test
```
All 119 automated tests across 30 test suites will execute and pass in under 10 seconds.

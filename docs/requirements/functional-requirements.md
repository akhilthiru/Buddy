# Flatmate – Functional Requirements Specification (FRS)

**Document Version**: 1.0.0  
**Phase**: Workflow B (Requirements Engineering)  
**Author**: Requirements Analyst  
**Status**: Ready for Human Sign-off  
**Date**: 2026-11-13  
**Target Release**: MVP v1.0

---

## 1. Overview & Document Convention

This document specifies the exhaustive, atomic, numbered functional requirements for Project **Flatmate** MVP. Every requirement is formulated to be independently verifiable, testable, and directly traceable to User Stories in `docs/requirements/backlog.md` and Test Cases in `docs/requirements/traceability-matrix.md`.

### Requirement Classification Structure
- **Domain 1**: Authentication & Identity Verification (FR-01 to FR-03)
- **Domain 2**: Profile & Discovery Modality Configuration (FR-04 to FR-06)
- **Domain 3**: 7-Vector Lifestyle Compatibility Profiling (FR-07 to FR-13)
- **Domain 4**: Deterministic Compatibility Scoring & Feed Filtering (FR-14 to FR-16)
- **Domain 5**: Discovery Card Deck & Swipe Gestures (FR-17 to FR-19)
- **Domain 6**: Mutual Matching & Double Opt-in Unlock (FR-20 to FR-21)
- **Domain 7**: In-App Real-Time Messaging & Privacy Safeguards (FR-22 to FR-24)
- **Domain 8**: Optional Room Listing Manager (Modalities 1 & 3) (FR-25 to FR-26)
- **Domain 9**: Trust, Safety & Harassment Mitigation (FR-27 to FR-28)

---

## 2. Domain 1: Authentication & Identity Verification

### FR-01: Phone Number Authentication via Secure OTP
- **Requirement ID**: `FR-01`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: The system must authenticate users via Indian mobile phone numbers (+91) using a time-limited One-Time Password (OTP).
- **Inputs**: User 10-digit Indian mobile number.
- **Preconditions**: User has access to an active cellular connection capable of receiving SMS.
- **Functional Flow**:
  1. User enters 10-digit phone number.
  2. System validates input against E.164 standard (`^\+91[6-9]\d{9}$`).
  3. System sends a 6-digit numeric OTP with 5-minute validity.
  4. User enters the 6-digit OTP.
  5. System validates OTP against the cryptographically hashed token in the cache.
  6. Upon successful verification, system issues a session JWT in an `httpOnly`, `secure`, `SameSite=Strict` cookie and a refresh token.
  7. If new user, routes to Profile Setup (`FR-04`); if returning user, routes to Discovery Feed (`FR-17`).
- **Error Handling & Limits**:
  - Rate limit: Maximum 3 OTP generation requests per phone number within 15 minutes.
  - Expiry: OTP expires after 300 seconds (5 minutes).
  - Failed attempts: Account locked for 30 minutes after 5 consecutive incorrect OTP submissions.
- **Traceability**: `US-01`, `TC-01`

### FR-02: Institutional & Corporate Domain Email Verification
- **Requirement ID**: `FR-02`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: The system must allow users to verify their affiliation with recognized colleges or employers via work/academic domain email verification to combat anonymity and impersonation.
- **Inputs**: Academic or corporate email address (e.g., `user@cet.ac.in`, `user@ust.com`, `user@infosys.com`).
- **Preconditions**: User is logged in via authenticated session (`FR-01`).
- **Functional Flow**:
  1. User submits work or academic email in profile settings or onboarding.
  2. System checks domain against whitelist of approved Trivandrum universities (CET, SCT, University of Kerala, GMC) and IT employers (Technopark Phases I-III companies).
  3. System dispatches a cryptographically secure verification link/token with 24-hour expiration.
  4. User clicks link or enters 6-digit token.
  5. System marks email status as `VERIFIED` and associates institutional metadata with user profile.
- **Error Handling & Limits**:
  - Unrecognized domain: If domain is not on whitelist, user is prompted to submit organization name for manual admin review.
  - Rate limit: Maximum 2 verification emails sent per 10 minutes.
- **Traceability**: `US-02`, `TC-02`

### FR-03: Verification Badge Display & Credential State Management
- **Requirement ID**: `FR-03`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: The system must display distinct visual trust badges on user discovery cards and full profile sheets indicating verified status without leaking raw email addresses.
- **Inputs**: User verification record.
- **Preconditions**: User has successfully verified credentials via `FR-02`.
- **Functional Flow**:
  1. System checks `verification_status` flag.
  2. If verified via corporate domain, renders a blue shield icon with tooltip: *"Verified Professional at [Employer]"*.
  3. If verified via university domain, renders a green cap icon with tooltip: *"Verified Student at [College]"*.
  4. If unverified, no badge is displayed, and profile card includes a subtle "Unverified Profile" indicator.
- **Privacy Rule**: The raw email address (`adarsh@ust.com`) must NEVER be exposed to other users or transmitted in discovery feed JSON payloads.
- **Traceability**: `US-03`, `TC-03`

---

## 3. Domain 2: Profile & Discovery Modality Configuration

### FR-04: Discovery Modality Selection & Routing
- **Requirement ID**: `FR-04`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: The system must require every user during onboarding to select their primary Discovery Modality, configuring the application's interface and matching engine logic accordingly.
- **Inputs**: Selected modality enum:
  - `MODALITY_1`: Has a room available, seeking flatmate.
  - `MODALITY_2`: Seeking accommodation and flatmate.
  - `MODALITY_3`: Has flat, wants to relocate with a new flatmate.
  - `MODALITY_4`: Seeking compatible person first to search together.
- **Preconditions**: Authenticated user completing initial onboarding.
- **Functional Flow**:
  1. Onboarding presents interactive modality selection screen with clear illustrations and friction explanations.
  2. User selects exactly one primary modality.
  3. If `MODALITY_1` or `MODALITY_3` is chosen, system queues the optional Room Listing step (`FR-25`).
  4. If `MODALITY_2` or `MODALITY_4` is chosen, system bypasses room listing and proceeds directly to Lifestyle Profiling (`FR-07`).
  5. User can change their modality at any time via Account Settings.
- **Traceability**: `US-04`, `TC-04`

### FR-05: Core Profile Configuration & Demographics
- **Requirement ID**: `FR-05`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: The system must capture essential identity and demographic attributes required for personal safety and roommate filtering.
- **Inputs**:
  - Full Name (Display name can be first name + last initial)
  - Gender (`FEMALE`, `MALE`, `NON_BINARY`)
  - Date of Birth / Age (Calculated; minimum age 18 years)
  - Occupation / Course of Study
  - Profile Photos: Minimum 1 photo, maximum 4 photos (stored via secure CDN)
  - Short Bio: Maximum 300 characters
- **Preconditions**: Modality selected (`FR-04`).
- **Validation Rules**:
  - Age must be ≥ 18 years old. Users under 18 are rejected at input.
  - Name is sanitized against offensive words and regex-validated (`^[a-zA-Z\s\.\']{2,50}$`).
  - Image files: JPEG/PNG/WebP, maximum 5MB per image. Images are auto-scanned for explicit content.
- **Traceability**: `US-05`, `TC-05`

### FR-06: Trivandrum Micro-Market & Budget Preferences
- **Requirement ID**: `FR-06`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: The system must capture preferred target micro-markets within Thiruvananthapuram and monthly rental budget ranges to drive deterministic discovery filtering.
- **Inputs**:
  - Preferred Micro-Markets (Multi-select from: `Kazhakkoottam`, `Kariavattom`, `Sreekaryam`, `Ulloor`, `Pattom`, `Kowdiar`, `Manacaud`, `Vellayambalam`)
  - Monthly Budget Range: Minimum and Maximum in INR (slider: ₹3,000 to ₹35,000/month per head)
  - Target Move-In Date: Date picker (Within 15 days, 1 month, 2 months, flexible)
- **Functional Behavior**: Feeds and compatibility calculations strictly respect these geographic and financial boundaries.
- **Traceability**: `US-05`, `TC-06`

---

## 4. Domain 3: 7-Vector Lifestyle Compatibility Profiling

### FR-07: Vector 1 – Sleep Schedule & Chronotype Profiling
- **Requirement ID**: `FR-07`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: Capture chronotype and work shift patterns to prevent sleep disruption clashes.
- **Inputs**:
  - Sleep Pattern: `EARLY_BIRD` (sleep by 10:30 PM), `NIGHT_OWL` (sleep after 1:00 AM), `FLEXIBLE`
  - Shift Schedule: `NORMAL_DAY` (09:00 - 18:00), `US_SHIFT` (18:00 - 03:00), `UK_SHIFT` (13:00 - 22:00), `ROTATIONAL_NIGHT`
  - Light/Noise Sensitivity: `HEAVY_SLEEPER`, `LIGHT_SLEEPER` (requires quiet)
  - Strict Dealbreaker: Boolean toggle (`true`/`false`)
- **Traceability**: `US-06`, `TC-07`

### FR-08: Vector 2 – Cleanliness & Hygiene Expectations
- **Requirement ID**: `FR-08`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: Capture chore habits, dishwashing timing, and common-area hygiene standards.
- **Inputs**:
  - Cleanliness Level: `RELAXED` (clean on weekends), `MODERATE` (clean every 2-3 days), `METICULOUS` (daily chore discipline)
  - Kitchen Sink Rule: `IMMEDIATE_WASH` (wash dishes immediately), `SAME_DAY` (wash before bed), `NEXT_DAY`
  - Domestic Help / Maid: `MUST_HAVE_MAID` (insist on hired maid), `OPEN_TO_MAID`, `DIY_ONLY`
  - Strict Dealbreaker: Boolean toggle
- **Traceability**: `US-06`, `TC-08`

### FR-09: Vector 3 – Dietary Preferences & Kitchen Sharing Rules
- **Requirement ID**: `FR-09`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: Capture dietary choices and kitchen coexistence comfort to prevent cultural food clashes.
- **Inputs**:
  - Personal Diet: `STRICT_VEGETARIAN`, `EGGETARIAN`, `NON_VEGETARIAN`, `HALAL_ONLY`
  - Kitchen Policy Comfort: `VEG_ONLY_KITCHEN` (no meat/fish stored or cooked), `SEPARATE_UTENSILS_OK` (non-veg ok with separate cookware), `NO_RESTRICTIONS` (comfortable with all cooking)
  - Strict Dealbreaker: Boolean toggle
- **Traceability**: `US-07`, `TC-09`

### FR-10: Vector 4 – Social Habits & Guest Policy
- **Requirement ID**: `FR-10`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: Capture guest frequency and home environment expectations (sanctuary vs social lounge).
- **Inputs**:
  - Guest Frequency: `NO_GUESTS` (strictly private sanctuary), `OCCASIONAL_FRIENDS` (daytime weekend visits), `FREQUENT_GUESTS` (open house)
  - Overnight Guests: `NO_OVERNIGHT`, `SAME_GENDER_ONLY`, `PARTNERS_ALLOWED`, `FLEXIBLE_WITH_NOTICE`
  - Party / Gathering Preference: `NEVER_AT_HOME`, `OCCASIONAL_WEEKENDS`, `FREQUENT`
  - Strict Dealbreaker: Boolean toggle
- **Traceability**: `US-07`, `TC-10`

### FR-11: Vector 5 – Substance Tolerance (Smoking / Alcohol)
- **Requirement ID**: `FR-11`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: Capture substance usage and household tolerance rules.
- **Inputs**:
  - Smoking: `NON_SMOKER_STRICT` (no smoking anywhere), `BALCONY_ONLY` (outdoor smoking ok), `SMOKER`
  - Alcohol: `TEETOTALER` (no alcohol in house), `SOCIAL_DRINKER` (moderate weekend consumption), `REGULAR`
  - Strict Dealbreaker: Boolean toggle (e.g. Non-smokers demanding smoke-free flat)
- **Traceability**: `US-08`, `TC-11`

### FR-12: Vector 6 – Financial Discipline & Rent Splitting
- **Requirement ID**: `FR-12`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: Capture financial expectations, rent settlement timeliness, and utility splitting models.
- **Inputs**:
  - Rent Payment Habit: `STRICT_1ST_OF_MONTH`, `BEFORE_5TH`, `FLEXIBLE`
  - AC Bill Splitting: `EQUAL_SPLIT`, `PROPORTIONAL_TO_USAGE` (sub-meter or AC owner pays difference)
  - Shared Grocery Tracking: `SPLITWISE_APP`, `INDIVIDUAL_PROVISIONS`, `ROTATIONAL_PAYMENT`
  - Strict Dealbreaker: Boolean toggle
- **Traceability**: `US-08`, `TC-12`

### FR-13: Vector 7 – Work Rhythm & Hybrid / WFH Setup
- **Requirement ID**: `FR-13`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: Capture home occupancy patterns during weekdays to prevent workspace conflicts.
- **Inputs**:
  - Work Mode: `OFFICE_DAILY` (out of flat 9am-6pm), `HYBRID` (2-3 days WFH), `100_PERCENT_REMOTE`
  - Work Call Frequency at Home: `LOW` (quiet desk work), `HIGH` (frequent meetings/client calls all day)
  - Workspace Need: `PRIVATE_ROOM_DESK`, `LIVING_ROOM_DESK_OK`
  - Strict Dealbreaker: Boolean toggle
- **Traceability**: `US-08`, `TC-13`

---

## 5. Domain 4: Deterministic Compatibility Scoring & Feed Filtering

### FR-14: Deterministic Compatibility Scoring Engine
- **Requirement ID**: `FR-14`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: The system must calculate a mathematical compatibility score (0% to 100%) between the requesting user and each candidate profile using a transparent, weighted vector algorithm.
- **Mathematical Specification**:
  $$\text{Total Score} = \sum_{k=1}^{7} \left( W_k \times S_k(\text{User}_A, \text{User}_B) \right)$$
  - Where $W_k$ represents vector weights:
    - Sleep Schedule ($W_1$): 0.20
    - Cleanliness & Hygiene ($W_2$): 0.20
    - Dietary & Kitchen ($W_3$): 0.15
    - Social & Guests ($W_4$): 0.15
    - Substances ($W_5$): 0.15
    - Financial Discipline ($W_6$): 0.10
    - Work Rhythm ($W_7$): 0.05
  - $S_k \in [0.0, 1.0]$ is the vector affinity score derived from the deterministic lookup matrix.
- **System Behavior**: Compatibility scores are computed on-the-fly or cached in Redis, sorting the candidate feed in descending order of compatibility.
- **Traceability**: `US-09`, `TC-14`

### FR-15: Dealbreaker Filtering & Hard Constraint Enforcement
- **Requirement ID**: `FR-15`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: The system must enforce non-negotiable constraints before ranking candidates in the discovery deck.
- **Hard Filter Rules**:
  1. **Gender Rule**: A candidate is excluded if `Candidate.Gender` does not match `User.GenderPreference` OR `User.Gender` does not match `Candidate.GenderPreference`.
  2. **Dealbreaker Vector Conflict**: If User A marks a vector as a dealbreaker (e.g., `VEG_ONLY_KITCHEN`) and Candidate B has an incompatible value (e.g., cooks non-veg regularly), Candidate B is completely filtered out of User A's discovery deck.
  3. **Modality Incompatibility**: Candidates with incompatible modalities (per PRD Rule 4 table) are excluded.
  4. **Blocked / Reported Users**: Blocked users are excluded bidirectionally.
- **Traceability**: `US-10`, `TC-15`

### FR-16: Transparent Compatibility Breakdown Generation
- **Requirement ID**: `FR-16`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: The system must generate an itemized breakdown of vector alignment (High Alignment, Moderate Alignment, Discussion Point) for every candidate card.
- **Outputs**:
  - Overall Score: Integer (e.g., `88%`)
  - Vector Badges:
    - Green Badge: Full alignment ($S_k \ge 0.85$)
    - Yellow Badge: Moderate alignment ($0.50 \le S_k < 0.85$)
    - Red / Flag Badge: Divergence ($S_k < 0.50$) with actionable prompt (e.g., *"Discuss: Candidate works US Night Shift"*).
- **Assistive AI Note**: (Optional P1) A 2-sentence summary generated by Gemini summarizing key lifestyle harmonies and conversational suggestions without altering the mathematical score.
- **Traceability**: `US-11`, `TC-16`

---

## 6. Domain 5: Discovery Deck & Swiping Interactions

### FR-17: Discovery Card Deck Interface & Feed Retrieval
- **Requirement ID**: `FR-17`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: The system must provide a mobile-first card deck displaying candidate profiles ranked by compatibility score, supporting paginated feed loading.
- **Feed Batch Size**: 20 candidates per batch.
- **Card Preview Components**:
  - Primary Photo with verified institutional/work badge overlay.
  - Display Name, Age, Profession/College.
  - Overall Compatibility Score badge (e.g. `92% Match`).
  - Target Micro-Markets and Budget.
  - Top 3 Lifestyle Highlight Chips (e.g., `Early Bird`, `Non-Smoker`, `Veg-Friendly`).
- **Empty State**: Empathetic UI when no candidates remain, with options to expand search radius or adjust filters.
- **Traceability**: `US-12`, `TC-17`

### FR-18: Swipe Interactions & Decision Processing
- **Requirement ID**: `FR-18`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: The system must capture and process touch swipe gestures and click-based button interactions with optimistic UI updates.
- **Supported Interactions**:
  1. **Swipe Left / 'Pass' Button**: Discards profile. Records `PASS` action. Card animates off-screen to the left.
  2. **Swipe Right / 'Like' Button**: Expresses interest. Records `LIKE` action. Card animates off-screen to the right. Evaluates mutual match (`FR-20`).
  3. **Swipe Up / 'Super-Like' Button**: Highlights user's profile to the candidate with an elevated badge.
  4. **Undo / Rewind**: Allows reverting the immediately preceding swipe action (limited to 1 rewind per session).
- **Idempotency & Resilience**: Actions include unique client UUIDs to prevent double-swiping under spotty connectivity.
- **Traceability**: `US-13`, `TC-18`

### FR-19: Detailed Profile Expansion Modal / Bottom Sheet
- **Requirement ID**: `FR-19`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: The user must be able to tap a candidate card to expand a full-screen or bottom-sheet view containing complete lifestyle vectors and room photos (if applicable).
- **Detailed View Contents**:
  - Full photo gallery (swipeable carousel).
  - Complete 7-vector lifestyle breakdown table with comparative indicators (My Habit vs Candidate's Habit).
  - Room listing section (if candidate is Modality 1 or 3).
  - Report / Block overflow button.
- **Ergonomics**: Smooth swipe-down gesture or close button to collapse sheet back to deck.
- **Traceability**: `US-14`, `US-15`, `TC-19`

---

## 7. Domain 6: Mutual Matching & Double Opt-in Unlock

### FR-20: Mutual Match Detection & State Transition
- **Requirement ID**: `FR-20`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: When User A records a `LIKE` on User B, the system must atomically query if User B has previously recorded a `LIKE` on User A.
- **Functional Behavior**:
  1. If User B has NOT liked User A: Record interaction as `PENDING_MUTUAL`. Candidate B will see User A in normal feed sequence.
  2. If User B HAS liked User A: Atomically transition match state to `MUTUAL_MATCH`.
  3. Generate a unique `conversation_id` linking User A and User B.
  4. Emit a real-time event to both active user sessions.
- **Traceability**: `US-16`, `TC-20`

### FR-21: Mutual Match Notification & Double Opt-in Unlock
- **Requirement ID**: `FR-21`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: Upon mutual match trigger, display an interactive celebration modal and unlock direct 1-on-1 chat.
- **UI Elements**:
  - Modal with photos of both users and text: *"It's a Flatmate Match!"*
  - Display compatibility score (e.g. `94% Compatibility`).
  - Action 1: *"Start Chatting Now"* (routes directly to conversation view).
  - Action 2: *"Keep Swiping"* (dismisses modal, stays on discovery deck).
- **Traceability**: `US-17`, `US-18`, `TC-21`

---

## 8. Domain 7: In-App Real-Time Messaging & Privacy Safeguards

### FR-22: 1-on-1 Real-Time Text Messaging Engine
- **Requirement ID**: `FR-22`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: The system must provide secure, low-latency text messaging between mutually matched pairs via WebSockets with HTTP polling fallback.
- **Functional Requirements**:
  - Message types supported: UTF-8 text strings (up to 2,000 characters).
  - Real-time delivery: Messages delivered to recipient within 150ms if recipient is online.
  - Offline delivery: Messages stored in PostgreSQL and delivered upon next login.
  - Status indicators: `SENT` (single check), `DELIVERED` (double grey check), `READ` (double blue check).
- **Traceability**: `US-19`, `US-20`, `TC-22`

### FR-23: DPDP-Compliant Privacy & Contact Information Masking
- **Requirement ID**: `FR-23`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: In strict compliance with India's DPDP Act 2023, the platform must never reveal raw phone numbers, email addresses, or precise GPS coordinates in discovery or chat.
- **Rules**:
  - Phone numbers are stored encrypted (AES-256) and never returned in API payloads.
  - Locations are coarsened to micro-market name (e.g., `Kazhakkoottam`, `Kowdiar`) and never precise coordinates.
  - Automated regex scanning warns users if they paste phone numbers or bank details into chat: *"For your security, keep conversations within Flatmate until you meet in person."*
- **Traceability**: `US-21`, `TC-23`

### FR-24: Active Conversation Management & Message Controls
- **Requirement ID**: `FR-24`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: Users must have full control over conversation states, including unmatching and conversation archiving.
- **Actions**:
  1. **Unmatch**: Either user can unmatch at any time. Unmatching immediately terminates the conversation, deletes the WebSocket subscription, and removes both users from each other's chat inbox.
  2. **Archive**: Hide conversations from active inbox without terminating match.
- **Traceability**: `US-22`, `TC-24`

---

## 9. Domain 8: Optional Room Listing Manager (Modalities 1 & 3)

### FR-25: Room Listing Creation & Media Upload
- **Requirement ID**: `FR-25`
- **Priority**: Should Have (P1)
- **Applicable Modalities**: Modalities 1, 3 (Optional for M2, M4)
- **Description**: Users with available rooms (Modality 1 or 3) can attach room details, amenities, and photos to their profile.
- **Inputs**:
  - Room Type: `PRIVATE_ROOM`, `SHARED_ROOM` (2 sharing / 3 sharing)
  - Bathroom Type: `ATTACHED_PRIVATE`, `SHARED`
  - Monthly Rent (INR) and Security Deposit (INR)
  - Date Available From: Calendar date
  - Key Amenities: Multi-select (`AC`, `High-Speed Wi-Fi`, `Washing Machine`, `Power Backup / Inverter`, `Covered Parking`, `Geyser / Water Heater`)
  - Room Photos: Minimum 1 photo, maximum 4 photos.
- **Traceability**: `US-23`, `US-24`, `TC-25`

### FR-26: Room Listing Display in Discovery Deck
- **Requirement ID**: `FR-26`
- **Priority**: Should Have (P1)
- **Applicable Modalities**: Modalities 1, 2, 3
- **Description**: When an accommodation seeker (Modality 2) views a Modality 1 user's profile card, the room listing badge and photos must be seamlessly accessible.
- **Display Rules**:
  - The discovery card displays a "Has Room in [Micro-Market]" pill tag.
  - Swiping horizontally on photo gallery toggles between candidate profile photo and room interior photos.
  - Rent per month (e.g. `₹7,500/mo`) is clearly displayed alongside the candidate's compatibility score.
- **Traceability**: `US-25`, `TC-26`

---

## 10. Domain 9: Trust, Safety & Harassment Mitigation

### FR-27: Instant User Blocking & Feed Exclusion
- **Requirement ID**: `FR-27`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: Users must be able to instantly block any user from the discovery deck, profile sheet, or active chat.
- **Functional Behavior**:
  1. User selects "Block User" from context menu.
  2. System prompts for confirmation.
  3. Upon confirmation, system writes a bidirectional block record to `user_blocks` table.
  4. Blocked user's profile disappears immediately from deck or chat list.
  5. The blocked user is barred from viewing or interacting with the reporting user across all feeds.
- **Traceability**: `US-26`, `TC-27`

### FR-28: Abuse & Harassment Reporting with Auto-Quarantine Trigger
- **Requirement ID**: `FR-28`
- **Priority**: Must Have (P0)
- **Applicable Modalities**: Modalities 1, 2, 3, 4
- **Description**: Users must be able to report suspicious or abusive accounts with structured categories and evidence submission, with automatic quarantine upon threshold breach.
- **Report Categories**:
  - `HARASSMENT_OR_ABUSE`: Verbal abuse, inappropriate sexual advances.
  - `SPAM_OR_COMMERCIAL_BROKER`: Broker posing as flatmate, third-party promotion.
  - `FAKE_PROFILE_IMPERSONATION`: Stolen photos, fraudulent credentials.
  - `MORAL_POLICING_OR_DISCRIMINATION`: Invasive regional/cultural harassment.
- **System Quarantine Threshold**:
  - If a user receives **2 reports within 24 hours** or **3 total reports**, their account status is automatically set to `QUARANTINED`.
  - Quarantined users are hidden from all discovery decks and cannot initiate new matches until reviewed by an administrator.
- **Traceability**: `US-27`, `US-28`, `TC-28`

---
name: database-design
description: Design normalized relational PostgreSQL schemas, indexing strategies, foreign key constraints, and versioned reversible migration procedures for Flatmate.
---

# Database Design Skill

## Purpose
Model, optimize, and maintain the PostgreSQL relational database schema for Flatmate, ensuring data integrity, strict referential constraints, performant indexing, and versioned zero-loss migrations.

## When to Use It
- During Workflow C (Architecture & Design) and Workflow D (Development).
- Whenever modifying entity models, adding columns, or optimizing queries.
- Before generating or applying any database migration.

## Required Inputs
- Domain models from `docs/architecture/system-architecture.md`.
- Functional requirements for profiles, preferences, matches, messages, and listings.

## Step-by-Step Procedure
1. **Design Relational Entities & Relationships (3NF)**:
   - `users`: ID (UUIDv4), email (unique), password_hash, status, created_at, updated_at.
   - `profiles`: user_id (FK), display_name, age, gender, occupation, college_company, bio, avatar_url, modal_intent (1..4), location_suburb, verified_status.
   - `lifestyle_preferences`: user_id (FK), sleep_routine, cleanliness_level, food_preference (veg/non-veg/vegan), drinking_habit, smoking_habit, social_battery, pet_tolerance, budget_min, budget_max, preferred_gender.
   - `discovery_swipes`: id, actor_user_id (FK), target_user_id (FK), action (LIKE, PASS, SUPERLIKE), created_at. Unique constraint on `(actor_user_id, target_user_id)`.
   - `matches`: id, user1_id (FK), user2_id (FK), compatibility_score, matched_at, status (ACTIVE, UNMATCHED).
   - `conversations`: id, match_id (FK), last_message_at.
   - `messages`: id, conversation_id (FK), sender_user_id (FK), content, read_at, created_at.
   - `room_listings`: id (optional for user), user_id (FK), title, description, rent, deposit, location_suburb, latitude, longitude, photos, available_from.
   - `reports_and_blocks`: id, reporter_user_id (FK), reported_user_id (FK), type, reason, status.
2. **Define Indexing Strategy**:
   - Compound indexes: `discovery_swipes (actor_user_id, target_user_id)`.
   - Filter indexes: `profiles (location_suburb, modal_intent)`, `lifestyle_preferences (preferred_gender, budget_min, budget_max)`.
   - Message ordering index: `messages (conversation_id, created_at DESC)`.
3. **Plan Migration Versioning & Rollback**:
   - Every migration must have an `UP` (apply) and a `DOWN` (revert) script.
   - Zero-downtime rules: Add new nullable columns before adding constraints; never drop active columns without a phased deprecation period.
4. **Publish Schema Specification**: Store in `docs/architecture/database-schema.md`.

## Expected Outputs
- `docs/architecture/database-schema.md`
- Entity-Relationship (ER) diagram specification.
- Migration guidelines and review checklist.

## Quality Checklist
- [ ] Primary keys use UUIDs or bigints; foreign keys have explicit cascade/restrict rules.
- [ ] No unindexed foreign keys or discovery query bottlenecks.
- [ ] PII and sensitive data are appropriately constrained and isolated.
- [ ] All migrations are reversible.

## Relevant References
- [system-architecture](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/system-architecture/SKILL.md)
- [backend-engineering](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/backend-engineering/SKILL.md)

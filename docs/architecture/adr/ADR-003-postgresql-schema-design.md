# ADR-003: Relational 3NF PostgreSQL Schema Design

- **Status**: Accepted
- **Author**: Solution Architect
- **Reviewers**: Chief Orchestrator, Backend Engineer, Security Reviewer
- **Date**: 2026-11-14
- **Tags**: database, postgresql, schema, architecture

---

## 1. Context and Problem Statement
Flatmate manages interconnected relational entities: users, verified credentials, 7-vector lifestyle profiles, multi-party discovery swipes, mutual match events, active conversations, 1-on-1 messages, room listings, and safety reports.
The persistence layer must guarantee ACID transactional consistency (e.g., atomically recording a reciprocal swipe and generating a mutual match and conversation), prevent duplicate reciprocal matches, enforce DPDP privacy constraints, and support performant indexed queries for discovery feeds.
We must choose the foundational data architecture and database schema design strategy.

## 2. Decision Drivers
- **Data Integrity & Consistency**: Absolute referential integrity across users, profiles, swipes, and matches. Prevent orphaned records or phantom matches.
- **Complex Query Performance**: Low-latency filtering across multi-attribute preference dimensions (gender, modality, micro-market, budget) and dealbreaker vector lookups.
- **Symmetrical Deduplication**: Prevent duplicate mirrored match rows (e.g., user A matched with user B, and user B matched with user A).
- **Auditability & Privacy**: Cryptographic masking of PII, encrypted phone numbers, and deterministic hashes for lookups.
- **Reversibility & Evolution**: Deterministic, version-controlled UP and DOWN migrations.

## 3. Considered Options
- **Option 1: PostgreSQL Relational Database in Third Normal Form (3NF)** with UUIDv4 primary keys, PostgreSQL ENUMs, and strict foreign keys.
- **Option 2: Document-Based NoSQL Database (MongoDB / Firestore)** storing profiles and lifestyle documents with embedded sub-documents.
- **Option 3: Hybrid PostgreSQL with heavily denormalized JSONB columns** for profiles and preferences.

## 4. Decision Outcome
Chosen option: **Option 1: PostgreSQL Relational Database in Third Normal Form (3NF)**.

PostgreSQL provides rock-solid ACID transactional guarantees essential for reciprocal swipe detection and conversation creation. By normalizing tables into 3NF and employing custom PostgreSQL `ENUM` types for domain invariants (modalities, lifestyle vectors, status flags), the database enforces domain validity at the storage layer while optimizing B-Tree index sizing. Symmetrical pair ordering is enforced via a CHECK constraint (`user1_id < user2_id`).

### Positive Consequences
- **Zero Orphaned Data**: Foreign keys with explicit `ON DELETE CASCADE` or `RESTRICT` guarantee clean referential integrity.
- **Indexed Filter Performance**: Separate indexed columns for budget ranges, gender preferences, and micro-market joins execute discovery feed queries in $< 25$ ms.
- **Canonical Match Uniqueness**: Enforcing `user1_id < user2_id` on the `matches` table eliminates duplicate rows and race conditions during simultaneous mutual swipes.
- **Reversible Migrations**: Clean DDL SQL migration scripts (`001_initial_schema.up.sql` and `down.sql`) provide deterministic staging verification and safe rollbacks.

### Negative Consequences / Trade-offs
- Schema changes require explicit, versioned migration scripts rather than dynamic schemaless document appends.
- High-volume messaging requires periodic index maintenance on `(conversation_id, created_at DESC)`.

## 5. Pros and Cons of Considered Options

### Option 1: PostgreSQL 3NF (Chosen)
- Good: ACID compliance ensures swipe and match creation happen in a single atomic transaction.
- Good: Strong type safety and domain constraints via native ENUM types.
- Good: Excellent query optimization with compound indexes for candidate feed evaluation.
- Bad: Requires strict migration management for every schema iteration.

### Option 2: Document Store (MongoDB)
- Good: Flexible schema allows fast prototyping of new lifestyle questions.
- Bad: Lacks ACID guarantees across separate collections (users, swipes, matches) without heavy multi-document transactions.
- Bad: Symmetrical match deduplication requires complex application-level locking.
- Bad: Weak referential constraints risk orphaned conversations and messages.

### Option 3: PostgreSQL with Denormalized JSONB
- Good: Combines relational users with flexible JSONB preference objects.
- Bad: Indexing deep JSONB keys is larger and slower than typed relational columns; lack of compile-time/DB-time type constraints on vector enums.

## 6. Implementation Notes & Follow-ups
- Implemented in `docs/architecture/database-schema.md`.
- Backend Engineer must apply migrations using a versioned migration tool (e.g., node-pg-migrate or Prisma/Drizzle migration CLI).
- Sensitive fields (`phone_encrypted`) must be encrypted using AES-256-GCM before DB insertion with application keys managed via environment secrets.

# ADR-006: Deterministic 7-Vector Compatibility Scoring Algorithm

- **Status**: Accepted
- **Author**: Solution Architect
- **Reviewers**: Chief Orchestrator, AI Engineer, Backend Engineer, Product Strategist
- **Date**: 2026-11-14
- **Tags**: matching, algorithm, ai, compatibility

---

## 1. Context and Problem Statement
A core value proposition of Flatmate is calculating a compatibility score (0% to 100%) and itemized breakdown between two prospective flatmates across 7 vital living vectors (Sleep Schedule, Cleanliness, Dietary/Kitchen, Social Habits, Substances, Financial Discipline, Work Rhythm).
A crucial architectural decision is determining whether matching should be calculated via a transparent deterministic mathematical algorithm or delegated to modern machine learning / LLM embeddings.
In shared urban living in India (and specifically Trivandrum), users need absolute trust, predictability, and explainability for dealbreakers (e.g. strict non-smoking, veg-only kitchens, female-only flats).
We must decide how compatibility scores are generated and ranked.

## 2. Decision Drivers
- **Predictability & Explainability**: A user must be able to see exactly why they scored 88% or 62% with another person (itemized breakdown by vector).
- **Strict Hard Dealbreaker Enforcement**: If a user marks "Strict Non-Smoker" or "Veg-Only Kitchen" as a non-negotiable dealbreaker, the system must guarantee 100% exclusion of incompatible candidates. Black-box vector embeddings can occasionally hallucinate or produce soft false-positive overlaps.
- **Latency & Scalability**: Evaluating 50 candidates in a discovery batch must complete in $< 50$ milliseconds (per NFR-PERF-03). Calling an LLM or running high-dimensional vector cosine distance queries for 50 candidates per user feed swipe would breach latency and cost budgets.
- **Fairness & Bias Prevention**: Eliminate black-box algorithmic bias in roommate selection.
- **Cost**: Zero external API cost for ranking feeds.

## 3. Considered Options
- **Option 1: Pure Deterministic Weighted Multi-Vector Affinity Scoring** with hard dealbreaker SQL/in-memory pre-filtering, accompanied by assistive LLM summaries only on deep-dive inspection.
- **Option 2: Vector Embeddings with Cosine Similarity (e.g. pgvector / OpenAI embeddings)** generating vector embeddings from profile text and survey answers.
- **Option 3: End-to-End LLM Prompt Scoring**: Passing candidate profile pairs to Gemini to output numerical compatibility scores.

## 4. Decision Outcome
Chosen option: **Option 1: Pure Deterministic Weighted Multi-Vector Affinity Scoring**.

The platform employs a transparent, weighted linear affinity formula:
$$\text{Total Score} = \sum_{k=1}^{7} \left( W_k \times S_k(\text{User}_A, \text{User}_B) \right)$$
Where weights $W_k$ are calibrated based on roommate co-living friction research:
- Sleep Schedule ($W_1$): 0.20
- Cleanliness & Hygiene ($W_2$): 0.20
- Dietary & Kitchen ($W_3$): 0.15
- Social & Guests ($W_4$): 0.15
- Substances ($W_5$): 0.15
- Financial Discipline ($W_6$): 0.10
- Work Rhythm ($W_7$): 0.05

Vector affinity scores $S_k \in [0.0, 1.0]$ are evaluated via deterministic lookup tables.
Hard dealbreakers are evaluated as an absolute binary filter prior to scoring.
The Gemini API is integrated solely as a secondary, asynchronous assistant to author 2-sentence conversational "Why You Click" harmony notes when a user explicitly taps into a detailed candidate profile sheet.

### Positive Consequences
- **Instantaneous Batch Performance**: Calculating 50 candidate vector comparisons in TypeScript takes $< 5$ ms, well within the 50 ms NFR-PERF-03 budget.
- **Zero Hallucination of Hard Rules**: A user with a dealbreaker for non-smoking will never see a smoker in their feed; mathematically guaranteed by relational query filters.
- **Transparent User Feedback**: The UI can directly render green, yellow, and red status pills for each of the 7 vectors because each vector has a distinct, reproducible sub-score.
- **Zero Incremental Cloud Inference Cost** for regular swipe feed browsing.

### Negative Consequences / Trade-offs
- Static weights ($W_1$ to $W_7$) are uniform across all users in MVP v1.0. (Post-MVP will allow users to dynamically adjust individual vector weights).

## 5. Pros and Cons of Considered Options

### Option 1: Deterministic Weighted Multi-Vector Scoring (Chosen)
- Good: Sub-millisecond execution time; zero external API dependencies for feed rendering.
- Good: 100% predictable, testable via unit tests, and fully explainable to users.
- Good: Hard dealbreakers are guaranteed to never leak incompatible profiles.
- Bad: Lacks semantic nuance for free-form bio text (mitigated by using Gemini for assistive notes).

### Option 2: Vector Embeddings (pgvector)
- Good: Captures semantic subtleties in user written bios.
- Bad: Cannot guarantee hard binary dealbreaker enforcement (e.g. cosine similarity might score high on common interests while ignoring a critical smoking conflict).
- Bad: Vector index queries are computationally heavier and require vector regeneration whenever preferences change.

### Option 3: End-to-End LLM Scoring
- Good: Natural language explanations generated simultaneously with scores.
- Bad: Extremely slow ($> 1500$ ms per candidate batch), highly expensive, non-deterministic (same candidate might get 85% today and 78% tomorrow), and violates Project Governance Rule 04.

## 6. Implementation Notes & Follow-ups
- Backend implementation: `src/modules/matching/services/matching-engine.service.ts`.
- Affinity lookup matrices for all 7 vectors will be defined as typed constant tables in `src/modules/matching/constants/affinity-matrix.ts`.
- Unit tests must achieve 100% branch coverage on dealbreaker filters and scoring calculations.

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ScoringEngine } from '../src/modules/matching/scoring.engine.ts';
import type {
  UserProfileSummary,
  LifestyleProfile,
  SleepVector,
  CleanlinessVector,
  DietaryVector,
  SocialVector,
  SubstancesVector,
  FinancialVector,
  WorkVector,
} from '../src/modules/matching/matching.types.ts';

// Helper fixtures
const defaultSleep: SleepVector = {
  sleepPattern: 'NIGHT_OWL',
  shiftSchedule: 'NORMAL_DAY',
  noiseSensitivity: 'HEAVY_SLEEPER',
  isDealbreaker: false,
};

const defaultCleanliness: CleanlinessVector = {
  cleanlinessLevel: 'METICULOUS',
  kitchenSinkRule: 'IMMEDIATE_WASH',
  maidPreference: 'MUST_HAVE_MAID',
  isDealbreaker: false,
};

const defaultDietary: DietaryVector = {
  dietType: 'NON_VEGETARIAN',
  kitchenPolicy: 'NO_RESTRICTIONS',
  isDealbreaker: false,
};

const defaultSocial: SocialVector = {
  guestFrequency: 'OCCASIONAL_FRIENDS',
  overnightGuestPolicy: 'SAME_GENDER_ONLY',
  partyPreference: 'OCCASIONAL_WEEKENDS',
  isDealbreaker: false,
};

const defaultSubstances: SubstancesVector = {
  smokingHabit: 'NON_SMOKER_STRICT',
  alcoholHabit: 'SOCIAL_DRINKER',
  isDealbreaker: false,
};

const defaultFinancial: FinancialVector = {
  rentPaymentHabit: 'STRICT_1ST_OF_MONTH',
  acBillSplit: 'EQUAL_SPLIT',
  groceryTracking: 'SPLITWISE_APP',
  isDealbreaker: false,
};

const defaultWork: WorkVector = {
  workMode: 'HYBRID',
  callFrequency: 'LOW',
  workspacePreference: 'PRIVATE_ROOM_DESK',
  isDealbreaker: false,
};

function createMockLifestyle(userId: string, overrides: Partial<LifestyleProfile> = {}): LifestyleProfile {
  return {
    userId,
    sleep: { ...defaultSleep },
    cleanliness: { ...defaultCleanliness },
    dietary: { ...defaultDietary },
    social: { ...defaultSocial },
    substances: { ...defaultSubstances },
    financial: { ...defaultFinancial },
    work: { ...defaultWork },
    ...overrides,
  };
}

function createMockProfile(userId: string, overrides: Partial<UserProfileSummary> = {}): UserProfileSummary {
  return {
    userId,
    displayName: `User ${userId}`,
    gender: 'MALE',
    preferredGender: 'ANY',
    modality: 'MODALITY_2',
    minBudget: 5000,
    maxBudget: 12000,
    status: 'ACTIVE',
    ...overrides,
  };
}

describe('Deterministic 7-Vector Compatibility Scoring Engine (ADR-006 & FR-14)', () => {
  it('US-09 Scenario 1: Identical profiles achieve 100% score with high harmony', () => {
    const userA = createMockProfile('user-a', { modality: 'MODALITY_2' });
    const userB = createMockProfile('user-b', { modality: 'MODALITY_1' });

    const lifestyleA = createMockLifestyle('user-a');
    const lifestyleB = createMockLifestyle('user-b');

    const result = ScoringEngine.calculateCompatibility(userA, lifestyleA, userB, lifestyleB);

    assert.strictEqual(result.dealbreakerFailed, false);
    assert.strictEqual(result.overallScore, 100);
    assert.strictEqual(result.vectors.sleep.affinityScore, 1.0);
    assert.strictEqual(result.vectors.cleanliness.affinityScore, 1.0);
    assert.strictEqual(result.vectors.dietary.affinityScore, 1.0);
    assert.strictEqual(result.vectors.social.affinityScore, 1.0);
    assert.strictEqual(result.vectors.substances.affinityScore, 1.0);
    assert.strictEqual(result.vectors.financial.affinityScore, 1.0);
    assert.strictEqual(result.vectors.work.affinityScore, 1.0);

    // All should be marked HIGH_ALIGNMENT
    for (const vectorKey of Object.keys(result.vectors) as Array<keyof typeof result.vectors>) {
      assert.strictEqual(result.vectors[vectorKey].status, 'HIGH_ALIGNMENT');
    }
  });

  it('US-09 Scenario 2: Divergent Sleep Habits (Early Bird vs Night Owl) evaluates to 0.25 and reflects 15% drop', () => {
    const userA = createMockProfile('user-a', { modality: 'MODALITY_2' });
    const userB = createMockProfile('user-b', { modality: 'MODALITY_1' });

    const lifestyleA = createMockLifestyle('user-a', {
      sleep: { ...defaultSleep, sleepPattern: 'EARLY_BIRD', isDealbreaker: false },
    });
    const lifestyleB = createMockLifestyle('user-b', {
      sleep: { ...defaultSleep, sleepPattern: 'NIGHT_OWL', isDealbreaker: false },
    });

    const result = ScoringEngine.calculateCompatibility(userA, lifestyleA, userB, lifestyleB);

    assert.strictEqual(result.dealbreakerFailed, false);
    // Sleep vector affinity must evaluate to 0.25
    assert.strictEqual(result.vectors.sleep.affinityScore, 0.25);
    assert.strictEqual(result.vectors.sleep.status, 'DISCUSSION_POINT');

    // Overall score drops from 100 to 85 (a 15% reduction, since 0.20 * (1 - 0.25) = 0.15)
    assert.strictEqual(result.overallScore, 85);
  });

  it('US-09 Scenario 3: Performance benchmark - Batch evaluation of 50 candidates completes in < 50ms', () => {
    const user = createMockProfile('user-root', { modality: 'MODALITY_2' });
    const userLifestyle = createMockLifestyle('user-root');

    const candidates: Array<{ profile: UserProfileSummary; lifestyle: LifestyleProfile }> = [];
    const sleepPatterns: Array<SleepVector['sleepPattern']> = ['EARLY_BIRD', 'NIGHT_OWL', 'FLEXIBLE'];
    const cleanLevels: Array<CleanlinessVector['cleanlinessLevel']> = ['RELAXED', 'MODERATE', 'METICULOUS'];

    for (let i = 0; i < 50; i++) {
      candidates.push({
        profile: createMockProfile(`candidate-${i}`, {
          modality: 'MODALITY_1',
          displayName: `Candidate ${i}`,
        }),
        lifestyle: createMockLifestyle(`candidate-${i}`, {
          sleep: { ...defaultSleep, sleepPattern: sleepPatterns[i % 3] },
          cleanliness: { ...defaultCleanliness, cleanlinessLevel: cleanLevels[i % 3] },
        }),
      });
    }

    const start = performance.now();
    const ranked = ScoringEngine.rankBatch(user, userLifestyle, candidates);
    const duration = performance.now() - start;

    assert.strictEqual(ranked.length, 50);
    // Verify descending sort order
    for (let i = 1; i < ranked.length; i++) {
      assert.ok(ranked[i - 1].result.overallScore >= ranked[i].result.overallScore);
    }
    // Performance assertion (< 50ms per NFR-PERF-03, typically < 5ms)
    assert.ok(duration < 50, `Batch took ${duration.toFixed(2)}ms, must be < 50ms`);
  });

  describe('US-10 & FR-15: Hard Filter & Dealbreaker Enforcement', () => {
    it('Scenario 1: Gender preference mismatch filters candidate', () => {
      // Female seeking Female only
      const userA = createMockProfile('user-f', {
        gender: 'FEMALE',
        preferredGender: 'FEMALE',
        modality: 'MODALITY_2',
      });
      const candidateMale = createMockProfile('user-m', {
        gender: 'MALE',
        preferredGender: 'FEMALE',
        modality: 'MODALITY_1',
      });

      const lifeA = createMockLifestyle('user-f');
      const lifeM = createMockLifestyle('user-m');

      const result = ScoringEngine.calculateCompatibility(userA, lifeA, candidateMale, lifeM);
      assert.strictEqual(result.dealbreakerFailed, true);
      assert.ok(result.failedReason?.includes('Gender mismatch'));
    });

    it('Scenario 2: Smoking dealbreaker strictly filters smoker', () => {
      const userA = createMockProfile('user-non-smoker', { modality: 'MODALITY_2' });
      const candidateSmoker = createMockProfile('user-smoker', { modality: 'MODALITY_1' });

      const lifeA = createMockLifestyle('user-non-smoker', {
        substances: { ...defaultSubstances, smokingHabit: 'NON_SMOKER_STRICT', isDealbreaker: true },
      });
      const lifeSmoker = createMockLifestyle('user-smoker', {
        substances: { ...defaultSubstances, smokingHabit: 'SMOKER', isDealbreaker: false },
      });

      const result = ScoringEngine.calculateCompatibility(userA, lifeA, candidateSmoker, lifeSmoker);
      assert.strictEqual(result.dealbreakerFailed, true);
      assert.ok(result.failedReason?.includes('Substances dealbreaker'));
    });

    it('Scenario 3: Dietary dealbreaker filters non-veg cooking when veg-only kitchen required', () => {
      const userA = createMockProfile('user-veg', { modality: 'MODALITY_2' });
      const candidateNonVeg = createMockProfile('user-nonveg', { modality: 'MODALITY_1' });

      const lifeA = createMockLifestyle('user-veg', {
        dietary: {
          dietType: 'STRICT_VEGETARIAN',
          kitchenPolicy: 'VEG_ONLY_KITCHEN',
          isDealbreaker: true,
        },
      });
      const lifeNonVeg = createMockLifestyle('user-nonveg', {
        dietary: {
          dietType: 'NON_VEGETARIAN',
          kitchenPolicy: 'NO_RESTRICTIONS',
          isDealbreaker: false,
        },
      });

      const result = ScoringEngine.calculateCompatibility(userA, lifeA, candidateNonVeg, lifeNonVeg);
      assert.strictEqual(result.dealbreakerFailed, true);
      assert.ok(result.failedReason?.includes('Dietary dealbreaker'));
    });

    it('Scenario 4: Discovery Modality as Status (Non-Disqualifying Preference)', () => {
      // Modality 1 (Has room) vs Modality 1 (Has room) -> Compatible (modality is status, not dealbreaker)
      const m1User = createMockProfile('m1', { modality: 'MODALITY_1' });
      const m1Candidate = createMockProfile('m1-cand', { modality: 'MODALITY_1' });
      const life = createMockLifestyle('default');

      const resM1M1 = ScoringEngine.calculateCompatibility(m1User, life, m1Candidate, life);
      assert.strictEqual(resM1M1.dealbreakerFailed, false, 'Modality 1 vs Modality 1 should not fail dealbreakers');

      // Modality 1 (Has room) vs Modality 4 (Team up first) -> Compatible
      const m4Candidate = createMockProfile('m4-cand', { modality: 'MODALITY_4' });
      const resM1M4 = ScoringEngine.calculateCompatibility(m1User, life, m4Candidate, life);
      assert.strictEqual(resM1M4.dealbreakerFailed, false, 'Modality 1 vs Modality 4 should not fail dealbreakers');

      // Modality 1 (Has room) vs Modality 2 (Seeking room) -> Compatible
      const m2Candidate = createMockProfile('m2-cand', { modality: 'MODALITY_2' });
      const resM1M2 = ScoringEngine.calculateCompatibility(m1User, life, m2Candidate, life);
      assert.strictEqual(resM1M2.dealbreakerFailed, false);

      // Modality 4 (Team up) vs Modality 4 (Team up) -> Compatible
      const m4User = createMockProfile('m4', { modality: 'MODALITY_4' });
      const resM4M4 = ScoringEngine.calculateCompatibility(m4User, life, m4Candidate, life);
      assert.strictEqual(resM4M4.dealbreakerFailed, false);
    });

    it('Scenario 4b: Location & Budget Affinity Calculation', () => {
      // Location overlap
      const locMatch = ScoringEngine.calculateLocationAffinity(['KAZHAKKOOTTAM', 'KARIAVATTOM'], ['KAZHAKKOOTTAM']);
      assert.strictEqual(locMatch, 1.0);

      const locDisjoint = ScoringEngine.calculateLocationAffinity(['KAZHAKKOOTTAM'], ['PATTOM']);
      assert.strictEqual(locDisjoint, 0.5);

      // Budget overlap
      const budgetMatch = ScoringEngine.calculateBudgetAffinity(5000, 10000, 7000, 12000);
      assert.strictEqual(budgetMatch, 1.0);

      const budgetNear = ScoringEngine.calculateBudgetAffinity(5000, 8000, 9000, 12000);
      assert.strictEqual(budgetNear, 0.8);
    });

    it('Scenario 5: Sleep dealbreaker filters opposing chronotypes when dealbreaker is toggled', () => {
      const userA = createMockProfile('user-a', { modality: 'MODALITY_2' });
      const candidateB = createMockProfile('user-b', { modality: 'MODALITY_1' });

      const lifeA = createMockLifestyle('user-a', {
        sleep: { ...defaultSleep, sleepPattern: 'EARLY_BIRD', isDealbreaker: true },
      });
      const lifeB = createMockLifestyle('user-b', {
        sleep: { ...defaultSleep, sleepPattern: 'NIGHT_OWL', isDealbreaker: false },
      });

      const result = ScoringEngine.calculateCompatibility(userA, lifeA, candidateB, lifeB);
      assert.strictEqual(result.dealbreakerFailed, true);
      assert.ok(result.failedReason?.includes('Sleep dealbreaker'));
    });
  });
});

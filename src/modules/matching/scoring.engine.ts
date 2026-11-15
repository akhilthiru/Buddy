import type {
  UserProfileSummary,
  LifestyleProfile,
  CompatibilityResult,
  VectorAlignmentDetail,
  AlignmentStatus,
  SleepVector,
  CleanlinessVector,
  DietaryVector,
  SocialVector,
  SubstancesVector,
  FinancialVector,
  WorkVector,
} from './matching.types.ts';
import {
  VECTOR_WEIGHTS,
  MODALITY_COMPATIBILITY_MATRIX,
  SLEEP_PATTERN_AFFINITY,
  SHIFT_SCHEDULE_AFFINITY,
  NOISE_SENSITIVITY_AFFINITY,
  CLEANLINESS_LEVEL_AFFINITY,
  KITCHEN_SINK_RULE_AFFINITY,
  MAID_PREFERENCE_AFFINITY,
  DIET_TYPE_AFFINITY,
  KITCHEN_POLICY_AFFINITY,
  GUEST_FREQUENCY_AFFINITY,
  OVERNIGHT_GUEST_POLICY_AFFINITY,
  PARTY_PREFERENCE_AFFINITY,
  SMOKING_HABIT_AFFINITY,
  ALCOHOL_HABIT_AFFINITY,
  RENT_PAYMENT_AFFINITY,
  AC_BILL_SPLIT_AFFINITY,
  GROCERY_TRACKING_AFFINITY,
  WORK_MODE_AFFINITY,
  CALL_FREQUENCY_AFFINITY,
  WORKSPACE_PREFERENCE_AFFINITY,
} from './constants/affinity-matrix.ts';

function getAlignmentStatus(score: number): AlignmentStatus {
  if (score >= 0.85) return 'HIGH_ALIGNMENT';
  if (score >= 0.50) return 'MODERATE_ALIGNMENT';
  return 'DISCUSSION_POINT';
}

function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export class ScoringEngine {
  /**
   * Evaluates hard dealbreakers. Returns null if all passed, or failure reason string.
   */
  static evaluateDealbreakers(
    user: UserProfileSummary,
    userLifestyle: LifestyleProfile,
    candidate: UserProfileSummary,
    candidateLifestyle: LifestyleProfile
  ): string | null {
    // 1. Gender Rule
    if (user.preferredGender !== 'ANY' && user.preferredGender !== candidate.gender) {
      return `Gender mismatch: User prefers ${user.preferredGender}, candidate is ${candidate.gender}`;
    }
    if (candidate.preferredGender !== 'ANY' && candidate.preferredGender !== user.gender) {
      return `Gender mismatch: Candidate prefers ${candidate.preferredGender}, user is ${user.gender}`;
    }

    // 2. Modality is treated as user status / housing preference, NOT a matching dealbreaker.
    // Matching is determined by compatibility preferences, location, and accommodation requirements.

    // 3. Vector Dealbreakers:
    // Dietary Dealbreaker: Strict non-veg conflict with Veg-Only Kitchen
    if (userLifestyle.dietary.isDealbreaker || candidateLifestyle.dietary.isDealbreaker) {
      const uDiet = userLifestyle.dietary;
      const cDiet = candidateLifestyle.dietary;
      if (
        (uDiet.kitchenPolicy === 'VEG_ONLY_KITCHEN' && cDiet.dietType === 'NON_VEGETARIAN') ||
        (cDiet.kitchenPolicy === 'VEG_ONLY_KITCHEN' && uDiet.dietType === 'NON_VEGETARIAN')
      ) {
        return 'Dietary dealbreaker: Veg-only kitchen conflict with non-vegetarian cooking';
      }
    }

    // Substances Dealbreaker: Strict Non-Smoker conflict
    if (userLifestyle.substances.isDealbreaker || candidateLifestyle.substances.isDealbreaker) {
      const uSub = userLifestyle.substances;
      const cSub = candidateLifestyle.substances;
      if (
        (uSub.smokingHabit === 'NON_SMOKER_STRICT' && cSub.smokingHabit !== 'NON_SMOKER_STRICT') ||
        (cSub.smokingHabit === 'NON_SMOKER_STRICT' && uSub.smokingHabit !== 'NON_SMOKER_STRICT')
      ) {
        return 'Substances dealbreaker: Strict non-smoker requirement violated';
      }
    }

    // Sleep Dealbreaker: Extreme chronotype divergence
    if (userLifestyle.sleep.isDealbreaker || candidateLifestyle.sleep.isDealbreaker) {
      const uSleep = userLifestyle.sleep;
      const cSleep = candidateLifestyle.sleep;
      if (
        (uSleep.sleepPattern === 'EARLY_BIRD' && cSleep.sleepPattern === 'NIGHT_OWL') ||
        (uSleep.sleepPattern === 'NIGHT_OWL' && cSleep.sleepPattern === 'EARLY_BIRD')
      ) {
        return 'Sleep dealbreaker: Opposing Early Bird and Night Owl chronotypes';
      }
    }

    // Cleanliness Dealbreaker
    if (userLifestyle.cleanliness.isDealbreaker || candidateLifestyle.cleanliness.isDealbreaker) {
      const uClean = userLifestyle.cleanliness;
      const cClean = candidateLifestyle.cleanliness;
      if (
        (uClean.cleanlinessLevel === 'METICULOUS' && cClean.cleanlinessLevel === 'RELAXED') ||
        (cClean.cleanlinessLevel === 'METICULOUS' && uClean.cleanlinessLevel === 'RELAXED')
      ) {
        return 'Cleanliness dealbreaker: Extreme divergence between Meticulous and Relaxed standards';
      }
    }

    // Hosting & Household Dealbreaker: Socially Active vs Quiet Sanctuary
    if (
      (userLifestyle.household?.isDealbreaker || candidateLifestyle.household?.isDealbreaker) &&
      userLifestyle.household &&
      candidateLifestyle.household
    ) {
      const uVibe = userLifestyle.household.householdVibe;
      const cVibe = candidateLifestyle.household.householdVibe;
      if (
        (uVibe === 'SOCIALLY_ACTIVE' && cVibe === 'QUIET_SANCTUARY') ||
        (cVibe === 'SOCIALLY_ACTIVE' && uVibe === 'QUIET_SANCTUARY')
      ) {
        return 'Hosting dealbreaker: Socially active household conflicts with quiet sanctuary preference';
      }
    }

    // Social Dealbreaker
    if (userLifestyle.social.isDealbreaker || candidateLifestyle.social.isDealbreaker) {
      const uSoc = userLifestyle.social;
      const cSoc = candidateLifestyle.social;
      if (
        (uSoc.guestFrequency === 'NO_GUESTS' && cSoc.partyPreference === 'FREQUENT') ||
        (cSoc.guestFrequency === 'NO_GUESTS' && uSoc.partyPreference === 'FREQUENT')
      ) {
        return 'Social dealbreaker: Sanctuary household conflict with frequent parties';
      }
    }

    // Financial Dealbreaker
    if (userLifestyle.financial.isDealbreaker || candidateLifestyle.financial.isDealbreaker) {
      const uFin = userLifestyle.financial;
      const cFin = candidateLifestyle.financial;
      if (
        (uFin.rentPaymentHabit === 'STRICT_1ST_OF_MONTH' && cFin.rentPaymentHabit === 'FLEXIBLE') ||
        (cFin.rentPaymentHabit === 'STRICT_1ST_OF_MONTH' && uFin.rentPaymentHabit === 'FLEXIBLE')
      ) {
        return 'Financial dealbreaker: Punctual rent payment requirement conflict';
      }
    }

    return null;
  }

  static calculateSleepAffinity(u: SleepVector, c: SleepVector): VectorAlignmentDetail {
    // US-09 Scenario 2: Opposing chronotypes evaluate to 0.25
    let score: number;
    if (
      (u.sleepPattern === 'EARLY_BIRD' && c.sleepPattern === 'NIGHT_OWL') ||
      (u.sleepPattern === 'NIGHT_OWL' && c.sleepPattern === 'EARLY_BIRD')
    ) {
      score = 0.25;
    } else {
      const patternScore = SLEEP_PATTERN_AFFINITY[u.sleepPattern][c.sleepPattern];
      const shiftScore = SHIFT_SCHEDULE_AFFINITY[u.shiftSchedule][c.shiftSchedule];
      const noiseScore = NOISE_SENSITIVITY_AFFINITY[u.noiseSensitivity][c.noiseSensitivity];
      score = roundToTwo(patternScore * 0.5 + shiftScore * 0.3 + noiseScore * 0.2);
    }

    const notes =
      score >= 0.85
        ? 'Harmonious sleep chronotype and work hours'
        : score >= 0.50
        ? 'Manageable schedule overlap; set expectations for quiet hours'
        : 'Discuss: Opposing sleep rhythms may cause weekday disturbance';

    return {
      affinityScore: score,
      status: getAlignmentStatus(score),
      userChoice: `${u.sleepPattern} (${u.shiftSchedule})`,
      candidateChoice: `${c.sleepPattern} (${c.shiftSchedule})`,
      notes,
    };
  }

  static calculateCleanlinessAffinity(u: CleanlinessVector, c: CleanlinessVector): VectorAlignmentDetail {
    const levelScore = CLEANLINESS_LEVEL_AFFINITY[u.cleanlinessLevel][c.cleanlinessLevel];
    const sinkScore = KITCHEN_SINK_RULE_AFFINITY[u.kitchenSinkRule][c.kitchenSinkRule];
    const maidScore = MAID_PREFERENCE_AFFINITY[u.maidPreference][c.maidPreference];

    const score = roundToTwo(levelScore * 0.45 + sinkScore * 0.35 + maidScore * 0.20);
    const notes =
      score >= 0.85
        ? 'Shared standards for daily chores and clean common spaces'
        : score >= 0.50
        ? 'Similar chore pacing; coordinate sink and weekend cleaning rota'
        : 'Discuss: Different expectations regarding dishwashing timing and maid hiring';

    return {
      affinityScore: score,
      status: getAlignmentStatus(score),
      userChoice: `${u.cleanlinessLevel}, ${u.kitchenSinkRule}`,
      candidateChoice: `${c.cleanlinessLevel}, ${c.kitchenSinkRule}`,
      notes,
    };
  }

  static calculateDietaryAffinity(u: DietaryVector, c: DietaryVector): VectorAlignmentDetail {
    const dietScore = DIET_TYPE_AFFINITY[u.dietType][c.dietType];
    const kitchenScore = KITCHEN_POLICY_AFFINITY[u.kitchenPolicy][c.kitchenPolicy];

    const score = roundToTwo(dietScore * 0.50 + kitchenScore * 0.50);
    const notes =
      score >= 0.85
        ? 'Compatible food lifestyle and kitchen utensil policy'
        : score >= 0.50
        ? 'Dietary difference with comfortable kitchen sharing arrangements'
        : 'Discuss: Separate cookware or storage may be required for comfort';

    return {
      affinityScore: score,
      status: getAlignmentStatus(score),
      userChoice: `${u.dietType} (${u.kitchenPolicy})`,
      candidateChoice: `${c.dietType} (${c.kitchenPolicy})`,
      notes,
    };
  }

  static calculateSocialAffinity(
    u: SocialVector,
    c: SocialVector,
    uHousehold?: import('./matching.types.ts').HouseholdPreferences,
    cHousehold?: import('./matching.types.ts').HouseholdPreferences
  ): VectorAlignmentDetail {
    const guestScore = GUEST_FREQUENCY_AFFINITY[u.guestFrequency][c.guestFrequency];
    const overnightScore = OVERNIGHT_GUEST_POLICY_AFFINITY[u.overnightGuestPolicy][c.overnightGuestPolicy];
    const partyScore = PARTY_PREFERENCE_AFFINITY[u.partyPreference][c.partyPreference];

    const baseScore = roundToTwo(guestScore * 0.35 + overnightScore * 0.40 + partyScore * 0.25);
    let finalScore = baseScore;

    if (uHousehold && cHousehold) {
      let vibeScore = 1.0;
      if (uHousehold.householdVibe === cHousehold.householdVibe) {
        vibeScore = 1.0;
      } else if (
        (uHousehold.householdVibe === 'SOCIALLY_ACTIVE' && cHousehold.householdVibe === 'QUIET_SANCTUARY') ||
        (uHousehold.householdVibe === 'QUIET_SANCTUARY' && cHousehold.householdVibe === 'SOCIALLY_ACTIVE')
      ) {
        vibeScore = 0.25;
      } else {
        vibeScore = 0.75;
      }
      finalScore = roundToTwo(baseScore * 0.70 + vibeScore * 0.30);
    }

    const notes =
      finalScore >= 0.85
        ? 'Well-aligned expectations on hosting guests and personal quiet time'
        : finalScore >= 0.50
        ? 'Moderate social overlap; establish common ground on weekend hosting'
        : 'Discuss: Differing comfort levels with overnight visitors or home parties';

    const uExtra = uHousehold ? ` [${uHousehold.householdVibe}]` : '';
    const cExtra = cHousehold ? ` [${cHousehold.householdVibe}]` : '';

    return {
      affinityScore: finalScore,
      status: getAlignmentStatus(finalScore),
      userChoice: `${u.guestFrequency}, ${u.overnightGuestPolicy}${uExtra}`,
      candidateChoice: `${c.guestFrequency}, ${c.overnightGuestPolicy}${cExtra}`,
      notes,
    };
  }

  static calculateSubstancesAffinity(u: SubstancesVector, c: SubstancesVector): VectorAlignmentDetail {
    const smokingScore = SMOKING_HABIT_AFFINITY[u.smokingHabit][c.smokingHabit];
    const alcoholScore = ALCOHOL_HABIT_AFFINITY[u.alcoholHabit][c.alcoholHabit];

    const score = roundToTwo(smokingScore * 0.60 + alcoholScore * 0.40);
    const notes =
      score >= 0.85
        ? 'Complete harmony on smoking and alcohol habits'
        : score >= 0.50
        ? 'Compatible with clear balcony/outdoor smoking boundary'
        : 'Discuss: Incompatible smoking or substance tolerance standards';

    return {
      affinityScore: score,
      status: getAlignmentStatus(score),
      userChoice: `${u.smokingHabit}, ${u.alcoholHabit}`,
      candidateChoice: `${c.smokingHabit}, ${c.alcoholHabit}`,
      notes,
    };
  }

  static calculateFinancialAffinity(u: FinancialVector, c: FinancialVector): VectorAlignmentDetail {
    const rentScore = RENT_PAYMENT_AFFINITY[u.rentPaymentHabit][c.rentPaymentHabit];
    const acScore = AC_BILL_SPLIT_AFFINITY[u.acBillSplit][c.acBillSplit];
    const groceryScore = GROCERY_TRACKING_AFFINITY[u.groceryTracking][c.groceryTracking];

    const score = roundToTwo(rentScore * 0.50 + acScore * 0.30 + groceryScore * 0.20);
    const notes =
      score >= 0.85
        ? 'Aligned financial discipline on rent settlement dates and utility splitting'
        : score >= 0.50
        ? 'Agree on settlement date and utility app conventions early'
        : 'Discuss: Different approaches to rent timeliness or AC electricity share';

    return {
      affinityScore: score,
      status: getAlignmentStatus(score),
      userChoice: `${u.rentPaymentHabit}, ${u.acBillSplit}`,
      candidateChoice: `${c.rentPaymentHabit}, ${c.acBillSplit}`,
      notes,
    };
  }

  static calculateWorkAffinity(u: WorkVector, c: WorkVector): VectorAlignmentDetail {
    const modeScore = WORK_MODE_AFFINITY[u.workMode][c.workMode];
    const callScore = CALL_FREQUENCY_AFFINITY[u.callFrequency][c.callFrequency];
    const workspaceScore = WORKSPACE_PREFERENCE_AFFINITY[u.workspacePreference][c.workspacePreference];

    const score = roundToTwo(modeScore * 0.40 + callScore * 0.40 + workspaceScore * 0.20);
    const notes =
      score >= 0.85
        ? 'Complementary daytime occupancy and call habits'
        : score >= 0.50
        ? 'Manageable daytime overlap; coordinate workspace boundaries'
        : 'Discuss: High call volume during remote work may require dedicated door-shut policy';

    return {
      affinityScore: score,
      status: getAlignmentStatus(score),
      userChoice: `${u.workMode}, ${u.callFrequency} calls`,
      candidateChoice: `${c.workMode}, ${c.callFrequency} calls`,
      notes,
    };
  }

  /**
   * Main deterministic compatibility scoring function.
   * Total Score = sum(W_k * S_k) * 100
   */
  static calculateCompatibility(
    user: UserProfileSummary,
    userLifestyle: LifestyleProfile,
    candidate: UserProfileSummary,
    candidateLifestyle: LifestyleProfile
  ): CompatibilityResult {
    const dealbreakerReason = this.evaluateDealbreakers(
      user,
      userLifestyle,
      candidate,
      candidateLifestyle
    );

    const sleep = this.calculateSleepAffinity(userLifestyle.sleep, candidateLifestyle.sleep);
    const cleanliness = this.calculateCleanlinessAffinity(
      userLifestyle.cleanliness,
      candidateLifestyle.cleanliness
    );
    const dietary = this.calculateDietaryAffinity(userLifestyle.dietary, candidateLifestyle.dietary);
    const social = this.calculateSocialAffinity(
      userLifestyle.social,
      candidateLifestyle.social,
      userLifestyle.household,
      candidateLifestyle.household
    );
    const substances = this.calculateSubstancesAffinity(
      userLifestyle.substances,
      candidateLifestyle.substances
    );
    const financial = this.calculateFinancialAffinity(
      userLifestyle.financial,
      candidateLifestyle.financial
    );
    const work = this.calculateWorkAffinity(userLifestyle.work, candidateLifestyle.work);

    const weightedScore =
      sleep.affinityScore * VECTOR_WEIGHTS.sleep +
      cleanliness.affinityScore * VECTOR_WEIGHTS.cleanliness +
      dietary.affinityScore * VECTOR_WEIGHTS.dietary +
      social.affinityScore * VECTOR_WEIGHTS.social +
      substances.affinityScore * VECTOR_WEIGHTS.substances +
      financial.affinityScore * VECTOR_WEIGHTS.financial +
      work.affinityScore * VECTOR_WEIGHTS.work;

    const overallScore = Math.min(100, Math.max(0, Math.round(weightedScore * 100)));

    const locationAffinity = this.calculateLocationAffinity(
      user.preferredSuburbs,
      candidate.preferredSuburbs
    );
    const budgetAffinity = this.calculateBudgetAffinity(
      user.minBudget,
      user.maxBudget,
      candidate.minBudget,
      candidate.maxBudget
    );

    return {
      overallScore,
      dealbreakerFailed: dealbreakerReason !== null,
      failedReason: dealbreakerReason || undefined,
      locationAffinity,
      budgetAffinity,
      vectors: {
        sleep,
        cleanliness,
        dietary,
        social,
        substances,
        financial,
        work,
      },
    };
  }

  /**
   * Calculates location affinity based on overlapping preferred suburbs.
   * Returns 1.0 if overlapping or unspecified, 0.5 if disjoint.
   */
  static calculateLocationAffinity(
    userSuburbs?: string[],
    candidateSuburbs?: string[]
  ): number {
    if (!userSuburbs || userSuburbs.length === 0 || !candidateSuburbs || candidateSuburbs.length === 0) {
      return 1.0;
    }
    const candidateSet = new Set(candidateSuburbs);
    const hasOverlap = userSuburbs.some((s) => candidateSet.has(s));
    return hasOverlap ? 1.0 : 0.5;
  }

  /**
   * Calculates budget affinity based on budget range overlap.
   */
  static calculateBudgetAffinity(
    userMin?: number,
    userMax?: number,
    candidateMin?: number,
    candidateMax?: number
  ): number {
    if (!userMin || !userMax || !candidateMin || !candidateMax) {
      return 1.0;
    }
    const overlapMin = Math.max(userMin, candidateMin);
    const overlapMax = Math.min(userMax, candidateMax);
    if (overlapMin <= overlapMax) {
      return 1.0;
    }
    const gap = overlapMin - overlapMax;
    if (gap <= 2000) return 0.8;
    if (gap <= 4000) return 0.6;
    return 0.3;
  }

  /**
   * High-throughput batch scoring helper for discovery feeds.
   * Evaluates dealbreakers and ranks eligible candidates by overall score,
   * tie-breaking by location & budget affinity.
   */
  static rankBatch(
    user: UserProfileSummary,
    userLifestyle: LifestyleProfile,
    candidates: Array<{ profile: UserProfileSummary; lifestyle: LifestyleProfile }>
  ): Array<{ candidate: UserProfileSummary; result: CompatibilityResult }> {
    const scored: Array<{ candidate: UserProfileSummary; result: CompatibilityResult }> = [];

    for (const c of candidates) {
      const result = this.calculateCompatibility(user, userLifestyle, c.profile, c.lifestyle);
      if (!result.dealbreakerFailed) {
        scored.push({ candidate: c.profile, result });
      }
    }

    // Sort descending by overall compatibility score, with location/budget tie-breaking
    scored.sort((a, b) => {
      const scoreDiff = b.result.overallScore - a.result.overallScore;
      if (scoreDiff !== 0) return scoreDiff;
      const bBonus = (b.result.locationAffinity ?? 1.0) + (b.result.budgetAffinity ?? 1.0);
      const aBonus = (a.result.locationAffinity ?? 1.0) + (a.result.budgetAffinity ?? 1.0);
      return bBonus - aBonus;
    });
    return scored;
  }
}

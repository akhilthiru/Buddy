import type {
  SleepPattern,
  ShiftSchedule,
  NoiseSensitivity,
  CleanlinessLevel,
  KitchenSinkRule,
  MaidPreference,
  DietType,
  KitchenPolicy,
  GuestFrequency,
  OvernightGuestPolicy,
  PartyPreference,
  SmokingHabit,
  AlcoholHabit,
  RentPaymentHabit,
  AcBillSplit,
  GroceryTracking,
  WorkMode,
  CallFrequency,
  WorkspacePreference,
  DiscoveryModality,
} from '../matching.types.ts';

export const VECTOR_WEIGHTS = {
  sleep: 0.20,
  cleanliness: 0.20,
  dietary: 0.15,
  social: 0.15,
  substances: 0.15,
  financial: 0.10,
  work: 0.05,
} as const;

// Ensure weights sum strictly to 1.0
const sumWeights = Object.values(VECTOR_WEIGHTS).reduce((acc, w) => acc + w, 0);
if (Math.abs(sumWeights - 1.0) > 0.0001) {
  throw new Error(`Vector weights sum must equal 1.0, got ${sumWeights}`);
}

/**
 * Modality Compatibility Matrix (PRD Rule 4)
 * M1 (Has Room): matches M2, M3
 * M2 (Seeking Room): matches M1
 * M3 (Relocating): matches M1, M3, M4
 * M4 (Team Up First): matches M3, M4
 */
export const MODALITY_COMPATIBILITY_MATRIX: Record<DiscoveryModality, Record<DiscoveryModality, boolean>> = {
  MODALITY_1: {
    MODALITY_1: false,
    MODALITY_2: true,
    MODALITY_3: true,
    MODALITY_4: false,
  },
  MODALITY_2: {
    MODALITY_1: true,
    MODALITY_2: false,
    MODALITY_3: false,
    MODALITY_4: false,
  },
  MODALITY_3: {
    MODALITY_1: true,
    MODALITY_2: false,
    MODALITY_3: true,
    MODALITY_4: true,
  },
  MODALITY_4: {
    MODALITY_1: false,
    MODALITY_2: false,
    MODALITY_3: true,
    MODALITY_4: true,
  },
};

/**
 * Sleep Schedule Affinity
 * Sleep Pattern (50%), Shift Schedule (30%), Noise Sensitivity (20%)
 */
export const SLEEP_PATTERN_AFFINITY: Record<SleepPattern, Record<SleepPattern, number>> = {
  EARLY_BIRD: {
    EARLY_BIRD: 1.0,
    NIGHT_OWL: 0.25, // Scenario 2: Divergent habits evaluated as 0.25
    FLEXIBLE: 0.85,
  },
  NIGHT_OWL: {
    EARLY_BIRD: 0.25,
    NIGHT_OWL: 1.0,
    FLEXIBLE: 0.85,
  },
  FLEXIBLE: {
    EARLY_BIRD: 0.85,
    NIGHT_OWL: 0.85,
    FLEXIBLE: 1.0,
  },
};

export const SHIFT_SCHEDULE_AFFINITY: Record<ShiftSchedule, Record<ShiftSchedule, number>> = {
  NORMAL_DAY: {
    NORMAL_DAY: 1.0,
    UK_SHIFT: 0.70,
    US_SHIFT: 0.25,
    ROTATIONAL_NIGHT: 0.20,
  },
  UK_SHIFT: {
    NORMAL_DAY: 0.70,
    UK_SHIFT: 1.0,
    US_SHIFT: 0.45,
    ROTATIONAL_NIGHT: 0.35,
  },
  US_SHIFT: {
    NORMAL_DAY: 0.25,
    UK_SHIFT: 0.45,
    US_SHIFT: 1.0,
    ROTATIONAL_NIGHT: 0.75,
  },
  ROTATIONAL_NIGHT: {
    NORMAL_DAY: 0.20,
    UK_SHIFT: 0.35,
    US_SHIFT: 0.75,
    ROTATIONAL_NIGHT: 1.0,
  },
};

export const NOISE_SENSITIVITY_AFFINITY: Record<NoiseSensitivity, Record<NoiseSensitivity, number>> = {
  HEAVY_SLEEPER: {
    HEAVY_SLEEPER: 1.0,
    LIGHT_SLEEPER: 0.75,
  },
  LIGHT_SLEEPER: {
    HEAVY_SLEEPER: 0.75,
    LIGHT_SLEEPER: 0.90,
  },
};

/**
 * Cleanliness & Hygiene Affinity
 * Cleanliness Level (45%), Sink Rule (35%), Maid (20%)
 */
export const CLEANLINESS_LEVEL_AFFINITY: Record<CleanlinessLevel, Record<CleanlinessLevel, number>> = {
  METICULOUS: {
    METICULOUS: 1.0,
    MODERATE: 0.65,
    RELAXED: 0.20,
  },
  MODERATE: {
    METICULOUS: 0.65,
    MODERATE: 1.0,
    RELAXED: 0.65,
  },
  RELAXED: {
    METICULOUS: 0.20,
    MODERATE: 0.65,
    RELAXED: 1.0,
  },
};

export const KITCHEN_SINK_RULE_AFFINITY: Record<KitchenSinkRule, Record<KitchenSinkRule, number>> = {
  IMMEDIATE_WASH: {
    IMMEDIATE_WASH: 1.0,
    SAME_DAY: 0.65,
    NEXT_DAY: 0.15,
  },
  SAME_DAY: {
    IMMEDIATE_WASH: 0.65,
    SAME_DAY: 1.0,
    NEXT_DAY: 0.60,
  },
  NEXT_DAY: {
    IMMEDIATE_WASH: 0.15,
    SAME_DAY: 0.60,
    NEXT_DAY: 1.0,
  },
};

export const MAID_PREFERENCE_AFFINITY: Record<MaidPreference, Record<MaidPreference, number>> = {
  MUST_HAVE_MAID: {
    MUST_HAVE_MAID: 1.0,
    OPEN_TO_MAID: 0.80,
    DIY_ONLY: 0.20,
  },
  OPEN_TO_MAID: {
    MUST_HAVE_MAID: 0.80,
    OPEN_TO_MAID: 1.0,
    DIY_ONLY: 0.75,
  },
  DIY_ONLY: {
    MUST_HAVE_MAID: 0.20,
    OPEN_TO_MAID: 0.75,
    DIY_ONLY: 1.0,
  },
};

/**
 * Dietary & Kitchen Affinity
 * Diet Type (50%), Kitchen Policy (50%)
 */
export const DIET_TYPE_AFFINITY: Record<DietType, Record<DietType, number>> = {
  STRICT_VEGETARIAN: {
    STRICT_VEGETARIAN: 1.0,
    EGGETARIAN: 0.80,
    NON_VEGETARIAN: 0.50,
    HALAL_ONLY: 0.50,
  },
  EGGETARIAN: {
    STRICT_VEGETARIAN: 0.80,
    EGGETARIAN: 1.0,
    NON_VEGETARIAN: 0.75,
    HALAL_ONLY: 0.70,
  },
  NON_VEGETARIAN: {
    STRICT_VEGETARIAN: 0.50,
    EGGETARIAN: 0.75,
    NON_VEGETARIAN: 1.0,
    HALAL_ONLY: 0.70,
  },
  HALAL_ONLY: {
    STRICT_VEGETARIAN: 0.50,
    EGGETARIAN: 0.70,
    NON_VEGETARIAN: 0.70,
    HALAL_ONLY: 1.0,
  },
};

export const KITCHEN_POLICY_AFFINITY: Record<KitchenPolicy, Record<KitchenPolicy, number>> = {
  VEG_ONLY_KITCHEN: {
    VEG_ONLY_KITCHEN: 1.0,
    SEPARATE_UTENSILS_OK: 0.40,
    NO_RESTRICTIONS: 0.10,
  },
  SEPARATE_UTENSILS_OK: {
    VEG_ONLY_KITCHEN: 0.40,
    SEPARATE_UTENSILS_OK: 1.0,
    NO_RESTRICTIONS: 0.75,
  },
  NO_RESTRICTIONS: {
    VEG_ONLY_KITCHEN: 0.10,
    SEPARATE_UTENSILS_OK: 0.75,
    NO_RESTRICTIONS: 1.0,
  },
};

/**
 * Social Habits & Guests
 * Guest Frequency (35%), Overnight Policy (40%), Party (25%)
 */
export const GUEST_FREQUENCY_AFFINITY: Record<GuestFrequency, Record<GuestFrequency, number>> = {
  NO_GUESTS: {
    NO_GUESTS: 1.0,
    OCCASIONAL_FRIENDS: 0.60,
    FREQUENT_GUESTS: 0.15,
  },
  OCCASIONAL_FRIENDS: {
    NO_GUESTS: 0.60,
    OCCASIONAL_FRIENDS: 1.0,
    FREQUENT_GUESTS: 0.65,
  },
  FREQUENT_GUESTS: {
    NO_GUESTS: 0.15,
    OCCASIONAL_FRIENDS: 0.65,
    FREQUENT_GUESTS: 1.0,
  },
};

export const OVERNIGHT_GUEST_POLICY_AFFINITY: Record<OvernightGuestPolicy, Record<OvernightGuestPolicy, number>> = {
  NO_OVERNIGHT: {
    NO_OVERNIGHT: 1.0,
    SAME_GENDER_ONLY: 0.60,
    PARTNERS_ALLOWED: 0.20,
    FLEXIBLE_WITH_NOTICE: 0.40,
  },
  SAME_GENDER_ONLY: {
    NO_OVERNIGHT: 0.60,
    SAME_GENDER_ONLY: 1.0,
    PARTNERS_ALLOWED: 0.50,
    FLEXIBLE_WITH_NOTICE: 0.75,
  },
  PARTNERS_ALLOWED: {
    NO_OVERNIGHT: 0.20,
    SAME_GENDER_ONLY: 0.50,
    PARTNERS_ALLOWED: 1.0,
    FLEXIBLE_WITH_NOTICE: 0.85,
  },
  FLEXIBLE_WITH_NOTICE: {
    NO_OVERNIGHT: 0.40,
    SAME_GENDER_ONLY: 0.75,
    PARTNERS_ALLOWED: 0.85,
    FLEXIBLE_WITH_NOTICE: 1.0,
  },
};

export const PARTY_PREFERENCE_AFFINITY: Record<PartyPreference, Record<PartyPreference, number>> = {
  NEVER_AT_HOME: {
    NEVER_AT_HOME: 1.0,
    OCCASIONAL_WEEKENDS: 0.60,
    FREQUENT: 0.10,
  },
  OCCASIONAL_WEEKENDS: {
    NEVER_AT_HOME: 0.60,
    OCCASIONAL_WEEKENDS: 1.0,
    FREQUENT: 0.60,
  },
  FREQUENT: {
    NEVER_AT_HOME: 0.10,
    OCCASIONAL_WEEKENDS: 0.60,
    FREQUENT: 1.0,
  },
};

/**
 * Substances (Smoking 60%, Alcohol 40%)
 */
export const SMOKING_HABIT_AFFINITY: Record<SmokingHabit, Record<SmokingHabit, number>> = {
  NON_SMOKER_STRICT: {
    NON_SMOKER_STRICT: 1.0,
    BALCONY_ONLY: 0.50,
    SMOKER: 0.05,
  },
  BALCONY_ONLY: {
    NON_SMOKER_STRICT: 0.50,
    BALCONY_ONLY: 1.0,
    SMOKER: 0.75,
  },
  SMOKER: {
    NON_SMOKER_STRICT: 0.05,
    BALCONY_ONLY: 0.75,
    SMOKER: 1.0,
  },
};

export const ALCOHOL_HABIT_AFFINITY: Record<AlcoholHabit, Record<AlcoholHabit, number>> = {
  TEETOTALER: {
    TEETOTALER: 1.0,
    SOCIAL_DRINKER: 0.65,
    REGULAR: 0.20,
  },
  SOCIAL_DRINKER: {
    TEETOTALER: 0.65,
    SOCIAL_DRINKER: 1.0,
    REGULAR: 0.75,
  },
  REGULAR: {
    TEETOTALER: 0.20,
    SOCIAL_DRINKER: 0.75,
    REGULAR: 1.0,
  },
};

/**
 * Financial Discipline
 * Rent payment (50%), AC split (30%), Grocery tracking (20%)
 */
export const RENT_PAYMENT_AFFINITY: Record<RentPaymentHabit, Record<RentPaymentHabit, number>> = {
  STRICT_1ST_OF_MONTH: {
    STRICT_1ST_OF_MONTH: 1.0,
    BEFORE_5TH: 0.75,
    FLEXIBLE: 0.25,
  },
  BEFORE_5TH: {
    STRICT_1ST_OF_MONTH: 0.75,
    BEFORE_5TH: 1.0,
    FLEXIBLE: 0.60,
  },
  FLEXIBLE: {
    STRICT_1ST_OF_MONTH: 0.25,
    BEFORE_5TH: 0.60,
    FLEXIBLE: 1.0,
  },
};

export const AC_BILL_SPLIT_AFFINITY: Record<AcBillSplit, Record<AcBillSplit, number>> = {
  EQUAL_SPLIT: {
    EQUAL_SPLIT: 1.0,
    PROPORTIONAL_TO_USAGE: 0.50,
  },
  PROPORTIONAL_TO_USAGE: {
    EQUAL_SPLIT: 0.50,
    PROPORTIONAL_TO_USAGE: 1.0,
  },
};

export const GROCERY_TRACKING_AFFINITY: Record<GroceryTracking, Record<GroceryTracking, number>> = {
  SPLITWISE_APP: {
    SPLITWISE_APP: 1.0,
    INDIVIDUAL_PROVISIONS: 0.55,
    ROTATIONAL_PAYMENT: 0.65,
  },
  INDIVIDUAL_PROVISIONS: {
    SPLITWISE_APP: 0.55,
    INDIVIDUAL_PROVISIONS: 1.0,
    ROTATIONAL_PAYMENT: 0.50,
  },
  ROTATIONAL_PAYMENT: {
    SPLITWISE_APP: 0.65,
    INDIVIDUAL_PROVISIONS: 0.50,
    ROTATIONAL_PAYMENT: 1.0,
  },
};

/**
 * Work Rhythm
 * Work Mode (40%), Call Frequency (40%), Workspace (20%)
 */
export const WORK_MODE_AFFINITY: Record<WorkMode, Record<WorkMode, number>> = {
  OFFICE_DAILY: {
    OFFICE_DAILY: 1.0,
    HYBRID: 0.85,
    '100_PERCENT_REMOTE': 0.90, // complementary usage
  },
  HYBRID: {
    OFFICE_DAILY: 0.85,
    HYBRID: 1.0,
    '100_PERCENT_REMOTE': 0.80,
  },
  '100_PERCENT_REMOTE': {
    OFFICE_DAILY: 0.90,
    HYBRID: 0.80,
    '100_PERCENT_REMOTE': 1.0,
  },
};

export const CALL_FREQUENCY_AFFINITY: Record<CallFrequency, Record<CallFrequency, number>> = {
  LOW: {
    LOW: 1.0,
    HIGH: 0.50,
  },
  HIGH: {
    LOW: 0.50,
    HIGH: 0.70,
  },
};

export const WORKSPACE_PREFERENCE_AFFINITY: Record<WorkspacePreference, Record<WorkspacePreference, number>> = {
  PRIVATE_ROOM_DESK: {
    PRIVATE_ROOM_DESK: 1.0,
    LIVING_ROOM_DESK_OK: 0.80,
  },
  LIVING_ROOM_DESK_OK: {
    PRIVATE_ROOM_DESK: 0.80,
    LIVING_ROOM_DESK_OK: 1.0,
  },
};

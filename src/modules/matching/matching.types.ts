export type UserStatus = 'ACTIVE' | 'QUARANTINED' | 'BANNED' | 'SUSPENDED';
export type GenderType = 'MALE' | 'FEMALE' | 'NON_BINARY';
export type PreferredGenderType = 'MALE' | 'FEMALE' | 'ANY';

export type DiscoveryModality =
  | 'MODALITY_1' // Has room available, seeking flatmate
  | 'MODALITY_2' // Seeking accommodation and flatmate
  | 'MODALITY_3' // Has flat, wants to relocate with new flatmate
  | 'MODALITY_4'; // Seeking compatible person first to search together

export type MoveInFlexibility = 'WITHIN_15_DAYS' | 'ONE_MONTH' | 'TWO_MONTHS' | 'FLEXIBLE';
export type VerificationBadge = 'UNVERIFIED' | 'VERIFIED_STUDENT' | 'VERIFIED_PROFESSIONAL';

export type TrivandrumSuburb =
  | 'KAZHAKKOOTTAM'
  | 'KARIAVATTOM'
  | 'SREEKARYAM'
  | 'ULLOOR'
  | 'PATTOM'
  | 'KOWDIAR'
  | 'MANACAUD'
  | 'VELLAYAMBALAM';

// 7 Vectors Enums
export type SleepPattern = 'EARLY_BIRD' | 'NIGHT_OWL' | 'FLEXIBLE';
export type ShiftSchedule = 'NORMAL_DAY' | 'US_SHIFT' | 'UK_SHIFT' | 'ROTATIONAL_NIGHT';
export type NoiseSensitivity = 'LIGHT_SLEEPER' | 'HEAVY_SLEEPER';

export type CleanlinessLevel = 'RELAXED' | 'MODERATE' | 'METICULOUS';
export type KitchenSinkRule = 'IMMEDIATE_WASH' | 'SAME_DAY' | 'NEXT_DAY';
export type MaidPreference = 'MUST_HAVE_MAID' | 'OPEN_TO_MAID' | 'DIY_ONLY';

export type DietType = 'STRICT_VEGETARIAN' | 'EGGETARIAN' | 'NON_VEGETARIAN' | 'HALAL_ONLY';
export type KitchenPolicy = 'VEG_ONLY_KITCHEN' | 'SEPARATE_UTENSILS_OK' | 'NO_RESTRICTIONS';

export type GuestFrequency = 'NO_GUESTS' | 'OCCASIONAL_FRIENDS' | 'FREQUENT_GUESTS';
export type OvernightGuestPolicy = 'NO_OVERNIGHT' | 'SAME_GENDER_ONLY' | 'PARTNERS_ALLOWED' | 'FLEXIBLE_WITH_NOTICE';
export type PartyPreference = 'NEVER_AT_HOME' | 'OCCASIONAL_WEEKENDS' | 'FREQUENT';

export type SmokingHabit = 'NON_SMOKER_STRICT' | 'BALCONY_ONLY' | 'SMOKER';
export type AlcoholHabit = 'TEETOTALER' | 'SOCIAL_DRINKER' | 'REGULAR';

export type RentPaymentHabit = 'STRICT_1ST_OF_MONTH' | 'BEFORE_5TH' | 'FLEXIBLE';
export type AcBillSplit = 'EQUAL_SPLIT' | 'PROPORTIONAL_TO_USAGE';
export type GroceryTracking = 'SPLITWISE_APP' | 'INDIVIDUAL_PROVISIONS' | 'ROTATIONAL_PAYMENT';

export type WorkMode = 'OFFICE_DAILY' | 'HYBRID' | '100_PERCENT_REMOTE';
export type CallFrequency = 'LOW' | 'HIGH';
export type WorkspacePreference = 'PRIVATE_ROOM_DESK' | 'LIVING_ROOM_DESK_OK';

export interface SleepVector {
  sleepPattern: SleepPattern;
  shiftSchedule: ShiftSchedule;
  noiseSensitivity: NoiseSensitivity;
  isDealbreaker: boolean;
}

export interface CleanlinessVector {
  cleanlinessLevel: CleanlinessLevel;
  kitchenSinkRule: KitchenSinkRule;
  maidPreference: MaidPreference;
  isDealbreaker: boolean;
}

export interface DietaryVector {
  dietType: DietType;
  kitchenPolicy: KitchenPolicy;
  isDealbreaker: boolean;
}

export interface SocialVector {
  guestFrequency: GuestFrequency;
  overnightGuestPolicy: OvernightGuestPolicy;
  partyPreference: PartyPreference;
  isDealbreaker: boolean;
}

export interface SubstancesVector {
  smokingHabit: SmokingHabit;
  alcoholHabit: AlcoholHabit;
  isDealbreaker: boolean;
}

export interface FinancialVector {
  rentPaymentHabit: RentPaymentHabit;
  acBillSplit: AcBillSplit;
  groceryTracking: GroceryTracking;
  isDealbreaker: boolean;
}

export interface WorkVector {
  workMode: WorkMode;
  callFrequency: CallFrequency;
  workspacePreference: WorkspacePreference;
  isDealbreaker: boolean;
}

export interface LifestyleProfile {
  userId: string;
  sleep: SleepVector;
  cleanliness: CleanlinessVector;
  dietary: DietaryVector;
  social: SocialVector;
  substances: SubstancesVector;
  financial: FinancialVector;
  work: WorkVector;
}

export interface UserProfileSummary {
  userId: string;
  displayName: string;
  gender: GenderType;
  preferredGender: PreferredGenderType;
  modality: DiscoveryModality;
  minBudget: number;
  maxBudget: number;
  status?: UserStatus;
  preferredSuburbs?: TrivandrumSuburb[];
  verificationBadge?: VerificationBadge;
}

export type AlignmentStatus = 'HIGH_ALIGNMENT' | 'MODERATE_ALIGNMENT' | 'DISCUSSION_POINT';

export interface VectorAlignmentDetail {
  affinityScore: number;
  status: AlignmentStatus;
  userChoice: string;
  candidateChoice: string;
  notes: string;
}

export interface CompatibilityResult {
  overallScore: number; // 0 - 100
  dealbreakerFailed: boolean;
  failedReason?: string;
  locationAffinity?: number;
  budgetAffinity?: number;
  vectors: {
    sleep: VectorAlignmentDetail;
    cleanliness: VectorAlignmentDetail;
    dietary: VectorAlignmentDetail;
    social: VectorAlignmentDetail;
    substances: VectorAlignmentDetail;
    financial: VectorAlignmentDetail;
    work: VectorAlignmentDetail;
  };
}

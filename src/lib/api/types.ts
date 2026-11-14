/**
 * Flatmate Type-Safe API Types
 * Generated directly from OpenAPI 3.1 specification (docs/architecture/api-spec.yaml).
 * Adheres strictly to RFC 7807 problem details and Trivandrum-specific domain types.
 */

// ============================================================================
// RFC 7807 PROBLEM DETAILS ERROR MODEL
// ============================================================================

export interface InvalidParamDetail {
  name: string;
  reason: string;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  invalidParams?: InvalidParamDetail[];
}

export interface GenericSuccessResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// DOMAIN ENUMS
// ============================================================================

export type DiscoveryModalityEnum =
  | 'MODALITY_1' // Has room available, seeking flatmate
  | 'MODALITY_2' // Seeking accommodation and flatmate
  | 'MODALITY_3' // Has flat, wants to relocate with new flatmate
  | 'MODALITY_4'; // Seeking compatible person first to search together

export type TrivandrumSuburbEnum =
  | 'KAZHAKKOOTTAM'
  | 'KARIAVATTOM'
  | 'SREEKARYAM'
  | 'ULLOOR'
  | 'PATTOM'
  | 'KOWDIAR'
  | 'MANACAUD'
  | 'VELLAYAMBALAM';

export type UserGenderEnum = 'MALE' | 'FEMALE' | 'NON_BINARY';
export type PreferredGenderEnum = 'MALE' | 'FEMALE' | 'ANY';

export type MoveInFlexibilityEnum =
  | 'WITHIN_15_DAYS'
  | 'ONE_MONTH'
  | 'TWO_MONTHS'
  | 'FLEXIBLE';

export type VerificationBadgeEnum =
  | 'UNVERIFIED'
  | 'VERIFIED_STUDENT'
  | 'VERIFIED_PROFESSIONAL';

export type SwipeActionEnum = 'LIKE' | 'PASS' | 'SUPERLIKE';

export type MessageStatusEnum = 'SENT' | 'DELIVERED' | 'READ';

export type ConversationStatusEnum = 'ACTIVE' | 'ARCHIVED' | 'TERMINATED';

export type RoomTypeEnum = 'PRIVATE_ROOM' | 'SHARED_ROOM';

export type BathroomTypeEnum = 'ATTACHED_PRIVATE' | 'SHARED';

export type ReportCategoryEnum =
  | 'HARASSMENT_OR_ABUSE'
  | 'SPAM_OR_COMMERCIAL_BROKER'
  | 'FAKE_PROFILE_IMPERSONATION'
  | 'MORAL_POLICING_OR_DISCRIMINATION';

// ============================================================================
// AUTHENTICATION & IDENTITY SCHEMAS
// ============================================================================

export interface SendOtpRequest {
  phoneNumber: string; // E.164 pattern: ^\+91[6-9]\d{9}$
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  expiresInSeconds: number;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string; // 6 numeric digits
}

export interface AuthUserSession {
  id: string;
  status: 'ACTIVE' | 'QUARANTINED' | 'BANNED' | 'SUSPENDED';
  isOnboardingCompleted: boolean;
}

export interface AuthSessionResponse {
  accessToken: string;
  expiresIn: number;
  isNewUser: boolean;
  user: AuthUserSession;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface InstitutionVerifyRequest {
  institutionEmail: string;
}

export interface InstitutionConfirmRequest {
  token: string;
}

export interface InstitutionVerificationResult {
  verified: boolean;
  badge: 'VERIFIED_STUDENT' | 'VERIFIED_PROFESSIONAL';
  institutionName: string;
}

// ============================================================================
// PROFILE SCHEMAS
// ============================================================================

export interface ProfilePhotoItem {
  id: string;
  photoUrl: string;
  orderIndex: number;
  isPrimary: boolean;
}

export interface UserProfileResponse {
  id: string;
  userId: string;
  displayName: string;
  gender: UserGenderEnum;
  age: number;
  occupation: string;
  collegeOrCompany?: string;
  bio?: string;
  modality: DiscoveryModalityEnum;
  preferredGender: PreferredGenderEnum;
  minBudget: number;
  maxBudget: number;
  moveInFlexibility?: MoveInFlexibilityEnum;
  preferredSuburbs: TrivandrumSuburbEnum[];
  verificationBadge: VerificationBadgeEnum;
  avatarUrl?: string;
  photos: ProfilePhotoItem[];
  isOnboardingCompleted: boolean;
}

export interface UpdateProfileRequest {
  displayName: string;
  gender: UserGenderEnum;
  birthDate: string; // YYYY-MM-DD
  occupation: string;
  collegeOrCompany?: string;
  bio?: string;
  modality: DiscoveryModalityEnum;
  preferredGender?: PreferredGenderEnum;
  minBudget: number;
  maxBudget: number;
  moveInFlexibility?: MoveInFlexibilityEnum;
  preferredSuburbs: TrivandrumSuburbEnum[];
}

// ============================================================================
// 7-VECTOR LIFESTYLE MODELS
// ============================================================================

export interface SleepVector {
  pattern: 'EARLY_BIRD' | 'NIGHT_OWL' | 'FLEXIBLE';
  shiftSchedule: 'NORMAL_DAY' | 'US_SHIFT' | 'UK_SHIFT' | 'ROTATIONAL_NIGHT';
  noiseSensitivity: 'LIGHT_SLEEPER' | 'HEAVY_SLEEPER';
  isDealbreaker: boolean;
}

export interface CleanlinessVector {
  level: 'RELAXED' | 'MODERATE' | 'METICULOUS';
  sinkRule: 'IMMEDIATE_WASH' | 'SAME_DAY' | 'NEXT_DAY';
  maidPreference: 'MUST_HAVE_MAID' | 'OPEN_TO_MAID' | 'DIY_ONLY';
  isDealbreaker: boolean;
}

export interface DietaryVector {
  dietType: 'STRICT_VEGETARIAN' | 'EGGETARIAN' | 'NON_VEGETARIAN' | 'HALAL_ONLY';
  kitchenPolicy: 'VEG_ONLY_KITCHEN' | 'SEPARATE_UTENSILS_OK' | 'NO_RESTRICTIONS';
  isDealbreaker: boolean;
}

export interface SocialVector {
  guestFrequency: 'NO_GUESTS' | 'OCCASIONAL_FRIENDS' | 'FREQUENT_GUESTS';
  overnightGuestPolicy: 'NO_OVERNIGHT' | 'SAME_GENDER_ONLY' | 'PARTNERS_ALLOWED' | 'FLEXIBLE_WITH_NOTICE';
  partyPreference: 'NEVER_AT_HOME' | 'OCCASIONAL_WEEKENDS' | 'FREQUENT';
  isDealbreaker: boolean;
}

export interface SubstancesVector {
  smokingHabit: 'NON_SMOKER_STRICT' | 'BALCONY_ONLY' | 'SMOKER';
  alcoholHabit: 'TEETOTALER' | 'SOCIAL_DRINKER' | 'REGULAR';
  isDealbreaker: boolean;
}

export interface FinancialVector {
  rentPaymentHabit: 'STRICT_1ST_OF_MONTH' | 'BEFORE_5TH' | 'FLEXIBLE';
  acBillSplit: 'EQUAL_SPLIT' | 'PROPORTIONAL_TO_USAGE';
  groceryTracking: 'SPLITWISE_APP' | 'INDIVIDUAL_PROVISIONS' | 'ROTATIONAL_PAYMENT';
  isDealbreaker: boolean;
}

export interface WorkVector {
  workMode: 'OFFICE_DAILY' | 'HYBRID' | '100_PERCENT_REMOTE';
  callFrequency: 'LOW' | 'HIGH';
  workspacePreference: 'PRIVATE_ROOM_DESK' | 'LIVING_ROOM_DESK_OK';
  isDealbreaker: boolean;
}

export interface LifestyleProfileResponse {
  id: string;
  userId: string;
  sleep: SleepVector;
  cleanliness: CleanlinessVector;
  dietary: DietaryVector;
  social: SocialVector;
  substances: SubstancesVector;
  financial: FinancialVector;
  work: WorkVector;
}

export interface UpdateLifestyleRequest {
  sleep: SleepVector;
  cleanliness: CleanlinessVector;
  dietary: DietaryVector;
  social: SocialVector;
  substances: SubstancesVector;
  financial: FinancialVector;
  work: WorkVector;
}

// ============================================================================
// COMPATIBILITY & DISCOVERY MODELS
// ============================================================================

export interface VectorAlignmentDetail {
  affinityScore: number; // 0.0 to 1.0
  status: 'HIGH_ALIGNMENT' | 'MODERATE_ALIGNMENT' | 'DISCUSSION_POINT';
  userChoice: string;
  candidateChoice: string;
  notes: string;
}

export interface HarmonyExplanation {
  headline: string;
  lifestyleHarmonies: string[];
  potentialCompromises: string;
  icebreakerPrompt: string;
}

export interface CompatibilityBreakdownResponse {
  overallScore: number; // 0 to 100
  vectors: {
    sleep: VectorAlignmentDetail;
    cleanliness: VectorAlignmentDetail;
    dietary: VectorAlignmentDetail;
    social: VectorAlignmentDetail;
    substances: VectorAlignmentDetail;
    financial: VectorAlignmentDetail;
    work: VectorAlignmentDetail;
  };
  aiHarmonyNote?: HarmonyExplanation;
}

export interface RoomPhotoItem {
  id: string;
  photoUrl: string;
  orderIndex: number;
}

export interface RoomListingResponse {
  id: string;
  userId: string;
  roomType: RoomTypeEnum;
  sharingCount?: number | null;
  bathroomType: BathroomTypeEnum;
  monthlyRent: number;
  securityDeposit: number;
  availableFrom: string; // YYYY-MM-DD
  locationSuburb: TrivandrumSuburbEnum;
  amenities: string[];
  photos: RoomPhotoItem[];
}

export interface DiscoveryCardItem {
  userId: string;
  displayName: string;
  age: number;
  occupation: string;
  collegeOrCompany?: string;
  modality: DiscoveryModalityEnum;
  compatibilityScore: number;
  verificationBadge: VerificationBadgeEnum;
  photos: ProfilePhotoItem[];
  topHighlights: string[];
  preferredSuburbs: TrivandrumSuburbEnum[];
  budgetRange: {
    min: number;
    max: number;
  };
  roomListing?: RoomListingResponse;
  bio?: string;
}

export interface DiscoveryFeedResponse {
  cards: DiscoveryCardItem[];
  pagination: {
    nextCursor?: string | null;
    hasMore: boolean;
  };
}

export interface SwipeRequest {
  candidateUserId: string;
  action: SwipeActionEnum;
  clientMutationId: string;
}

export interface SwipeResponse {
  success: boolean;
  isMutualMatch: boolean;
  match?: MatchItem;
  conversationId?: string | null;
}

export interface RewindResponse {
  success: boolean;
  rewoundCandidateId: string;
  remainingRewinds: number;
}

export interface CandidateDetailResponse {
  profile: UserProfileResponse;
  lifestyle: LifestyleProfileResponse;
  compatibility: CompatibilityBreakdownResponse;
  roomListing?: RoomListingResponse;
}

// ============================================================================
// MATCHES & MESSAGING MODELS
// ============================================================================

export interface MatchItem {
  id: string;
  matchedUserId: string;
  matchedUserDisplayName: string;
  matchedUserAvatarUrl: string;
  compatibilityScore: number;
  matchedAt: string;
  conversationId: string;
  modality?: DiscoveryModalityEnum;
  collegeOrCompany?: string;
  suburb?: TrivandrumSuburbEnum;
}

export interface MatchesListResponse {
  matches: MatchItem[];
  totalCount: number;
}

export interface ChatMessageItem {
  id: string;
  conversationId: string;
  senderUserId: string;
  content: string;
  status: MessageStatusEnum;
  createdAt: string;
  readAt?: string | null;
}

export interface ConversationParticipant {
  id: string;
  displayName: string;
  avatarUrl?: string;
  verificationBadge: VerificationBadgeEnum;
  collegeOrCompany?: string;
  compatibilityScore?: number;
}

export interface ConversationItem {
  id: string;
  matchId: string;
  participant: ConversationParticipant;
  lastMessage?: ChatMessageItem;
  status: ConversationStatusEnum;
  lastMessageAt: string;
  unreadCount?: number;
}

export interface ConversationsListResponse {
  conversations: ConversationItem[];
}

export interface SendMessageRequest {
  content: string;
}

export interface MessageHistoryResponse {
  messages: ChatMessageItem[];
  hasMore: boolean;
  nextCursor?: string | null;
}

// ============================================================================
// ROOM LISTING MANAGEMENT
// ============================================================================

export interface CreateRoomListingRequest {
  roomType: RoomTypeEnum;
  sharingCount?: number;
  bathroomType: BathroomTypeEnum;
  monthlyRent: number;
  securityDeposit: number;
  availableFrom: string;
  locationSuburb: TrivandrumSuburbEnum;
  amenities: string[];
}

// ============================================================================
// TRUST & SAFETY MODELS
// ============================================================================

export interface BlockUserRequest {
  targetUserId: string;
  reason?: string;
}

export interface ReportUserRequest {
  targetUserId: string;
  category: ReportCategoryEnum;
  details: string;
}

export interface ReportUserResponse {
  reportId: string;
  status: 'PENDING_REVIEW' | 'ACTIONED_QUARANTINE';
  message: string;
}

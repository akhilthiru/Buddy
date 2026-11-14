import crypto from 'node:crypto';
import type {
  UserProfileSummary,
  LifestyleProfile,
  GenderType,
  PreferredGenderType,
  DiscoveryModality,
  MoveInFlexibility,
  VerificationBadge,
  TrivandrumSuburb,
  UserStatus,
} from '../modules/matching/matching.types.ts';

export interface DbUser {
  id: string;
  phoneHash: string;
  phoneEncrypted: Buffer;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbAuthOtp {
  id: string;
  phoneHash: string;
  otpHash: string;
  attemptsCount: number;
  expiresAt: Date;
  verifiedAt?: Date;
  createdAt: Date;
}

export interface DbUserProfile {
  id: string;
  userId: string;
  displayName: string;
  gender: GenderType;
  birthDate: Date;
  occupation: string;
  collegeOrCompany?: string;
  bio?: string;
  modality: DiscoveryModality;
  preferredGender: PreferredGenderType;
  minBudget: number;
  maxBudget: number;
  moveInFlexibility: MoveInFlexibility;
  verificationBadge: VerificationBadge;
  avatarUrl?: string;
  isOnboardingCompleted: boolean;
  preferredSuburbs: TrivandrumSuburb[];
  photos: Array<{ id: string; photoUrl: string; orderIndex: number; isPrimary: boolean }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbDiscoverySwipe {
  id: string;
  actorUserId: string;
  targetUserId: string;
  action: 'LIKE' | 'PASS' | 'SUPERLIKE';
  createdAt: Date;
}

export interface DbMatch {
  id: string;
  user1Id: string;
  user2Id: string;
  compatibilityScore: number;
  status: 'ACTIVE' | 'UNMATCHED';
  matchedAt: Date;
  unmatchedAt?: Date;
  updatedAt: Date;
}

export interface DbConversation {
  id: string;
  matchId: string;
  user1Id: string;
  user2Id: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'TERMINATED';
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbMessage {
  id: string;
  conversationId: string;
  senderUserId: string;
  content: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: Date;
  readAt?: Date;
  warningNotice?: string;
}

export interface DbRoomListing {
  id: string;
  userId: string;
  roomType: 'PRIVATE_ROOM' | 'SHARED_ROOM';
  sharingCount?: number;
  bathroomType: 'ATTACHED_PRIVATE' | 'SHARED';
  monthlyRent: number;
  securityDeposit: number;
  availableFrom: string;
  locationSuburb: TrivandrumSuburb;
  amenities: string[];
  photos: Array<{ id: string; photoUrl: string; orderIndex: number }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbUserBlock {
  id: string;
  blockerUserId: string;
  blockedUserId: string;
  reason?: string;
  createdAt: Date;
}

export interface DbUserReport {
  id: string;
  reporterUserId: string;
  reportedUserId: string;
  category: string;
  details: string;
  status: 'PENDING_REVIEW' | 'ACTIONED_QUARANTINE' | 'DISMISSED';
  createdAt: Date;
  actionedAt?: Date;
}

export interface DbRefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  familyId: string;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface DbInstitutionVerification {
  id: string;
  userId: string;
  emailHash: string;
  emailMasked: string;
  institutionType: 'CORPORATE' | 'ACADEMIC';
  institutionName: string;
  domain: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  tokenHash: string;
  expiresAt: Date;
  verifiedAt?: Date;
  createdAt: Date;
}

export class InMemoryDb {
  users = new Map<string, DbUser>();
  authOtps: DbAuthOtp[] = [];
  userProfiles = new Map<string, DbUserProfile>(); // keyed by userId
  lifestyleProfiles = new Map<string, LifestyleProfile>(); // keyed by userId
  discoverySwipes: DbDiscoverySwipe[] = [];
  matches: DbMatch[] = [];
  conversations: DbConversation[] = [];
  messages: DbMessage[] = [];
  roomListings = new Map<string, DbRoomListing>(); // keyed by userId
  userBlocks: DbUserBlock[] = [];
  userReports: DbUserReport[] = [];
  refreshTokens: DbRefreshToken[] = [];
  institutionVerifications: DbInstitutionVerification[] = [];

  // Rewind tracking: map of userId -> array of rewound swipe IDs in session
  rewindsUsed = new Map<string, number>();

  // Swipe rate limiting: map of userId -> array of swipe timestamps in last minute
  swipeTimestamps = new Map<string, number[]>();

  reset(): void {
    this.users.clear();
    this.authOtps = [];
    this.userProfiles.clear();
    this.lifestyleProfiles.clear();
    this.discoverySwipes = [];
    this.matches = [];
    this.conversations = [];
    this.messages = [];
    this.roomListings.clear();
    this.userBlocks = [];
    this.userReports = [];
    this.refreshTokens = [];
    this.institutionVerifications = [];
    this.rewindsUsed.clear();
    this.swipeTimestamps.clear();
  }
}

export const db = new InMemoryDb();

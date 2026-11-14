import type {
  DiscoveryModality,
  VerificationBadge,
  TrivandrumSuburb,
} from '../matching/matching.types.ts';
import type { ProfilePhotoResponse } from '../users/users.types.ts';

export interface DiscoveryCardItem {
  userId: string;
  displayName: string;
  age: number;
  occupation: string;
  collegeOrCompany?: string;
  modality: DiscoveryModality;
  compatibilityScore: number;
  verificationBadge: VerificationBadge;
  photos: ProfilePhotoResponse[];
  topHighlights: string[];
  preferredSuburbs: TrivandrumSuburb[];
  budgetRange: {
    min: number;
    max: number;
  };
  roomListing?: {
    id: string;
    roomType: string;
    bathroomType: string;
    monthlyRent: number;
    availableFrom: string;
    locationSuburb: string;
  };
}

export interface SwipeRequest {
  candidateUserId: string;
  action: 'LIKE' | 'PASS' | 'SUPERLIKE';
  clientMutationId: string;
}

export interface SwipeResponse {
  isMutualMatch: boolean;
  matchId?: string;
  conversationId?: string;
}

export interface RewindResponse {
  success: boolean;
  rewoundCandidateId: string;
  remainingRewinds: number;
}

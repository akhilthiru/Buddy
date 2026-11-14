import type {
  GenderType,
  PreferredGenderType,
  DiscoveryModality,
  MoveInFlexibility,
  VerificationBadge,
  TrivandrumSuburb,
} from '../matching/matching.types.ts';

export interface UpdateProfileRequest {
  displayName: string;
  gender: GenderType;
  birthDate: string; // YYYY-MM-DD
  occupation: string;
  collegeOrCompany?: string;
  bio?: string;
  modality: DiscoveryModality;
  preferredGender: PreferredGenderType;
  minBudget: number; // >= 1000
  maxBudget: number; // >= minBudget
  moveInFlexibility: MoveInFlexibility;
  preferredSuburbs: TrivandrumSuburb[];
}

export interface ProfilePhotoResponse {
  id: string;
  photoUrl: string;
  orderIndex: number;
  isPrimary: boolean;
}

export interface UserProfileResponse {
  id: string;
  userId: string;
  displayName: string;
  gender: GenderType;
  age: number;
  birthDate: string;
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
  photos: ProfilePhotoResponse[];
  createdAt: string;
  updatedAt: string;
}

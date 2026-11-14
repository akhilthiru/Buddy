import crypto from 'node:crypto';
import { db } from '../../database/in-memory-db.ts';
import { NotFoundError, BadRequestError } from '../../common/errors/problem-details.ts';
import type {
  UpdateProfileRequest,
  UserProfileResponse,
  ProfilePhotoResponse,
} from './users.types.ts';

export class UsersService {
  private static calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  static getProfile(userId: string): UserProfileResponse {
    const profile = db.userProfiles.get(userId);
    if (!profile) {
      throw new NotFoundError('Profile not found for current user');
    }

    return {
      id: profile.id,
      userId: profile.userId,
      displayName: profile.displayName,
      gender: profile.gender,
      age: this.calculateAge(profile.birthDate),
      birthDate: profile.birthDate.toISOString().split('T')[0],
      occupation: profile.occupation,
      collegeOrCompany: profile.collegeOrCompany,
      bio: profile.bio,
      modality: profile.modality,
      preferredGender: profile.preferredGender,
      minBudget: profile.minBudget,
      maxBudget: profile.maxBudget,
      moveInFlexibility: profile.moveInFlexibility,
      verificationBadge: profile.verificationBadge,
      avatarUrl: profile.avatarUrl,
      isOnboardingCompleted: profile.isOnboardingCompleted,
      preferredSuburbs: profile.preferredSuburbs,
      photos: profile.photos,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  static updateProfile(userId: string, req: UpdateProfileRequest): UserProfileResponse {
    const user = db.users.get(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const birthDate = new Date(req.birthDate);
    if (isNaN(birthDate.getTime())) {
      throw new BadRequestError('Invalid birthDate format (must be YYYY-MM-DD)');
    }

    const age = this.calculateAge(birthDate);
    if (age < 18) {
      throw new BadRequestError('Users must be at least 18 years of age to use Flatmate');
    }

    if (req.minBudget < 1000) {
      throw new BadRequestError('Minimum budget must be at least ₹1,000');
    }

    if (req.maxBudget < req.minBudget) {
      throw new BadRequestError('Maximum budget must be greater than or equal to minimum budget');
    }

    if (!req.preferredSuburbs || req.preferredSuburbs.length === 0) {
      throw new BadRequestError('At least one preferred Trivandrum micro-market suburb is required');
    }

    let profile = db.userProfiles.get(userId);
    const now = new Date();

    if (!profile) {
      profile = {
        id: crypto.randomUUID(),
        userId,
        displayName: req.displayName.trim(),
        gender: req.gender,
        birthDate,
        occupation: req.occupation.trim(),
        collegeOrCompany: req.collegeOrCompany?.trim(),
        bio: req.bio?.trim(),
        modality: req.modality,
        preferredGender: req.preferredGender,
        minBudget: req.minBudget,
        maxBudget: req.maxBudget,
        moveInFlexibility: req.moveInFlexibility,
        verificationBadge: 'UNVERIFIED',
        isOnboardingCompleted: true,
        preferredSuburbs: req.preferredSuburbs,
        photos: [],
        createdAt: now,
        updatedAt: now,
      };
      db.userProfiles.set(userId, profile);
    } else {
      profile.displayName = req.displayName.trim();
      profile.gender = req.gender;
      profile.birthDate = birthDate;
      profile.occupation = req.occupation.trim();
      profile.collegeOrCompany = req.collegeOrCompany?.trim();
      profile.bio = req.bio?.trim();
      profile.modality = req.modality;
      profile.preferredGender = req.preferredGender;
      profile.minBudget = req.minBudget;
      profile.maxBudget = req.maxBudget;
      profile.moveInFlexibility = req.moveInFlexibility;
      profile.preferredSuburbs = req.preferredSuburbs;
      profile.isOnboardingCompleted = true;
      profile.updatedAt = now;
    }

    return this.getProfile(userId);
  }

  static addPhoto(
    userId: string,
    photoUrl: string,
    orderIndex: number,
    isPrimary = false
  ): ProfilePhotoResponse {
    const profile = db.userProfiles.get(userId);
    if (!profile) {
      throw new NotFoundError('User profile not found. Please create profile first.');
    }

    if (orderIndex < 0 || orderIndex > 3) {
      throw new BadRequestError('Photo order index must be between 0 and 3 (max 4 photos)');
    }

    if (profile.photos.length >= 4) {
      throw new BadRequestError('Maximum 4 photos allowed per profile');
    }

    const photoId = crypto.randomUUID();
    const photo: ProfilePhotoResponse = {
      id: photoId,
      photoUrl,
      orderIndex,
      isPrimary: isPrimary || profile.photos.length === 0,
    };

    if (photo.isPrimary) {
      profile.photos.forEach((p) => (p.isPrimary = false));
      profile.avatarUrl = photoUrl;
    }

    profile.photos.push(photo);
    profile.photos.sort((a, b) => a.orderIndex - b.orderIndex);
    return photo;
  }

  static deletePhoto(userId: string, photoId: string): void {
    const profile = db.userProfiles.get(userId);
    if (!profile) {
      throw new NotFoundError('User profile not found');
    }

    const index = profile.photos.findIndex((p) => p.id === photoId);
    if (index === -1) {
      throw new NotFoundError('Photo not found');
    }

    profile.photos.splice(index, 1);
    if (profile.photos.length > 0) {
      profile.photos[0].isPrimary = true;
      profile.avatarUrl = profile.photos[0].photoUrl;
    } else {
      profile.avatarUrl = undefined;
    }
  }

  static getCandidateProfile(requestingUserId: string, candidateUserId: string): UserProfileResponse {
    // Check block
    const isBlocked = db.userBlocks.some(
      (b) =>
        (b.blockerUserId === requestingUserId && b.blockedUserId === candidateUserId) ||
        (b.blockerUserId === candidateUserId && b.blockedUserId === requestingUserId)
    );
    if (isBlocked) {
      throw new NotFoundError('Candidate profile not found or unavailable');
    }

    const candidateUser = db.users.get(candidateUserId);
    if (!candidateUser || candidateUser.status !== 'ACTIVE') {
      throw new NotFoundError('Candidate profile not available');
    }

    return this.getProfile(candidateUserId);
  }
}

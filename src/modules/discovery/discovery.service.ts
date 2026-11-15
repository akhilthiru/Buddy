import crypto from 'node:crypto';
import { db } from '../../database/in-memory-db.ts';
import { ScoringEngine } from '../matching/scoring.engine.ts';
import {
  BadRequestError,
  NotFoundError,
  RateLimitError,
} from '../../common/errors/problem-details.ts';
import type {
  DiscoveryCardItem,
  SwipeResponse,
  RewindResponse,
} from './discovery.types.ts';
import type {
  UserProfileSummary,
  LifestyleProfile,
  CompatibilityResult,
} from '../matching/matching.types.ts';

export class DiscoveryService {
  private static readonly SWIPE_RATE_LIMIT = 60; // 60 per minute

  private static calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private static getTopHighlights(lifestyle: LifestyleProfile): string[] {
    const highlights: string[] = [];

    // Chronotype
    if (lifestyle.sleep.sleepPattern === 'EARLY_BIRD') highlights.push('Early Bird');
    else if (lifestyle.sleep.sleepPattern === 'NIGHT_OWL') highlights.push('Night Owl');

    // Cleanliness
    if (lifestyle.cleanliness.cleanlinessLevel === 'METICULOUS') highlights.push('Clean & Organized');

    // Diet
    if (lifestyle.dietary.dietType === 'STRICT_VEGETARIAN') highlights.push('Vegetarian');
    else if (lifestyle.dietary.dietType === 'NON_VEGETARIAN') highlights.push('Non-Veg Friendly');

    // Smoking
    if (lifestyle.substances.smokingHabit === 'NON_SMOKER_STRICT') highlights.push('Non-Smoker');

    // Rent
    if (lifestyle.financial.rentPaymentHabit === 'STRICT_1ST_OF_MONTH') highlights.push('Strict 1st Rent');

    // Work
    if (lifestyle.work.workMode === 'HYBRID') highlights.push('Hybrid WFH');
    else if (lifestyle.work.workMode === 'OFFICE_DAILY') highlights.push('Office Daily');

    return highlights.slice(0, 3);
  }

  /**
   * Retrieves paginated, compatibility-ranked discovery candidate feed.
   */
  static getFeed(userId: string, limit = 20): { cards: DiscoveryCardItem[]; hasMore: boolean } {
    const user = db.users.get(userId);
    const userProfile = db.userProfiles.get(userId);
    const userLifestyle = db.lifestyleProfiles.get(userId);

    if (!user || !userProfile || !userLifestyle) {
      throw new BadRequestError('Please complete your profile and 7-vector lifestyle settings first');
    }

    // Blocked user IDs
    const blockedUserIds = new Set<string>();
    for (const b of db.userBlocks) {
      if (b.blockerUserId === userId) blockedUserIds.add(b.blockedUserId);
      if (b.blockedUserId === userId) blockedUserIds.add(b.blockerUserId);
    }

    // Already swiped target IDs
    const swipedUserIds = new Set<string>();
    for (const s of db.discoverySwipes) {
      if (s.actorUserId === userId) {
        swipedUserIds.add(s.targetUserId);
      }
    }

    const candidatePool: Array<{ profile: UserProfileSummary; lifestyle: LifestyleProfile }> = [];

    for (const [candidateId, candUser] of db.users.entries()) {
      if (candidateId === userId) continue;
      if (candUser.status !== 'ACTIVE') continue;
      if (blockedUserIds.has(candidateId)) continue;
      if (swipedUserIds.has(candidateId)) continue;

      const candProfile = db.userProfiles.get(candidateId);
      const candLifestyle = db.lifestyleProfiles.get(candidateId);

      if (!candProfile || !candLifestyle || !candProfile.isOnboardingCompleted) {
        continue;
      }

      candidatePool.push({
        profile: {
          userId: candidateId,
          displayName: candProfile.displayName,
          gender: candProfile.gender,
          preferredGender: candProfile.preferredGender,
          modality: candProfile.modality,
          minBudget: candProfile.minBudget,
          maxBudget: candProfile.maxBudget,
          status: candUser.status,
          preferredSuburbs: candProfile.preferredSuburbs,
          verificationBadge: candProfile.verificationBadge,
        },
        lifestyle: candLifestyle,
      });
    }

    const userSummary: UserProfileSummary = {
      userId,
      displayName: userProfile.displayName,
      gender: userProfile.gender,
      preferredGender: userProfile.preferredGender,
      modality: userProfile.modality,
      minBudget: userProfile.minBudget,
      maxBudget: userProfile.maxBudget,
      status: user.status,
      preferredSuburbs: userProfile.preferredSuburbs,
      verificationBadge: userProfile.verificationBadge,
    };

    // Deterministic ranking
    const ranked = ScoringEngine.rankBatch(userSummary, userLifestyle, candidatePool);
    const paginated = ranked.slice(0, limit);

    const cards: DiscoveryCardItem[] = paginated.map(({ candidate, result }) => {
      const fullCandProfile = db.userProfiles.get(candidate.userId)!;
      const fullCandLifestyle = db.lifestyleProfiles.get(candidate.userId)!;
      const room = db.roomListings.get(candidate.userId);

      return {
        userId: candidate.userId,
        displayName: fullCandProfile.displayName,
        age: this.calculateAge(fullCandProfile.birthDate),
        occupation: fullCandProfile.occupation,
        collegeOrCompany: fullCandProfile.collegeOrCompany,
        modality: fullCandProfile.modality,
        compatibilityScore: result.overallScore,
        verificationBadge: fullCandProfile.verificationBadge,
        photos: fullCandProfile.photos,
        topHighlights: this.getTopHighlights(fullCandLifestyle),
        preferredSuburbs: fullCandProfile.preferredSuburbs,
        budgetRange: {
          min: fullCandProfile.minBudget,
          max: fullCandProfile.maxBudget,
        },
        roomListing: room
          ? {
              id: room.id,
              roomType: room.roomType,
              bathroomType: room.bathroomType,
              monthlyRent: room.monthlyRent,
              availableFrom: room.availableFrom,
              locationSuburb: room.locationSuburb,
            }
          : undefined,
      };
    });

    return {
      cards,
      hasMore: ranked.length > limit,
    };
  }

  /**
   * Records swipe decision and checks for mutual match.
   */
  static swipe(
    actorUserId: string,
    candidateUserId: string,
    action: 'LIKE' | 'PASS' | 'SUPERLIKE'
  ): SwipeResponse {
    if (actorUserId === candidateUserId) {
      throw new BadRequestError('Cannot swipe on your own profile');
    }

    const candidateUser = db.users.get(candidateUserId);
    if (!candidateUser || candidateUser.status !== 'ACTIVE') {
      throw new NotFoundError('Candidate is no longer active on Buddy');
    }

    // Rate Limiting (60/min)
    const now = Date.now();
    const timestamps = db.swipeTimestamps.get(actorUserId) || [];
    const recent = timestamps.filter((t) => now - t < 60000);
    if (recent.length >= this.SWIPE_RATE_LIMIT) {
      throw new RateLimitError('Swipe limit exceeded (60 per minute). Please slow down.');
    }
    recent.push(now);
    db.swipeTimestamps.set(actorUserId, recent);

    // Record or update swipe
    const existingIndex = db.discoverySwipes.findIndex(
      (s) => s.actorUserId === actorUserId && s.targetUserId === candidateUserId
    );
    if (existingIndex !== -1) {
      db.discoverySwipes[existingIndex].action = action;
    } else {
      db.discoverySwipes.push({
        id: crypto.randomUUID(),
        actorUserId,
        targetUserId: candidateUserId,
        action,
        createdAt: new Date(),
      });
    }

    // Mutual match check
    if (action === 'LIKE' || action === 'SUPERLIKE') {
      const reciprocalSwipe = db.discoverySwipes.find(
        (s) =>
          s.actorUserId === candidateUserId &&
          s.targetUserId === actorUserId &&
          (s.action === 'LIKE' || s.action === 'SUPERLIKE')
      );

      if (reciprocalSwipe) {
        // Canonical ordering: user1_id < user2_id
        const [user1Id, user2Id] =
          actorUserId < candidateUserId
            ? [actorUserId, candidateUserId]
            : [candidateUserId, actorUserId];

        let match = db.matches.find((m) => m.user1Id === user1Id && m.user2Id === user2Id);

        if (!match) {
          // Calculate score
          const u1Profile = db.userProfiles.get(user1Id)!;
          const u1Life = db.lifestyleProfiles.get(user1Id)!;
          const u2Profile = db.userProfiles.get(user2Id)!;
          const u2Life = db.lifestyleProfiles.get(user2Id)!;

          const comp = ScoringEngine.calculateCompatibility(
            {
              userId: user1Id,
              displayName: u1Profile.displayName,
              gender: u1Profile.gender,
              preferredGender: u1Profile.preferredGender,
              modality: u1Profile.modality,
              minBudget: u1Profile.minBudget,
              maxBudget: u1Profile.maxBudget,
            },
            u1Life,
            {
              userId: user2Id,
              displayName: u2Profile.displayName,
              gender: u2Profile.gender,
              preferredGender: u2Profile.preferredGender,
              modality: u2Profile.modality,
              minBudget: u2Profile.minBudget,
              maxBudget: u2Profile.maxBudget,
            },
            u2Life
          );

          match = {
            id: crypto.randomUUID(),
            user1Id,
            user2Id,
            compatibilityScore: comp.overallScore,
            status: 'ACTIVE',
            matchedAt: new Date(),
            updatedAt: new Date(),
          };
          db.matches.push(match);

          // Create conversation
          const conversation = {
            id: crypto.randomUUID(),
            matchId: match.id,
            user1Id,
            user2Id,
            status: 'ACTIVE' as const,
            lastMessageAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          db.conversations.push(conversation);

          return {
            isMutualMatch: true,
            matchId: match.id,
            conversationId: conversation.id,
          };
        } else {
          match.status = 'ACTIVE';
          const conv = db.conversations.find((c) => c.matchId === match!.id);
          return {
            isMutualMatch: true,
            matchId: match.id,
            conversationId: conv ? conv.id : undefined,
          };
        }
      }
    }

    return { isMutualMatch: false };
  }

  /**
   * Rewinds immediately preceding swipe action (max 1 per session).
   */
  static rewind(userId: string): RewindResponse {
    const rewinds = db.rewindsUsed.get(userId) || 0;
    if (rewinds >= 1) {
      throw new BadRequestError('Rewind limit reached: maximum 1 rewind allowed per session');
    }

    // Find the latest swipe by this user
    const userSwipes = db.discoverySwipes
      .filter((s) => s.actorUserId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const lastSwipe = userSwipes[0];
    if (!lastSwipe) {
      throw new NotFoundError('No swipe action found to rewind');
    }

    // Check if it created a match
    const isMatched = db.matches.some(
      (m) =>
        m.status === 'ACTIVE' &&
        ((m.user1Id === userId && m.user2Id === lastSwipe.targetUserId) ||
          (m.user2Id === userId && m.user1Id === lastSwipe.targetUserId))
    );

    if (isMatched) {
      throw new BadRequestError('Cannot rewind a profile that resulted in an active mutual match');
    }

    // Delete swipe record
    const idx = db.discoverySwipes.findIndex((s) => s.id === lastSwipe.id);
    if (idx !== -1) {
      db.discoverySwipes.splice(idx, 1);
    }

    db.rewindsUsed.set(userId, rewinds + 1);

    return {
      success: true,
      rewoundCandidateId: lastSwipe.targetUserId,
      remainingRewinds: 0,
    };
  }

  /**
   * Get 7-vector compatibility breakdown for a specific candidate.
   */
  static getCompatibilityBreakdown(userId: string, candidateId: string): CompatibilityResult {
    const uProfile = db.userProfiles.get(userId);
    const uLife = db.lifestyleProfiles.get(userId);
    const cProfile = db.userProfiles.get(candidateId);
    const cLife = db.lifestyleProfiles.get(candidateId);

    if (!uProfile || !uLife || !cProfile || !cLife) {
      throw new NotFoundError('Profile data incomplete for compatibility calculation');
    }

    return ScoringEngine.calculateCompatibility(
      {
        userId,
        displayName: uProfile.displayName,
        gender: uProfile.gender,
        preferredGender: uProfile.preferredGender,
        modality: uProfile.modality,
        minBudget: uProfile.minBudget,
        maxBudget: uProfile.maxBudget,
      },
      uLife,
      {
        userId: candidateId,
        displayName: cProfile.displayName,
        gender: cProfile.gender,
        preferredGender: cProfile.preferredGender,
        modality: cProfile.modality,
        minBudget: cProfile.minBudget,
        maxBudget: cProfile.maxBudget,
      },
      cLife
    );
  }
}

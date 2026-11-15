import { db } from '../../database/in-memory-db.ts';
import { NotFoundError } from '../../common/errors/problem-details.ts';
import type { LifestyleProfile } from '../matching/matching.types.ts';

export class PreferencesService {
  static getLifestyle(userId: string): LifestyleProfile {
    const lifestyle = db.lifestyleProfiles.get(userId);
    if (!lifestyle) {
      throw new NotFoundError('Lifestyle profile not found for user');
    }
    return lifestyle;
  }

  static updateLifestyle(
    userId: string,
    data: Omit<LifestyleProfile, 'userId'>
  ): LifestyleProfile {
    const user = db.users.get(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const lifestyle: LifestyleProfile = {
      userId,
      sleep: data.sleep,
      cleanliness: data.cleanliness,
      dietary: data.dietary,
      social: data.social,
      substances: data.substances,
      financial: data.financial,
      work: data.work,
      household: data.household,
    };

    db.lifestyleProfiles.set(userId, lifestyle);
    return lifestyle;
  }
}

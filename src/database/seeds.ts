import { db, type DbUser, type DbUserProfile, type DbRoomListing } from './in-memory-db.ts';
import { CryptoUtil } from '../common/utils/crypto.ts';
import type { LifestyleProfile } from '../modules/matching/matching.types.ts';

export function seedDevelopmentData(): void {
  // If already seeded or running tests, return
  if (db.users.size > 0) return;

  const now = new Date();

  // -------------------------------------------------------------
  // USER 1: Adarsh Nair (Technopark Software Engineer)
  // Modality 1: Has a room in Kazhakkoottam, looking for a flatmate
  // -------------------------------------------------------------
  const user1Id = 'usr_adarsh_001';
  const user1: DbUser = {
    id: user1Id,
    phoneHash: CryptoUtil.hashDeterministic('+919876543211'),
    phoneEncrypted: CryptoUtil.encryptAesGcm('+919876543211'),
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };
  db.users.set(user1Id, user1);

  const profile1: DbUserProfile = {
    id: 'prof_adarsh_001',
    userId: user1Id,
    displayName: 'Adarsh Nair',
    gender: 'MALE',
    birthDate: new Date('1999-04-12'),
    occupation: 'Senior Backend Engineer',
    collegeOrCompany: 'TCS (Technopark Phase I)',
    bio: 'Looking for a flatmate for the master bedroom in my 2BHK flat near Kazhakkoottam junction. Calm, tidy, enjoys badminton on weekends.',
    modality: 'MODALITY_1', // Has a room
    preferredGender: 'MALE',
    minBudget: 7000,
    maxBudget: 9000,
    moveInFlexibility: 'WITHIN_15_DAYS',
    verificationBadge: 'VERIFIED_PROFESSIONAL',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isOnboardingCompleted: true,
    preferredSuburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM'],
    photos: [
      {
        id: 'photo_1',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        orderIndex: 0,
        isPrimary: true,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  db.userProfiles.set(user1Id, profile1);

  const lifestyle1: LifestyleProfile = {
    userId: user1Id,
    sleep: {
      sleepPattern: 'EARLY_BIRD',
      shiftSchedule: 'NORMAL_DAY',
      noiseSensitivity: 'LIGHT_SLEEPER',
      isDealbreaker: true,
    },
    cleanliness: {
      cleanlinessLevel: 'METICULOUS',
      kitchenSinkRule: 'IMMEDIATE_WASH',
      maidPreference: 'OPEN_TO_MAID',
      isDealbreaker: true,
    },
    dietary: {
      dietType: 'NON_VEGETARIAN',
      kitchenPolicy: 'NO_RESTRICTIONS',
      isDealbreaker: false,
    },
    social: {
      guestFrequency: 'OCCASIONAL_FRIENDS',
      overnightGuestPolicy: 'SAME_GENDER_ONLY',
      partyPreference: 'OCCASIONAL_WEEKENDS',
      isDealbreaker: false,
    },
    substances: {
      smokingHabit: 'NON_SMOKER_STRICT',
      alcoholHabit: 'TEETOTALER',
      isDealbreaker: true,
    },
    financial: {
      rentPaymentHabit: 'STRICT_1ST_OF_MONTH',
      acBillSplit: 'EQUAL_SPLIT',
      groceryTracking: 'SPLITWISE_APP',
      isDealbreaker: true,
    },
    work: {
      workMode: 'HYBRID',
      callFrequency: 'LOW',
      workspacePreference: 'PRIVATE_ROOM_DESK',
      isDealbreaker: false,
    },
  };
  db.lifestyleProfiles.set(user1Id, lifestyle1);

  // Adarsh's Room Listing (Modality 1)
  const roomListing1: DbRoomListing = {
    id: 'room_adarsh_001',
    userId: user1Id,
    roomType: 'PRIVATE_ROOM',
    bathroomType: 'ATTACHED_PRIVATE',
    monthlyRent: 7500,
    securityDeposit: 20000,
    availableFrom: '2026-12-01',
    locationSuburb: 'KAZHAKKOOTTAM',
    amenities: ['AC', 'WiFi', 'Attached Bathroom', 'Washing Machine', 'Covered Parking', 'Gated Security'],
    photos: [
      {
        id: 'room_p1',
        photoUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
        orderIndex: 0,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  db.roomListings.set(user1Id, roomListing1);

  // -------------------------------------------------------------
  // USER 2: Sneha Menon (CET Trivandrum Postgraduate Student)
  // Modality 2: Needs a room near Sreekaryam / Kariavattom
  // -------------------------------------------------------------
  const user2Id = 'usr_sneha_002';
  const user2: DbUser = {
    id: user2Id,
    phoneHash: CryptoUtil.hashDeterministic('+919876543212'),
    phoneEncrypted: CryptoUtil.encryptAesGcm('+919876543212'),
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };
  db.users.set(user2Id, user2);

  const profile2: DbUserProfile = {
    id: 'prof_sneha_002',
    userId: user2Id,
    displayName: 'Sneha Menon',
    gender: 'FEMALE',
    birthDate: new Date('2001-08-20'),
    occupation: 'M.Tech AI Student',
    collegeOrCompany: 'College of Engineering Trivandrum (CET)',
    bio: 'Grad student at CET. Looking for a quiet, study-friendly room in a shared apartment. Non-smoker, vegetarian kitchen preferred.',
    modality: 'MODALITY_2', // Seeking existing room
    preferredGender: 'FEMALE',
    minBudget: 5000,
    maxBudget: 7500,
    moveInFlexibility: 'IMMEDIATELY',
    verificationBadge: 'VERIFIED_STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    isOnboardingCompleted: true,
    preferredSuburbs: ['SREEKARYAM', 'KARIAVATTOM'],
    photos: [
      {
        id: 'photo_2',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
        orderIndex: 0,
        isPrimary: true,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  db.userProfiles.set(user2Id, profile2);

  const lifestyle2: LifestyleProfile = {
    userId: user2Id,
    sleep: {
      sleepPattern: 'NIGHT_OWL',
      shiftSchedule: 'NORMAL_DAY',
      noiseSensitivity: 'HEAVY_SLEEPER',
      isDealbreaker: false,
    },
    cleanliness: {
      cleanlinessLevel: 'METICULOUS',
      kitchenSinkRule: 'IMMEDIATE_WASH',
      maidPreference: 'OPEN_TO_MAID',
      isDealbreaker: true,
    },
    dietary: {
      dietType: 'STRICT_VEGETARIAN',
      kitchenPolicy: 'VEG_ONLY_KITCHEN',
      isDealbreaker: true,
    },
    social: {
      guestFrequency: 'NO_GUESTS',
      overnightGuestPolicy: 'SAME_GENDER_ONLY',
      partyPreference: 'NEVER_AT_HOME',
      isDealbreaker: true,
    },
    substances: {
      smokingHabit: 'NON_SMOKER_STRICT',
      alcoholHabit: 'TEETOTALER',
      isDealbreaker: true,
    },
    financial: {
      rentPaymentHabit: 'STRICT_1ST_OF_MONTH',
      acBillSplit: 'EQUAL_SPLIT',
      groceryTracking: 'INDIVIDUAL_PROVISIONS',
      isDealbreaker: true,
    },
    work: {
      workMode: 'OFFICE_DAILY',
      callFrequency: 'LOW',
      workspacePreference: 'PRIVATE_ROOM_DESK',
      isDealbreaker: false,
    },
  };
  db.lifestyleProfiles.set(user2Id, lifestyle2);

  // -------------------------------------------------------------
  // USER 3: Rahul Pillai (UST Global Analyst)
  // Modality 3: Has accommodation in Kowdiar, desires relocation
  // -------------------------------------------------------------
  const user3Id = 'usr_rahul_003';
  const user3: DbUser = {
    id: user3Id,
    phoneHash: CryptoUtil.hashDeterministic('+919876543213'),
    phoneEncrypted: CryptoUtil.encryptAesGcm('+919876543213'),
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };
  db.users.set(user3Id, user3);

  const profile3: DbUserProfile = {
    id: 'prof_rahul_003',
    userId: user3Id,
    displayName: 'Rahul Pillai',
    gender: 'MALE',
    birthDate: new Date('1997-11-05'),
    occupation: 'Financial Analyst',
    collegeOrCompany: 'UST Global (Technopark Phase II)',
    bio: 'Currently in Kowdiar but commute to Technopark is too long. Relocating to Kazhakkoottam or Kariavattom. Foodie and football fan.',
    modality: 'MODALITY_3', // Relocating
    preferredGender: 'ANY',
    minBudget: 8000,
    maxBudget: 12000,
    moveInFlexibility: 'FLEXIBLE',
    verificationBadge: 'VERIFIED_PROFESSIONAL',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    isOnboardingCompleted: true,
    preferredSuburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM', 'KOWDIAR'],
    photos: [
      {
        id: 'photo_3',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
        orderIndex: 0,
        isPrimary: true,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  db.userProfiles.set(user3Id, profile3);

  const lifestyle3: LifestyleProfile = {
    userId: user3Id,
    sleep: {
      sleepPattern: 'EARLY_BIRD',
      shiftSchedule: 'NORMAL_DAY',
      noiseSensitivity: 'LIGHT_SLEEPER',
      isDealbreaker: false,
    },
    cleanliness: {
      cleanlinessLevel: 'MODERATE',
      kitchenSinkRule: 'SAME_DAY',
      maidPreference: 'MUST_HAVE_MAID',
      isDealbreaker: false,
    },
    dietary: {
      dietType: 'NON_VEGETARIAN',
      kitchenPolicy: 'NO_RESTRICTIONS',
      isDealbreaker: false,
    },
    social: {
      guestFrequency: 'OCCASIONAL_FRIENDS',
      overnightGuestPolicy: 'FLEXIBLE_WITH_NOTICE',
      partyPreference: 'OCCASIONAL_WEEKENDS',
      isDealbreaker: false,
    },
    substances: {
      smokingHabit: 'NON_SMOKER_STRICT',
      alcoholHabit: 'SOCIAL_DRINKER',
      isDealbreaker: false,
    },
    financial: {
      rentPaymentHabit: 'BEFORE_5TH',
      acBillSplit: 'EQUAL_SPLIT',
      groceryTracking: 'SPLITWISE_APP',
      isDealbreaker: true,
    },
    work: {
      workMode: 'HYBRID',
      callFrequency: 'LOW',
      workspacePreference: 'PRIVATE_ROOM_DESK',
      isDealbreaker: false,
    },
  };
  db.lifestyleProfiles.set(user3Id, lifestyle3);

  // -------------------------------------------------------------
  // USER 4: Anjali Krishna (HR Specialist at Allianz Technopark)
  // Modality 4: Looking for flatmate first before apartment hunting
  // -------------------------------------------------------------
  const user4Id = 'usr_anjali_004';
  const user4: DbUser = {
    id: user4Id,
    phoneHash: CryptoUtil.hashDeterministic('+919876543214'),
    phoneEncrypted: CryptoUtil.encryptAesGcm('+919876543214'),
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };
  db.users.set(user4Id, user4);

  const profile4: DbUserProfile = {
    id: 'prof_anjali_004',
    userId: user4Id,
    displayName: 'Anjali Krishna',
    gender: 'FEMALE',
    birthDate: new Date('1998-02-14'),
    occupation: 'HR Specialist',
    collegeOrCompany: 'Allianz (Technopark Phase III)',
    bio: 'Want to team up with another female professional first, then search together for a spacious 2BHK/3BHK in Kazhakkoottam. Plant lover, quiet evenings.',
    modality: 'MODALITY_4', // Team up first
    preferredGender: 'FEMALE',
    minBudget: 8000,
    maxBudget: 11000,
    moveInFlexibility: 'WITHIN_30_DAYS',
    verificationBadge: 'VERIFIED_PROFESSIONAL',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    isOnboardingCompleted: true,
    preferredSuburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM', 'VELLAYAMBALAM'],
    photos: [
      {
        id: 'photo_4',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
        orderIndex: 0,
        isPrimary: true,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  db.userProfiles.set(user4Id, profile4);

  const lifestyle4: LifestyleProfile = {
    userId: user4Id,
    sleep: {
      sleepPattern: 'FLEXIBLE',
      shiftSchedule: 'NORMAL_DAY',
      noiseSensitivity: 'LIGHT_SLEEPER',
      isDealbreaker: false,
    },
    cleanliness: {
      cleanlinessLevel: 'METICULOUS',
      kitchenSinkRule: 'IMMEDIATE_WASH',
      maidPreference: 'MUST_HAVE_MAID',
      isDealbreaker: true,
    },
    dietary: {
      dietType: 'NON_VEGETARIAN',
      kitchenPolicy: 'NO_RESTRICTIONS',
      isDealbreaker: false,
    },
    social: {
      guestFrequency: 'OCCASIONAL_FRIENDS',
      overnightGuestPolicy: 'SAME_GENDER_ONLY',
      partyPreference: 'NEVER_AT_HOME',
      isDealbreaker: false,
    },
    substances: {
      smokingHabit: 'NON_SMOKER_STRICT',
      alcoholHabit: 'TEETOTALER',
      isDealbreaker: true,
    },
    financial: {
      rentPaymentHabit: 'STRICT_1ST_OF_MONTH',
      acBillSplit: 'EQUAL_SPLIT',
      groceryTracking: 'SPLITWISE_APP',
      isDealbreaker: true,
    },
    work: {
      workMode: 'HYBRID',
      callFrequency: 'LOW',
      workspacePreference: 'PRIVATE_ROOM_DESK',
      isDealbreaker: false,
    },
  };
  db.lifestyleProfiles.set(user4Id, lifestyle4);

  // Pre-configure Adarsh and Rahul having mutual interests so new users can test swipes
  // Seed a pre-existing swipe from Adarsh on new male users or test user
  console.log('✔ Flatmate Development Seed Data loaded (4 profiles across Modalities 1-4, 1 room listing).');
}


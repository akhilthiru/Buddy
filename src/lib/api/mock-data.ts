import type {
  UserProfileResponse,
  LifestyleProfileResponse,
  DiscoveryCardItem,
  CandidateDetailResponse,
  MatchItem,
  ConversationItem,
  ChatMessageItem,
  RoomListingResponse,
} from './types.ts';

// ============================================================================
// LOGGED IN USER MOCK (Mathews Varghese - Infosys Technopark)
// ============================================================================

export const MOCK_CURRENT_USER: UserProfileResponse = {
  id: 'usr-current-001',
  userId: 'usr-current-001',
  displayName: 'Mathews Varghese',
  gender: 'MALE',
  age: 25,
  occupation: 'Frontend Engineer',
  collegeOrCompany: 'Infosys (Technopark Phase II)',
  bio: 'Techie looking for a relaxed, clean flatmate to find a flat near Kazhakkoottam. Weekend movie buff and badminton player.',
  modality: 'MODALITY_4',
  preferredGender: 'MALE',
  minBudget: 6000,
  maxBudget: 9000,
  moveInFlexibility: 'WITHIN_15_DAYS',
  preferredSuburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM', 'SREEKARYAM'],
  verificationBadge: 'VERIFIED_PROFESSIONAL',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  photos: [
    {
      id: 'p-0',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      orderIndex: 0,
      isPrimary: true,
    },
  ],
  isOnboardingCompleted: true,
};

export const MOCK_CURRENT_LIFESTYLE: LifestyleProfileResponse = {
  id: 'life-cur-001',
  userId: 'usr-current-001',
  sleep: {
    pattern: 'EARLY_BIRD',
    shiftSchedule: 'NORMAL_DAY',
    noiseSensitivity: 'LIGHT_SLEEPER',
    isDealbreaker: true,
  },
  cleanliness: {
    level: 'MODERATE',
    sinkRule: 'BEFORE_BED' as unknown as 'IMMEDIATE_WASH' | 'SAME_DAY' | 'NEXT_DAY',
    maidPreference: 'OPEN_TO_MAID',
    isDealbreaker: true,
  },
  dietary: {
    dietType: 'NON_VEGETARIAN',
    kitchenPolicy: 'SEPARATE_UTENSILS_OK',
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
    alcoholHabit: 'SOCIAL_DRINKER',
    isDealbreaker: true,
  },
  financial: {
    rentPaymentHabit: 'STRICT_1ST_OF_MONTH',
    acBillSplit: 'PROPORTIONAL_TO_USAGE',
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

// ============================================================================
// CANDIDATE 1: Adarsh Nair (UST Global, Modality 4 - Team Up First)
// ============================================================================

export const MOCK_CANDIDATE_ADARSH: DiscoveryCardItem = {
  userId: 'usr-adarsh-002',
  displayName: 'Adarsh Nair',
  age: 24,
  occupation: 'Software Engineer',
  collegeOrCompany: 'UST Global (Technopark Phase I)',
  bio: 'Software engineer at UST. Looking for a neat flatmate to team up and lease a spacious 2BHK near Kazhakkoottam. Quiet weekdays, FIFA tournaments on weekends.',
  modality: 'MODALITY_4',
  compatibilityScore: 94,
  verificationBadge: 'VERIFIED_PROFESSIONAL',
  preferredSuburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM'],
  budgetRange: { min: 6500, max: 8500 },
  topHighlights: ['Early Bird', 'Non-Smoker', 'Hybrid WFH', 'Splitwise Discipline'],
  photos: [
    {
      id: 'p-ad-1',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      orderIndex: 0,
      isPrimary: true,
    },
    {
      id: 'p-ad-2',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      orderIndex: 1,
      isPrimary: false,
    },
    {
      id: 'p-ad-3',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
      orderIndex: 2,
      isPrimary: false,
    },
  ],
};

// ============================================================================
// CANDIDATE 2: Rohit Menon (CET Student, Modality 1 - Has Room Available)
// ============================================================================

const MOCK_ROOM_ROHIT: RoomListingResponse = {
  id: 'rm-rohit-001',
  userId: 'usr-rohit-003',
  roomType: 'PRIVATE_ROOM',
  sharingCount: 1,
  bathroomType: 'ATTACHED_PRIVATE',
  monthlyRent: 7500,
  securityDeposit: 15000,
  availableFrom: '2026-12-01',
  locationSuburb: 'KAZHAKKOOTTAM',
  amenities: ['AC in Bedroom', '100Mbps Wi-Fi', 'Washing Machine', 'Power Backup / Inverter'],
  photos: [
    {
      id: 'rm-p1',
      photoUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      orderIndex: 0,
    },
    {
      id: 'rm-p2',
      photoUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      orderIndex: 1,
    },
  ],
};

export const MOCK_CANDIDATE_ROHIT: DiscoveryCardItem = {
  userId: 'usr-rohit-003',
  displayName: 'Rohit Menon',
  age: 23,
  occupation: 'M.Tech Research Scholar',
  collegeOrCompany: 'College of Engineering Trivandrum (CET)',
  bio: 'Master student at CET. Have an air-conditioned master bedroom available in Artech Lake Residency, Kazhakkoottam. Clean, disciplined, vegetarian cooking.',
  modality: 'MODALITY_1',
  compatibilityScore: 88,
  verificationBadge: 'VERIFIED_STUDENT',
  preferredSuburbs: ['KAZHAKKOOTTAM', 'SREEKARYAM'],
  budgetRange: { min: 7000, max: 8000 },
  topHighlights: ['Attached Bath', 'Pure Veg Kitchen', 'Quiet Study Vibe', 'Wi-Fi 100Mbps'],
  roomListing: MOCK_ROOM_ROHIT,
  photos: [
    {
      id: 'p-ro-1',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      orderIndex: 0,
      isPrimary: true,
    },
    {
      id: 'p-ro-2',
      photoUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      orderIndex: 1,
      isPrimary: false,
    },
  ],
};

// ============================================================================
// CANDIDATE 3: Ashwin Kumar (Tata Elxsi, Modality 2 - Seeking Accommodation)
// ============================================================================

export const MOCK_CANDIDATE_ASHWIN: DiscoveryCardItem = {
  userId: 'usr-ashwin-004',
  displayName: 'Ashwin Kumar',
  age: 26,
  occupation: 'Automotive Embedded Engineer',
  collegeOrCompany: 'Tata Elxsi (Technopark)',
  bio: 'Relocating from Bangalore to Technopark Trivandrum next month. Seeking a private room in a friendly 2BHK/3BHK. Non-smoker, early morning runner.',
  modality: 'MODALITY_2',
  compatibilityScore: 82,
  verificationBadge: 'VERIFIED_PROFESSIONAL',
  preferredSuburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM', 'PATTOM'],
  budgetRange: { min: 7000, max: 9500 },
  topHighlights: ['Early Bird', 'Non-Smoker', 'Regular Runner', 'Clean Kitchen'],
  photos: [
    {
      id: 'p-as-1',
      photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
      orderIndex: 0,
      isPrimary: true,
    },
  ],
};

// ============================================================================
// CANDIDATE 4: Siddharth Pillai (Modality 4 - Team Up First)
// ============================================================================

export const MOCK_CANDIDATE_SIDDHARTH: DiscoveryCardItem = {
  userId: 'usr-sid-005',
  displayName: 'Siddharth Pillai',
  age: 25,
  occupation: 'Cloud Infrastructure Consultant',
  collegeOrCompany: 'Allianz Technology Trivandrum',
  bio: 'Working hybrid at Allianz. Looking to partner up with a like-minded professional to lease a modern flat in Kowdiar or Pattom.',
  modality: 'MODALITY_4',
  compatibilityScore: 76,
  verificationBadge: 'VERIFIED_PROFESSIONAL',
  preferredSuburbs: ['KOWDIAR', 'PATTOM', 'VELLAYAMBALAM'],
  budgetRange: { min: 8000, max: 12000 },
  topHighlights: ['Hybrid Remote', 'Non-Smoker', 'Weekend Cooking', 'Split Bills Promptly'],
  photos: [
    {
      id: 'p-sid-1',
      photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
      orderIndex: 0,
      isPrimary: true,
    },
  ],
};

export const MOCK_DISCOVERY_CARDS: DiscoveryCardItem[] = [
  MOCK_CANDIDATE_ADARSH,
  MOCK_CANDIDATE_ROHIT,
  MOCK_CANDIDATE_ASHWIN,
  MOCK_CANDIDATE_SIDDHARTH,
];

// ============================================================================
// DETAILED CANDIDATE RESPONSES (FOR FULL PROFILE MODAL)
// ============================================================================

export const MOCK_ADARSH_DETAIL: CandidateDetailResponse = {
  profile: {
    id: 'prof-ad-002',
    userId: 'usr-adarsh-002',
    displayName: 'Adarsh Nair',
    gender: 'MALE',
    age: 24,
    occupation: 'Software Engineer',
    collegeOrCompany: 'UST Global (Technopark Phase I)',
    bio: 'Software engineer at UST. Looking for a neat flatmate to team up and lease a spacious 2BHK near Kazhakkoottam. Quiet weekdays, FIFA tournaments on weekends.',
    modality: 'MODALITY_4',
    preferredGender: 'MALE',
    minBudget: 6500,
    maxBudget: 8500,
    moveInFlexibility: 'WITHIN_15_DAYS',
    preferredSuburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM'],
    verificationBadge: 'VERIFIED_PROFESSIONAL',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    photos: MOCK_CANDIDATE_ADARSH.photos,
    isOnboardingCompleted: true,
  },
  lifestyle: {
    id: 'life-ad-002',
    userId: 'usr-adarsh-002',
    sleep: {
      pattern: 'EARLY_BIRD',
      shiftSchedule: 'NORMAL_DAY',
      noiseSensitivity: 'LIGHT_SLEEPER',
      isDealbreaker: true,
    },
    cleanliness: {
      level: 'MODERATE',
      sinkRule: 'SAME_DAY',
      maidPreference: 'OPEN_TO_MAID',
      isDealbreaker: true,
    },
    dietary: {
      dietType: 'NON_VEGETARIAN',
      kitchenPolicy: 'SEPARATE_UTENSILS_OK',
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
      alcoholHabit: 'SOCIAL_DRINKER',
      isDealbreaker: true,
    },
    financial: {
      rentPaymentHabit: 'STRICT_1ST_OF_MONTH',
      acBillSplit: 'PROPORTIONAL_TO_USAGE',
      groceryTracking: 'SPLITWISE_APP',
      isDealbreaker: true,
    },
    work: {
      workMode: 'HYBRID',
      callFrequency: 'LOW',
      workspacePreference: 'PRIVATE_ROOM_DESK',
      isDealbreaker: false,
    },
  },
  compatibility: {
    overallScore: 94,
    vectors: {
      sleep: {
        affinityScore: 1.0,
        status: 'HIGH_ALIGNMENT',
        userChoice: 'Early Bird (Sleeps by 10:30 PM)',
        candidateChoice: 'Early Bird (Sleeps by 11:00 PM)',
        notes: 'Identical circadian rhythm. Quiet evenings guaranteed.',
      },
      cleanliness: {
        affinityScore: 0.95,
        status: 'HIGH_ALIGNMENT',
        userChoice: 'Moderate clean, same-day sink',
        candidateChoice: 'Moderate clean, same-day sink',
        notes: 'Both adhere to same-day kitchen dishwashing rule.',
      },
      dietary: {
        affinityScore: 0.9,
        status: 'HIGH_ALIGNMENT',
        userChoice: 'Non-Vegetarian, Separate utensils ok',
        candidateChoice: 'Non-Vegetarian, Separate utensils ok',
        notes: 'Harmonious kitchen habits and grocery separation.',
      },
      social: {
        affinityScore: 0.92,
        status: 'HIGH_ALIGNMENT',
        userChoice: 'Occasional daytime friends',
        candidateChoice: 'Occasional daytime friends',
        notes: 'Both agree home is primarily a peaceful sanctuary.',
      },
      substances: {
        affinityScore: 1.0,
        status: 'HIGH_ALIGNMENT',
        userChoice: 'Strict Non-Smoker',
        candidateChoice: 'Strict Non-Smoker',
        notes: 'Zero smoke tolerance honored mutually.',
      },
      financial: {
        affinityScore: 1.0,
        status: 'HIGH_ALIGNMENT',
        userChoice: 'Pay 1st of month, Splitwise tracking',
        candidateChoice: 'Pay 1st of month, Splitwise tracking',
        notes: 'Identical bill transparency expectations.',
      },
      work: {
        affinityScore: 0.88,
        status: 'HIGH_ALIGNMENT',
        userChoice: 'Hybrid 3 days WFH',
        candidateChoice: 'Hybrid 2 days WFH',
        notes: 'Both respect quiet private workspace during calls.',
      },
    },
    aiHarmonyNote: {
      headline: 'Exceptional lifestyle harmony for Technopark professionals',
      lifestyleHarmonies: [
        'Shared commitment to quiet sleep schedules before 11 PM.',
        'Zero tolerance for smoking inside apartments.',
        'Prompt bill settlement habit on the 1st of every month via Splitwise.',
      ],
      potentialCompromises: 'Adarsh occasionally hosts colleagues for weekend FIFA gaming in the hall.',
      icebreakerPrompt: 'Ask which 2BHK societies in Kazhakkoottam they have shortlisted!',
    },
  },
};

// ============================================================================
// MUTUAL MATCHES & CONVERSATIONS
// ============================================================================

export const MOCK_MATCHES: MatchItem[] = [
  {
    id: 'match-001',
    matchedUserId: 'usr-adarsh-002',
    matchedUserDisplayName: 'Adarsh Nair',
    matchedUserAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    compatibilityScore: 94,
    matchedAt: '2026-11-14T10:14:00Z',
    conversationId: 'conv-001',
    modality: 'MODALITY_4',
    collegeOrCompany: 'UST Global',
    suburb: 'KAZHAKKOOTTAM',
  },
  {
    id: 'match-002',
    matchedUserId: 'usr-rohit-003',
    matchedUserDisplayName: 'Rohit Menon',
    matchedUserAvatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    compatibilityScore: 88,
    matchedAt: '2026-11-13T16:30:00Z',
    conversationId: 'conv-002',
    modality: 'MODALITY_1',
    collegeOrCompany: 'CET Trivandrum',
    suburb: 'KAZHAKKOOTTAM',
  },
];

export const MOCK_CONVERSATIONS: ConversationItem[] = [
  {
    id: 'conv-001',
    matchId: 'match-001',
    participant: {
      id: 'usr-adarsh-002',
      displayName: 'Adarsh Nair',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      verificationBadge: 'VERIFIED_PROFESSIONAL',
      collegeOrCompany: 'UST Global',
      compatibilityScore: 94,
    },
    status: 'ACTIVE',
    lastMessageAt: '2026-11-14T10:37:00Z',
    unreadCount: 1,
    lastMessage: {
      id: 'msg-004',
      conversationId: 'conv-001',
      senderUserId: 'usr-adarsh-002',
      content: 'Perfect! I visited Artech Lake Residency yesterday. Rent is ₹16k total (₹8k each). Want to check photos together?',
      status: 'DELIVERED',
      createdAt: '2026-11-14T10:37:00Z',
    },
  },
  {
    id: 'conv-002',
    matchId: 'match-002',
    participant: {
      id: 'usr-rohit-003',
      displayName: 'Rohit Menon',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      verificationBadge: 'VERIFIED_STUDENT',
      collegeOrCompany: 'CET Trivandrum',
      compatibilityScore: 88,
    },
    status: 'ACTIVE',
    lastMessageAt: '2026-11-13T18:00:00Z',
    unreadCount: 0,
    lastMessage: {
      id: 'msg-005',
      conversationId: 'conv-002',
      senderUserId: 'usr-current-001',
      content: 'Thanks Rohit! Let me check with my work schedule and get back to you for a visit.',
      status: 'READ',
      createdAt: '2026-11-13T18:00:00Z',
    },
  },
];

export const MOCK_MESSAGES_CONV_001: ChatMessageItem[] = [
  {
    id: 'msg-001',
    conversationId: 'conv-001',
    senderUserId: 'usr-adarsh-002',
    content: "Hey! Saw your profile. Are you also looking at flats near Technopark Phase II?",
    status: 'READ',
    createdAt: '2026-11-14T10:32:00Z',
  },
  {
    id: 'msg-002',
    conversationId: 'conv-001',
    senderUserId: 'usr-current-001',
    content: "Hi Adarsh! Yes, looking for a 2BHK near Kazhakkoottam junction. Moving mid-next month.",
    status: 'READ',
    createdAt: '2026-11-14T10:35:00Z',
  },
  {
    id: 'msg-003',
    conversationId: 'conv-001',
    senderUserId: 'usr-adarsh-002',
    content: "Awesome! What's your target budget per head?",
    status: 'READ',
    createdAt: '2026-11-14T10:36:00Z',
  },
  {
    id: 'msg-004',
    conversationId: 'conv-001',
    senderUserId: 'usr-adarsh-002',
    content: 'Perfect! I visited Artech Lake Residency yesterday. Rent is ₹16k total (₹8k each). Want to check photos together?',
    status: 'DELIVERED',
    createdAt: '2026-11-14T10:37:00Z',
  },
];

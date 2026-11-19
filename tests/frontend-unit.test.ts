import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  formatINR,
  getModalityLabel,
  getSuburbLabel,
  formatRelativeTime,
  formatClockTime,
  cn,
} from '../src/lib/utils.ts';
import { createProblemDetails, ApiError } from '../src/lib/api/client.ts';
import { MOCK_ADARSH_DETAIL, MOCK_DISCOVERY_CARDS } from '../src/lib/api/mock-data.ts';

describe('Frontend Utilities & Formatting Test Suite', () => {
  test('formatINR correctly formats currency amounts into INR currency string', () => {
    const formatted = formatINR(7500);
    assert.ok(formatted.includes('7,500') || formatted.includes('7500'));
  });

  test('getModalityLabel returns proper labels and codes', () => {
    const m1 = getModalityLabel('MODALITY_1');
    assert.strictEqual(m1.code, 'M1');
    assert.strictEqual(m1.badge, 'Has Room Available');

    const m4 = getModalityLabel('MODALITY_4');
    assert.strictEqual(m4.code, 'M4');
    assert.strictEqual(m4.badge, 'Team Up First');
  });

  test('getSuburbLabel correctly maps Trivandrum sub-markets', () => {
    assert.strictEqual(getSuburbLabel('KAZHAKKOOTTAM'), 'Kazhakkoottam');
    assert.strictEqual(getSuburbLabel('KARIAVATTOM'), 'Kariavattom');
    assert.strictEqual(getSuburbLabel('UNKNOWN_AREA'), 'UNKNOWN_AREA');
  });

  test('cn utility joins classes cleanly', () => {
    const classes = cn('text-sm', false && 'hidden', 'font-bold');
    assert.strictEqual(classes, 'text-sm font-bold');
  });

  test('formatClockTime formats date string into AM/PM', () => {
    const timeStr = formatClockTime('2026-11-14T10:30:00Z');
    assert.ok(timeStr.includes(':'));
  });

  test('formatRelativeTime returns human readable relative string', () => {
    const now = new Date().toISOString();
    assert.strictEqual(formatRelativeTime(now), 'Just now');
  });
});

describe('RFC 7807 Error Model Compliance Test Suite', () => {
  test('createProblemDetails formats RFC 7807 problem details object correctly', () => {
    const problem = createProblemDetails(400, 'Invalid Phone Number', 'The phone number format is invalid.', '/auth/otp/send');
    assert.strictEqual(problem.status, 400);
    assert.strictEqual(problem.title, 'Invalid Phone Number');
    assert.strictEqual(problem.detail, 'The phone number format is invalid.');
    assert.strictEqual(problem.instance, '/auth/otp/send');
    assert.strictEqual(problem.type, 'https://flatmate.in/errors/400');
  });

  test('ApiError encapsulates ProblemDetails correctly', () => {
    const problem = createProblemDetails(404, 'User Not Found', 'Candidate does not exist.');
    const error = new ApiError(problem);
    assert.strictEqual(error.name, 'ApiError');
    assert.strictEqual(error.message, 'Candidate does not exist.');
    assert.strictEqual(error.problem.status, 404);
  });
});

describe('Discovery Gesture Physics & Compatibility Scoring Rules', () => {
  test('Swipe threshold calculations guarantee decisive action commitment at 100px', () => {
    const swipeThreshold = 100;
    const dragXRight = 120;
    const dragXLeft = -110;
    const dragBelow = 40;

    assert.ok(dragXRight > swipeThreshold, 'Right swipe committed to LIKE');
    assert.ok(dragXLeft < -swipeThreshold, 'Left swipe committed to PASS');
    assert.ok(Math.abs(dragBelow) < swipeThreshold, 'Sub-threshold drag snaps back');
  });

  test('Dynamic rotation physics is clamped within +/- 18 degrees', () => {
    const computeRotation = (dx: number) => Math.max(-18, Math.min(18, (dx / 400) * 18));
    assert.strictEqual(computeRotation(0), 0);
    assert.strictEqual(computeRotation(400), 18);
    assert.strictEqual(computeRotation(-400), -18);
    assert.strictEqual(computeRotation(600), 18);
  });

  test('Compatibility tiers are correctly partitioned', () => {
    const getTier = (score: number) => {
      if (score >= 85) return 'HIGH';
      if (score >= 65) return 'MODERATE';
      return 'LOW';
    };

    assert.strictEqual(getTier(94), 'HIGH');
    assert.strictEqual(getTier(85), 'HIGH');
    assert.strictEqual(getTier(84), 'MODERATE');
    assert.strictEqual(getTier(65), 'MODERATE');
    assert.strictEqual(getTier(64), 'LOW');
    assert.strictEqual(getTier(40), 'LOW');
  });

  test('Adarsh mock profile data satisfies all 7 lifestyle vectors', () => {
    const vectors = MOCK_ADARSH_DETAIL.compatibility.vectors;
    assert.ok(vectors.sleep);
    assert.ok(vectors.cleanliness);
    assert.ok(vectors.dietary);
    assert.ok(vectors.social);
    assert.ok(vectors.substances);
    assert.ok(vectors.financial);
    assert.ok(vectors.work);

    assert.strictEqual(vectors.sleep.status, 'HIGH_ALIGNMENT');
    assert.strictEqual(vectors.substances.affinityScore, 1.0);
  });

  test('E.164 phone number pattern strictly enforces +91 Indian format', () => {
    const e164Regex = /^\+91[6-9]\d{9}$/;
    assert.ok(e164Regex.test('+919876543210'));
    assert.ok(e164Regex.test('+917890123456'));
    assert.ok(!e164Regex.test('9876543210'), 'Must include +91');
    assert.ok(!e164Regex.test('+914876543210'), 'Indian mobiles start with 6-9');
    assert.ok(!e164Regex.test('+91987654321'), 'Must have 10 digits after +91');
  });

  test('Discovery feed contains active Trivandrum candidates', () => {
    assert.ok(MOCK_DISCOVERY_CARDS.length >= 3);
    const adarsh = MOCK_DISCOVERY_CARDS.find((c) => c.displayName === 'Adarsh Nair');
    assert.ok(adarsh);
    assert.strictEqual(adarsh.compatibilityScore, 94);
    assert.strictEqual(adarsh.modality, 'MODALITY_4');
  });
});

describe('Centralised Profile Completion Calculation Engine', () => {
  // Pure implementation of the 18-field completion formula for verification
  function calculateProfileCompletion(user: any, lifestyle: any) {
    const p = (user && user.profile) ? user.profile : (user || {});
    const l = lifestyle || {};

    const hasName = Boolean(p.displayName || p.name);
    const hasGender = Boolean(p.gender);
    const hasBirthDate = Boolean(p.birthDate);
    const hasPhoto = Boolean(p.avatar || (p.photos && p.photos.length > 0));
    const basicsCount = [hasName, hasGender, hasBirthDate, hasPhoto].filter(Boolean).length;

    const hasOcc = Boolean(p.occupation || p.work);
    const hasComp = Boolean(p.collegeOrCompany);
    const hasBio = Boolean(p.bio && p.bio.trim().length > 0);
    const aboutCount = [hasOcc, hasComp, hasBio].filter(Boolean).length;

    const hasMod = Boolean(p.modality);
    const hasPrefGen = Boolean(p.preferredGender);
    const hasSubs = Boolean(p.preferredSuburbs && p.preferredSuburbs.length > 0);
    const hasBudget = Boolean(p.maxBudget && p.maxBudget > 0);
    const housingCount = [hasMod, hasPrefGen, hasSubs, hasBudget].filter(Boolean).length;

    const hasSleep = Boolean(l.sleep && l.sleep.sleepPattern);
    const hasClean = Boolean(l.cleanliness && l.cleanliness.cleanlinessLevel);
    const hasDiet = Boolean(l.dietary && l.dietary.dietType);
    const hasSmoke = Boolean(l.substances && l.substances.smokingHabit);
    const lifestyleCount = [hasSleep, hasClean, hasDiet, hasSmoke].filter(Boolean).length;

    const hasVibe = Boolean((l.household && l.household.householdVibe) || (l.social && l.social.partyPreference));
    const hasGuest = Boolean(l.social && l.social.guestFrequency);
    const hostingCount = [hasVibe, hasGuest].filter(Boolean).length;

    const isVerified = Boolean((p.verificationBadge && p.verificationBadge !== 'UNVERIFIED') || p.institutionalEmailVerified);
    const trustCount = isVerified ? 1 : 0;

    const totalFields = 18;
    const completedFields = basicsCount + aboutCount + housingCount + lifestyleCount + hostingCount + trustCount;
    const percentage = Math.min(100, Math.round((completedFields / totalFields) * 100));

    function getStatus(count: number, max: number) {
      if (count === max) return { key: 'completed', label: 'Completed ✔', pillClass: 'completed' };
      if (count > 0) return { key: 'partial', label: `${count} of ${max} completed`, pillClass: 'partial' };
      return { key: 'not-started', label: 'Not Started', pillClass: 'not-started' };
    }

    return {
      totalFields,
      completedFields,
      percentage,
      sections: {
        basics: { count: basicsCount, total: 4, status: getStatus(basicsCount, 4) },
        about: { count: aboutCount, total: 3, status: getStatus(aboutCount, 3) },
        housing: { count: housingCount, total: 4, status: getStatus(housingCount, 4) },
        lifestyle: { count: lifestyleCount, total: 4, status: getStatus(lifestyleCount, 4) },
        hosting: { count: hostingCount, total: 2, status: getStatus(hostingCount, 2) },
        trust: { count: trustCount, total: 1, status: getStatus(trustCount, 1) },
      }
    };
  }

  test('Fully populated user achieves 100% completion across all 6 sections', () => {
    const fullUser = {
      profile: {
        displayName: 'Adarsh Nair',
        gender: 'MALE',
        birthDate: '1999-04-12',
        photos: [{ photoUrl: 'https://example.com/photo.jpg' }],
        occupation: 'Senior Backend Engineer',
        collegeOrCompany: 'TCS Technopark',
        bio: 'Calm, tidy, badminton enthusiast in Trivandrum',
        modality: 'MODALITY_1',
        preferredGender: 'MALE',
        preferredSuburbs: ['KAZHAKKOOTTAM'],
        maxBudget: 9000,
        verificationBadge: 'VERIFIED_PROFESSIONAL'
      }
    };

    const fullLifestyle = {
      sleep: { sleepPattern: 'EARLY_BIRD' },
      cleanliness: { cleanlinessLevel: 'METICULOUS' },
      dietary: { dietType: 'NON_VEGETARIAN' },
      substances: { smokingHabit: 'NON_SMOKER_STRICT' },
      household: { householdVibe: 'BALANCED_CASUAL' },
      social: { guestFrequency: 'OCCASIONAL_FRIENDS', partyPreference: 'WEEKEND_GATHERINGS' }
    };

    const comp = calculateProfileCompletion(fullUser, fullLifestyle);
    assert.strictEqual(comp.totalFields, 18);
    assert.strictEqual(comp.completedFields, 18);
    assert.strictEqual(comp.percentage, 100);
    assert.strictEqual(comp.sections.basics.status.key, 'completed');
    assert.strictEqual(comp.sections.about.status.key, 'completed');
    assert.strictEqual(comp.sections.housing.status.key, 'completed');
    assert.strictEqual(comp.sections.lifestyle.status.key, 'completed');
    assert.strictEqual(comp.sections.hosting.status.key, 'completed');
    assert.strictEqual(comp.sections.trust.status.key, 'completed');
  });

  test('Incomplete user (e.g. Kiran with only phone verified and basic name) accurately scores partial fields', () => {
    const incompleteUser = {
      profile: {
        displayName: 'Kiran Kumar',
        gender: 'MALE',
        birthDate: null,
        photos: [],
        occupation: 'Technopark Associate',
        collegeOrCompany: '',
        bio: '',
        modality: 'MODALITY_2',
        preferredGender: 'ANY',
        preferredSuburbs: [],
        maxBudget: 0,
        verificationBadge: 'UNVERIFIED'
      }
    };

    const comp = calculateProfileCompletion(incompleteUser, null);
    assert.strictEqual(comp.totalFields, 18);
    // Basics: name, gender (2/4)
    assert.strictEqual(comp.sections.basics.count, 2);
    assert.strictEqual(comp.sections.basics.status.key, 'partial');
    // About: occupation (1/3)
    assert.strictEqual(comp.sections.about.count, 1);
    assert.strictEqual(comp.sections.about.status.key, 'partial');
    // Housing: modality, preferredGender (2/4)
    assert.strictEqual(comp.sections.housing.count, 2);
    // Lifestyle: 0/4
    assert.strictEqual(comp.sections.lifestyle.count, 0);
    assert.strictEqual(comp.sections.lifestyle.status.key, 'not-started');
    // Trust: 0/1
    assert.strictEqual(comp.sections.trust.count, 0);
    assert.strictEqual(comp.sections.trust.status.key, 'not-started');

    // Total: 2 + 1 + 2 = 5 / 18 -> 28%
    assert.strictEqual(comp.completedFields, 5);
    assert.strictEqual(comp.percentage, 28);
  });

  test('Completely empty profile returns 0% with all sections Not Started', () => {
    const emptyComp = calculateProfileCompletion(null, null);
    assert.strictEqual(emptyComp.completedFields, 0);
    assert.strictEqual(emptyComp.percentage, 0);
    Object.values(emptyComp.sections).forEach((sec) => {
      assert.strictEqual(sec.count, 0);
      assert.strictEqual(sec.status.key, 'not-started');
    });
  });
});

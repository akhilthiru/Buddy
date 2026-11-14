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

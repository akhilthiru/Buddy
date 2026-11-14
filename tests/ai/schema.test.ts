/**
 * Flatmate AI Module – Schema Validation Unit Tests
 * 
 * Validates 100% schema conformance for Gemini structured outputs.
 * Complies with:
 * - docs/architecture/ai-architecture.md (Section 4)
 * - tests/ai/schema.test.ts requirement
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  HarmonyExplanationSchema,
  HarmonyExplanationSchemaValidator,
  HARMONY_EXPLANATION_JSON_SCHEMA,
  GEMINI_RESPONSE_SCHEMA,
} from '../../src/modules/ai/schemas.ts';

describe('HarmonyExplanation Schema Validation', () => {
  const validSample = {
    headline: 'Synchronized sleep rhythms and shared respect for tidy spaces',
    lifestyleHarmonies: [
      'Both maintain early morning schedules and quiet weeknight evenings.',
      'Shared dedication to immediate dishwashing and tidy kitchen areas.',
    ],
    potentialCompromises: 'Agree in advance on hosting weekend guests to maintain quiet downtime.',
    icebreakerPrompt: 'Hey! Looks like we both value a clean, quiet flat. When do you usually wake up?',
  };

  test('TC-AI-SCHEMA-01: Validates a fully compliant harmony explanation payload', () => {
    const result = HarmonyExplanationSchema.safeParse(validSample);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.headline, validSample.headline);
      assert.equal(result.data.lifestyleHarmonies.length, 2);
    }
  });

  test('TC-AI-SCHEMA-02: Accepts valid payload with 3 lifestyle harmonies', () => {
    const payload = {
      ...validSample,
      lifestyleHarmonies: [
        'Both adhere to early morning alarms and sleep before 11 PM.',
        'Shared dedication to immediate kitchen cleanup and tidy countertops.',
        'Aligned split of monthly expenses via Splitwise with zero delays.',
      ],
    };
    const result = HarmonyExplanationSchema.safeParse(payload);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.lifestyleHarmonies.length, 3);
    }
  });

  test('TC-AI-SCHEMA-03: Rejects payload missing required fields', () => {
    const missingHeadline = {
      lifestyleHarmonies: validSample.lifestyleHarmonies,
      potentialCompromises: validSample.potentialCompromises,
      icebreakerPrompt: validSample.icebreakerPrompt,
    };
    const res1 = HarmonyExplanationSchema.safeParse(missingHeadline);
    assert.equal(res1.success, false);

    const missingHarmonies = {
      headline: validSample.headline,
      potentialCompromises: validSample.potentialCompromises,
      icebreakerPrompt: validSample.icebreakerPrompt,
    };
    const res2 = HarmonyExplanationSchema.safeParse(missingHarmonies);
    assert.equal(res2.success, false);
  });

  test('TC-AI-SCHEMA-04: Enforces headline character bounds (5 to 80 chars)', () => {
    // Too short (< 5 chars)
    const tooShort = { ...validSample, headline: 'Fit' };
    const resShort = HarmonyExplanationSchema.safeParse(tooShort);
    assert.equal(resShort.success, false);

    // Too long (> 80 chars)
    const tooLong = {
      ...validSample,
      headline: 'This is an exceptionally long and verbose headline that exceeds the eighty character maximum limit',
    };
    const resLong = HarmonyExplanationSchema.safeParse(tooLong);
    assert.equal(resLong.success, false);
  });

  test('TC-AI-SCHEMA-05: Enforces lifestyleHarmonies array length bounds (2 to 3 items)', () => {
    // Only 1 item (< 2)
    const tooFew = {
      ...validSample,
      lifestyleHarmonies: ['Both adhere to early rest schedules.'],
    };
    const resFew = HarmonyExplanationSchema.safeParse(tooFew);
    assert.equal(resFew.success, false);

    // 4 items (> 3)
    const tooMany = {
      ...validSample,
      lifestyleHarmonies: [
        'Both adhere to early rest schedules and sleep by 11 PM.',
        'Shared kitchen cleanliness and immediate dishwashing.',
        'Prompt rent payment on the 1st of the month.',
        'Quiet remote work etiquette during daytime hours.',
      ],
    };
    const resMany = HarmonyExplanationSchema.safeParse(tooMany);
    assert.equal(resMany.success, false);
  });

  test('TC-AI-SCHEMA-06: Enforces length bounds on individual harmony strings (10 to 120 chars)', () => {
    const shortItem = {
      ...validSample,
      lifestyleHarmonies: ['Too short', 'Valid length harmony string here.'],
    };
    const resShort = HarmonyExplanationSchema.safeParse(shortItem);
    assert.equal(resShort.success, false);

    const longItem = {
      ...validSample,
      lifestyleHarmonies: [
        'A'.repeat(125),
        'Valid length harmony string here.',
      ],
    };
    const resLong = HarmonyExplanationSchema.safeParse(longItem);
    assert.equal(resLong.success, false);
  });

  test('TC-AI-SCHEMA-07: Enforces potentialCompromises length bounds (10 to 140 chars)', () => {
    const shortCompromise = { ...validSample, potentialCompromises: 'Short' };
    const resShort = HarmonyExplanationSchema.safeParse(shortCompromise);
    assert.equal(resShort.success, false);

    const longCompromise = { ...validSample, potentialCompromises: 'C'.repeat(145) };
    const resLong = HarmonyExplanationSchema.safeParse(longCompromise);
    assert.equal(resLong.success, false);
  });

  test('TC-AI-SCHEMA-08: Enforces icebreakerPrompt length bounds (10 to 120 chars)', () => {
    const shortIcebreaker = { ...validSample, icebreakerPrompt: 'Hi there' };
    const resShort = HarmonyExplanationSchema.safeParse(shortIcebreaker);
    assert.equal(resShort.success, false);

    const longIcebreaker = { ...validSample, icebreakerPrompt: 'I'.repeat(125) };
    const resLong = HarmonyExplanationSchema.safeParse(longIcebreaker);
    assert.equal(resLong.success, false);
  });

  test('TC-AI-SCHEMA-09: Rejects unrecognized extra properties in strict mode', () => {
    const injectedPayload = {
      ...validSample,
      extraInjectedKey: 'malicious payload injection',
    };
    const result = HarmonyExplanationSchema.safeParse(injectedPayload);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.code === 'unrecognized_keys'));
    }
  });

  test('TC-AI-SCHEMA-10: Rejects non-object and null inputs', () => {
    assert.equal(HarmonyExplanationSchema.safeParse(null).success, false);
    assert.equal(HarmonyExplanationSchema.safeParse('string payload').success, false);
    assert.equal(HarmonyExplanationSchema.safeParse(12345).success, false);
    assert.equal(HarmonyExplanationSchema.safeParse([]).success, false);
  });

  test('TC-AI-SCHEMA-11: parse() throws descriptive error on invalid inputs', () => {
    assert.throws(
      () => HarmonyExplanationSchemaValidator.parse({ headline: 123 }),
      /HarmonyExplanation validation failed/
    );
  });

  test('TC-AI-SCHEMA-12: Conforms to JSON Schema and Gemini structured output specifications', () => {
    assert.equal(HARMONY_EXPLANATION_JSON_SCHEMA.type, 'object');
    assert.equal(HARMONY_EXPLANATION_JSON_SCHEMA.additionalProperties, false);
    assert.deepEqual(HARMONY_EXPLANATION_JSON_SCHEMA.required, [
      'headline',
      'lifestyleHarmonies',
      'potentialCompromises',
      'icebreakerPrompt',
    ]);

    assert.equal(GEMINI_RESPONSE_SCHEMA.type, 'OBJECT');
    assert.deepEqual(GEMINI_RESPONSE_SCHEMA.required, [
      'headline',
      'lifestyleHarmonies',
      'potentialCompromises',
      'icebreakerPrompt',
    ]);
  });
});

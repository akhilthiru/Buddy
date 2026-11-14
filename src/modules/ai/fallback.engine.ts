/**
 * Flatmate AI Module – Deterministic Fallback Engine
 * 
 * Instant rule-based harmony note generator activated when:
 * - Gemini API times out (>800ms)
 * - Gemini API returns rate limits (HTTP 429) or 5xx errors
 * - Circuit breaker is tripped
 * - Response fails strict schema validation
 * 
 * Complies with:
 * - docs/architecture/ai-architecture.md (Section 7)
 * - NFR-PERF-06 (<50ms fallback latency)
 */

import type { HarmonyExplanation } from './schemas.ts';
import { HarmonyExplanationSchemaValidator } from './schemas.ts';

const VECTOR_HARMONY_DESCRIPTIONS: Record<string, string> = {
  sleep: 'Aligned sleep rhythms ensuring quiet resting hours.',
  cleanliness: 'Compatible standards for shared space and kitchen cleanliness.',
  dietary: 'Mutually comfortable cooking habits and kitchen arrangements.',
  social: 'Shared expectations around weekend visitors and quiet evenings.',
  substances: 'Identical preferences regarding household smoking and alcohol policies.',
  financial: 'Shared commitment to timely rent settlement and transparent expense splits.',
  work: 'Compatible daytime occupancy schedules and remote work environments.',
};

const VECTOR_COMPROMISE_DESCRIPTIONS: Record<string, string> = {
  sleep: 'Coordinate morning alarm times and quiet evening hours.',
  cleanliness: 'Agree on a rotating chore schedule for shared kitchen and living areas.',
  dietary: 'Discuss utensil arrangements and kitchen storage preferences.',
  social: 'Agree in advance on hosting friends and weekend quiet hours.',
  substances: 'Confirm household boundaries regarding balcony or outdoor spaces.',
  financial: 'Confirm preferred expense tracking method and utility payment dates.',
  work: 'Coordinate desk space and phone call etiquette during work hours.',
};

export interface FallbackHarmonyOptions {
  score: number;
  highVectors?: string[];
  divergentVector?: string | null;
  suburbZone?: string;
}

/**
 * Generate deterministic fallback harmony summary in sub-millisecond execution time
 */
export function generateFallbackHarmony(options: FallbackHarmonyOptions | number): HarmonyExplanation {
  let score: number;
  let highVectors: string[] = ['cleanliness', 'sleep'];
  let divergentVector: string | null = null;

  if (typeof options === 'number') {
    score = Math.round(options);
  } else {
    score = Math.round(options.score);
    if (options.highVectors && options.highVectors.length > 0) {
      highVectors = options.highVectors;
    }
    divergentVector = options.divergentVector || null;
  }

  // 1. Headline (5-80 chars)
  let headline: string;
  if (score >= 90) {
    headline = `Exceptional mutual alignment (${score}%) across core living rhythms`;
  } else if (score >= 80) {
    headline = `Strong mutual compatibility (${score}%) across shared habits`;
  } else if (score >= 70) {
    headline = `Solid daily compatibility (${score}%) with complementary routines`;
  } else {
    headline = `Balanced living compatibility (${score}%) with common daily ground`;
  }

  // Ensure headline stays strictly <= 80 chars
  if (headline.length > 80) {
    headline = `Strong mutual compatibility (${score}%) across living habits`;
  }

  // 2. Lifestyle Harmonies (2-3 items, each 10-120 chars)
  const harmonies: string[] = [];
  const selectedVectors = highVectors.slice(0, 3);

  for (const v of selectedVectors) {
    const key = v.toLowerCase().trim();
    if (VECTOR_HARMONY_DESCRIPTIONS[key]) {
      harmonies.push(VECTOR_HARMONY_DESCRIPTIONS[key]!);
    } else {
      harmonies.push(`Compatible expectations and mutual respect regarding ${key}.`);
    }
    if (harmonies.length >= 3) break;
  }

  // Ensure minimum 2 harmonies
  if (harmonies.length < 2) {
    harmonies.push('Mutual interest in maintaining a comfortable, respectful co-living home.');
  }
  if (harmonies.length < 2) {
    harmonies.push('Predictable daily schedules that align well with shared apartment life.');
  }

  // 3. Potential Compromises (10-140 chars)
  let potentialCompromises: string;
  if (divergentVector) {
    const key = divergentVector.toLowerCase().trim();
    potentialCompromises = VECTOR_COMPROMISE_DESCRIPTIONS[key] ||
      `Discuss mutual preferences regarding ${key} to ensure smooth day-to-day coordination.`;
  } else {
    potentialCompromises = 'No notable lifestyle divergences identified; connect to confirm house rules.';
  }

  if (potentialCompromises.length > 140) {
    potentialCompromises = potentialCompromises.substring(0, 137) + '...';
  }

  // 4. Icebreaker Prompt (10-120 chars)
  let icebreakerPrompt: string;
  const primaryHigh = selectedVectors[0]?.toLowerCase().trim();

  if (primaryHigh === 'sleep') {
    icebreakerPrompt = 'Hey! Looks like we have similar sleep schedules. When do you usually wind down?';
  } else if (primaryHigh === 'cleanliness') {
    icebreakerPrompt = 'Hey! Saw that you also value a tidy place. How do you like organizing chores?';
  } else if (primaryHigh === 'work') {
    icebreakerPrompt = 'Hey! Looks like our work routines match nicely. How does your weekly schedule look?';
  } else {
    icebreakerPrompt = 'Hey! We have high lifestyle compatibility. Excited to chat about looking for a flat!';
  }

  if (icebreakerPrompt.length > 120) {
    icebreakerPrompt = 'Hey! Looks like our living preferences match nicely. Excited to connect!';
  }

  const result: HarmonyExplanation = {
    headline,
    lifestyleHarmonies: harmonies.slice(0, 3),
    potentialCompromises,
    icebreakerPrompt,
  };

  // Runtime assertion check (always valid)
  return HarmonyExplanationSchemaValidator.parse(result);
}

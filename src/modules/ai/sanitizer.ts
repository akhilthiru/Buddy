/**
 * Flatmate AI Module – Zero-PII Sanitizer & Anonymizer Pipeline
 * 
 * Strict DPDP Act 2023 Compliance & Prompt Injection Defense.
 * Complies with:
 * - docs/architecture/ai-architecture.md (Section 3: PII Scrubbing & Security Guardrails)
 * - docs/architecture/threat-model.md (TH-I-04, LLM Defense Specifications)
 */

import type { LifestyleVectors, VectorBreakdownMap } from './schemas.ts';

export interface RawUserProfileInput {
  userId?: string;
  displayName?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  bio?: string;
  suburb?: string;
  institutionOrCompany?: string;
  vectors: LifestyleVectors;
}

export interface AnonymizedPromptPayload {
  compatibilityScore: number;
  userA: {
    label: string;
    suburbZone: string;
    vectors: LifestyleVectors;
    sanitizedBioSnippet?: string;
  };
  userB: {
    label: string;
    suburbZone: string;
    vectors: LifestyleVectors;
    sanitizedBioSnippet?: string;
  };
  highlightedOverlaps: string[];
  divergencePoints: string[];
  serializedPromptData: string;
}

/**
 * Known Trivandrum micro-market suburb mappings to coarsened zones
 * Prevents pinpoint geolocation triangulation (TH-I-02)
 */
export const SUBURB_ZONE_MAP: Record<string, string> = {
  // North Tech Corridor (Technopark / IT zone)
  kazhakkoottam: 'North Tech Corridor',
  kazhakoottam: 'North Tech Corridor',
  kariavattom: 'North Tech Corridor',
  technopark: 'North Tech Corridor',
  kulathoor: 'North Tech Corridor',
  attenkuzhy: 'North Tech Corridor',
  chavadimukku: 'North Tech Corridor',
  pangappara: 'North Tech Corridor',
  manvila: 'North Tech Corridor',

  // Central Academic Zone (CET, University, Medical College)
  sreekaryam: 'Central Academic Zone',
  ulloor: 'Central Academic Zone',
  medicalcollege: 'Central Academic Zone',
  'medical college': 'Central Academic Zone',
  cheruvakkal: 'Central Academic Zone',
  kesavadasapuram: 'Central Academic Zone',
  paruthippara: 'Central Academic Zone',

  // East Residential Corridor
  kowdiar: 'East Residential Corridor',
  pattom: 'East Residential Corridor',
  sasthamangalam: 'East Residential Corridor',
  vellayambalam: 'East Residential Corridor',
  kuravankonam: 'East Residential Corridor',
  nandavanam: 'East Residential Corridor',
  peroorkada: 'East Residential Corridor',

  // South Central Hub
  manacaud: 'South Central Hub',
  'east fort': 'South Central Hub',
  eastfort: 'South Central Hub',
  thampanoor: 'South Central Hub',
  palayam: 'South Central Hub',
  vanchiyoor: 'South Central Hub',
  petta: 'South Central Hub',
  pettah: 'South Central Hub',
};

/**
 * Regex Patterns for PII Identification & Redaction
 */
export const PII_PATTERNS = {
  // Indian Phone Numbers (+91 9876543210, 09876543210, 98765-43210, +919876543210, 10-digit Indian mobiles)
  phone: /(?:(?:\+91|0091|0)[\s\-]?)?(?:[6-9]\d{9}|[6-9]\d{4}[\s\-]?\d{5}|[6-9]\d{2}[\s\-]?\d{3}[\s\-]?\d{4})\b/g,

  // Email Addresses
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,

  // UPI IDs / Payment Handles
  upi: /[a-zA-Z0-9.\-_]{2,256}@(oksbi|okhdfcbank|okaxis|okicici|paytm|gpay|ybl|upi|apl|axl|ibl|barodampay|federal)\b/gi,

  // URLs & Web Links
  url: /(?:https?:\/\/|www\.)[^\s<>"'{}|\\^`\[\]]+/gi,

  // Social Handles (@username, Instagram / Telegram / Twitter / LinkedIn patterns)
  socialHandle: /(?:^|[\s,;:])@([a-zA-Z0-9._]{3,30})\b/g,

  // Delimiter Escape & Prompt Injection Sequences
  promptInjectionPhrases: /(?:ignore\s+(?:all\s+)?previous\s+instructions|forget\s+(?:all\s+)?previous\s+instructions|system\s+prompt|system\s+override:?|disregard\s+(?:the\s+above|all\s+prior)|dan\s+mode|jailbreak|new\s+system\s+directive|developer\s+mode|you\s+are\s+now|override\s+instructions|act\s+as\s+an?\s+unrestricted|system\s*:|instructions?\s*:|assistant\s*:|output\s+the\s+system\s+prompt|reveal\s+your\s+prompt|do\s+anything\s+now)/gi,

  // XML / HTML tags that could break prompt boundaries
  xmlTags: /<\/?[a-zA-Z0-9_:\-]+(?:\s+[^>]*?)?\/?>/g,
};

/**
 * Coarsen a Trivandrum suburb name into a generic geographic corridor
 */
export function coarsenSuburb(suburb?: string): string {
  if (!suburb) return 'Trivandrum Urban Area';
  const clean = suburb.toLowerCase().trim().replace(/[^a-z0-9 ]/g, '');
  if (SUBURB_ZONE_MAP[clean]) {
    return SUBURB_ZONE_MAP[clean];
  }
  // Check substring matches
  for (const [key, zone] of Object.entries(SUBURB_ZONE_MAP)) {
    if (clean.includes(key)) {
      return zone;
    }
  }
  return 'Trivandrum Urban Area';
}

/**
 * Sanitize untrusted user-authored text (such as bio snippets)
 * - Masks phone numbers, emails, UPI handles, URLs, and social tags
 * - Strips injection phrases and control/XML delimiters
 * - Truncates to max 150 characters
 * - Safely escapes characters
 */
export function sanitizeBioText(rawBio?: string): string {
  if (!rawBio || typeof rawBio !== 'string') {
    return '';
  }

  let text = rawBio;

  // 1. Redact Phone Numbers
  text = text.replace(PII_PATTERNS.phone, '[REDACTED_CONTACT]');

  // 2. Redact UPI IDs
  text = text.replace(PII_PATTERNS.upi, '[REDACTED_UPI]');

  // 3. Redact Emails
  text = text.replace(PII_PATTERNS.email, '[REDACTED_EMAIL]');

  // 4. Redact URLs
  text = text.replace(PII_PATTERNS.url, '[REDACTED_LINK]');

  // 5. Redact Social Handles
  text = text.replace(PII_PATTERNS.socialHandle, (match, handle) => {
    return match.replace(`@${handle}`, '[REDACTED_HANDLE]');
  });

  // 6. Neutralize Prompt Injection attempts
  text = text.replace(PII_PATTERNS.promptInjectionPhrases, '[NEUTRALIZED_PROMPT_DIRECTIVE]');

  // 7. Strip all HTML/XML tags
  text = text.replace(PII_PATTERNS.xmlTags, '');

  // 8. Normalize whitespace and clean control characters
  text = text.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();

  // 9. Truncate to maximum 150 characters per specification
  if (text.length > 150) {
    text = text.substring(0, 147) + '...';
  }

  return text;
}

/**
 * Check whether any text contains unmasked PII
 * Used in evaluation scripts and security assertion guards
 */
export function containsUnmaskedPII(text: string): { hasPII: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (PII_PATTERNS.phone.test(text)) {
    reasons.push('Detected unmasked phone number');
  }
  PII_PATTERNS.phone.lastIndex = 0;

  if (PII_PATTERNS.email.test(text)) {
    reasons.push('Detected unmasked email address');
  }
  PII_PATTERNS.email.lastIndex = 0;

  if (PII_PATTERNS.upi.test(text)) {
    reasons.push('Detected unmasked UPI ID');
  }
  PII_PATTERNS.upi.lastIndex = 0;

  if (PII_PATTERNS.url.test(text)) {
    reasons.push('Detected unmasked URL');
  }
  PII_PATTERNS.url.lastIndex = 0;

  return {
    hasPII: reasons.length > 0,
    reasons,
  };
}

/**
 * Zero-PII Anonymization Pipeline
 * 
 * Transforms two raw user profiles and their deterministic match breakdown into an
 * air-gapped, zero-PII payload ready for Gemini input.
 * Strips all personal names, exact locations, contact methods, and institution names.
 */
export function anonymizeProfiles(params: {
  userA: RawUserProfileInput;
  userB: RawUserProfileInput;
  compatibilityScore: number;
  vectorBreakdown?: VectorBreakdownMap;
}): AnonymizedPromptPayload {
  const { userA, userB, compatibilityScore, vectorBreakdown } = params;

  // 1. Coarsen suburb locations
  const suburbZoneA = coarsenSuburb(userA.suburb);
  const suburbZoneB = coarsenSuburb(userB.suburb);

  // 2. Sanitize bios if present
  const bioA = userA.bio ? sanitizeBioText(userA.bio) : undefined;
  const bioB = userB.bio ? sanitizeBioText(userB.bio) : undefined;

  // 3. Extract High Alignment Overlaps & Divergence Points
  const highlightedOverlaps: string[] = [];
  const divergencePoints: string[] = [];

  if (vectorBreakdown) {
    for (const [vecKey, detail] of Object.entries(vectorBreakdown)) {
      const vecTitle = vecKey.charAt(0).toUpperCase() + vecKey.slice(1);
      if (detail.status === 'HIGH_ALIGNMENT' || detail.affinityScore >= 0.85) {
        highlightedOverlaps.push(`${vecTitle} (Alignment: ${Math.round(detail.affinityScore * 100)}%)`);
      } else if (detail.status === 'DISCUSSION_POINT' || detail.affinityScore < 0.55) {
        divergencePoints.push(`${vecTitle} (User A: ${detail.userChoice} vs User B: ${detail.candidateChoice})`);
      }
    }
  }

  // Fallbacks if vector breakdown is not explicitly passed
  if (highlightedOverlaps.length === 0) {
    highlightedOverlaps.push('Core daily rhythms and co-living expectations');
  }

  // 4. Construct compact, zero-PII serialized string
  const serializedLines: string[] = [
    `EVALUATION DATA:`,
    `- Compatibility Score: ${Math.round(compatibilityScore)}%`,
    `- User A: Sleep=${userA.vectors.sleep}, Cleanliness=${userA.vectors.cleanliness}, Diet=${userA.vectors.dietary}, Social=${userA.vectors.social}, Substances=${userA.vectors.substances}, Financial=${userA.vectors.financial}, Work=${userA.vectors.work}, Zone=${suburbZoneA}`,
    `- User B: Sleep=${userB.vectors.sleep}, Cleanliness=${userB.vectors.cleanliness}, Diet=${userB.vectors.dietary}, Social=${userB.vectors.social}, Substances=${userB.vectors.substances}, Financial=${userB.vectors.financial}, Work=${userB.vectors.work}, Zone=${suburbZoneB}`,
    `- High Overlaps: ${highlightedOverlaps.join(', ')}`,
    `- Divergence Points: ${divergencePoints.length > 0 ? divergencePoints.join('; ') : 'None identified'}`,
  ];

  if (bioA) {
    serializedLines.push(`<untrusted_user_snippet user="A">\n${bioA}\n</untrusted_user_snippet>`);
  }
  if (bioB) {
    serializedLines.push(`<untrusted_user_snippet user="B">\n${bioB}\n</untrusted_user_snippet>`);
  }

  serializedLines.push(`Generate the structured harmony analysis conforming strictly to schema.`);

  return {
    compatibilityScore,
    userA: {
      label: 'User A',
      suburbZone: suburbZoneA,
      vectors: userA.vectors,
      sanitizedBioSnippet: bioA,
    },
    userB: {
      label: 'User B',
      suburbZone: suburbZoneB,
      vectors: userB.vectors,
      sanitizedBioSnippet: bioB,
    },
    highlightedOverlaps,
    divergencePoints,
    serializedPromptData: serializedLines.join('\n'),
  };
}

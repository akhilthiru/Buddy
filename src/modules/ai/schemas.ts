/**
 * Flatmate AI Module – Strict Schemas & Validation Contracts
 * 
 * Complies with:
 * - docs/architecture/ai-architecture.md (Section 4)
 * - docs/architecture/api-spec.yaml (HarmonyExplanation)
 * - docs/architecture/threat-model.md (TH-I-04, LLM Guardrails)
 */

export interface HarmonyExplanation {
  /** Engaging punchy 1-sentence synthesis of key common ground (5-80 chars) */
  headline: string;
  /** 2 to 3 specific positive alignments in daily rhythms or values (each 10-120 chars) */
  lifestyleHarmonies: string[];
  /** Gentle, non-judgmental flag of a minor lifestyle divergence to discuss (10-140 chars) */
  potentialCompromises: string;
  /** Friendly, contextual conversation starter question for the chat (10-120 chars) */
  icebreakerPrompt: string;
}

export interface ValidationIssue {
  path: string[];
  message: string;
  code: string;
}

export type SafeParseResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: { issues: ValidationIssue[]; message: string }; data?: never };

/**
 * 7-Vector Lifestyle Profile Input
 */
export interface LifestyleVectors {
  sleep: string;
  cleanliness: string;
  dietary: string;
  social: string;
  substances: string;
  financial: string;
  work: string;
}

export type AlignmentStatus = 'HIGH_ALIGNMENT' | 'MODERATE_ALIGNMENT' | 'DISCUSSION_POINT';

export interface VectorAlignmentDetail {
  affinityScore: number;
  status: AlignmentStatus;
  userChoice: string;
  candidateChoice: string;
  notes: string;
}

export type VectorBreakdownMap = Record<
  'sleep' | 'cleanliness' | 'dietary' | 'social' | 'substances' | 'financial' | 'work',
  VectorAlignmentDetail
>;

/**
 * Strict Schema Validator for HarmonyExplanation
 * Enforces strict limits:
 * - headline: 5-80 chars
 * - lifestyleHarmonies: array of 2-3 items, each 10-120 chars
 * - potentialCompromises: 10-140 chars
 * - icebreakerPrompt: 10-120 chars
 * - additionalProperties: false (rejects unexpected keys)
 */
export class HarmonyExplanationSchemaValidator {
  static readonly ALLOWED_KEYS = new Set([
    'headline',
    'lifestyleHarmonies',
    'potentialCompromises',
    'icebreakerPrompt',
  ]);

  static safeParse(input: unknown): SafeParseResult<HarmonyExplanation> {
    const issues: ValidationIssue[] = [];

    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return {
        success: false,
        error: {
          issues: [{ path: [], message: 'Expected an object payload', code: 'invalid_type' }],
          message: 'Expected an object payload',
        },
      };
    }

    const obj = input as Record<string, unknown>;

    // Strict check: No extra unexpected properties
    for (const key of Object.keys(obj)) {
      if (!this.ALLOWED_KEYS.has(key)) {
        issues.push({
          path: [key],
          message: `Unrecognized property '${key}' is not permitted in strict mode`,
          code: 'unrecognized_keys',
        });
      }
    }

    // 1. headline: string, 5-80 chars
    if (typeof obj['headline'] !== 'string') {
      issues.push({
        path: ['headline'],
        message: 'headline must be a string',
        code: 'invalid_type',
      });
    } else {
      const trimmed = obj['headline'].trim();
      if (trimmed.length < 5) {
        issues.push({
          path: ['headline'],
          message: `headline must be at least 5 characters (received ${trimmed.length})`,
          code: 'too_small',
        });
      } else if (trimmed.length > 80) {
        issues.push({
          path: ['headline'],
          message: `headline must not exceed 80 characters (received ${trimmed.length})`,
          code: 'too_big',
        });
      }
    }

    // 2. lifestyleHarmonies: array of strings, minItems 2, maxItems 3, each 10-120 chars
    if (!Array.isArray(obj['lifestyleHarmonies'])) {
      issues.push({
        path: ['lifestyleHarmonies'],
        message: 'lifestyleHarmonies must be an array of strings',
        code: 'invalid_type',
      });
    } else {
      const arr = obj['lifestyleHarmonies'];
      if (arr.length < 2) {
        issues.push({
          path: ['lifestyleHarmonies'],
          message: `lifestyleHarmonies must contain at least 2 items (received ${arr.length})`,
          code: 'too_small',
        });
      } else if (arr.length > 3) {
        issues.push({
          path: ['lifestyleHarmonies'],
          message: `lifestyleHarmonies must not exceed 3 items (received ${arr.length})`,
          code: 'too_big',
        });
      }

      arr.forEach((item, index) => {
        if (typeof item !== 'string') {
          issues.push({
            path: ['lifestyleHarmonies', index.toString()],
            message: `lifestyleHarmonies[${index}] must be a string`,
            code: 'invalid_type',
          });
        } else {
          const itemTrimmed = item.trim();
          if (itemTrimmed.length < 10) {
            issues.push({
              path: ['lifestyleHarmonies', index.toString()],
              message: `lifestyleHarmonies[${index}] must be at least 10 characters (received ${itemTrimmed.length})`,
              code: 'too_small',
            });
          } else if (itemTrimmed.length > 120) {
            issues.push({
              path: ['lifestyleHarmonies', index.toString()],
              message: `lifestyleHarmonies[${index}] must not exceed 120 characters (received ${itemTrimmed.length})`,
              code: 'too_big',
            });
          }
        }
      });
    }

    // 3. potentialCompromises: string, 10-140 chars
    if (typeof obj['potentialCompromises'] !== 'string') {
      issues.push({
        path: ['potentialCompromises'],
        message: 'potentialCompromises must be a string',
        code: 'invalid_type',
      });
    } else {
      const trimmed = obj['potentialCompromises'].trim();
      if (trimmed.length < 10) {
        issues.push({
          path: ['potentialCompromises'],
          message: `potentialCompromises must be at least 10 characters (received ${trimmed.length})`,
          code: 'too_small',
        });
      } else if (trimmed.length > 140) {
        issues.push({
          path: ['potentialCompromises'],
          message: `potentialCompromises must not exceed 140 characters (received ${trimmed.length})`,
          code: 'too_big',
        });
      }
    }

    // 4. icebreakerPrompt: string, 10-120 chars
    if (typeof obj['icebreakerPrompt'] !== 'string') {
      issues.push({
        path: ['icebreakerPrompt'],
        message: 'icebreakerPrompt must be a string',
        code: 'invalid_type',
      });
    } else {
      const trimmed = obj['icebreakerPrompt'].trim();
      if (trimmed.length < 10) {
        issues.push({
          path: ['icebreakerPrompt'],
          message: `icebreakerPrompt must be at least 10 characters (received ${trimmed.length})`,
          code: 'too_small',
        });
      } else if (trimmed.length > 120) {
        issues.push({
          path: ['icebreakerPrompt'],
          message: `icebreakerPrompt must not exceed 120 characters (received ${trimmed.length})`,
          code: 'too_big',
        });
      }
    }

    if (issues.length > 0) {
      return {
        success: false,
        error: {
          issues,
          message: issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
        },
      };
    }

    return {
      success: true,
      data: {
        headline: (obj['headline'] as string).trim(),
        lifestyleHarmonies: (obj['lifestyleHarmonies'] as string[]).map((s) => s.trim()),
        potentialCompromises: (obj['potentialCompromises'] as string).trim(),
        icebreakerPrompt: (obj['icebreakerPrompt'] as string).trim(),
      },
    };
  }

  static parse(input: unknown): HarmonyExplanation {
    const result = this.safeParse(input);
    if (!result.success) {
      const error = new Error(`HarmonyExplanation validation failed: ${result.error.message}`);
      (error as unknown as { issues: ValidationIssue[] }).issues = result.error.issues;
      throw error;
    }
    return result.data;
  }
}

/**
 * Standard Zod-compatible interface export for seamless drop-in
 */
export const HarmonyExplanationSchema = {
  safeParse: (input: unknown) => HarmonyExplanationSchemaValidator.safeParse(input),
  parse: (input: unknown) => HarmonyExplanationSchemaValidator.parse(input),
};

/**
 * Draft 2020-12 JSON Schema for HarmonyExplanation
 * Conforms to docs/architecture/ai-architecture.md Section 4.1
 */
export const HARMONY_EXPLANATION_JSON_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'HarmonyExplanation',
  type: 'object',
  required: ['headline', 'lifestyleHarmonies', 'potentialCompromises', 'icebreakerPrompt'],
  properties: {
    headline: {
      type: 'string',
      minLength: 5,
      maxLength: 80,
      description: 'Engaging punchy 1-sentence synthesis of key common ground.',
    },
    lifestyleHarmonies: {
      type: 'array',
      minItems: 2,
      maxItems: 3,
      items: {
        type: 'string',
        minLength: 10,
        maxLength: 120,
        description: 'Specific positive alignment in daily rhythms or values.',
      },
      description: 'Two to three specific lifestyle harmonies.',
    },
    potentialCompromises: {
      type: 'string',
      minLength: 10,
      maxLength: 140,
      description: 'Gentle, non-judgmental flag of a minor lifestyle divergence to discuss.',
    },
    icebreakerPrompt: {
      type: 'string',
      minLength: 10,
      maxLength: 120,
      description: 'Friendly, contextual conversation starter question for the chat.',
    },
  },
  additionalProperties: false,
} as const;

/**
 * Google Gemini API Structured Output Response Schema
 * Gemini requires standard OpenAPI 3.0 schema subset
 */
export const GEMINI_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    headline: {
      type: 'STRING',
      description: 'Engaging punchy 1-sentence synthesis of key common ground (5-80 chars).',
    },
    lifestyleHarmonies: {
      type: 'ARRAY',
      items: {
        type: 'STRING',
        description: 'Positive alignment in daily rhythms or values (10-120 chars).',
      },
      description: 'Exactly 2 or 3 bullet points highlighting mutual habits.',
    },
    potentialCompromises: {
      type: 'STRING',
      description: 'Gentle, constructive discussion topic for lifestyle differences (10-140 chars).',
    },
    icebreakerPrompt: {
      type: 'STRING',
      description: 'Friendly, contextual question to break the ice in chat (10-120 chars).',
    },
  },
  required: ['headline', 'lifestyleHarmonies', 'potentialCompromises', 'icebreakerPrompt'],
} as const;

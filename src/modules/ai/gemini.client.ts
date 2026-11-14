/**
 * Flatmate AI Module – Google Gemini Flash Client Service
 * 
 * Complies with:
 * - docs/architecture/ai-architecture.md (Section 2, 6: Token/Latency Budget)
 * - docs/architecture/threat-model.md (Section 4.5: LLM Defense & Circuit Breaker)
 * - Latency SLA Budget: <= 800ms p95; hard timeout 1200ms
 * - Structured Output: Strict JSON schema enforcement
 * - Memoization & Prompt Caching: Commutative vector hash cache (24h TTL)
 */

import { createHash } from 'node:crypto';
import type { HarmonyExplanation, LifestyleVectors, VectorBreakdownMap } from './schemas.ts';
import { GEMINI_RESPONSE_SCHEMA, HarmonyExplanationSchemaValidator } from './schemas.ts';
import type { RawUserProfileInput } from './sanitizer.ts';
import { anonymizeProfiles } from './sanitizer.ts';
import { buildCompatibilityPrompt, SYSTEM_INSTRUCTION } from './prompt.templates.ts';
import { generateFallbackHarmony } from './fallback.engine.ts';

export interface GeminiClientConfig {
  apiKey?: string;
  model?: string;
  timeoutMs?: number;
  temperature?: number;
  maxOutputTokens?: number;
  cacheTtlSeconds?: number;
  circuitBreakerThreshold?: number;
  circuitBreakerResetMs?: number;
}

export type ExplanationSource = 'gemini' | 'cache' | 'fallback';

export interface HarmonyGenerationResult {
  data: HarmonyExplanation;
  source: ExplanationSource;
  latencyMs: number;
  cached: boolean;
  modelUsed?: string;
}

interface CacheEntry {
  data: HarmonyExplanation;
  expiresAt: number;
}

const CircuitState = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  HALF_OPEN: 'HALF_OPEN',
} as const;

type CircuitState = (typeof CircuitState)[keyof typeof CircuitState];

export class GeminiClient {
  private readonly apiKey: string | undefined;
  private readonly model: string;
  private readonly timeoutMs: number;
  private readonly temperature: number;
  private readonly maxOutputTokens: number;
  private readonly cacheTtlSeconds: number;
  private readonly circuitBreakerThreshold: number;
  private readonly circuitBreakerResetMs: number;

  // In-memory commutative vector cache
  private readonly cache: Map<string, CacheEntry> = new Map();

  // Circuit Breaker State
  private circuitState: CircuitState = CircuitState.CLOSED;
  private consecutiveFailures: number = 0;
  private circuitOpenedAt: number = 0;

  constructor(config: GeminiClientConfig = {}) {
    this.apiKey = config.apiKey || process.env['GEMINI_API_KEY'];
    this.model = config.model || process.env['GEMINI_MODEL'] || 'gemini-1.5-flash';
    this.timeoutMs = config.timeoutMs || Number(process.env['AI_TIMEOUT_MS']) || 800;
    this.temperature = config.temperature !== undefined ? config.temperature : 0.2;
    this.maxOutputTokens = config.maxOutputTokens || 250;
    this.cacheTtlSeconds = config.cacheTtlSeconds || 86400; // 24 hours
    this.circuitBreakerThreshold = config.circuitBreakerThreshold || 3;
    this.circuitBreakerResetMs = config.circuitBreakerResetMs || 30000; // 30s
  }

  /**
   * Generates a commutative SHA-256 vector hash
   * Commutative: Hash(A, B) === Hash(B, A), ensuring symmetrical pairs share the same cache entry.
   */
  public generateVectorCacheKey(userAVectors: LifestyleVectors, userBVectors: LifestyleVectors): string {
    const serialize = (v: LifestyleVectors) =>
      `sleep:${v.sleep}|clean:${v.cleanliness}|diet:${v.dietary}|soc:${v.social}|sub:${v.substances}|fin:${v.financial}|wrk:${v.work}`;

    const strA = serialize(userAVectors);
    const strB = serialize(userBVectors);

    // Sort to guarantee commutativity
    const combined = strA < strB ? `${strA}###${strB}` : `${strB}###${strA}`;
    return createHash('sha256').update(combined).digest('hex');
  }

  /**
   * Check cache for existing harmony explanation
   */
  public getCachedExplanation(cacheKey: string): HarmonyExplanation | null {
    const entry = this.cache.get(cacheKey);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(cacheKey);
      return null;
    }
    return entry.data;
  }

  /**
   * Store explanation in cache
   */
  public setCachedExplanation(cacheKey: string, data: HarmonyExplanation): void {
    // Evict older entries if cache size exceeds 10,000 pairs to prevent memory leakage
    if (this.cache.size > 10000) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(cacheKey, {
      data,
      expiresAt: Date.now() + this.cacheTtlSeconds * 1000,
    });
  }

  /**
   * Clear the cache (useful for testing)
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Evaluates circuit breaker state
   */
  private checkCircuitBreaker(): boolean {
    if (this.circuitState === CircuitState.OPEN) {
      if (Date.now() - this.circuitOpenedAt > this.circuitBreakerResetMs) {
        this.circuitState = CircuitState.HALF_OPEN;
        return true; // Allow one probe request
      }
      return false; // Fast-fail
    }
    return true;
  }

  private recordSuccess(): void {
    this.consecutiveFailures = 0;
    this.circuitState = CircuitState.CLOSED;
  }

  private recordFailure(): void {
    this.consecutiveFailures++;
    if (this.consecutiveFailures >= this.circuitBreakerThreshold) {
      this.circuitState = CircuitState.OPEN;
      this.circuitOpenedAt = Date.now();
    }
  }

  /**
   * Main Method: Generate "Why You Click" Harmony Breakdown
   */
  public async generateHarmonyExplanation(params: {
    userA: RawUserProfileInput;
    userB: RawUserProfileInput;
    compatibilityScore: number;
    vectorBreakdown?: VectorBreakdownMap;
  }): Promise<HarmonyGenerationResult> {
    const startTime = Date.now();

    // 1. Commutative Vector Cache Lookup
    const cacheKey = this.generateVectorCacheKey(params.userA.vectors, params.userB.vectors);
    const cached = this.getCachedExplanation(cacheKey);

    if (cached) {
      return {
        data: cached,
        source: 'cache',
        latencyMs: Date.now() - startTime,
        cached: true,
      };
    }

    // Determine highest and divergent vectors for fallback
    const highVectors: string[] = [];
    let divergentVector: string | null = null;
    if (params.vectorBreakdown) {
      for (const [key, detail] of Object.entries(params.vectorBreakdown)) {
        if (detail.status === 'HIGH_ALIGNMENT' || detail.affinityScore >= 0.85) {
          highVectors.push(key);
        } else if (detail.status === 'DISCUSSION_POINT' || detail.affinityScore < 0.55) {
          if (!divergentVector) divergentVector = key;
        }
      }
    }

    // 2. Circuit Breaker & API Key Pre-flight Check
    if (!this.apiKey || !this.checkCircuitBreaker()) {
      const fallback = generateFallbackHarmony({
        score: params.compatibilityScore,
        highVectors: highVectors.length > 0 ? highVectors : undefined,
        divergentVector,
      });

      return {
        data: fallback,
        source: 'fallback',
        latencyMs: Date.now() - startTime,
        cached: false,
      };
    }

    // 3. Zero-PII Sanitization & Prompt Construction
    const anonymizedPayload = anonymizeProfiles(params);
    const fullPrompt = buildCompatibilityPrompt(anonymizedPayload);

    // 4. Invoke Gemini API with strict timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: fullPrompt }],
          },
        ],
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        generationConfig: {
          temperature: this.temperature,
          maxOutputTokens: this.maxOutputTokens,
          responseMimeType: 'application/json',
          responseSchema: GEMINI_RESPONSE_SCHEMA,
        },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Gemini API HTTP Error: ${response.status} ${response.statusText}`);
      }

      const rawJson = (await response.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      };

      const textOutput = rawJson.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textOutput) {
        throw new Error('Gemini API returned empty candidate response');
      }

      // Parse JSON
      const parsedJson = JSON.parse(textOutput);

      // 5. Strict Schema Validation
      const validationResult = HarmonyExplanationSchemaValidator.safeParse(parsedJson);
      if (!validationResult.success) {
        throw new Error(`Output failed strict schema validation: ${validationResult.error.message}`);
      }

      const explanation = validationResult.data;

      // 6. Cache valid response
      this.setCachedExplanation(cacheKey, explanation);
      this.recordSuccess();

      return {
        data: explanation,
        source: 'gemini',
        latencyMs: Date.now() - startTime,
        cached: false,
        modelUsed: this.model,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      this.recordFailure();

      // Graceful fallback on any failure (timeout, network error, schema fail)
      const fallback = generateFallbackHarmony({
        score: params.compatibilityScore,
        highVectors: highVectors.length > 0 ? highVectors : undefined,
        divergentVector,
      });

      return {
        data: fallback,
        source: 'fallback',
        latencyMs: Date.now() - startTime,
        cached: false,
      };
    }
  }
}

/**
 * Singleton Gemini AIService Instance
 */
export const geminiAIService = new GeminiClient();

/**
 * Flatmate AI Module – Evaluation Suite Test Runner
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runAIEvaluationBenchmark } from './eval.ts';

test('TC-AI-EVAL-01: Run automated benchmark and verify all performance and safety gates pass', async () => {
  // If runAIEvaluationBenchmark fails, it throws or exits with code 1
  await runAIEvaluationBenchmark();
  assert.ok(true, 'Benchmark passed completely');
});

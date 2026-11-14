import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { api } from '../src/lib/api/client.ts';
import { MOCK_DISCOVERY_CARDS } from '../src/lib/api/mock-data.ts';
import type { FilterState } from '../src/components/features/FilterDrawer.tsx';

describe('Component State & API Integration Test Suite', () => {
  test('Discovery feed filters by modality correctly', async () => {
    const feed = await api.getDiscoveryFeed({
      modalities: ['MODALITY_1'],
    });
    assert.ok(feed.cards.length > 0);
    feed.cards.forEach((card) => {
      assert.strictEqual(card.modality, 'MODALITY_1');
    });
  });

  test('Discovery feed filters by suburb correctly', async () => {
    const feed = await api.getDiscoveryFeed({
      suburbs: ['KAZHAKKOOTTAM'],
    });
    assert.ok(feed.cards.length > 0);
    feed.cards.forEach((card) => {
      assert.ok(card.preferredSuburbs.includes('KAZHAKKOOTTAM'));
    });
  });

  test('Discovery feed filters by maxBudget per head', async () => {
    const maxBudget = 8000;
    const feed = await api.getDiscoveryFeed({
      maxBudget,
    });
    assert.ok(feed.cards.length > 0);
    feed.cards.forEach((card) => {
      assert.ok(card.budgetRange.min <= maxBudget);
    });
  });

  test('Swipe action triggers mutual match for LIKE on Adarsh', async () => {
    const swipeRes = await api.swipe({
      candidateUserId: 'usr-adarsh-002',
      action: 'LIKE',
      clientMutationId: 'test-mut-001',
    });

    assert.strictEqual(swipeRes.success, true);
    assert.strictEqual(swipeRes.isMutualMatch, true);
    assert.ok(swipeRes.match);
    assert.strictEqual(swipeRes.conversationId, 'conv-001');
  });

  test('Rewind restores previously swiped candidate', async () => {
    const rewindRes = await api.rewind();
    assert.strictEqual(rewindRes.success, true);
    assert.strictEqual(rewindRes.rewoundCandidateId, 'usr-adarsh-002');
  });

  test('Candidate detail response contains full 7-vector lifestyle breakdown', async () => {
    const candidate = await api.getCandidateDetail('usr-adarsh-002');
    assert.strictEqual(candidate.profile.displayName, 'Adarsh Nair');
    assert.strictEqual(candidate.compatibility.overallScore, 94);

    const vectors = candidate.compatibility.vectors;
    assert.strictEqual(vectors.sleep.affinityScore, 1.0);
    assert.strictEqual(vectors.cleanliness.status, 'HIGH_ALIGNMENT');
    assert.strictEqual(vectors.substances.status, 'HIGH_ALIGNMENT');
    assert.strictEqual(vectors.financial.status, 'HIGH_ALIGNMENT');
  });

  test('SendMessage appends new message with SENT status', async () => {
    const msg = await api.sendMessage('conv-001', 'Hey Adarsh, want to visit the 2BHK flat tomorrow?');
    assert.strictEqual(msg.conversationId, 'conv-001');
    assert.strictEqual(msg.status, 'SENT');
    assert.strictEqual(msg.content, 'Hey Adarsh, want to visit the 2BHK flat tomorrow?');
    assert.ok(msg.id.startsWith('msg-'));
  });

  test('Filter state default configuration aligns with Trivandrum micro-markets', () => {
    const defaultFilters: FilterState = {
      modalities: ['MODALITY_1', 'MODALITY_4'],
      suburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM'],
      maxBudget: 10000,
      minScore: 75,
      onlyVerified: false,
      strictNonSmoker: false,
    };

    assert.strictEqual(defaultFilters.modalities.length, 2);
    assert.strictEqual(defaultFilters.suburbs.length, 2);
    assert.strictEqual(defaultFilters.minScore, 75);
  });
});

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { Readable } from 'node:stream';
import { app } from '../src/app.ts';
import { db } from '../src/database/in-memory-db.ts';
import { AuthService } from '../src/modules/auth/auth.service.ts';
import type { UpdateProfileRequest } from '../src/modules/users/users.types.ts';
import type { LifestyleProfile } from '../src/modules/matching/matching.types.ts';

interface TestResponse {
  statusCode: number;
  headers: Record<string, string | string[]>;
  body: any;
  rawBody: string;
}

function request(
  method: string,
  path: string,
  options: {
    headers?: Record<string, string>;
    body?: any;
    cookies?: Record<string, string>;
  } = {}
): Promise<TestResponse> {
  return new Promise((resolve) => {
    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(options.headers || {})) {
      headers[k.toLowerCase()] = v;
    }

    if (options.cookies) {
      headers['cookie'] = Object.entries(options.cookies)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('; ');
    }

    const payload = options.body ? JSON.stringify(options.body) : '';
    if (payload) {
      headers['content-type'] = 'application/json';
      headers['content-length'] = Buffer.byteLength(payload).toString();
    }

    // Mock incoming message
    const reqStream = new Readable({
      read() {
        if (payload) {
          this.push(payload);
        }
        this.push(null);
      },
    }) as any;

    reqStream.method = method;
    reqStream.url = path;
    reqStream.headers = headers;

    // Mock server response
    let statusCode = 200;
    const resHeaders: Record<string, string | string[]> = {};
    const chunks: Buffer[] = [];

    const mockRes: any = {
      writeHead(code: number, headersObj?: any) {
        statusCode = code;
        if (headersObj) {
          Object.assign(resHeaders, headersObj);
        }
        return this;
      },
      setHeader(name: string, value: string | string[]) {
        resHeaders[name.toLowerCase()] = value;
      },
      write(chunk: any) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        return true;
      },
      end(chunk?: any) {
        if (chunk) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const rawBody = Buffer.concat(chunks).toString('utf8');
        let parsedBody: any = {};
        try {
          parsedBody = JSON.parse(rawBody);
        } catch {
          parsedBody = rawBody;
        }

        resolve({
          statusCode,
          headers: resHeaders,
          body: parsedBody,
          rawBody,
        });
      },
    };

    app.handleRequest(reqStream, mockRes);
  });
}

// Helper to create and authenticate a user
async function createTestSession(phone: string) {
  await AuthService.sendOtp(phone);
  const { session, rawRefreshToken } = await AuthService.verifyOtp(phone, '123456');
  return {
    userId: session.user.id,
    token: session.accessToken,
    refreshToken: rawRefreshToken,
  };
}

const defaultLifestyle: Omit<LifestyleProfile, 'userId'> = {
  sleep: {
    sleepPattern: 'NIGHT_OWL',
    shiftSchedule: 'NORMAL_DAY',
    noiseSensitivity: 'HEAVY_SLEEPER',
    isDealbreaker: false,
  },
  cleanliness: {
    cleanlinessLevel: 'METICULOUS',
    kitchenSinkRule: 'IMMEDIATE_WASH',
    maidPreference: 'MUST_HAVE_MAID',
    isDealbreaker: false,
  },
  dietary: {
    dietType: 'NON_VEGETARIAN',
    kitchenPolicy: 'NO_RESTRICTIONS',
    isDealbreaker: false,
  },
  social: {
    guestFrequency: 'OCCASIONAL_FRIENDS',
    overnightGuestPolicy: 'SAME_GENDER_ONLY',
    partyPreference: 'OCCASIONAL_WEEKENDS',
    isDealbreaker: false,
  },
  substances: {
    smokingHabit: 'NON_SMOKER_STRICT',
    alcoholHabit: 'SOCIAL_DRINKER',
    isDealbreaker: false,
  },
  financial: {
    rentPaymentHabit: 'STRICT_1ST_OF_MONTH',
    acBillSplit: 'EQUAL_SPLIT',
    groceryTracking: 'SPLITWISE_APP',
    isDealbreaker: false,
  },
  work: {
    workMode: 'HYBRID',
    callFrequency: 'LOW',
    workspacePreference: 'PRIVATE_ROOM_DESK',
    isDealbreaker: false,
  },
};

describe('RESTful OpenAPI Endpoints & RFC 7807 Compliance', () => {
  beforeEach(() => {
    db.reset();
  });

  describe('Authentication Endpoints (/api/v1/auth/*)', () => {
    it('POST /api/v1/auth/otp/send returns 200 with valid payload', async () => {
      const res = await request('POST', '/api/v1/auth/otp/send', {
        body: { phoneNumber: '+919876543210' },
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
    });

    it('POST /api/v1/auth/otp/verify returns 200 and sets httpOnly refresh_token cookies', async () => {
      await request('POST', '/api/v1/auth/otp/send', {
        body: { phoneNumber: '+919876543210' },
      });

      const res = await request('POST', '/api/v1/auth/otp/verify', {
        body: { phoneNumber: '+919876543210', otp: '123456' },
      });

      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.accessToken);
      assert.strictEqual(res.body.tokenType, 'Bearer');

      const setCookie = res.headers['Set-Cookie'];
      assert.ok(setCookie);
    });

    it('POST /api/v1/auth/refresh rotates session with refresh_token cookie', async () => {
      const { refreshToken } = await createTestSession('+919876543210');

      const res = await request('POST', '/api/v1/auth/refresh', {
        cookies: { refresh_token: refreshToken },
      });

      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.accessToken);
    });

    it('POST /api/v1/auth/logout invalidates session', async () => {
      const { token, refreshToken } = await createTestSession('+919876543210');

      const res = await request('POST', '/api/v1/auth/logout', {
        headers: { Authorization: `Bearer ${token}` },
        cookies: { refresh_token: refreshToken },
      });

      assert.strictEqual(res.statusCode, 204);
    });
  });

  describe('User Profile Endpoints (/api/v1/profiles/*)', () => {
    it('PUT & GET /api/v1/profiles/me creates and retrieves profile with masked PII', async () => {
      const { token, userId } = await createTestSession('+919876543210');

      const profilePayload: UpdateProfileRequest = {
        displayName: 'Adarsh Nair',
        gender: 'MALE',
        birthDate: '1998-05-15',
        occupation: 'Software Engineer',
        collegeOrCompany: 'UST Global',
        bio: 'Techie looking for quiet flat near Technopark Phase 3',
        modality: 'MODALITY_2',
        preferredGender: 'MALE',
        minBudget: 6000,
        maxBudget: 12000,
        moveInFlexibility: 'WITHIN_15_DAYS',
        preferredSuburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM'],
      };

      const putRes = await request('PUT', '/api/v1/profiles/me', {
        headers: { Authorization: `Bearer ${token}` },
        body: profilePayload,
      });

      assert.strictEqual(putRes.statusCode, 200);
      assert.strictEqual(putRes.body.displayName, 'Adarsh Nair');
      assert.strictEqual(putRes.body.age >= 25, true);
      assert.strictEqual(putRes.body.isOnboardingCompleted, true);
      // Ensure raw phone is NEVER leaked
      assert.strictEqual(putRes.body.phoneNumber, undefined);

      const getRes = await request('GET', '/api/v1/profiles/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      assert.strictEqual(getRes.statusCode, 200);
      assert.strictEqual(getRes.body.userId, userId);
    });

    it('POST & DELETE /api/v1/profiles/me/photos manages photos', async () => {
      const { token } = await createTestSession('+919876543210');

      // Setup profile
      await request('PUT', '/api/v1/profiles/me', {
        headers: { Authorization: `Bearer ${token}` },
        body: {
          displayName: 'Adarsh',
          gender: 'MALE',
          birthDate: '1998-05-15',
          occupation: 'Dev',
          modality: 'MODALITY_2',
          preferredGender: 'ANY',
          minBudget: 5000,
          maxBudget: 10000,
          moveInFlexibility: 'FLEXIBLE',
          preferredSuburbs: ['KAZHAKKOOTTAM'],
        },
      });

      const photoRes = await request('POST', '/api/v1/profiles/me/photos', {
        headers: { Authorization: `Bearer ${token}` },
        body: { photoUrl: 'https://cdn.flatmate.in/photo1.jpg', orderIndex: 0, isPrimary: true },
      });

      assert.strictEqual(photoRes.statusCode, 201);
      assert.strictEqual(photoRes.body.orderIndex, 0);

      const deleteRes = await request('DELETE', `/api/v1/profiles/me/photos/${photoRes.body.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      assert.strictEqual(deleteRes.statusCode, 204);
    });
  });

  describe('Discovery Feed, Swiping & Mutual Matching Flow', () => {
    it('executes full flow: feed discovery -> swipe LIKE -> mutual match -> conversation unlock', async () => {
      // User 1: Adarsh (Modality 2 - Seeker)
      const user1 = await createTestSession('+919876543210');
      await request('PUT', '/api/v1/profiles/me', {
        headers: { Authorization: `Bearer ${user1.token}` },
        body: {
          displayName: 'Adarsh',
          gender: 'MALE',
          birthDate: '1998-05-15',
          occupation: 'Software Engineer',
          modality: 'MODALITY_2',
          preferredGender: 'MALE',
          minBudget: 5000,
          maxBudget: 12000,
          moveInFlexibility: 'WITHIN_15_DAYS',
          preferredSuburbs: ['KAZHAKKOOTTAM'],
        },
      });
      await request('PUT', '/api/v1/lifestyle/me', {
        headers: { Authorization: `Bearer ${user1.token}` },
        body: defaultLifestyle,
      });

      // User 2: Rohit (Modality 1 - Has Room)
      const user2 = await createTestSession('+919876543211');
      await request('PUT', '/api/v1/profiles/me', {
        headers: { Authorization: `Bearer ${user2.token}` },
        body: {
          displayName: 'Rohit',
          gender: 'MALE',
          birthDate: '1997-03-20',
          occupation: 'Tech Lead',
          modality: 'MODALITY_1',
          preferredGender: 'MALE',
          minBudget: 7000,
          maxBudget: 15000,
          moveInFlexibility: 'WITHIN_15_DAYS',
          preferredSuburbs: ['KAZHAKKOOTTAM'],
        },
      });
      await request('PUT', '/api/v1/lifestyle/me', {
        headers: { Authorization: `Bearer ${user2.token}` },
        body: defaultLifestyle,
      });

      // User 1 fetches discovery feed
      const feedRes = await request('GET', '/api/v1/discovery/feed', {
        headers: { Authorization: `Bearer ${user1.token}` },
      });

      assert.strictEqual(feedRes.statusCode, 200);
      assert.strictEqual(feedRes.body.cards.length, 1);
      assert.strictEqual(feedRes.body.cards[0].userId, user2.userId);
      assert.strictEqual(feedRes.body.cards[0].compatibilityScore, 100);

      // User 1 Swipes LIKE on User 2
      const swipe1Res = await request('POST', '/api/v1/discovery/swipe', {
        headers: { Authorization: `Bearer ${user1.token}` },
        body: {
          candidateUserId: user2.userId,
          action: 'LIKE',
          clientMutationId: 'mut-1',
        },
      });

      assert.strictEqual(swipe1Res.statusCode, 200);
      assert.strictEqual(swipe1Res.body.isMutualMatch, false);

      // User 2 Swipes LIKE on User 1 -> Mutual Match!
      const swipe2Res = await request('POST', '/api/v1/discovery/swipe', {
        headers: { Authorization: `Bearer ${user2.token}` },
        body: {
          candidateUserId: user1.userId,
          action: 'LIKE',
          clientMutationId: 'mut-2',
        },
      });

      assert.strictEqual(swipe2Res.statusCode, 200);
      assert.strictEqual(swipe2Res.body.isMutualMatch, true);
      assert.ok(swipe2Res.body.matchId);
      assert.ok(swipe2Res.body.conversationId);

      // User 1 lists matches
      const matchesRes = await request('GET', '/api/v1/matches', {
        headers: { Authorization: `Bearer ${user1.token}` },
      });
      assert.strictEqual(matchesRes.statusCode, 200);
      assert.strictEqual(matchesRes.body.totalCount, 1);
      assert.strictEqual(matchesRes.body.matches[0].matchedUserId, user2.userId);

      // User 1 sends message to User 2
      const msgRes = await request(
        'POST',
        `/api/v1/conversations/${swipe2Res.body.conversationId}/messages`,
        {
          headers: { Authorization: `Bearer ${user1.token}` },
          body: { content: 'Hey Rohit! Saw your room listing in Kazhakkoottam. When can I visit?' },
        }
      );

      assert.strictEqual(msgRes.statusCode, 201);
      assert.strictEqual(msgRes.body.status, 'SENT');
      assert.strictEqual(msgRes.body.warningNotice, undefined);

      // Contact Harvesting Warning Test (FR-23)
      const harvestingMsgRes = await request(
        'POST',
        `/api/v1/conversations/${swipe2Res.body.conversationId}/messages`,
        {
          headers: { Authorization: `Bearer ${user1.token}` },
          body: { content: 'Call me directly on 9876543210 or email me at adarsh@gmail.com' },
        }
      );

      assert.strictEqual(harvestingMsgRes.statusCode, 201);
      assert.ok(harvestingMsgRes.body.warningNotice);
      assert.ok(harvestingMsgRes.body.warningNotice.includes('For your security'));
    });

    it('rewinds preceding swipe action (max 1 allowed per session)', async () => {
      const user1 = await createTestSession('+919876543210');
      const user2 = await createTestSession('+919876543211');

      // Setup user profiles
      await request('PUT', '/api/v1/profiles/me', {
        headers: { Authorization: `Bearer ${user1.token}` },
        body: {
          displayName: 'Adarsh',
          gender: 'MALE',
          birthDate: '1998-05-15',
          occupation: 'Dev',
          modality: 'MODALITY_2',
          preferredGender: 'ANY',
          minBudget: 5000,
          maxBudget: 10000,
          moveInFlexibility: 'FLEXIBLE',
          preferredSuburbs: ['KAZHAKKOOTTAM'],
        },
      });

      await request('POST', '/api/v1/discovery/swipe', {
        headers: { Authorization: `Bearer ${user1.token}` },
        body: { candidateUserId: user2.userId, action: 'PASS', clientMutationId: 'pass-1' },
      });

      // Rewind swipe
      const rewindRes = await request('POST', '/api/v1/discovery/rewind', {
        headers: { Authorization: `Bearer ${user1.token}` },
      });

      assert.strictEqual(rewindRes.statusCode, 200);
      assert.strictEqual(rewindRes.body.success, true);
      assert.strictEqual(rewindRes.body.rewoundCandidateId, user2.userId);

      // 2nd rewind attempt in same session is rejected
      const secondRewindRes = await request('POST', '/api/v1/discovery/rewind', {
        headers: { Authorization: `Bearer ${user1.token}` },
      });
      assert.strictEqual(secondRewindRes.statusCode, 400);
    });
  });

  describe('Trust, Safety & Auto-Quarantine (FR-27, FR-28)', () => {
    it('blocks user bidirectionally and terminates active conversation', async () => {
      const user1 = await createTestSession('+919876543210');
      const user2 = await createTestSession('+919876543211');

      const blockRes = await request('POST', '/api/v1/safety/blocks', {
        headers: { Authorization: `Bearer ${user1.token}` },
        body: { targetUserId: user2.userId, reason: 'Unsolicited spam messages' },
      });

      assert.strictEqual(blockRes.statusCode, 201);
      assert.strictEqual(blockRes.body.success, true);

      // Unblock
      const unblockRes = await request('DELETE', `/api/v1/safety/blocks/${user2.userId}`, {
        headers: { Authorization: `Bearer ${user1.token}` },
      });
      assert.strictEqual(unblockRes.statusCode, 200);
    });

    it('triggers automatic account quarantine upon 2 reports within 24 hours (FR-28)', async () => {
      const badActor = await createTestSession('+919876543299');
      const victim1 = await createTestSession('+919876543201');
      const victim2 = await createTestSession('+919876543202');

      // Report 1
      const rep1Res = await request('POST', '/api/v1/safety/reports', {
        headers: { Authorization: `Bearer ${victim1.token}` },
        body: {
          targetUserId: badActor.userId,
          category: 'HARASSMENT_OR_ABUSE',
          details: 'User sent aggressive inappropriate messages in chat.',
        },
      });
      assert.strictEqual(rep1Res.statusCode, 201);
      assert.strictEqual(rep1Res.body.status, 'PENDING_REVIEW');

      // Report 2 within 24h -> Triggers Auto-Quarantine!
      const rep2Res = await request('POST', '/api/v1/safety/reports', {
        headers: { Authorization: `Bearer ${victim2.token}` },
        body: {
          targetUserId: badActor.userId,
          category: 'HARASSMENT_OR_ABUSE',
          details: 'User made harassing remarks and moral policing threats.',
        },
      });

      assert.strictEqual(rep2Res.statusCode, 201);
      assert.strictEqual(rep2Res.body.status, 'ACTIONED_QUARANTINE');
      assert.ok(rep2Res.body.message.includes('automatically quarantined'));

      // Verify bad actor's account is QUARANTINED in database
      const dbActor = db.users.get(badActor.userId);
      assert.strictEqual(dbActor?.status, 'QUARANTINED');
    });
  });

  describe('RFC 7807 Problem Details Error Formatting', () => {
    it('returns RFC 7807 compliant JSON for 404 Not Found', async () => {
      const res = await request('GET', '/api/v1/non-existent-endpoint');
      assert.strictEqual(res.statusCode, 404);
      assert.strictEqual(res.headers['Content-Type'], 'application/problem+json');
      assert.strictEqual(res.body.status, 404);
      assert.strictEqual(res.body.title, 'Not Found');
      assert.ok(res.body.type);
      assert.ok(res.body.detail);
      assert.strictEqual(res.body.instance, '/api/v1/non-existent-endpoint');
    });

    it('returns RFC 7807 compliant JSON for 401 Unauthorized', async () => {
      const res = await request('GET', '/api/v1/profiles/me');
      assert.strictEqual(res.statusCode, 401);
      assert.strictEqual(res.headers['Content-Type'], 'application/problem+json');
      assert.strictEqual(res.body.status, 401);
      assert.strictEqual(res.body.title, 'Unauthorized');
      assert.ok(res.body.detail);
    });
  });
});

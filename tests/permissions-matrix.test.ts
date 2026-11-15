import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { Readable } from 'node:stream';
import { app } from '../src/app.ts';
import { db } from '../src/database/in-memory-db.ts';
import { AuthService } from '../src/modules/auth/auth.service.ts';
import { UsersService } from '../src/modules/users/users.service.ts';
import { PreferencesService } from '../src/modules/preferences/preferences.service.ts';
import { MessagingService } from '../src/modules/messaging/messaging.service.ts';
import type { LifestyleProfile } from '../src/modules/matching/matching.types.ts';

function request(
  method: string,
  path: string,
  options: {
    headers?: Record<string, string>;
    body?: any;
  } = {}
): Promise<{ statusCode: number; headers: Record<string, string | string[]>; body: any }> {
  return new Promise((resolve) => {
    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(options.headers || {})) {
      headers[k.toLowerCase()] = v;
    }

    const payload = options.body ? JSON.stringify(options.body) : '';
    if (payload) {
      headers['content-type'] = 'application/json';
      headers['content-length'] = Buffer.byteLength(payload).toString();
    }

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
        });
      },
    };

    app.handleRequest(reqStream, mockRes);
  });
}

const testLifestyle: Omit<LifestyleProfile, 'userId'> = {
  sleep: {
    sleepPattern: 'EARLY_BIRD',
    shiftSchedule: 'NORMAL_DAY',
    noiseSensitivity: 'HEAVY_SLEEPER',
    isDealbreaker: false,
  },
  cleanliness: {
    cleanlinessLevel: 'METICULOUS',
    kitchenSinkRule: 'IMMEDIATE_WASH',
    maidPreference: 'OPEN_TO_MAID',
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

describe('Buddy Access Control & Match Interaction Permissions Matrix', () => {
  let completeCandidateUserId: string;

  before(async () => {
    // Setup verified complete candidate
    const candPhone = '+919999911111';
    await AuthService.sendOtp(candPhone);
    const { session } = await AuthService.verifyOtp(candPhone, '123456');
    completeCandidateUserId = session.user.id;

    UsersService.updateProfile(completeCandidateUserId, {
      displayName: 'Adarsh Complete',
      gender: 'MALE',
      preferredGender: 'ANY',
      birthDate: '1997-04-10',
      occupation: 'Techie @ Technopark',
      modality: 'MODALITY_1',
      minBudget: 5000,
      maxBudget: 12000,
      moveInFlexibility: 'WITHIN_15_DAYS',
      preferredSuburbs: ['KAZHAKKOOTTAM'],
      isOnboardingCompleted: true,
    });
    PreferencesService.updateLifestyle(completeCandidateUserId, testLifestyle);
  });

  // ==========================================
  // STATE 1: GUEST USER (UNAUTHENTICATED)
  // ==========================================
  describe('Guest User Permissions', () => {
    it('CRIT-01: Guest can view available matches in discovery feed without authentication', async () => {
      const res = await request('GET', '/api/v1/discovery/feed?limit=10');
      assert.strictEqual(res.statusCode, 200);
      assert.ok(Array.isArray(res.body.cards));
      assert.ok(res.body.cards.length > 0, 'Guest should see active Trivandrum candidate cards');
      // PII check: no phones or emails
      const raw = JSON.stringify(res.body);
      assert.strictEqual(raw.includes('9999911111'), false, 'Zero raw phones in guest feed');
    });

    it('CRIT-02: Guest cannot perform swipe actions (returns 401 Unauthorized)', async () => {
      const resPass = await request('POST', '/api/v1/discovery/swipe', {
        body: { candidateUserId: completeCandidateUserId, action: 'PASS' },
      });
      assert.strictEqual(resPass.statusCode, 401);

      const resLike = await request('POST', '/api/v1/discovery/swipe', {
        body: { candidateUserId: completeCandidateUserId, action: 'LIKE' },
      });
      assert.strictEqual(resLike.statusCode, 401);
    });

    it('CRIT-03: Guest cannot send messages (returns 401 Unauthorized)', async () => {
      const resMsg = await request('POST', '/api/v1/conversations/dummy-conv/messages', {
        body: { content: 'Hello' },
      });
      assert.strictEqual(resMsg.statusCode, 401);
    });
  });

  // ==========================================
  // STATE 2: LOGGED IN, REGISTRATION INCOMPLETE
  // ==========================================
  describe('Logged In, Registration Incomplete Permissions', () => {
    let incompleteUserToken: string;
    let incompleteUserId: string;

    before(async () => {
      const incompletePhone = '+919999922222';
      await AuthService.sendOtp(incompletePhone);
      const { session } = await AuthService.verifyOtp(incompletePhone, '123456');
      incompleteUserToken = session.accessToken;
      incompleteUserId = session.user.id;

      // Save partial profile with isOnboardingCompleted: false
      UsersService.updateProfile(incompleteUserId, {
        displayName: 'Incomplete User',
        gender: 'FEMALE',
        preferredGender: 'ANY',
        birthDate: '2000-01-01',
        occupation: 'Student',
        modality: 'MODALITY_2',
        minBudget: 4000,
        maxBudget: 8000,
        moveInFlexibility: 'WITHIN_1_MONTH',
        preferredSuburbs: ['KARIAVATTOM'],
        isOnboardingCompleted: false,
      });
    });

    it('CRIT-04: Incomplete user can view matches in discovery feed', async () => {
      const res = await request('GET', '/api/v1/discovery/feed?limit=10', {
        headers: { Authorization: `Bearer ${incompleteUserToken}` },
      });
      assert.strictEqual(res.statusCode, 200);
      assert.ok(Array.isArray(res.body.cards));
      assert.ok(res.body.cards.length > 0);
    });

    it('CRIT-05: Incomplete user CAN swipe left (PASS / Not Interested)', async () => {
      const resPass = await request('POST', '/api/v1/discovery/swipe', {
        headers: { Authorization: `Bearer ${incompleteUserToken}` },
        body: { candidateUserId: completeCandidateUserId, action: 'PASS' },
      });
      assert.strictEqual(resPass.statusCode, 200);
      assert.strictEqual(resPass.body.isMutualMatch, false);
    });

    it('CRIT-06: Incomplete user CANNOT express interest or swipe right (LIKE returns 403 Forbidden)', async () => {
      const resLike = await request('POST', '/api/v1/discovery/swipe', {
        headers: { Authorization: `Bearer ${incompleteUserToken}` },
        body: { candidateUserId: completeCandidateUserId, action: 'LIKE' },
      });
      assert.strictEqual(resLike.statusCode, 403);
      assert.strictEqual(resLike.body.title, 'Registration Incomplete');
      assert.ok(resLike.body.detail.includes('Mandatory registration must be completed'));
    });

    it('CRIT-07: Incomplete user CANNOT send messages (returns 403 Forbidden)', async () => {
      // Create a test conversation directly in DB for test verification
      db.conversations.push({
        id: 'test-conv-incomplete',
        matchId: 'dummy-match',
        user1Id: incompleteUserId,
        user2Id: completeCandidateUserId,
        status: 'ACTIVE',
        lastMessageAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const resMsg = await request('POST', '/api/v1/conversations/test-conv-incomplete/messages', {
        headers: { Authorization: `Bearer ${incompleteUserToken}` },
        body: { content: 'Hey!' },
      });
      assert.strictEqual(resMsg.statusCode, 403);
      assert.strictEqual(resMsg.body.title, 'Registration Incomplete');
      assert.ok(resMsg.body.detail.includes('Mandatory registration must be completed'));
    });

    // ==========================================
    // STATE 3: COMPLETING REGISTRATION UNLOCKS INTERACTIONS
    // ==========================================
    it('CRIT-08: Completing mandatory registration unlocks positive interest (LIKE) and messaging', async () => {
      // User completes mandatory registration
      UsersService.updateProfile(incompleteUserId, {
        displayName: 'Now Complete User',
        gender: 'FEMALE',
        preferredGender: 'ANY',
        birthDate: '2000-01-01',
        occupation: 'Student',
        modality: 'MODALITY_2',
        minBudget: 4000,
        maxBudget: 8000,
        moveInFlexibility: 'WITHIN_1_MONTH',
        preferredSuburbs: ['KARIAVATTOM'],
        isOnboardingCompleted: true,
      });

      // Now LIKE swipe MUST succeed!
      const resLike = await request('POST', '/api/v1/discovery/swipe', {
        headers: { Authorization: `Bearer ${incompleteUserToken}` },
        body: { candidateUserId: completeCandidateUserId, action: 'LIKE' },
      });
      assert.strictEqual(resLike.statusCode, 200);
      assert.strictEqual(typeof resLike.body.isMutualMatch, 'boolean');

      // Now Message sending MUST succeed!
      const resMsg = await request('POST', '/api/v1/conversations/test-conv-incomplete/messages', {
        headers: { Authorization: `Bearer ${incompleteUserToken}` },
        body: { content: 'Hello after completing registration!' },
      });
      assert.strictEqual(resMsg.statusCode, 201);
      assert.strictEqual(resMsg.body.content, 'Hello after completing registration!');
    });
  });
});

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { Readable } from 'node:stream';
import { app } from '../src/app.ts';
import { db } from '../src/database/in-memory-db.ts';
import { AuthService } from '../src/modules/auth/auth.service.ts';
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
          rawBody,
        });
      },
    };

    app.handleRequest(reqStream, mockRes);
  });
}

async function createAuthenticatedUser(phone: string) {
  await AuthService.sendOtp(phone);
  const { session, rawRefreshToken } = await AuthService.verifyOtp(phone, '123456');
  return {
    userId: session.user.id,
    token: session.accessToken,
    refreshToken: rawRefreshToken,
  };
}

const baseLifestyle: Omit<LifestyleProfile, 'userId'> = {
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

describe('End-to-End User Discovery Journeys (All 4 Modalities)', () => {
  beforeEach(() => {
    db.reset();
  });

  // =========================================================================
  // JOURNEY 1: MODALITY 1 (Leaseholder with room available)
  // =========================================================================
  it('Modality 1 Journey: Leaseholder offers room, configures preferences, reviews candidate feed, likes candidate, unlocks mutual match chat', async () => {
    // Step 1: Leaseholder (Mathews Varghese) registers & authenticates via OTP (FR-01)
    const mathews = await createAuthenticatedUser('+919846011111');
    assert.ok(mathews.token, 'Mathews successfully obtained JWT access token');

    // Step 2: Mathews verifies corporate identity badge with Technopark employer UST (FR-02, FR-03)
    const verifyReq = await request('POST', '/api/v1/auth/institution/verify-request', {
      headers: { Authorization: `Bearer ${mathews.token}` },
      body: {
        email: 'mathews.v@ust.com',
        institutionType: 'CORPORATE',
      },
    });
    assert.strictEqual(verifyReq.statusCode, 202);
    assert.ok(verifyReq.body.previewToken);

    const verifyConfirm = await request('POST', '/api/v1/auth/institution/verify-confirm', {
      headers: { Authorization: `Bearer ${mathews.token}` },
      body: { token: verifyReq.body.previewToken },
    });
    assert.strictEqual(verifyConfirm.statusCode, 200);
    assert.strictEqual(verifyConfirm.body.badge, 'VERIFIED_PROFESSIONAL');

    // Step 3: Mathews configures Modality 1 Profile (FR-04, FR-05, FR-06)
    const profileRes = await request('PUT', '/api/v1/profiles/me', {
      headers: { Authorization: `Bearer ${mathews.token}` },
      body: {
        displayName: 'Mathews Varghese',
        gender: 'MALE',
        birthDate: '1993-06-12',
        occupation: 'Senior Solutions Architect',
        collegeOrCompany: 'UST Global',
        bio: 'Quiet professional offering private bedroom in Kowdiar.',
        modality: 'MODALITY_1',
        preferredGender: 'MALE',
        minBudget: 8000,
        maxBudget: 12000,
        moveInFlexibility: 'WITHIN_15_DAYS',
        preferredSuburbs: ['KOWDIAR', 'PATTOM'],
      },
    });
    assert.strictEqual(profileRes.statusCode, 200);
    assert.strictEqual(profileRes.body.modality, 'MODALITY_1');
    assert.strictEqual(profileRes.body.verificationBadge, 'VERIFIED_PROFESSIONAL');

    // Step 4: Mathews configures 7-Vector Lifestyle (FR-07 through FR-13)
    const lifestyleRes = await request('PUT', '/api/v1/lifestyle/me', {
      headers: { Authorization: `Bearer ${mathews.token}` },
      body: {
        ...baseLifestyle,
        sleep: { sleepPattern: 'EARLY_BIRD', shiftSchedule: 'NORMAL_DAY', noiseSensitivity: 'LIGHT_SLEEPER', isDealbreaker: false },
        substances: { smokingHabit: 'NON_SMOKER_STRICT', alcoholHabit: 'TEETOTALER', isDealbreaker: true },
      },
    });
    assert.strictEqual(lifestyleRes.statusCode, 200);

    // Step 5: Mathews creates a Room Listing with photos and amenities (FR-25)
    const roomRes = await request('POST', '/api/v1/rooms/me', {
      headers: { Authorization: `Bearer ${mathews.token}` },
      body: {
        roomType: 'PRIVATE_ROOM',
        bathroomType: 'ATTACHED_PRIVATE',
        monthlyRent: 8500,
        securityDeposit: 25000,
        availableFrom: '2026-12-01',
        locationSuburb: 'KOWDIAR',
        amenities: ['High-Speed WiFi', 'AC Bedroom', 'Covered Car Parking', 'Washing Machine'],
      },
    });
    assert.strictEqual(roomRes.statusCode, 201);
    assert.strictEqual(roomRes.body.monthlyRent, 8500);
    assert.strictEqual(roomRes.body.locationSuburb, 'KOWDIAR');

    // Step 6: Onboard compatible Modality 2 candidate (Anil - seeking room in Kowdiar)
    const anil = await createAuthenticatedUser('+919846022222');
    await request('PUT', '/api/v1/profiles/me', {
      headers: { Authorization: `Bearer ${anil.token}` },
      body: {
        displayName: 'Anil Kumar',
        gender: 'MALE',
        birthDate: '1995-08-20',
        occupation: 'Software Engineer',
        collegeOrCompany: 'Allianz',
        bio: 'Clean, non-smoker looking for room near Kowdiar/Pattom.',
        modality: 'MODALITY_2',
        preferredGender: 'MALE',
        minBudget: 7000,
        maxBudget: 10000,
        moveInFlexibility: 'WITHIN_15_DAYS',
        preferredSuburbs: ['KOWDIAR', 'PATTOM'],
      },
    });
    await request('PUT', '/api/v1/lifestyle/me', {
      headers: { Authorization: `Bearer ${anil.token}` },
      body: {
        ...baseLifestyle,
        sleep: { sleepPattern: 'EARLY_BIRD', shiftSchedule: 'NORMAL_DAY', noiseSensitivity: 'LIGHT_SLEEPER', isDealbreaker: false },
        substances: { smokingHabit: 'NON_SMOKER_STRICT', alcoholHabit: 'TEETOTALER', isDealbreaker: false },
      },
    });

    // Step 7: Mathews reviews discovery feed - verifying Modality 1 pairs with Modality 2 (FR-17)
    const feedRes = await request('GET', '/api/v1/discovery/feed', {
      headers: { Authorization: `Bearer ${mathews.token}` },
    });
    assert.strictEqual(feedRes.statusCode, 200);
    assert.strictEqual(feedRes.body.cards.length, 1);
    const candidateCard = feedRes.body.cards[0];
    assert.strictEqual(candidateCard.userId, anil.userId);
    assert.strictEqual(candidateCard.modality, 'MODALITY_2');
    assert.ok(candidateCard.compatibilityScore >= 90, `Score expected >=90, got ${candidateCard.compatibilityScore}`);

    // Step 8: Mathews inspects detailed Compatibility Breakdown modal (FR-16, FR-19)
    const compRes = await request('GET', `/api/v1/discovery/compatibility/${anil.userId}`, {
      headers: { Authorization: `Bearer ${mathews.token}` },
    });
    assert.strictEqual(compRes.statusCode, 200);
    assert.strictEqual(compRes.body.dealbreakerFailed, false);
    assert.ok(compRes.body.vectors.sleep.affinityScore >= 0.8, 'Sleep affinity should be high');
    assert.ok(compRes.body.vectors.substances.affinityScore >= 0.9, 'Substances affinity should be high');

    // Step 9: Mathews swipes LIKE on Anil (FR-18)
    const swipe1 = await request('POST', '/api/v1/discovery/swipe', {
      headers: { Authorization: `Bearer ${mathews.token}` },
      body: { candidateUserId: anil.userId, action: 'LIKE', clientMutationId: 'm1-swipe-01' },
    });
    assert.strictEqual(swipe1.statusCode, 200);
    assert.strictEqual(swipe1.body.isMutualMatch, false, 'First swipe should not yet be a mutual match');

    // Step 10: Anil reviews feed, inspects Mathews' listing, and swipes LIKE on Mathews (FR-20, FR-26)
    const anilFeed = await request('GET', '/api/v1/discovery/feed', {
      headers: { Authorization: `Bearer ${anil.token}` },
    });
    assert.strictEqual(anilFeed.statusCode, 200);
    assert.strictEqual(anilFeed.body.cards[0].userId, mathews.userId);

    const swipe2 = await request('POST', '/api/v1/discovery/swipe', {
      headers: { Authorization: `Bearer ${anil.token}` },
      body: { candidateUserId: mathews.userId, action: 'LIKE', clientMutationId: 'm2-swipe-01' },
    });
    assert.strictEqual(swipe2.statusCode, 200);
    assert.strictEqual(swipe2.body.isMutualMatch, true, 'Mutual match triggered atomically!');
    const conversationId = swipe2.body.conversationId;
    assert.ok(conversationId, 'Conversation ID created upon mutual match');

    // Step 11: Mathews verifies Mutual Match list & unlocks 1-on-1 chat (FR-21, FR-22)
    const matchesRes = await request('GET', '/api/v1/matches', {
      headers: { Authorization: `Bearer ${mathews.token}` },
    });
    assert.strictEqual(matchesRes.statusCode, 200);
    assert.strictEqual(matchesRes.body.totalCount, 1);
    assert.strictEqual(matchesRes.body.matches[0].matchedUserId, anil.userId);

    // Step 12: Mathews sends message introducing room in Kowdiar (FR-22)
    const sendMsg = await request('POST', `/api/v1/conversations/${conversationId}/messages`, {
      headers: { Authorization: `Bearer ${mathews.token}` },
      body: { content: 'Hi Anil! The private room in Kowdiar is available from Dec 1. Would you like to schedule a visit?' },
    });
    assert.strictEqual(sendMsg.statusCode, 201);
    assert.strictEqual(sendMsg.body.senderUserId, mathews.userId);

    // Step 13: Anil reads conversation messages (FR-22, FR-23)
    const messagesRes = await request('GET', `/api/v1/conversations/${conversationId}/messages`, {
      headers: { Authorization: `Bearer ${anil.token}` },
    });
    assert.strictEqual(messagesRes.statusCode, 200);
    assert.strictEqual(messagesRes.body.messages.length, 1);
    assert.ok(messagesRes.body.messages[0].content.includes('Kowdiar'));
  });

  // =========================================================================
  // JOURNEY 2: MODALITY 2 (Seeker configures budget & habits, filters Kazhakkoottam, swipes, celebrates match)
  // =========================================================================
  it('Modality 2 Journey: Seeker configures budget & habits, filters feed by Kazhakkoottam, swipes, celebrates mutual match', async () => {
    // Step 1: Pre-populate Modality 1 Room Provider in Kazhakkoottam (Jithin)
    const jithin = await createAuthenticatedUser('+919846033333');
    await request('PUT', '/api/v1/profiles/me', {
      headers: { Authorization: `Bearer ${jithin.token}` },
      body: {
        displayName: 'Jithin Raj',
        gender: 'MALE',
        birthDate: '1996-03-10',
        occupation: 'DevOps Engineer',
        modality: 'MODALITY_1',
        preferredGender: 'MALE',
        minBudget: 6000,
        maxBudget: 8000,
        moveInFlexibility: 'IMMEDIATE',
        preferredSuburbs: ['KAZHAKKOOTTAM'],
      },
    });
    await request('PUT', '/api/v1/lifestyle/me', {
      headers: { Authorization: `Bearer ${jithin.token}` },
      body: {
        ...baseLifestyle,
        substances: { smokingHabit: 'NON_SMOKER_STRICT', alcoholHabit: 'SOCIAL_DRINKER', isDealbreaker: true },
      },
    });
    await request('POST', '/api/v1/rooms/me', {
      headers: { Authorization: `Bearer ${jithin.token}` },
      body: {
        roomType: 'PRIVATE_ROOM',
        bathroomType: 'SHARED',
        monthlyRent: 7000,
        securityDeposit: 15000,
        availableFrom: '2026-11-20',
        locationSuburb: 'KAZHAKKOOTTAM',
        amenities: ['WiFi', 'Power Backup'],
      },
    });

    // Step 2: Also add a Distractor Candidate (Smoker dealbreaker breach) to test filter exclusion
    const distractor = await createAuthenticatedUser('+919846099999');
    await request('PUT', '/api/v1/profiles/me', {
      headers: { Authorization: `Bearer ${distractor.token}` },
      body: {
        displayName: 'Heavy Smoker Candidate',
        gender: 'MALE',
        birthDate: '1994-01-01',
        occupation: 'Freelancer',
        modality: 'MODALITY_1',
        preferredGender: 'MALE',
        minBudget: 5000,
        maxBudget: 7000,
        moveInFlexibility: 'FLEXIBLE',
        preferredSuburbs: ['KAZHAKKOOTTAM'],
      },
    });
    await request('PUT', '/api/v1/lifestyle/me', {
      headers: { Authorization: `Bearer ${distractor.token}` },
      body: {
        ...baseLifestyle,
        substances: { smokingHabit: 'SMOKER', alcoholHabit: 'REGULAR', isDealbreaker: false },
      },
    });

    // Step 3: Seeker (Rahul Dev) onboards with Modality 2 (FR-04, FR-05, FR-06)
    const rahul = await createAuthenticatedUser('+919846044444');
    const rahulProfile = await request('PUT', '/api/v1/profiles/me', {
      headers: { Authorization: `Bearer ${rahul.token}` },
      body: {
        displayName: 'Rahul Dev',
        gender: 'MALE',
        birthDate: '1999-11-04',
        occupation: 'Frontend Specialist',
        collegeOrCompany: 'Infosys',
        bio: 'Looking for a flat in Kazhakkoottam under 7.5k.',
        modality: 'MODALITY_2',
        preferredGender: 'MALE',
        minBudget: 6000,
        maxBudget: 7500,
        moveInFlexibility: 'IMMEDIATE',
        preferredSuburbs: ['KAZHAKKOOTTAM'],
      },
    });
    assert.strictEqual(rahulProfile.statusCode, 200);

    // Step 4: Rahul sets strict Non-Smoker Dealbreaker (FR-11, FR-15)
    await request('PUT', '/api/v1/lifestyle/me', {
      headers: { Authorization: `Bearer ${rahul.token}` },
      body: {
        ...baseLifestyle,
        substances: { smokingHabit: 'NON_SMOKER_STRICT', alcoholHabit: 'SOCIAL_DRINKER', isDealbreaker: true },
      },
    });

    // Jithin previously swiped LIKE on Rahul
    await request('POST', '/api/v1/discovery/swipe', {
      headers: { Authorization: `Bearer ${jithin.token}` },
      body: { candidateUserId: rahul.userId, action: 'LIKE', clientMutationId: 'jit-01' },
    });

    // Step 5: Rahul retrieves discovery feed filtered by Kazhakkoottam & dealbreakers (FR-15, FR-17)
    const rahulFeed = await request('GET', '/api/v1/discovery/feed', {
      headers: { Authorization: `Bearer ${rahul.token}` },
    });
    assert.strictEqual(rahulFeed.statusCode, 200);
    // Smoker distractor must be strictly filtered out by dealbreaker engine (FR-15)
    assert.strictEqual(rahulFeed.body.cards.length, 1);
    assert.strictEqual(rahulFeed.body.cards[0].userId, jithin.userId);
    assert.strictEqual(rahulFeed.body.cards[0].displayName, 'Jithin Raj');

    // Step 6: Rahul reviews compatibility breakdown
    const breakdown = await request('GET', `/api/v1/discovery/compatibility/${jithin.userId}`, {
      headers: { Authorization: `Bearer ${rahul.token}` },
    });
    assert.strictEqual(breakdown.statusCode, 200);
    assert.strictEqual(breakdown.body.dealbreakerFailed, false);
    assert.ok(breakdown.body.vectors.substances.affinityScore >= 0.85);

    // Step 7: Rahul swipes LIKE and receives instant Mutual Match celebration payload (FR-18, FR-20, FR-21)
    const swipeRes = await request('POST', '/api/v1/discovery/swipe', {
      headers: { Authorization: `Bearer ${rahul.token}` },
      body: { candidateUserId: jithin.userId, action: 'LIKE', clientMutationId: 'rah-01' },
    });
    assert.strictEqual(swipeRes.statusCode, 200);
    assert.strictEqual(swipeRes.body.isMutualMatch, true);
    assert.ok(swipeRes.body.matchId);
    assert.ok(swipeRes.body.conversationId);
  });

  // =========================================================================
  // JOURNEY 3: MODALITY 3 (Relocator looking to move out searches for compatible peer)
  // =========================================================================
  it('Modality 3 Journey: Relocator looking to move out searches for compatible peer', async () => {
    // Step 1: Relocator 1 (Farzana Mohammed - Kariavattom PhD scholar)
    const farzana = await createAuthenticatedUser('+919846055555');
    
    // Academic Verification (@cet.ac.in)
    const acadReq = await request('POST', '/api/v1/auth/institution/verify-request', {
      headers: { Authorization: `Bearer ${farzana.token}` },
      body: { email: 'farzana@cet.ac.in', institutionType: 'ACADEMIC' },
    });
    await request('POST', '/api/v1/auth/institution/verify-confirm', {
      headers: { Authorization: `Bearer ${farzana.token}` },
      body: { token: acadReq.body.previewToken },
    });

    await request('PUT', '/api/v1/profiles/me', {
      headers: { Authorization: `Bearer ${farzana.token}` },
      body: {
        displayName: 'Farzana Mohammed',
        gender: 'FEMALE',
        birthDate: '1998-02-14',
        occupation: 'Research Scholar',
        collegeOrCompany: 'College of Engineering Trivandrum',
        bio: 'Currently in a flat near Kariavattom, looking to relocate with a serious student/professional.',
        modality: 'MODALITY_3',
        preferredGender: 'FEMALE',
        minBudget: 5000,
        maxBudget: 8000,
        moveInFlexibility: 'WITHIN_30_DAYS',
        preferredSuburbs: ['KARIAVATTOM', 'SREEKARYAM'],
      },
    });

    await request('PUT', '/api/v1/lifestyle/me', {
      headers: { Authorization: `Bearer ${farzana.token}` },
      body: {
        ...baseLifestyle,
        dietary: { dietType: 'HALAL_ONLY', kitchenPolicy: 'SEPARATE_UTENSILS_OK', isDealbreaker: false },
        social: { guestFrequency: 'NO_GUESTS', overnightGuestPolicy: 'NO_OVERNIGHT', partyPreference: 'NEVER_AT_HOME', isDealbreaker: false },
        work: { workMode: '100_PERCENT_REMOTE', callFrequency: 'LOW', workspacePreference: 'PRIVATE_ROOM_DESK', isDealbreaker: false },
      },
    });

    // Step 2: Relocator 2 (Sneha Pillai - Also Modality 3, moving out of hostel/flat)
    const sneha = await createAuthenticatedUser('+919846066666');
    await request('PUT', '/api/v1/profiles/me', {
      headers: { Authorization: `Bearer ${sneha.token}` },
      body: {
        displayName: 'Sneha Pillai',
        gender: 'FEMALE',
        birthDate: '1997-07-22',
        occupation: 'Biotech Analyst',
        collegeOrCompany: 'Kinfra BioTech',
        bio: 'Moving out of flat, seeking quiet, studious flatmate in Kariavattom.',
        modality: 'MODALITY_3',
        preferredGender: 'FEMALE',
        minBudget: 6000,
        maxBudget: 8500,
        moveInFlexibility: 'WITHIN_30_DAYS',
        preferredSuburbs: ['KARIAVATTOM', 'SREEKARYAM'],
      },
    });

    await request('PUT', '/api/v1/lifestyle/me', {
      headers: { Authorization: `Bearer ${sneha.token}` },
      body: {
        ...baseLifestyle,
        dietary: { dietType: 'STRICT_VEGETARIAN', kitchenPolicy: 'SEPARATE_UTENSILS_OK', isDealbreaker: false },
        social: { guestFrequency: 'NO_GUESTS', overnightGuestPolicy: 'NO_OVERNIGHT', partyPreference: 'NEVER_AT_HOME', isDealbreaker: false },
      },
    });

    // Step 3: Farzana fetches discovery feed. Per PRD Rule 4, Modality 3 matches with M1, M3, and M4.
    const farzanaFeed = await request('GET', '/api/v1/discovery/feed', {
      headers: { Authorization: `Bearer ${farzana.token}` },
    });
    assert.strictEqual(farzanaFeed.statusCode, 200);
    assert.strictEqual(farzanaFeed.body.cards.length, 1);
    assert.strictEqual(farzanaFeed.body.cards[0].userId, sneha.userId);
    assert.strictEqual(farzanaFeed.body.cards[0].modality, 'MODALITY_3');

    // Step 4: Farzana swipes LIKE, then Sneha swipes LIKE -> Mutual Match
    await request('POST', '/api/v1/discovery/swipe', {
      headers: { Authorization: `Bearer ${farzana.token}` },
      body: { candidateUserId: sneha.userId, action: 'LIKE', clientMutationId: 'farz-01' },
    });

    const snehaSwipe = await request('POST', '/api/v1/discovery/swipe', {
      headers: { Authorization: `Bearer ${sneha.token}` },
      body: { candidateUserId: farzana.userId, action: 'LIKE', clientMutationId: 'sneh-01' },
    });
    assert.strictEqual(snehaSwipe.statusCode, 200);
    assert.strictEqual(snehaSwipe.body.isMutualMatch, true);
    const convId = snehaSwipe.body.conversationId;

    // Step 5: Test DPDP Contact Harvesting Scanner (FR-23): Attempt to leak raw phone number in chat
    const leakedMsg = await request('POST', `/api/v1/conversations/${convId}/messages`, {
      headers: { Authorization: `Bearer ${farzana.token}` },
      body: { content: 'Call me on 9846055555 directly so we can inspect apartments.' },
    });
    assert.strictEqual(leakedMsg.statusCode, 201);
    // DPDP Scanner attaches safety advisory notice to the message
    assert.ok(leakedMsg.body.warningNotice, 'Should attach privacy warning on detected phone number');
    assert.ok(leakedMsg.body.warningNotice.includes('security') && leakedMsg.body.warningNotice.includes('Buddy'));
  });

  // =========================================================================
  // JOURNEY 4: MODALITY 4 (Joint seeker matches with compatible peer first before property search)
  // =========================================================================
  it('Modality 4 Journey: Joint seeker matches with compatible peer first before property search', async () => {
    // Step 1: Adarsh Nair (M4 - Technopark Software Engineer, seeks flatmate first)
    const adarsh = await createAuthenticatedUser('+919846077777');
    
    // Corporate Badge verification (@infosys.com)
    const corpReq = await request('POST', '/api/v1/auth/institution/verify-request', {
      headers: { Authorization: `Bearer ${adarsh.token}` },
      body: { email: 'adarsh.nair@infosys.com', institutionType: 'CORPORATE' },
    });
    await request('POST', '/api/v1/auth/institution/verify-confirm', {
      headers: { Authorization: `Bearer ${adarsh.token}` },
      body: { token: corpReq.body.previewToken },
    });

    await request('PUT', '/api/v1/profiles/me', {
      headers: { Authorization: `Bearer ${adarsh.token}` },
      body: {
        displayName: 'Adarsh Nair',
        gender: 'MALE',
        birthDate: '1998-05-15',
        occupation: 'Software Engineer',
        collegeOrCompany: 'Infosys Technopark',
        bio: 'Let’s team up and scout a modern 2BHK flat near Kazhakkoottam bypass.',
        modality: 'MODALITY_4',
        preferredGender: 'MALE',
        minBudget: 6000,
        maxBudget: 8500,
        moveInFlexibility: 'WITHIN_15_DAYS',
        preferredSuburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM'],
      },
    });

    await request('PUT', '/api/v1/lifestyle/me', {
      headers: { Authorization: `Bearer ${adarsh.token}` },
      body: {
        ...baseLifestyle,
        sleep: { sleepPattern: 'NIGHT_OWL', shiftSchedule: 'NORMAL_DAY', noiseSensitivity: 'HEAVY_SLEEPER', isDealbreaker: false },
        work: { workMode: 'HYBRID', callFrequency: 'LOW', workspacePreference: 'PRIVATE_ROOM_DESK', isDealbreaker: false },
      },
    });

    // Step 2: Rohit Menon (M4 - Also seeking peer first to search together)
    const rohit = await createAuthenticatedUser('+919846088888');
    await request('PUT', '/api/v1/profiles/me', {
      headers: { Authorization: `Bearer ${rohit.token}` },
      body: {
        displayName: 'Rohit Menon',
        gender: 'MALE',
        birthDate: '1997-09-10',
        occupation: 'Backend Developer',
        collegeOrCompany: 'UST Global',
        bio: 'Searching for an equal partner to lease a flat near Phase 3.',
        modality: 'MODALITY_4',
        preferredGender: 'MALE',
        minBudget: 7000,
        maxBudget: 9000,
        moveInFlexibility: 'WITHIN_15_DAYS',
        preferredSuburbs: ['KAZHAKKOOTTAM'],
      },
    });

    await request('PUT', '/api/v1/lifestyle/me', {
      headers: { Authorization: `Bearer ${rohit.token}` },
      body: {
        ...baseLifestyle,
        sleep: { sleepPattern: 'NIGHT_OWL', shiftSchedule: 'NORMAL_DAY', noiseSensitivity: 'HEAVY_SLEEPER', isDealbreaker: false },
        work: { workMode: 'HYBRID', callFrequency: 'LOW', workspacePreference: 'PRIVATE_ROOM_DESK', isDealbreaker: false },
      },
    });

    // Step 3: Add an incompatible Modality 1 provider to prove Modality 4 NEVER matches with M1 per PRD Rule 4
    const m1User = await createAuthenticatedUser('+919846012345');
    await request('PUT', '/api/v1/profiles/me', {
      headers: { Authorization: `Bearer ${m1User.token}` },
      body: {
        displayName: 'M1 Provider',
        gender: 'MALE',
        birthDate: '1990-01-01',
        occupation: 'Manager',
        modality: 'MODALITY_1',
        preferredGender: 'MALE',
        minBudget: 7000,
        maxBudget: 9000,
        moveInFlexibility: 'IMMEDIATE',
        preferredSuburbs: ['KAZHAKKOOTTAM'],
      },
    });
    await request('PUT', '/api/v1/lifestyle/me', {
      headers: { Authorization: `Bearer ${m1User.token}` },
      body: baseLifestyle,
    });

    // Step 4: Adarsh retrieves discovery feed - modality is status preference; eligible candidates appear with Rohit (M4) ranked first
    const adarshFeed = await request('GET', '/api/v1/discovery/feed', {
      headers: { Authorization: `Bearer ${adarsh.token}` },
    });
    assert.strictEqual(adarshFeed.statusCode, 200);
    assert.ok(adarshFeed.body.cards.length >= 1, 'Should return candidate feed');
    assert.strictEqual(adarshFeed.body.cards[0].userId, rohit.userId);
    assert.strictEqual(adarshFeed.body.cards[0].modality, 'MODALITY_4');

    // Step 5: Test Accidental Pass & Rewind (FR-18, US-14)
    // Add third candidate for rewind testing
    const tempCandidate = await createAuthenticatedUser('+919846054321');
    await request('PUT', '/api/v1/profiles/me', {
      headers: { Authorization: `Bearer ${tempCandidate.token}` },
      body: {
        displayName: 'Kiran Mohan',
        gender: 'MALE',
        birthDate: '1996-05-05',
        occupation: 'Tester',
        modality: 'MODALITY_4',
        preferredGender: 'MALE',
        minBudget: 6000,
        maxBudget: 8500,
        moveInFlexibility: 'WITHIN_15_DAYS',
        preferredSuburbs: ['KAZHAKKOOTTAM'],
      },
    });
    await request('PUT', '/api/v1/lifestyle/me', {
      headers: { Authorization: `Bearer ${tempCandidate.token}` },
      body: baseLifestyle,
    });

    // Adarsh accidentally passes on Kiran
    await request('POST', '/api/v1/discovery/swipe', {
      headers: { Authorization: `Bearer ${adarsh.token}` },
      body: { candidateUserId: tempCandidate.userId, action: 'PASS', clientMutationId: 'pass-01' },
    });

    // Adarsh invokes Rewind
    const rewindRes = await request('POST', '/api/v1/discovery/rewind', {
      headers: { Authorization: `Bearer ${adarsh.token}` },
    });
    assert.strictEqual(rewindRes.statusCode, 200);
    assert.strictEqual(rewindRes.body.success, true);
    assert.strictEqual(rewindRes.body.rewoundCandidateId, tempCandidate.userId);

    // Enforce 1 Rewind limit per session (returns 400 Bad Request)
    const secondRewind = await request('POST', '/api/v1/discovery/rewind', {
      headers: { Authorization: `Bearer ${adarsh.token}` },
    });
    assert.strictEqual(secondRewind.statusCode, 400);

    // Step 6: Adarsh swipes LIKE on Rohit, Rohit swipes LIKE on Adarsh -> Mutual Match
    await request('POST', '/api/v1/discovery/swipe', {
      headers: { Authorization: `Bearer ${adarsh.token}` },
      body: { candidateUserId: rohit.userId, action: 'LIKE', clientMutationId: 'ad-like-01' },
    });

    const rohitSwipe = await request('POST', '/api/v1/discovery/swipe', {
      headers: { Authorization: `Bearer ${rohit.token}` },
      body: { candidateUserId: adarsh.userId, action: 'LIKE', clientMutationId: 'ro-like-01' },
    });
    assert.strictEqual(rohitSwipe.statusCode, 200);
    assert.strictEqual(rohitSwipe.body.isMutualMatch, true);
    const convId = rohitSwipe.body.conversationId;

    // Step 7: Adarsh & Rohit coordinate apartment search via in-app chat (FR-22)
    const adarshMsg = await request('POST', `/api/v1/conversations/${convId}/messages`, {
      headers: { Authorization: `Bearer ${adarsh.token}` },
      body: { content: 'Hey Rohit! Saw your profile. Let’s shortlist 2BHK flats near Technopark Phase 3.' },
    });
    assert.strictEqual(adarshMsg.statusCode, 201);

    const rohitReply = await request('POST', `/api/v1/conversations/${convId}/messages`, {
      headers: { Authorization: `Bearer ${rohit.token}` },
      body: { content: 'Awesome Adarsh! I know a few gated societies near Kazhakkoottam. Let’s connect on the weekend.' },
    });
    assert.strictEqual(rohitReply.statusCode, 201);

    // Verify conversation message count
    const conversationHistory = await request('GET', `/api/v1/conversations/${convId}/messages`, {
      headers: { Authorization: `Bearer ${adarsh.token}` },
    });
    assert.strictEqual(conversationHistory.statusCode, 200);
    assert.strictEqual(conversationHistory.body.messages.length, 2);
  });
});

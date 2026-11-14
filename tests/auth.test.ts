import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../src/modules/auth/auth.service.ts';
import { db } from '../src/database/in-memory-db.ts';
import { JwtUtil } from '../src/common/utils/jwt.ts';
import { env } from '../src/config/env.ts';
import {
  BadRequestError,
  UnauthorizedError,
  AccountLockedError,
} from '../src/common/errors/problem-details.ts';

describe('Auth & Identity Module (ADR-005, FR-01, FR-02, FR-03)', () => {
  beforeEach(() => {
    db.reset();
  });

  describe('FR-01: Phone Number Authentication via Secure OTP', () => {
    it('sends 6-digit OTP to valid Indian mobile number (+919876543210)', async () => {
      const response = await AuthService.sendOtp('+919876543210');
      assert.strictEqual(response.success, true);
      assert.strictEqual(response.expiresInSeconds, 300);
      assert.strictEqual(db.authOtps.length, 1);
      assert.strictEqual(db.authOtps[0].attemptsCount, 0);
    });

    it('rejects invalid phone number formats', async () => {
      await assert.rejects(
        async () => AuthService.sendOtp('9876543210'),
        (err: any) => err instanceof BadRequestError && err.status === 400
      );

      await assert.rejects(
        async () => AuthService.sendOtp('+12025550143'),
        (err: any) => err instanceof BadRequestError
      );

      await assert.rejects(
        async () => AuthService.sendOtp('+911234567890'), // does not start with 6-9
        (err: any) => err instanceof BadRequestError
      );
    });

    it('successfully verifies OTP, creates user and issues JWT + refresh token', async () => {
      await AuthService.sendOtp('+919876543210');
      const { session, rawRefreshToken } = await AuthService.verifyOtp('+919876543210', '123456');

      assert.ok(session.accessToken);
      assert.strictEqual(session.tokenType, 'Bearer');
      assert.strictEqual(session.expiresIn, 900);
      assert.ok(session.user.id);
      assert.strictEqual(session.user.status, 'ACTIVE');
      assert.strictEqual(session.user.isOnboardingCompleted, false);

      // Verify JWT signature
      const decoded = JwtUtil.verify(session.accessToken, env.JWT_SECRET);
      assert.strictEqual(decoded.sub, session.user.id);
      assert.strictEqual(decoded.role, 'USER');

      // Verify refresh token stored in DB
      assert.strictEqual(db.refreshTokens.length, 1);
      assert.strictEqual(db.refreshTokens[0].userId, session.user.id);
      assert.strictEqual(db.refreshTokens[0].isRevoked, false);
      assert.ok(rawRefreshToken);
    });

    it('rejects incorrect OTP with 401 Unauthorized', async () => {
      await AuthService.sendOtp('+919876543210');
      await assert.rejects(
        async () => AuthService.verifyOtp('+919876543210', '999999'),
        (err: any) => err instanceof UnauthorizedError && err.status === 401
      );
    });

    it('locks account after 3 failed OTP attempts with 423 Locked', async () => {
      await AuthService.sendOtp('+919876543210');

      // Attempt 1
      await assert.rejects(async () => AuthService.verifyOtp('+919876543210', '000001'));
      // Attempt 2
      await assert.rejects(async () => AuthService.verifyOtp('+919876543210', '000002'));
      // Attempt 3
      await assert.rejects(async () => AuthService.verifyOtp('+919876543210', '000003'));

      // 4th attempt should throw AccountLockedError
      await assert.rejects(
        async () => AuthService.verifyOtp('+919876543210', '123456'),
        (err: any) => err instanceof AccountLockedError && err.status === 423
      );
    });
  });

  describe('ADR-005: Refresh Token Rotation & Token Family Reuse Detection', () => {
    it('rotates refresh token and issues new access token', async () => {
      await AuthService.sendOtp('+919876543210');
      const { rawRefreshToken } = await AuthService.verifyOtp('+919876543210', '123456');

      const { response, newRawRefreshToken } = await AuthService.refreshSession(rawRefreshToken);
      assert.ok(response.accessToken);
      assert.notStrictEqual(newRawRefreshToken, rawRefreshToken);

      // Verify previous token is revoked
      const oldRecord = db.refreshTokens.find((r) => r.isRevoked);
      assert.ok(oldRecord);

      // Verify new token is active in same family
      const newRecord = db.refreshTokens.find((r) => !r.isRevoked);
      assert.ok(newRecord);
      assert.strictEqual(oldRecord.familyId, newRecord.familyId);
    });

    it('detects token reuse and terminates entire token family', async () => {
      await AuthService.sendOtp('+919876543210');
      const { rawRefreshToken: tokenV1 } = await AuthService.verifyOtp('+919876543210', '123456');

      // Rotate token once (v1 -> v2)
      const { newRawRefreshToken: tokenV2 } = await AuthService.refreshSession(tokenV1);

      // Malicious attacker attempts to replay already-rotated tokenV1
      await assert.rejects(
        async () => AuthService.refreshSession(tokenV1),
        (err: any) =>
          err instanceof UnauthorizedError &&
          err.detail.includes('Security incident: Token reuse detected')
      );

      // Verify ALL tokens in the family are revoked!
      const activeTokensInFamily = db.refreshTokens.filter((r) => !r.isRevoked);
      assert.strictEqual(activeTokensInFamily.length, 0);

      // Legitimate client with tokenV2 is also now blocked until re-authentication
      await assert.rejects(
        async () => AuthService.refreshSession(tokenV2),
        (err: any) => err instanceof UnauthorizedError
      );
    });
  });

  describe('FR-02 & FR-03: Academic & Corporate Badge Verification', () => {
    it('dispatches verification link to recognized academic email (@cet.ac.in)', async () => {
      await AuthService.sendOtp('+919876543210');
      const { session } = await AuthService.verifyOtp('+919876543210', '123456');

      const result = await AuthService.requestInstitutionVerification(session.user.id, {
        email: 'student@cet.ac.in',
        institutionType: 'ACADEMIC',
      });

      assert.strictEqual(result.success, true);
      assert.ok(result.previewToken);

      // Confirm verification
      const confirmResult = await AuthService.confirmInstitutionVerification(
        session.user.id,
        result.previewToken!
      );
      assert.strictEqual(confirmResult.success, true);
      assert.strictEqual(confirmResult.badge, 'VERIFIED_STUDENT');
    });

    it('rejects unrecognized academic domain', async () => {
      await AuthService.sendOtp('+919876543210');
      const { session } = await AuthService.verifyOtp('+919876543210', '123456');

      await assert.rejects(
        async () =>
          AuthService.requestInstitutionVerification(session.user.id, {
            email: 'fake@unknowncollege.com',
            institutionType: 'ACADEMIC',
          }),
        (err: any) => err instanceof BadRequestError && err.detail.includes('Unrecognized academic domain')
      );
    });

    it('dispatches verification link to recognized Technopark corporate email (@ust.com)', async () => {
      await AuthService.sendOtp('+919876543210');
      const { session } = await AuthService.verifyOtp('+919876543210', '123456');

      const result = await AuthService.requestInstitutionVerification(session.user.id, {
        email: 'engineer@ust.com',
        institutionType: 'CORPORATE',
      });

      assert.strictEqual(result.success, true);
      assert.ok(result.previewToken);

      const confirmResult = await AuthService.confirmInstitutionVerification(
        session.user.id,
        result.previewToken!
      );
      assert.strictEqual(confirmResult.success, true);
      assert.strictEqual(confirmResult.badge, 'VERIFIED_PROFESSIONAL');
    });
  });
});

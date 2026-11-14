import crypto from 'node:crypto';
import { db } from '../../database/in-memory-db.ts';
import { CryptoUtil } from '../../common/utils/crypto.ts';
import { JwtUtil } from '../../common/utils/jwt.ts';
import { env } from '../../config/env.ts';
import {
  BadRequestError,
  UnauthorizedError,
  AccountLockedError,
  ForbiddenError,
  RateLimitError,
} from '../../common/errors/problem-details.ts';
import type {
  SendOtpResponse,
  AuthSessionResponse,
  RefreshTokenResponse,
  InstitutionVerifyRequest,
} from './auth.types.ts';

export class AuthService {
  private static readonly PHONE_REGEX = /^\+91[6-9]\d{9}$/;
  private static readonly OTP_EXPIRY_SECONDS = 300; // 5 minutes
  private static readonly MAX_OTP_ATTEMPTS = 3;
  private static readonly OTP_RATE_LIMIT_WINDOW_SECONDS = 900; // 15 minutes
  private static readonly MAX_OTP_SEND_REQUESTS = 3; // max 3 requests per 15 minutes per phone (TH-S-01, TH-D-02)

  /**
   * Dispatches 6-digit OTP to Indian mobile phone number (FR-01).
   */
  static async sendOtp(phoneNumber: string): Promise<SendOtpResponse & { previewOtp?: string }> {
    if (!this.PHONE_REGEX.test(phoneNumber)) {
      throw new BadRequestError('Invalid Indian mobile phone number format (+91 followed by 10 digits starting with 6-9)');
    }

    const phoneHash = CryptoUtil.hashDeterministic(phoneNumber);

    // Sliding window rate limiting: max 3 requests per 15 minutes per phone number
    const windowStart = new Date(Date.now() - this.OTP_RATE_LIMIT_WINDOW_SECONDS * 1000);
    const recentRequests = db.authOtps.filter(
      (r) => r.phoneHash === phoneHash && r.createdAt >= windowStart
    );

    if (recentRequests.length >= this.MAX_OTP_SEND_REQUESTS) {
      throw new RateLimitError(
        'Too many OTP requests. Maximum 3 requests allowed per 15 minutes for this phone number.'
      );
    }
    // In development or test, allow 123456 or random OTP
    const isProd = env.NODE_ENV === 'production';
    const otp = isProd ? crypto.randomInt(100000, 999999).toString() : '123456';
    const otpHash = await CryptoUtil.hashSecret(otp);

    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_SECONDS * 1000);

    // Persist OTP record
    db.authOtps.push({
      id: crypto.randomUUID(),
      phoneHash,
      otpHash,
      attemptsCount: 0,
      expiresAt,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: 'OTP sent successfully',
      expiresInSeconds: this.OTP_EXPIRY_SECONDS,
      previewOtp: isProd ? undefined : otp,
    };
  }

  /**
   * Verifies OTP, creates or fetches user, returns JWT and refresh token.
   */
  static async verifyOtp(
    phoneNumber: string,
    otp: string
  ): Promise<{ session: AuthSessionResponse; rawRefreshToken: string }> {
    if (!this.PHONE_REGEX.test(phoneNumber)) {
      throw new BadRequestError('Invalid phone number format');
    }
    if (!/^\d{6}$/.test(otp)) {
      throw new BadRequestError('OTP must be exactly 6 digits');
    }

    const phoneHash = CryptoUtil.hashDeterministic(phoneNumber);
    const now = new Date();

    // Find active OTP record
    const otpRecords = db.authOtps
      .filter((r) => r.phoneHash === phoneHash && !r.verifiedAt && r.expiresAt > now)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const activeOtp = otpRecords[0];
    if (!activeOtp) {
      throw new UnauthorizedError('Invalid or expired OTP. Please request a new OTP.');
    }

    if (activeOtp.attemptsCount >= this.MAX_OTP_ATTEMPTS) {
      throw new AccountLockedError('Maximum OTP verification attempts exceeded. Please request a new OTP.');
    }

    activeOtp.attemptsCount += 1;

    const isValid = await CryptoUtil.verifySecret(activeOtp.otpHash, otp);
    if (!isValid) {
      throw new UnauthorizedError('Incorrect OTP entered');
    }

    activeOtp.verifiedAt = now;

    // Fetch or create User
    let user = Array.from(db.users.values()).find((u) => u.phoneHash === phoneHash);
    let isNewUser = false;

    if (!user) {
      const encryptedPhone = CryptoUtil.encryptAesGcm(phoneNumber);
      user = {
        id: crypto.randomUUID(),
        phoneHash,
        phoneEncrypted: encryptedPhone,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      };
      db.users.set(user.id, user);
      isNewUser = true;
    }

    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      throw new ForbiddenError(`Your account has been ${user.status.toLowerCase()}`);
    }

    const userProfile = db.userProfiles.get(user.id);
    const isOnboardingCompleted = userProfile ? userProfile.isOnboardingCompleted : false;

    // Issue JWT access token
    const accessToken = JwtUtil.sign(
      { sub: user.id, role: 'USER', status: user.status },
      env.JWT_SECRET,
      env.JWT_ACCESS_EXPIRY_SECONDS
    );

    // Issue opaque refresh token with token family
    const rawRefreshToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = CryptoUtil.hashDeterministic(rawRefreshToken);
    const familyId = crypto.randomUUID();

    db.refreshTokens.push({
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash,
      familyId,
      isRevoked: false,
      expiresAt: new Date(Date.now() + env.JWT_REFRESH_EXPIRY_SECONDS * 1000),
      createdAt: now,
    });

    return {
      session: {
        accessToken,
        tokenType: 'Bearer',
        expiresIn: env.JWT_ACCESS_EXPIRY_SECONDS,
        user: {
          id: user.id,
          status: user.status,
          isOnboardingCompleted,
        },
      },
      rawRefreshToken,
    };
  }

  /**
   * Refreshes access token with family-based reuse detection (ADR-005).
   */
  static async refreshSession(
    rawRefreshToken: string
  ): Promise<{ response: RefreshTokenResponse; newRawRefreshToken: string }> {
    if (!rawRefreshToken) {
      throw new UnauthorizedError('Missing refresh token cookie');
    }

    const tokenHash = CryptoUtil.hashDeterministic(rawRefreshToken);
    const tokenRecord = db.refreshTokens.find((r) => r.tokenHash === tokenHash);

    if (!tokenRecord) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const now = new Date();

    // Token Reuse Detection: If an already revoked token is presented, compromise detected!
    if (tokenRecord.isRevoked) {
      // Invalidate the entire token family immediately!
      for (const tok of db.refreshTokens) {
        if (tok.familyId === tokenRecord.familyId) {
          tok.isRevoked = true;
        }
      }
      throw new UnauthorizedError('Security incident: Token reuse detected. Session terminated.');
    }

    if (tokenRecord.expiresAt < now) {
      tokenRecord.isRevoked = true;
      throw new UnauthorizedError('Refresh token expired');
    }

    // Revoke current token (rotation)
    tokenRecord.isRevoked = true;

    const user = db.users.get(tokenRecord.userId);
    if (!user || user.status === 'BANNED' || user.status === 'SUSPENDED') {
      throw new ForbiddenError('User account is inactive or banned');
    }

    // Issue new refresh token within SAME family
    const newRawRefreshToken = crypto.randomBytes(32).toString('hex');
    const newTokenHash = CryptoUtil.hashDeterministic(newRawRefreshToken);

    db.refreshTokens.push({
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash: newTokenHash,
      familyId: tokenRecord.familyId,
      isRevoked: false,
      expiresAt: new Date(Date.now() + env.JWT_REFRESH_EXPIRY_SECONDS * 1000),
      createdAt: now,
    });

    const accessToken = JwtUtil.sign(
      { sub: user.id, role: 'USER', status: user.status },
      env.JWT_SECRET,
      env.JWT_ACCESS_EXPIRY_SECONDS
    );

    return {
      response: {
        accessToken,
        tokenType: 'Bearer',
        expiresIn: env.JWT_ACCESS_EXPIRY_SECONDS,
      },
      newRawRefreshToken,
    };
  }

  /**
   * Terminate session and revoke refresh token.
   */
  static async logout(userId: string, rawRefreshToken?: string): Promise<void> {
    if (rawRefreshToken) {
      const tokenHash = CryptoUtil.hashDeterministic(rawRefreshToken);
      const token = db.refreshTokens.find((r) => r.tokenHash === tokenHash && r.userId === userId);
      if (token) {
        token.isRevoked = true;
      }
    } else {
      // Revoke all tokens for this user
      for (const t of db.refreshTokens) {
        if (t.userId === userId) {
          t.isRevoked = true;
        }
      }
    }
  }

  /**
   * Request institutional verification (FR-02).
   */
  static async requestInstitutionVerification(
    userId: string,
    req: InstitutionVerifyRequest
  ): Promise<{ success: boolean; message: string; previewToken?: string }> {
    const user = db.users.get(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const email = req.email.trim().toLowerCase();
    const domain = email.split('@')[1];
    if (!domain) {
      throw new BadRequestError('Invalid email format');
    }

    // Trivandrum ecosystem validation
    const recognizedAcademic = ['cet.ac.in', 'keralauniversity.ac.in', 'iiitmk.ac.in', 'sciet.ac.in'];
    const recognizedCorporate = ['ust.com', 'infosys.com', 'tcs.com', 'allianz.com', 'ibssoftware.com'];

    if (req.institutionType === 'ACADEMIC' && !recognizedAcademic.includes(domain)) {
      throw new BadRequestError(`Unrecognized academic domain: ${domain}. Must be accredited university/college.`);
    }
    if (req.institutionType === 'CORPORATE' && !recognizedCorporate.includes(domain)) {
      throw new BadRequestError(`Unrecognized corporate domain: ${domain}. Must be verified Technopark/Kinfra corporate.`);
    }

    const emailHash = CryptoUtil.hashDeterministic(email);
    const existing = db.institutionVerifications.find((v) => v.emailHash === emailHash && v.status === 'VERIFIED');
    if (existing && existing.userId !== userId) {
      throw new BadRequestError('This institution email is already verified by another account');
    }

    const token = crypto.randomBytes(24).toString('hex');
    const tokenHash = CryptoUtil.hashDeterministic(token);

    db.institutionVerifications.push({
      id: crypto.randomUUID(),
      userId,
      emailHash,
      emailMasked: CryptoUtil.maskEmail(email),
      institutionType: req.institutionType,
      institutionName: domain.split('.')[0].toUpperCase(),
      domain,
      status: 'PENDING',
      tokenHash,
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000), // 24 hours
      createdAt: new Date(),
    });

    return {
      success: true,
      message: `Verification link sent to ${CryptoUtil.maskEmail(email)}`,
      previewToken: token, // In test/dev environment, return previewToken
    };
  }

  /**
   * Confirms institutional verification token (FR-02, FR-03).
   */
  static async confirmInstitutionVerification(
    userId: string,
    token: string
  ): Promise<{ success: boolean; badge: string }> {
    const tokenHash = CryptoUtil.hashDeterministic(token);
    const verification = db.institutionVerifications.find(
      (v) => v.tokenHash === tokenHash && v.userId === userId && v.status === 'PENDING'
    );

    if (!verification) {
      throw new UnauthorizedError('Invalid or expired verification token');
    }

    if (verification.expiresAt < new Date()) {
      throw new UnauthorizedError('Verification token has expired');
    }

    verification.status = 'VERIFIED';
    verification.verifiedAt = new Date();

    const badge =
      verification.institutionType === 'ACADEMIC'
        ? 'VERIFIED_STUDENT'
        : 'VERIFIED_PROFESSIONAL';

    // Update user profile badge
    const profile = db.userProfiles.get(userId);
    if (profile) {
      profile.verificationBadge = badge;
    }

    return {
      success: true,
      badge,
    };
  }
}

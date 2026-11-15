import http from 'node:http';
import { db } from './database/in-memory-db.ts';
import { AuthService } from './modules/auth/auth.service.ts';
import { UsersService } from './modules/users/users.service.ts';
import { PreferencesService } from './modules/preferences/preferences.service.ts';
import { DiscoveryService } from './modules/discovery/discovery.service.ts';
import { MessagingService } from './modules/messaging/messaging.service.ts';
import { ListingsService } from './modules/listings/listings.service.ts';
import { SafetyService } from './modules/safety/safety.service.ts';
import { ScoringEngine } from './modules/matching/scoring.engine.ts';
import { geminiAIService } from './modules/ai/gemini.client.ts';
import { JwtUtil } from './common/utils/jwt.ts';
import { env } from './config/env.ts';
import {
  AppError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} from './common/errors/problem-details.ts';
import { renderTestConsoleHtml } from './app/test-console.html.ts';
import { renderClientAppHtml } from './app/client-app.html.ts';

export interface HttpRequest {
  method: string;
  url: string;
  pathname: string;
  query: Record<string, string>;
  params: Record<string, string>;
  headers: http.IncomingHttpHeaders;
  cookies: Record<string, string>;
  body: any;
  user?: {
    userId: string;
    role: string;
    status: string;
  };
}

export interface HttpResponse {
  statusCode: number;
  headers: Record<string, string | string[]>;
  body?: string;
  status(code: number): HttpResponse;
  header(name: string, value: string | string[]): HttpResponse;
  json(data: unknown): void;
  send(data?: string): void;
}

export function parseCookies(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  for (const part of cookieHeader.split(';')) {
    const [key, ...vals] = part.trim().split('=');
    if (key) {
      cookies[key] = decodeURIComponent(vals.join('='));
    }
  }
  return cookies;
}

export class BuddyApp {
  private authenticate(req: HttpRequest): void {
    let token: string | undefined;
    const auth = req.headers['authorization'] || (req.headers as any)['Authorization'];
    if (auth && typeof auth === 'string' && auth.startsWith('Bearer ')) {
      token = auth.substring(7);
    } else if (req.cookies['access_token']) {
      token = req.cookies['access_token'];
    }

    if (!token) {
      throw new UnauthorizedError('Missing authentication token');
    }

    try {
      const decoded = JwtUtil.verify(token, env.JWT_SECRET);
      if (!decoded.sub) {
        throw new UnauthorizedError('Invalid token subject');
      }

      const dbUser = db.users.get(decoded.sub);
      const effectiveStatus = dbUser ? dbUser.status : (decoded.status || 'ACTIVE');

      if (effectiveStatus === 'BANNED' || effectiveStatus === 'SUSPENDED' || effectiveStatus === 'QUARANTINED') {
        throw new ForbiddenError(`Account is ${effectiveStatus.toLowerCase()}`);
      }

      req.user = {
        userId: decoded.sub,
        role: decoded.role || 'USER',
        status: effectiveStatus,
      };
    } catch (err: any) {
      if (err instanceof AppError) {
        throw err;
      }
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Access token has expired');
      }
      throw new UnauthorizedError('Invalid access token');
    }
  }

  private optionalAuthenticate(req: HttpRequest): void {
    let token: string | undefined;
    const auth = req.headers['authorization'] || (req.headers as any)['Authorization'];
    if (auth && typeof auth === 'string' && auth.startsWith('Bearer ')) {
      token = auth.substring(7);
    } else if (req.cookies['access_token']) {
      token = req.cookies['access_token'];
    }

    if (!token) return;

    try {
      const decoded = JwtUtil.verify(token, env.JWT_SECRET);
      if (!decoded.sub) return;

      const dbUser = db.users.get(decoded.sub);
      const effectiveStatus = dbUser ? dbUser.status : (decoded.status || 'ACTIVE');

      if (effectiveStatus === 'BANNED' || effectiveStatus === 'SUSPENDED' || effectiveStatus === 'QUARANTINED') {
        return;
      }

      req.user = {
        userId: decoded.sub,
        role: decoded.role || 'USER',
        status: effectiveStatus,
      };
    } catch {
      // Treat as unauthenticated guest on token verification error
    }
  }

  private matchRoute(
    pattern: string,
    pathname: string
  ): { matched: boolean; params: Record<string, string> } {
    const patternParts = pattern.split('/');
    const pathParts = pathname.split('/');

    if (patternParts.length !== pathParts.length) {
      return { matched: false, params: {} };
    }

    const params: Record<string, string> = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].substring(1);
        params[paramName] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return { matched: false, params: {} };
      }
    }
    return { matched: true, params };
  }

  public async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = urlObj.pathname;
    const query: Record<string, string> = {};
    urlObj.searchParams.forEach((val, key) => {
      query[key] = val;
    });

    const cookies = parseCookies(req.headers['cookie']);

    // Parse Body
    let body: any = {};
    if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const rawBody = Buffer.concat(chunks).toString('utf8');
      if (rawBody.trim().length > 0) {
        try {
          body = JSON.parse(rawBody);
        } catch {
          body = {};
        }
      }
    }

    const httpReq: HttpRequest = {
      method: req.method || 'GET',
      url: req.url || '/',
      pathname,
      query,
      params: {},
      headers: req.headers,
      cookies,
      body,
    };

    const responseHeaders: Record<string, string | string[]> = {
      'Access-Control-Allow-Origin': env.CORS_ORIGIN,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    };

    if (httpReq.method === 'OPTIONS') {
      res.writeHead(204, responseHeaders);
      res.end();
      return;
    }

    const sendProblemDetails = (err: AppError) => {
      const payload = err.toProblemDetails(pathname);
      res.writeHead(err.status, {
        ...responseHeaders,
        'Content-Type': 'application/problem+json',
      });
      res.end(JSON.stringify(payload));
    };

    try {
      await this.dispatch(httpReq, res, responseHeaders);
    } catch (err: any) {
      if (err instanceof AppError) {
        sendProblemDetails(err);
      } else {
        console.error('[Unhandled Request Error]:', err);
        sendProblemDetails(
          new AppError(500, 'Internal Server Error', err.message || 'An unexpected error occurred')
        );
      }
    }
  }

  private async dispatch(
    req: HttpRequest,
    res: http.ServerResponse,
    responseHeaders: Record<string, string | string[]>
  ): Promise<void> {
    const method = req.method;
    const path = req.pathname;

    const json = (statusCode: number, data: unknown, extraHeaders: Record<string, string | string[]> = {}) => {
      res.writeHead(statusCode, {
        ...responseHeaders,
        'Content-Type': 'application/json',
        ...extraHeaders,
      });
      res.end(JSON.stringify(data));
    };

    const noContent = () => {
      res.writeHead(204, responseHeaders);
      res.end();
    };

    // ==========================================
    // SYSTEM & HEALTH CHECKS
    // ==========================================
    if (method === 'GET' && path === '/healthz') {
      return json(200, {
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'buddy-modular-monolith',
        version: '1.0.0',
        environment: env.NODE_ENV,
        database: {
          usersCount: db.users.size,
          profilesCount: db.userProfiles.size,
          listingsCount: db.roomListings.size,
          matchesCount: db.matches.length,
        },
      });
    }

    if (method === 'GET' && (path === '/' || path === '/app')) {
      const html = renderClientAppHtml();
      res.writeHead(200, {
        ...responseHeaders,
        'Content-Type': 'text/html; charset=utf-8',
      });
      res.end(html);
      return;
    }

    if (method === 'GET' && path === '/test-console') {
      const html = renderTestConsoleHtml();
      res.writeHead(200, {
        ...responseHeaders,
        'Content-Type': 'text/html; charset=utf-8',
      });
      res.end(html);
      return;
    }

    // ==========================================
    // DOMAIN 1: AUTHENTICATION
    // ==========================================
    if (method === 'POST' && path === '/api/v1/auth/otp/send') {
      const result = await AuthService.sendOtp(req.body.phoneNumber);
      return json(200, result);
    }

    if (method === 'POST' && path === '/api/v1/auth/otp/verify') {
      const { session, rawRefreshToken } = await AuthService.verifyOtp(
        req.body.phoneNumber,
        req.body.otp
      );

      const cookieHeader = [
        `refresh_token=${rawRefreshToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${env.JWT_REFRESH_EXPIRY_SECONDS}`,
        `__Host-refresh_token=${rawRefreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${env.JWT_REFRESH_EXPIRY_SECONDS}`,
      ];

      return json(200, session, { 'Set-Cookie': cookieHeader });
    }

    if (method === 'POST' && path === '/api/v1/auth/refresh') {
      const rawRefreshToken =
        req.cookies['refresh_token'] || req.cookies['__Host-refresh_token'] || req.body.refreshToken;
      const { response, newRawRefreshToken } = await AuthService.refreshSession(rawRefreshToken);

      const cookieHeader = [
        `refresh_token=${newRawRefreshToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${env.JWT_REFRESH_EXPIRY_SECONDS}`,
        `__Host-refresh_token=${newRawRefreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${env.JWT_REFRESH_EXPIRY_SECONDS}`,
      ];

      return json(200, response, { 'Set-Cookie': cookieHeader });
    }

    if (method === 'POST' && path === '/api/v1/auth/logout') {
      this.authenticate(req);
      const rawRefreshToken = req.cookies['refresh_token'];
      await AuthService.logout(req.user!.userId, rawRefreshToken);
      return noContent();
    }

    if (method === 'POST' && path === '/api/v1/auth/institution/verify-request') {
      this.authenticate(req);
      const result = await AuthService.requestInstitutionVerification(req.user!.userId, req.body);
      return json(202, result);
    }

    if (method === 'POST' && path === '/api/v1/auth/institution/verify-confirm') {
      this.authenticate(req);
      const result = await AuthService.confirmInstitutionVerification(req.user!.userId, req.body.token);
      return json(200, result);
    }

    // ==========================================
    // DOMAIN 2: PROFILES
    // ==========================================
    if (method === 'GET' && path === '/api/v1/profiles/me') {
      this.authenticate(req);
      const profile = UsersService.getProfile(req.user!.userId);
      return json(200, profile);
    }

    if (method === 'PUT' && path === '/api/v1/profiles/me') {
      this.authenticate(req);
      const profile = UsersService.updateProfile(req.user!.userId, req.body);
      return json(200, profile);
    }

    if (method === 'POST' && path === '/api/v1/profiles/me/photos') {
      this.authenticate(req);
      const photo = UsersService.addPhoto(
        req.user!.userId,
        req.body.photoUrl,
        req.body.orderIndex,
        req.body.isPrimary
      );
      return json(201, photo);
    }

    const photoDeleteMatch = this.matchRoute('/api/v1/profiles/me/photos/:photoId', path);
    if (method === 'DELETE' && photoDeleteMatch.matched) {
      this.authenticate(req);
      UsersService.deletePhoto(req.user!.userId, photoDeleteMatch.params.photoId);
      return noContent();
    }

    const candidateProfileMatch = this.matchRoute('/api/v1/profiles/:userId', path);
    if (method === 'GET' && candidateProfileMatch.matched) {
      this.authenticate(req);
      const cand = UsersService.getCandidateProfile(
        req.user!.userId,
        candidateProfileMatch.params.userId
      );
      return json(200, cand);
    }

    // ==========================================
    // DOMAIN 3: LIFESTYLE PREFERENCES (7 VECTORS)
    // ==========================================
    if (method === 'GET' && path === '/api/v1/lifestyle/me') {
      this.authenticate(req);
      const lifestyle = PreferencesService.getLifestyle(req.user!.userId);
      return json(200, lifestyle);
    }

    if (method === 'PUT' && path === '/api/v1/lifestyle/me') {
      this.authenticate(req);
      const lifestyle = PreferencesService.updateLifestyle(req.user!.userId, req.body);
      return json(200, lifestyle);
    }

    // ==========================================
    // DOMAIN 4 & 5: DISCOVERY & SWIPING
    // ==========================================
    if (method === 'GET' && path === '/api/v1/discovery/feed') {
      this.optionalAuthenticate(req);
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
      const feed = DiscoveryService.getFeed(req.user?.userId, limit);
      return json(200, feed);
    }

    if (method === 'POST' && path === '/api/v1/discovery/swipe') {
      this.authenticate(req);
      const candidateId = req.body.candidateUserId || req.body.targetUserId;
      const result = DiscoveryService.swipe(
        req.user!.userId,
        candidateId,
        req.body.action
      );
      return json(200, result);
    }

    if (method === 'POST' && path === '/api/v1/discovery/rewind') {
      this.authenticate(req);
      const result = DiscoveryService.rewind(req.user!.userId);
      return json(200, result);
    }

    const compBreakdownMatch = this.matchRoute('/api/v1/discovery/compatibility/:candidateId', path);
    if (method === 'GET' && compBreakdownMatch.matched) {
      this.authenticate(req);
      const breakdown = DiscoveryService.getCompatibilityBreakdown(
        req.user!.userId,
        compBreakdownMatch.params.candidateId
      );
      return json(200, breakdown);
    }

    // ==========================================
    // DOMAIN 6: MATCHES
    // ==========================================
    if (method === 'GET' && path === '/api/v1/matches') {
      this.authenticate(req);
      const matches = MessagingService.listMatches(req.user!.userId);
      return json(200, matches);
    }

    const matchDeleteMatch = this.matchRoute('/api/v1/matches/:matchId', path);
    if (method === 'DELETE' && matchDeleteMatch.matched) {
      this.authenticate(req);
      MessagingService.unmatch(req.user!.userId, matchDeleteMatch.params.matchId);
      return noContent();
    }

    // ==========================================
    // DOMAIN 7: CONVERSATIONS & MESSAGING
    // ==========================================
    if (method === 'GET' && path === '/api/v1/conversations') {
      this.authenticate(req);
      const convs = MessagingService.listConversations(req.user!.userId);
      return json(200, { conversations: convs });
    }

    const msgListMatch = this.matchRoute('/api/v1/conversations/:conversationId/messages', path);
    if (method === 'GET' && msgListMatch.matched) {
      this.authenticate(req);
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
      const history = MessagingService.getMessages(
        msgListMatch.params.conversationId,
        req.user!.userId,
        limit
      );
      return json(200, history);
    }

    if (method === 'POST' && msgListMatch.matched) {
      this.authenticate(req);
      const message = MessagingService.sendMessage(
        msgListMatch.params.conversationId,
        req.user!.userId,
        req.body.content
      );
      return json(201, message);
    }

    const archiveConvMatch = this.matchRoute('/api/v1/conversations/:conversationId/archive', path);
    if (method === 'POST' && archiveConvMatch.matched) {
      this.authenticate(req);
      MessagingService.archiveConversation(archiveConvMatch.params.conversationId, req.user!.userId);
      return noContent();
    }

    // ==========================================
    // DOMAIN 8: ROOM LISTINGS
    // ==========================================
    if (method === 'GET' && path === '/api/v1/rooms/me') {
      this.authenticate(req);
      const room = ListingsService.getListing(req.user!.userId);
      return json(200, room);
    }

    if ((method === 'POST' || method === 'PUT') && path === '/api/v1/rooms/me') {
      this.authenticate(req);
      const room = ListingsService.createOrUpdateListing(req.user!.userId, req.body);
      return json(method === 'POST' ? 201 : 200, room);
    }

    if (method === 'DELETE' && path === '/api/v1/rooms/me') {
      this.authenticate(req);
      ListingsService.deleteListing(req.user!.userId);
      return noContent();
    }

    if (method === 'POST' && path === '/api/v1/rooms/me/photos') {
      this.authenticate(req);
      const photo = ListingsService.addPhoto(req.user!.userId, req.body.photoUrl, req.body.orderIndex);
      return json(201, photo);
    }

    const roomListingMatch = this.matchRoute('/api/v1/rooms/:listingId', path);
    if (method === 'GET' && roomListingMatch.matched) {
      const room = ListingsService.getListingById(roomListingMatch.params.listingId);
      return json(200, room);
    }

    // ==========================================
    // DOMAIN 9: TRUST & SAFETY
    // ==========================================
    if (method === 'POST' && path === '/api/v1/safety/blocks') {
      this.authenticate(req);
      const targetUserId = req.body.targetUserId || req.body.blockedUserId;
      const result = SafetyService.blockUser(req.user!.userId, {
        targetUserId,
        reason: req.body.reason,
      });
      return json(201, result);
    }

    const blockDeleteMatch = this.matchRoute('/api/v1/safety/blocks/:blockedUserId', path);
    if (method === 'DELETE' && blockDeleteMatch.matched) {
      this.authenticate(req);
      const result = SafetyService.unblockUser(req.user!.userId, blockDeleteMatch.params.blockedUserId);
      return json(200, result);
    }

    if (method === 'POST' && path === '/api/v1/safety/reports') {
      this.authenticate(req);
      const targetUserId = req.body.targetUserId || req.body.reportedUserId;
      let category = req.body.category;
      if (category === 'HARASSMENT') category = 'HARASSMENT_OR_ABUSE';
      if (category === 'SPAM_COMMERCIAL') category = 'SPAM_OR_COMMERCIAL_BROKER';
      if (category === 'FAKE_PROFILE') category = 'FAKE_PROFILE_IMPERSONATION';

      const result = SafetyService.reportUser(req.user!.userId, {
        targetUserId,
        category,
        details: req.body.details,
      });
      return json(201, result);
    }

    // ==========================================
    // DOMAIN 10: ASSISTIVE AI ASSISTANT
    // ==========================================
    if (method === 'POST' && path === '/api/v1/ai/harmony-explanation') {
      this.authenticate(req);
      const candidateId = req.body.candidateUserId;
      if (!candidateId) {
        throw new BadRequestError('candidateUserId is required');
      }

      const userProfile = db.userProfiles.get(req.user!.userId);
      const candProfile = db.userProfiles.get(candidateId);
      const userLife = db.lifestyleProfiles.get(req.user!.userId);
      const candLife = db.lifestyleProfiles.get(candidateId);

      if (!userProfile || !candProfile || !userLife || !candLife) {
        throw new NotFoundError('Profiles or lifestyle data not found for AI evaluation');
      }

      const comp = ScoringEngine.calculateCompatibility(
        userProfile,
        userLife,
        candProfile,
        candLife
      );

      const aiResult = await geminiAIService.generateHarmonyExplanation({
        userA: {
          userId: req.user!.userId,
          displayName: userProfile.displayName,
          suburb: userProfile.preferredSuburbs[0] || 'KAZHAKKOOTTAM',
          modality: userProfile.modality,
          bio: userProfile.bio,
          vectors: {
            sleep: userLife.sleep.sleepPattern,
            cleanliness: userLife.cleanliness.cleanlinessLevel,
            dietary: userLife.dietary.dietType,
            social: userLife.social.guestFrequency,
            substances: userLife.substances.smokingHabit,
            financial: userLife.financial.rentPaymentHabit,
            work: userLife.work.workMode,
          },
        },
        userB: {
          userId: candidateId,
          displayName: candProfile.displayName,
          suburb: candProfile.preferredSuburbs[0] || 'KAZHAKKOOTTAM',
          modality: candProfile.modality,
          bio: candProfile.bio,
          vectors: {
            sleep: candLife.sleep.sleepPattern,
            cleanliness: candLife.cleanliness.cleanlinessLevel,
            dietary: candLife.dietary.dietType,
            social: candLife.social.guestFrequency,
            substances: candLife.substances.smokingHabit,
            financial: candLife.financial.rentPaymentHabit,
            work: candLife.work.workMode,
          },
        },
        compatibilityScore: comp.overallScore,
        vectorBreakdown: comp.vectors as any,
      });

      return json(200, aiResult.data);
    }

    // 404 Route Not Found
    throw new NotFoundError(`Endpoint ${method} ${path} not found on Buddy API`);
  }
}

export const app = new BuddyApp();
export const FlatmateApp = BuddyApp;

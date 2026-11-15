import type {
  ProblemDetails,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  AuthSessionResponse,
  InstitutionVerifyRequest,
  InstitutionConfirmRequest,
  InstitutionVerificationResult,
  UserProfileResponse,
  UpdateProfileRequest,
  LifestyleProfileResponse,
  UpdateLifestyleRequest,
  DiscoveryFeedResponse,
  CandidateDetailResponse,
  SwipeRequest,
  SwipeResponse,
  RewindResponse,
  MatchesListResponse,
  ConversationsListResponse,
  MessageHistoryResponse,
  ChatMessageItem,
  CreateRoomListingRequest,
  RoomListingResponse,
  BlockUserRequest,
  ReportUserRequest,
  ReportUserResponse,
  GenericSuccessResponse,
} from './types.ts';

import {
  MOCK_CURRENT_USER,
  MOCK_CURRENT_LIFESTYLE,
  MOCK_DISCOVERY_CARDS,
  MOCK_CANDIDATE_ADARSH,
  MOCK_ADARSH_DETAIL,
  MOCK_MATCHES,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES_CONV_001,
} from './mock-data.ts';

export class ApiError extends Error {
  public problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(problem.detail || problem.title);
    this.name = 'ApiError';
    this.problem = problem;
  }
}

/**
 * Creates an RFC 7807 ProblemDetails object from an unexpected error
 */
export function createProblemDetails(status: number, title: string, detail: string, instance?: string): ProblemDetails {
  return {
    type: `https://flatmate.in/errors/${status}`,
    title,
    status,
    detail,
    instance,
  };
}

class BuddyApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;
  private useMockFallback: boolean = true;

  constructor() {
    this.baseUrl =
      typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL
        : 'http://localhost:4000/api/v1';
  }

  public setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public setMockFallback(enabled: boolean) {
    this.useMockFallback = enabled;
  }

  /**
   * Universal fetch wrapper adhering to RFC 7807 problem details
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    mockFallback?: () => T
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json, application/problem+json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let problem: ProblemDetails;
        try {
          problem = (await response.json()) as ProblemDetails;
        } catch {
          problem = createProblemDetails(
            response.status,
            response.statusText || 'HTTP Error',
            `Server returned status ${response.status}`,
            endpoint
          );
        }
        throw new ApiError(problem);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // If network unreachable and mock fallback provided, safely return mock data
      if (this.useMockFallback && mockFallback) {
        return mockFallback();
      }

      const problem = createProblemDetails(
        500,
        'Network Connection Failure',
        error instanceof Error ? error.message : 'Unable to connect to Buddy API server.',
        endpoint
      );
      throw new ApiError(problem);
    }
  }

  // ==========================================================================
  // AUTHENTICATION & IDENTITY
  // ==========================================================================

  public async sendOtp(req: SendOtpRequest): Promise<SendOtpResponse> {
    return this.request<SendOtpResponse>(
      '/auth/otp/send',
      {
        method: 'POST',
        body: JSON.stringify(req),
      },
      () => ({
        success: true,
        message: 'OTP sent successfully to ' + req.phoneNumber,
        expiresInSeconds: 300,
      })
    );
  }

  public async verifyOtp(req: VerifyOtpRequest): Promise<AuthSessionResponse> {
    return this.request<AuthSessionResponse>(
      '/auth/otp/verify',
      {
        method: 'POST',
        body: JSON.stringify(req),
      },
      () => {
        if (req.otp !== '123456' && req.otp !== '482910' && req.otp.length !== 6) {
          throw new ApiError({
            type: 'https://flatmate.in/errors/invalid-otp',
            title: 'Invalid OTP',
            status: 400,
            detail: 'The submitted OTP is invalid or expired. Enter 123456 for demo.',
            instance: '/auth/otp/verify',
          });
        }
        const session: AuthSessionResponse = {
          accessToken: 'mock-jwt-token-xyz-123',
          expiresIn: 900,
          isNewUser: false,
          user: {
            id: MOCK_CURRENT_USER.id,
            status: 'ACTIVE',
            isOnboardingCompleted: true,
          },
        };
        this.setAccessToken(session.accessToken);
        return session;
      }
    );
  }

  public async verifyInstitution(req: InstitutionVerifyRequest): Promise<GenericSuccessResponse> {
    return this.request<GenericSuccessResponse>(
      '/auth/institution/verify',
      {
        method: 'POST',
        body: JSON.stringify(req),
      },
      () => ({
        success: true,
        message: `Verification link sent to ${req.institutionEmail}`,
      })
    );
  }

  public async confirmInstitution(req: InstitutionConfirmRequest): Promise<InstitutionVerificationResult> {
    return this.request<InstitutionVerificationResult>(
      '/auth/institution/confirm',
      {
        method: 'POST',
        body: JSON.stringify(req),
      },
      () => ({
        verified: true,
        badge: 'VERIFIED_PROFESSIONAL',
        institutionName: 'Technopark Trivandrum',
      })
    );
  }

  // ==========================================================================
  // PROFILE & LIFESTYLE
  // ==========================================================================

  public async getMyProfile(): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>(
      '/users/me/profile',
      { method: 'GET' },
      () => MOCK_CURRENT_USER
    );
  }

  public async updateMyProfile(req: UpdateProfileRequest): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>(
      '/users/me/profile',
      {
        method: 'PUT',
        body: JSON.stringify(req),
      },
      () => ({
        ...MOCK_CURRENT_USER,
        displayName: req.displayName,
        gender: req.gender,
        occupation: req.occupation,
        collegeOrCompany: req.collegeOrCompany,
        bio: req.bio,
        modality: req.modality,
        minBudget: req.minBudget,
        maxBudget: req.maxBudget,
        preferredSuburbs: req.preferredSuburbs,
      })
    );
  }

  public async getMyLifestyle(): Promise<LifestyleProfileResponse> {
    return this.request<LifestyleProfileResponse>(
      '/users/me/lifestyle',
      { method: 'GET' },
      () => MOCK_CURRENT_LIFESTYLE
    );
  }

  public async updateMyLifestyle(req: UpdateLifestyleRequest): Promise<LifestyleProfileResponse> {
    return this.request<LifestyleProfileResponse>(
      '/users/me/lifestyle',
      {
        method: 'PUT',
        body: JSON.stringify(req),
      },
      () => ({
        ...MOCK_CURRENT_LIFESTYLE,
        ...req,
      })
    );
  }

  // ==========================================================================
  // DISCOVERY & MATCHING
  // ==========================================================================

  public async getDiscoveryFeed(filters?: {
    suburbs?: string[];
    minBudget?: number;
    maxBudget?: number;
    modalities?: string[];
  }): Promise<DiscoveryFeedResponse> {
    return this.request<DiscoveryFeedResponse>(
      '/discovery/feed',
      { method: 'GET' },
      () => {
        let cards = [...MOCK_DISCOVERY_CARDS];
        if (filters?.modalities && filters.modalities.length > 0) {
          cards = cards.filter((c) => filters.modalities!.includes(c.modality));
        }
        if (filters?.suburbs && filters.suburbs.length > 0) {
          cards = cards.filter((c) =>
            c.preferredSuburbs.some((s) => filters.suburbs!.includes(s))
          );
        }
        if (filters?.maxBudget) {
          cards = cards.filter((c) => c.budgetRange.min <= filters.maxBudget!);
        }
        return {
          cards,
          pagination: {
            nextCursor: null,
            hasMore: false,
          },
        };
      }
    );
  }

  public async getCandidateDetail(userId: string): Promise<CandidateDetailResponse> {
    return this.request<CandidateDetailResponse>(
      `/discovery/candidate/${userId}`,
      { method: 'GET' },
      () => {
        if (userId === MOCK_CANDIDATE_ADARSH.userId) {
          return MOCK_ADARSH_DETAIL;
        }
        return {
          ...MOCK_ADARSH_DETAIL,
          profile: {
            ...MOCK_ADARSH_DETAIL.profile,
            id: `prof-${userId}`,
            userId,
            displayName: 'Candidate ' + userId.substring(0, 4),
          },
        };
      }
    );
  }

  public async swipe(req: SwipeRequest): Promise<SwipeResponse> {
    return this.request<SwipeResponse>(
      '/discovery/swipe',
      {
        method: 'POST',
        body: JSON.stringify(req),
      },
      () => {
        const isMatch = req.action === 'LIKE' || req.action === 'SUPERLIKE';
        return {
          success: true,
          isMutualMatch: isMatch,
          conversationId: isMatch ? 'conv-001' : null,
          match: isMatch
            ? {
                id: 'match-' + Date.now(),
                matchedUserId: req.candidateUserId,
                matchedUserDisplayName: 'Adarsh Nair',
                matchedUserAvatarUrl:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                compatibilityScore: 94,
                matchedAt: new Date().toISOString(),
                conversationId: 'conv-001',
              }
            : undefined,
        };
      }
    );
  }

  public async rewind(): Promise<RewindResponse> {
    return this.request<RewindResponse>(
      '/discovery/rewind',
      { method: 'POST' },
      () => ({
        success: true,
        rewoundCandidateId: MOCK_CANDIDATE_ADARSH.userId,
        remainingRewinds: 0,
      })
    );
  }

  // ==========================================================================
  // MATCHES & MESSAGING
  // ==========================================================================

  public async getMatches(): Promise<MatchesListResponse> {
    return this.request<MatchesListResponse>(
      '/matches',
      { method: 'GET' },
      () => ({
        matches: MOCK_MATCHES,
        totalCount: MOCK_MATCHES.length,
      })
    );
  }

  public async getConversations(): Promise<ConversationsListResponse> {
    return this.request<ConversationsListResponse>(
      '/messages/conversations',
      { method: 'GET' },
      () => ({
        conversations: MOCK_CONVERSATIONS,
      })
    );
  }

  public async getMessages(conversationId: string): Promise<MessageHistoryResponse> {
    return this.request<MessageHistoryResponse>(
      `/messages/conversations/${conversationId}/history`,
      { method: 'GET' },
      () => ({
        messages: MOCK_MESSAGES_CONV_001,
        hasMore: false,
      })
    );
  }

  public async sendMessage(conversationId: string, content: string): Promise<ChatMessageItem> {
    return this.request<ChatMessageItem>(
      `/messages/conversations/${conversationId}/send`,
      {
        method: 'POST',
        body: JSON.stringify({ content }),
      },
      () => ({
        id: 'msg-' + Date.now(),
        conversationId,
        senderUserId: MOCK_CURRENT_USER.id,
        content,
        status: 'SENT',
        createdAt: new Date().toISOString(),
      })
    );
  }

  // ==========================================================================
  // ROOM LISTING MANAGEMENT
  // ==========================================================================

  public async createRoomListing(req: CreateRoomListingRequest): Promise<RoomListingResponse> {
    return this.request<RoomListingResponse>(
      '/rooms',
      {
        method: 'POST',
        body: JSON.stringify(req),
      },
      () => ({
        id: 'rm-new-' + Date.now(),
        userId: MOCK_CURRENT_USER.id,
        roomType: req.roomType,
        sharingCount: req.sharingCount || 1,
        bathroomType: req.bathroomType,
        monthlyRent: req.monthlyRent,
        securityDeposit: req.securityDeposit,
        availableFrom: req.availableFrom,
        locationSuburb: req.locationSuburb,
        amenities: req.amenities,
        photos: [],
      })
    );
  }

  // ==========================================================================
  // TRUST & SAFETY
  // ==========================================================================

  public async blockUser(req: BlockUserRequest): Promise<GenericSuccessResponse> {
    return this.request<GenericSuccessResponse>(
      '/safety/block',
      {
        method: 'POST',
        body: JSON.stringify(req),
      },
      () => ({
        success: true,
        message: 'User has been blocked. You will not see each other in discovery or chat.',
      })
    );
  }

  public async reportUser(req: ReportUserRequest): Promise<ReportUserResponse> {
    return this.request<ReportUserResponse>(
      '/safety/report',
      {
        method: 'POST',
        body: JSON.stringify(req),
      },
      () => ({
        reportId: 'rep-' + Date.now(),
        status: 'PENDING_REVIEW',
        message: 'Report submitted. Thank you for keeping our community safe.',
      })
    );
  }
}

export const api = new BuddyApiClient();
export { BuddyApiClient as FlatmateApiClient };

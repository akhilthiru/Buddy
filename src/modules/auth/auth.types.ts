export interface SendOtpRequest {
  phoneNumber: string; // E.164: +91[6-9]\d{9}
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  expiresInSeconds: number;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string; // 6 digits
}

export interface AuthSessionResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: {
    id: string;
    status: string;
    isOnboardingCompleted: boolean;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface InstitutionVerifyRequest {
  email: string;
  institutionType: 'CORPORATE' | 'ACADEMIC';
}

export interface InstitutionConfirmRequest {
  token: string;
}

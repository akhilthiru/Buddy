export type ReportCategory =
  | 'HARASSMENT_OR_ABUSE'
  | 'SPAM_OR_COMMERCIAL_BROKER'
  | 'FAKE_PROFILE_IMPERSONATION'
  | 'MORAL_POLICING_OR_DISCRIMINATION';

export interface BlockUserRequest {
  targetUserId: string;
  reason?: string;
}

export interface ReportUserRequest {
  targetUserId: string;
  category: ReportCategory;
  details: string;
}

export interface ReportUserResponse {
  reportId: string;
  status: 'PENDING_REVIEW' | 'ACTIONED_QUARANTINE';
  message: string;
}

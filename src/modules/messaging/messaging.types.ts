export interface ChatMessageItem {
  id: string;
  conversationId: string;
  senderUserId: string;
  content: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: string;
  readAt?: string;
  warningNotice?: string;
}

export interface ConversationParticipant {
  id: string;
  displayName: string;
  avatarUrl?: string;
  verificationBadge: string;
}

export interface ConversationItem {
  id: string;
  matchId: string;
  participant: ConversationParticipant;
  lastMessage?: ChatMessageItem;
  status: 'ACTIVE' | 'ARCHIVED' | 'TERMINATED';
  lastMessageAt: string;
  unreadCount: number;
}

export interface MatchItem {
  id: string;
  matchedUserId: string;
  matchedUserDisplayName: string;
  matchedUserAvatarUrl?: string;
  compatibilityScore: number;
  matchedAt: string;
  conversationId: string;
  age?: number;
  occupation?: string;
  collegeOrCompany?: string;
  bio?: string;
  modality?: string;
  verificationBadge?: string;
  preferredSuburbs?: string[];
  maxBudget?: number;
  topHighlights?: string[];
  photos?: Array<{ id: string; photoUrl: string; orderIndex?: number; isPrimary?: boolean }>;
  candidate?: any;
}

export interface SendMessageRequest {
  content: string;
}

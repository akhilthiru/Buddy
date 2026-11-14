import crypto from 'node:crypto';
import { db, type DbMessage } from '../../database/in-memory-db.ts';
import { ContentFilter } from './content.filter.ts';
import { wsGateway } from './websocket.gateway.ts';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../../common/errors/problem-details.ts';
import type {
  ChatMessageItem,
  ConversationItem,
  MatchItem,
} from './messaging.types.ts';

export class MessagingService {
  /**
   * Lists mutual matches for user (FR-20).
   */
  static listMatches(userId: string): { matches: MatchItem[]; totalCount: number } {
    const userMatches = db.matches.filter(
      (m) => m.status === 'ACTIVE' && (m.user1Id === userId || m.user2Id === userId)
    );

    const matches: MatchItem[] = userMatches.map((m) => {
      const partnerId = m.user1Id === userId ? m.user2Id : m.user1Id;
      const partnerProfile = db.userProfiles.get(partnerId);
      const conv = db.conversations.find((c) => c.matchId === m.id);

      return {
        id: m.id,
        matchedUserId: partnerId,
        matchedUserDisplayName: partnerProfile ? partnerProfile.displayName : 'Flatmate User',
        matchedUserAvatarUrl: partnerProfile?.avatarUrl,
        compatibilityScore: m.compatibilityScore,
        matchedAt: m.matchedAt.toISOString(),
        conversationId: conv ? conv.id : '',
      };
    });

    return {
      matches,
      totalCount: matches.length,
    };
  }

  /**
   * Unmatches a partner and terminates the active conversation (FR-24).
   */
  static unmatch(userId: string, matchId: string): void {
    const match = db.matches.find((m) => m.id === matchId);
    if (!match) {
      throw new NotFoundError('Match not found');
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new ForbiddenError('You are not a participant in this match');
    }

    match.status = 'UNMATCHED';
    match.unmatchedAt = new Date();

    const conv = db.conversations.find((c) => c.matchId === match.id);
    if (conv) {
      conv.status = 'TERMINATED';
    }
  }

  /**
   * Lists conversations for the user with unread counters (FR-22, FR-24).
   */
  static listConversations(userId: string): ConversationItem[] {
    const userConvs = db.conversations
      .filter((c) => c.status !== 'TERMINATED' && (c.user1Id === userId || c.user2Id === userId))
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

    return userConvs.map((conv) => {
      const partnerId = conv.user1Id === userId ? conv.user2Id : conv.user1Id;
      const partnerProfile = db.userProfiles.get(partnerId);

      // Last message
      const messages = db.messages
        .filter((m) => m.conversationId === conv.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      const lastMsg = messages[0];

      // Unread count
      const unreadCount = db.messages.filter(
        (m) => m.conversationId === conv.id && m.senderUserId !== userId && m.status !== 'READ'
      ).length;

      return {
        id: conv.id,
        matchId: conv.matchId,
        participant: {
          id: partnerId,
          displayName: partnerProfile ? partnerProfile.displayName : 'Flatmate User',
          avatarUrl: partnerProfile?.avatarUrl,
          verificationBadge: partnerProfile ? partnerProfile.verificationBadge : 'UNVERIFIED',
        },
        lastMessage: lastMsg
          ? {
              id: lastMsg.id,
              conversationId: lastMsg.conversationId,
              senderUserId: lastMsg.senderUserId,
              content: lastMsg.content,
              status: lastMsg.status,
              createdAt: lastMsg.createdAt.toISOString(),
              readAt: lastMsg.readAt?.toISOString(),
              warningNotice: lastMsg.warningNotice,
            }
          : undefined,
        status: conv.status,
        lastMessageAt: conv.lastMessageAt.toISOString(),
        unreadCount,
      };
    });
  }

  /**
   * Sends 1-on-1 text message with contact harvesting scanner and real-time delivery (FR-22, FR-23).
   */
  static sendMessage(
    conversationId: string,
    senderUserId: string,
    content: string
  ): ChatMessageItem {
    if (!content || content.trim().length === 0) {
      throw new BadRequestError('Message content cannot be empty');
    }
    if (content.length > 2000) {
      throw new BadRequestError('Message exceeds maximum limit of 2,000 characters');
    }

    const conv = db.conversations.find((c) => c.id === conversationId);
    if (!conv) {
      throw new NotFoundError('Conversation not found');
    }

    if (conv.user1Id !== senderUserId && conv.user2Id !== senderUserId) {
      throw new ForbiddenError('You are not a participant in this conversation');
    }

    if (conv.status !== 'ACTIVE') {
      throw new ForbiddenError(
        conv.status === 'TERMINATED'
          ? 'This conversation is no longer active due to an unmatch or block.'
          : 'This conversation has been archived.'
      );
    }

    const recipientUserId = conv.user1Id === senderUserId ? conv.user2Id : conv.user1Id;

    // DPDP contact harvesting filter
    const warningNotice = ContentFilter.scanForContactDetails(content);

    const now = new Date();
    const isRecipientOnline = wsGateway.isUserOnline(recipientUserId);

    const message: DbMessage = {
      id: crypto.randomUUID(),
      conversationId,
      senderUserId,
      content: content.trim(),
      status: isRecipientOnline ? 'DELIVERED' : 'SENT',
      createdAt: now,
      warningNotice,
    };

    db.messages.push(message);
    conv.lastMessageAt = now;

    const chatItem: ChatMessageItem = {
      id: message.id,
      conversationId: message.conversationId,
      senderUserId: message.senderUserId,
      content: message.content,
      status: message.status,
      createdAt: message.createdAt.toISOString(),
      warningNotice: message.warningNotice,
    };

    // Real-time dispatch via WebSocket
    if (isRecipientOnline) {
      wsGateway.sendToUser(recipientUserId, 'NEW_MESSAGE', chatItem);
    }

    return chatItem;
  }

  /**
   * Fetches conversation message history and marks incoming messages as READ (FR-22).
   */
  static getMessages(
    conversationId: string,
    userId: string,
    limit = 50
  ): { messages: ChatMessageItem[]; hasMore: boolean } {
    const conv = db.conversations.find((c) => c.id === conversationId);
    if (!conv) {
      throw new NotFoundError('Conversation not found');
    }

    if (conv.user1Id !== userId && conv.user2Id !== userId) {
      throw new ForbiddenError('You are not a participant in this conversation');
    }

    const convMessages = db.messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const now = new Date();
    // Mark unread messages sent by partner as READ
    for (const m of convMessages) {
      if (m.senderUserId !== userId && m.status !== 'READ') {
        m.status = 'READ';
        m.readAt = now;
      }
    }

    const paginated = convMessages.slice(-limit);

    return {
      messages: paginated.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        senderUserId: m.senderUserId,
        content: m.content,
        status: m.status,
        createdAt: m.createdAt.toISOString(),
        readAt: m.readAt?.toISOString(),
        warningNotice: m.warningNotice,
      })),
      hasMore: convMessages.length > limit,
    };
  }

  /**
   * Archives conversation.
   */
  static archiveConversation(conversationId: string, userId: string): void {
    const conv = db.conversations.find((c) => c.id === conversationId);
    if (!conv) {
      throw new NotFoundError('Conversation not found');
    }

    if (conv.user1Id !== userId && conv.user2Id !== userId) {
      throw new ForbiddenError('You are not a participant in this conversation');
    }

    conv.status = 'ARCHIVED';
  }
}

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import { ChatMessageItem, ConversationParticipant } from '@/lib/api/types';
import { ChatWindow } from '@/components/features/ChatWindow';

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = (params?.id as string) || 'conv-001';

  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [participant, setParticipant] = useState<ConversationParticipant>({
    id: 'usr-adarsh-002',
    displayName: 'Adarsh Nair',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    verificationBadge: 'VERIFIED_PROFESSIONAL',
    collegeOrCompany: 'UST Global (Technopark Phase I)',
    compatibilityScore: 94,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChat = async () => {
      setIsLoading(true);
      try {
        const history = await api.getMessages(conversationId);
        setMessages(history.messages);
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchChat();
  }, [conversationId]);

  const handleSendMessage = async (content: string) => {
    // Optimistic UI update
    const optimisticMsg: ChatMessageItem = {
      id: 'opt-' + Date.now(),
      conversationId,
      senderUserId: 'usr-current-001',
      content,
      status: 'SENT',
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const savedMsg = await api.sendMessage(conversationId, content);
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMsg.id ? savedMsg : m))
      );
    } catch {
      // Keep optimistic message for demo
    }
  };

  return (
    <div className="flex-1 flex flex-col p-2 sm:p-4 max-w-2xl mx-auto w-full h-[calc(100vh-80px)]">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">
          Connecting to private chat...
        </div>
      ) : (
        <ChatWindow
          participant={participant}
          messages={messages}
          currentUserId="usr-current-001"
          onSendMessage={handleSendMessage}
          onBack={() => router.push('/matches')}
          onReportOrBlock={() => alert('Options: Block or Report User')}
          className="flex-1"
        />
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import { MatchItem, ConversationItem } from '@/lib/api/types';
import { formatRelativeTime, getModalityLabel } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { CompatibilityBadge } from '@/components/features/CompatibilityBadge';

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [matchRes, convRes] = await Promise.all([
          api.getMatches(),
          api.getConversations(),
        ]);
        setMatches(matchRes.matches);
        setConversations(convRes.conversations);
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full p-4 sm:p-6 text-left space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mutual Connections</h1>
        <p className="text-xs text-slate-500 mt-1">
          People who mutually liked your profile. Start a conversation to discuss flats and lifestyle.
        </p>
      </div>

      {/* 1. New Matches Horizontal Roster */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recent Matches ({matches.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-24 h-32 rounded-2xl bg-slate-200 animate-pulse shrink-0" />
            ))}
          </div>
        ) : matches.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {matches.map((match) => {
              const modalityInfo = getModalityLabel(match.modality || 'MODALITY_4');
              return (
                <div
                  key={match.id}
                  onClick={() => router.push(`/chat/${match.conversationId}`)}
                  className="group relative flex flex-col items-center p-3 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 shadow-xs cursor-pointer shrink-0 w-28 text-center transition-all hover:scale-102"
                >
                  <div className="relative mb-2">
                    <Avatar
                      src={match.matchedUserAvatarUrl}
                      alt={match.matchedUserDisplayName}
                      size="lg"
                    />
                    <div className="absolute -bottom-1 -right-1">
                      <CompatibilityBadge
                        score={match.compatibilityScore}
                        size="sm"
                        showLabel={false}
                      />
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-800 truncate w-full">
                    {match.matchedUserDisplayName}
                  </span>
                  <span className="text-[10px] text-teal-700 font-semibold mt-0.5 truncate w-full">
                    {modalityInfo.badge}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
            No mutual matches yet. Keep discovering candidates!
          </div>
        )}
      </div>

      {/* 2. Conversation Threads List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Conversations ({conversations.length})
          </h2>
          <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full">
            DPDP Protected
          </span>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : conversations.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {conversations.map((thread) => {
              const { participant, lastMessage, unreadCount } = thread;

              return (
                <Link
                  key={thread.id}
                  href={`/chat/${thread.id}`}
                  className="flex items-center gap-3.5 p-4 hover:bg-slate-50 transition-colors select-none"
                >
                  <Avatar
                    src={participant.avatarUrl}
                    alt={participant.displayName}
                    size="lg"
                    isOnline={true}
                    verificationBadge={participant.verificationBadge}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-bold text-slate-900 text-sm truncate">
                          {participant.displayName}
                        </span>
                        {participant.verificationBadge === 'VERIFIED_PROFESSIONAL' && (
                          <svg
                            className="w-3.5 h-3.5 text-sky-600 shrink-0"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium shrink-0">
                        {formatRelativeTime(thread.lastMessageAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      {participant.compatibilityScore && (
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                          {participant.compatibilityScore}% Match
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 truncate">
                        {participant.collegeOrCompany || 'Technopark'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 truncate">
                      {lastMessage ? lastMessage.content : 'New mutual match! Send a greeting.'}
                    </p>
                  </div>

                  {Boolean(unreadCount && unreadCount > 0) && (
                    <div className="shrink-0">
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                        {unreadCount}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            No active conversations yet. Match with a candidate to start chatting!
          </div>
        )}
      </div>
    </div>
  );
}

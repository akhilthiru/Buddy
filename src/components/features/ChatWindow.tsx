import React, { useState, useRef, useEffect } from 'react';
import { cn, formatClockTime } from '@/lib/utils';
import { ChatMessageItem, ConversationParticipant } from '@/lib/api/types';
import { Avatar } from '@/components/ui/Avatar';
import { CompatibilityBadge } from './CompatibilityBadge';

export interface ChatWindowProps {
  participant: ConversationParticipant;
  messages: ChatMessageItem[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack?: () => void;
  onReportOrBlock?: () => void;
  className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  participant,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
  onReportOrBlock,
  className,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputText('');
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-card max-w-2xl mx-auto',
        className
      )}
    >
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-xs z-10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to conversations"
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <Avatar
            src={participant.avatarUrl}
            alt={participant.displayName}
            size="md"
            isOnline={true}
            verificationBadge={participant.verificationBadge}
          />

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm">{participant.displayName}</span>
              {participant.verificationBadge === 'VERIFIED_PROFESSIONAL' && (
                <span title="Verified Professional" className="text-sky-600">
                  <svg className="w-4 h-4 fill-sky-600 text-white" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {participant.collegeOrCompany || 'Technopark Buddy'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {participant.compatibilityScore && (
            <CompatibilityBadge score={participant.compatibilityScore} size="sm" showLabel={false} />
          )}

          {onReportOrBlock && (
            <button
              type="button"
              onClick={onReportOrBlock}
              aria-label="Report or block participant"
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 2. DPDP Privacy & Safety Notice */}
      <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 flex items-start gap-2.5 text-left text-xs text-amber-900">
        <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        </svg>
        <p className="leading-snug">
          <strong className="font-semibold">DPDP Safety Reminder:</strong> Protect your privacy. Keep conversations inside Buddy until mutual trust is established. Never send security deposits before physical flat visits.
        </p>
      </div>

      {/* 3. Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex justify-center my-2">
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-200/60 rounded-full px-3 py-0.5">
            Today
          </span>
        </div>

        {messages.map((message) => {
          const isMe = message.senderUserId === currentUserId;

          return (
            <div
              key={message.id}
              className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs text-left',
                  isMe
                    ? 'bg-teal-600 text-white rounded-tr-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                )}
              >
                <p className="break-words">{message.content}</p>
                <div
                  className={cn(
                    'flex items-center justify-end gap-1 text-[10px] mt-1 font-medium',
                    isMe ? 'text-teal-100' : 'text-slate-400'
                  )}
                >
                  <span>{formatClockTime(message.createdAt)}</span>
                  {isMe && (
                    <span className="inline-flex">
                      {message.status === 'SENT' && (
                        <svg className="w-3.5 h-3.5 text-teal-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {message.status === 'DELIVERED' && (
                        <svg className="w-3.5 h-3.5 text-teal-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 6 7 17l-5-5M22 10l-7.5 7.5-2-2" />
                        </svg>
                      )}
                      {message.status === 'READ' && (
                        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 6 7 17l-5-5M22 10l-7.5 7.5-2-2" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Composer Bar */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${participant.displayName}...`}
          aria-label="Write a message"
          className="flex-1 h-11 px-4 rounded-full bg-slate-100 text-slate-800 text-sm placeholder:text-slate-400 border border-transparent focus:border-teal-500 focus:bg-white focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          aria-label="Send message"
          className={cn(
            'w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0',
            inputText.trim()
              ? 'bg-teal-600 text-white hover:bg-teal-700 active:scale-95 shadow-sm'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          )}
        >
          <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
};

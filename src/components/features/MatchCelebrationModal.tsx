import React from 'react';
import { MatchItem } from '@/lib/api/types';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

export interface MatchCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchItem | null;
  currentUserAvatarUrl?: string;
  onOpenChat: (conversationId: string) => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  isOpen,
  onClose,
  match,
  currentUserAvatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  onOpenChat,
}) => {
  if (!match) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="text-center p-8 max-w-md">
      <div className="flex flex-col items-center">
        {/* Celebration sparkles icon */}
        <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-4 animate-bounce">
          <svg className="w-8 h-8 fill-teal-500" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-coral-600">
          Mutual Harmony Connected!
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-1">
          It&apos;s a Flatmate Match!
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          You and <strong className="text-slate-800">{match.matchedUserDisplayName}</strong> liked each other!
        </p>

        {/* Dual Avatars with Harmony Score Overlay */}
        <div className="relative flex items-center justify-center my-6 gap-3">
          {/* User Photo */}
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-floating">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUserAvatarUrl}
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Compatibility badge bridge */}
          <div className="z-10 bg-emerald-500 text-white font-black text-xs px-3 py-1.5 rounded-full border-2 border-white shadow-card animate-pulse-match">
            {match.compatibilityScore}%
          </div>

          {/* Matched Candidate Photo */}
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-floating">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={match.matchedUserAvatarUrl}
              alt={match.matchedUserDisplayName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <p className="text-xs text-slate-600 max-w-xs mb-6">
          You share identical lifestyle habits and both prefer flat sharing in Trivandrum. Break the ice now!
        </p>

        {/* CTAs */}
        <div className="w-full space-y-2.5">
          <Button
            variant="primary"
            size="lg"
            className="w-full shadow-card text-base font-bold"
            onClick={() => {
              onClose();
              onOpenChat(match.conversationId);
            }}
          >
            Say Hello to {match.matchedUserDisplayName} &gt;
          </Button>

          <Button
            variant="outline"
            size="md"
            className="w-full border-slate-200 text-slate-600"
            onClick={onClose}
          >
            Keep Swiping
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

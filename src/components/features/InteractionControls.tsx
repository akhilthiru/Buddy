import React from 'react';
import { cn } from '@/lib/utils';

export interface InteractionControlsProps {
  onRewind?: () => void;
  onPass: () => void;
  onSuperLike: () => void;
  onLike: () => void;
  canRewind?: boolean;
  candidateName?: string;
  showShortcuts?: boolean;
  className?: string;
}

export const InteractionControls: React.FC<InteractionControlsProps> = ({
  onRewind,
  onPass,
  onSuperLike,
  onLike,
  canRewind = true,
  candidateName = 'candidate',
  showShortcuts = false,
  className,
}) => {
  return (
    <div
      role="group"
      aria-label="Discovery card actions"
      className={cn(
        'flex items-center justify-center gap-3 sm:gap-4 py-2 select-none',
        className
      )}
    >
      {/* Rewind Button (48x48px) */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={onRewind}
          disabled={!canRewind || !onRewind}
          aria-label={`Rewind previous swipe on ${candidateName}`}
          className={cn(
            'w-12 h-12 rounded-full bg-white border-2 border-slate-200 shadow-card flex items-center justify-center transition-all',
            'hover:border-amber-400 hover:bg-amber-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
            !canRewind ? 'opacity-40 cursor-not-allowed border-slate-200' : 'text-amber-600'
          )}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
        {showShortcuts && <span className="text-[10px] text-slate-400 font-bold mt-1">Key: Z</span>}
      </div>

      {/* Pass Button (56x56px) */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={onPass}
          aria-label={`Pass on ${candidateName}`}
          className={cn(
            'w-14 h-14 rounded-full bg-white border-2 border-rose-200 text-rose-500 shadow-card flex items-center justify-center transition-all',
            'hover:bg-rose-50 hover:border-rose-400 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500'
          )}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {showShortcuts && <span className="text-[10px] text-slate-400 font-bold mt-1">Key: ←</span>}
      </div>

      {/* Super-Like Button (48x48px) */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={onSuperLike}
          aria-label={`Super-Like ${candidateName}`}
          className={cn(
            'w-12 h-12 rounded-full bg-white border-2 border-coral-200 text-coral-500 shadow-card flex items-center justify-center transition-all',
            'hover:bg-coral-50 hover:border-coral-400 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500'
          )}
        >
          <svg className="w-5 h-5 fill-coral-500 stroke-coral-500" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
        {showShortcuts && <span className="text-[10px] text-slate-400 font-bold mt-1">Key: ↑</span>}
      </div>

      {/* Like Button (56x56px) */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={onLike}
          aria-label={`Like ${candidateName}`}
          className={cn(
            'w-14 h-14 rounded-full bg-white border-2 border-emerald-200 text-emerald-500 shadow-card flex items-center justify-center transition-all',
            'hover:bg-emerald-50 hover:border-emerald-400 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'
          )}
        >
          <svg className="w-7 h-7 fill-emerald-500 stroke-emerald-500" viewBox="0 0 24 24">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
        {showShortcuts && <span className="text-[10px] text-slate-400 font-bold mt-1">Key: →</span>}
      </div>
    </div>
  );
};

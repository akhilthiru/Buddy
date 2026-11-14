import React from 'react';
import { cn } from '@/lib/utils';

export interface LifestyleChipProps {
  label: string;
  icon?: React.ReactNode;
  variant?: 'preview' | 'interactive';
  status?: 'harmony' | 'discussion' | 'neutral';
  isSelected?: boolean;
  isDealbreaker?: boolean;
  onToggle?: () => void;
  onToggleDealbreaker?: () => void;
  className?: string;
}

export const LifestyleChip: React.FC<LifestyleChipProps> = ({
  label,
  icon,
  variant = 'preview',
  status = 'neutral',
  isSelected = false,
  isDealbreaker = false,
  onToggle,
  onToggleDealbreaker,
  className,
}) => {
  // Display-only preview chip
  if (variant === 'preview') {
    const statusStyles: Record<string, string> = {
      harmony: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      discussion: 'bg-amber-50 text-amber-800 border-amber-300',
      neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-caption font-semibold border select-none shrink-0 transition-colors',
          statusStyles[status],
          className
        )}
      >
        {status === 'harmony' && (
          <svg className="w-3 h-3 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {status === 'discussion' && (
          <svg className="w-3 h-3 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{label}</span>
      </span>
    );
  }

  // Interactive Onboarding Questionnaire Chip (min 44px height for WCAG)
  return (
    <div
      className={cn(
        'group relative flex items-center justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer select-none min-h-[48px]',
        isSelected
          ? 'bg-teal-50 border-teal-600 text-teal-950 shadow-xs'
          : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-slate-50',
        className
      )}
      onClick={onToggle}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle?.();
        }
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            'w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors',
            isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
          )}
        >
          {isSelected && (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <span className="text-sm font-semibold">{label}</span>
      </div>

      {/* Dealbreaker pinning toggle */}
      {isSelected && onToggleDealbreaker && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleDealbreaker();
          }}
          title={isDealbreaker ? 'Dealbreaker pinned' : 'Mark as non-negotiable dealbreaker'}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-colors ml-2',
            isDealbreaker
              ? 'bg-coral-100 text-coral-800 border border-coral-300'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/60'
          )}
        >
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>{isDealbreaker ? 'Dealbreaker' : 'Pin Dealbreaker'}</span>
        </button>
      )}
    </div>
  );
};

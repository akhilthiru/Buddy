import React from 'react';
import { cn } from '@/lib/utils';

export interface CompatibilityBadgeProps {
  score: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true,
  onClick,
  className,
}) => {
  // Tier thresholds from docs/ux/design-system.md
  // High: >= 85%, Moderate: 65% - 84%, Low: < 65%
  const isHigh = score >= 85;
  const isModerate = score >= 65 && score < 85;

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-300';
  let dotColor = 'bg-slate-400';

  if (isHigh) {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-400';
    dotColor = 'bg-emerald-500';
  } else if (isModerate) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-300';
    dotColor = 'bg-amber-500';
  }

  const sizes: Record<string, string> = {
    sm: 'text-xs px-2 py-0.5 rounded-full',
    md: 'text-caption px-2.5 py-1 rounded-full font-bold',
    lg: 'text-sm px-3.5 py-1.5 rounded-full font-bold',
  };

  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`${score}% Compatibility Match`}
      className={cn(
        'inline-flex items-center gap-1.5 border shadow-xs select-none transition-all',
        colorClasses,
        sizes[size],
        isClickable ? 'cursor-pointer hover:scale-105 active:scale-95' : '',
        className
      )}
    >
      <span className={cn('w-2 h-2 rounded-full shrink-0', dotColor)} />
      <span>{score}%</span>
      {showLabel && <span className="opacity-90 font-medium">Match</span>}
    </div>
  );
};

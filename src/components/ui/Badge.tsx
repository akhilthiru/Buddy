import React from 'react';
import { cn } from '@/lib/utils';
import { VerificationBadgeEnum } from '@/lib/api/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'teal' | 'coral' | 'emerald' | 'amber' | 'rose' | 'sky' | 'slate';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'teal',
  size = 'md',
  icon,
  children,
  ...props
}) => {
  const variants: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-800 border border-teal-200',
    coral: 'bg-coral-50 text-coral-800 border border-coral-200',
    emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200',
    rose: 'bg-rose-50 text-rose-800 border border-rose-200',
    sky: 'bg-sky-50 text-sky-800 border border-sky-200',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  const sizes: Record<string, string> = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
    md: 'text-caption px-2.5 py-1 rounded-full font-semibold',
    lg: 'text-sm px-3.5 py-1.5 rounded-full font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 shrink-0 transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export interface TrustBadgeProps {
  type: VerificationBadgeEnum;
  affiliationName?: string;
  size?: 'sm' | 'md';
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  type,
  affiliationName,
  size = 'md',
}) => {
  if (type === 'VERIFIED_PROFESSIONAL') {
    return (
      <Badge variant="sky" size={size} className="shadow-xs font-medium">
        <svg
          className="w-3.5 h-3.5 text-sky-600 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <span>{affiliationName ? `Verified @ ${affiliationName}` : 'Verified Corporate'}</span>
      </Badge>
    );
  }

  if (type === 'VERIFIED_STUDENT') {
    return (
      <Badge variant="emerald" size={size} className="shadow-xs font-medium">
        <svg
          className="w-3.5 h-3.5 text-emerald-600 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
        <span>{affiliationName ? `Verified @ ${affiliationName}` : 'Verified Student'}</span>
      </Badge>
    );
  }

  return (
    <Badge variant="slate" size={size}>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1" />
      <span>Unverified Profile</span>
    </Badge>
  );
};

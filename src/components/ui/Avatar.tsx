import React from 'react';
import { cn } from '@/lib/utils';
import { VerificationBadgeEnum } from '@/lib/api/types';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  verificationBadge?: VerificationBadgeEnum;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  isOnline = false,
  verificationBadge,
  className,
  ...props
}) => {
  const sizes: Record<string, string> = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-13 h-13 text-base', // ~52px
    xl: 'w-20 h-20 text-xl',
  };

  const initials = alt
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={cn('relative inline-flex shrink-0 select-none', className)} {...props}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-bold bg-slate-200 text-slate-700 border-2 border-white shadow-xs',
          sizes[size]
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide broken image and fall back to initials
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Online presence dot */}
      {isOnline && (
        <span
          className="absolute bottom-0 right-0 block w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-600/20"
          aria-label="Online"
        />
      )}

      {/* Trust badge anchor overlay */}
      {verificationBadge === 'VERIFIED_PROFESSIONAL' && (
        <span
          title="Verified Professional"
          className="absolute -top-1 -right-1 block p-0.5 rounded-full bg-sky-600 text-white shadow-xs"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      )}

      {verificationBadge === 'VERIFIED_STUDENT' && (
        <span
          title="Verified Student"
          className="absolute -top-1 -right-1 block p-0.5 rounded-full bg-emerald-600 text-white shadow-xs"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      )}
    </div>
  );
};

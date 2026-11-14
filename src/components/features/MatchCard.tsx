import React, { useState } from 'react';
import { cn, formatINR, getModalityLabel, getSuburbLabel } from '@/lib/utils';
import { DiscoveryCardItem } from '@/lib/api/types';
import { TrustBadge } from '@/components/ui/Badge';
import { CompatibilityBadge } from './CompatibilityBadge';
import { LifestyleChip } from './LifestyleChip';

export interface MatchCardProps {
  candidate: DiscoveryCardItem;
  dragDeltaX?: number; // Swipe displacement in pixels
  dragDeltaY?: number;
  onExpand?: () => void;
  onReport?: () => void;
  className?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  candidate,
  dragDeltaX = 0,
  dragDeltaY = 0,
  onExpand,
  onReport,
  className,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);

  const photos =
    candidate.photos && candidate.photos.length > 0
      ? candidate.photos
      : [
          {
            id: 'fallback',
            photoUrl:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            orderIndex: 0,
            isPrimary: true,
          },
        ];

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const modalityInfo = getModalityLabel(candidate.modality);
  const locationLabel = candidate.preferredSuburbs
    .map((s) => getSuburbLabel(s))
    .join(', ');

  // Calculate dynamic stamp opacities based on drag displacement
  const likeOpacity = Math.min(1, Math.max(0, dragDeltaX / 80));
  const passOpacity = Math.min(1, Math.max(0, -dragDeltaX / 80));
  const superLikeOpacity = Math.min(1, Math.max(0, -dragDeltaY / 80));

  return (
    <div
      className={cn(
        'relative w-full h-[520px] sm:h-[560px] rounded-3xl overflow-hidden shadow-card bg-slate-900 select-none border border-slate-800/40',
        className
      )}
    >
      {/* Background Image Carousel */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[photoIndex]?.photoUrl}
        alt={`${candidate.displayName} photo ${photoIndex + 1}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
      />

      {/* Dynamic Interaction Stamp Overlays */}
      {likeOpacity > 0.05 && (
        <div
          style={{ opacity: likeOpacity }}
          className="absolute top-8 left-6 z-30 pointer-events-none transform -rotate-12 border-4 border-emerald-500 rounded-xl px-4 py-1.5 shadow-lg bg-emerald-950/40 backdrop-blur-xs"
        >
          <span className="text-2xl font-black text-emerald-400 tracking-wider">LIKE</span>
        </div>
      )}

      {passOpacity > 0.05 && (
        <div
          style={{ opacity: passOpacity }}
          className="absolute top-8 right-6 z-30 pointer-events-none transform rotate-12 border-4 border-rose-500 rounded-xl px-4 py-1.5 shadow-lg bg-rose-950/40 backdrop-blur-xs"
        >
          <span className="text-2xl font-black text-rose-400 tracking-wider">PASS</span>
        </div>
      )}

      {superLikeOpacity > 0.05 && (
        <div
          style={{ opacity: superLikeOpacity }}
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none border-4 border-coral-500 rounded-2xl px-6 py-2 shadow-floating bg-coral-950/60 backdrop-blur-sm"
        >
          <span className="text-2xl font-black text-coral-400 tracking-wider">SUPER LIKE</span>
        </div>
      )}

      {/* Photo carousel indicators & tap zones */}
      <div className="absolute top-3 inset-x-3 z-20 flex gap-1.5 px-2">
        {photos.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 rounded-full flex-1 transition-all duration-200',
              i === photoIndex ? 'bg-white shadow-xs' : 'bg-white/40'
            )}
          />
        ))}
      </div>

      {/* Left/Right Tap Zones for photo switching */}
      <div
        className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer"
        onClick={handlePrevPhoto}
        aria-label="Previous photo"
      />
      <div
        className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer"
        onClick={handleNextPhoto}
        aria-label="Next photo"
      />

      {/* Top Badges & Options Cluster */}
      <div className="absolute top-7 inset-x-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 flex-wrap">
          <TrustBadge
            type={candidate.verificationBadge}
            affiliationName={candidate.collegeOrCompany}
            size="sm"
          />
          <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
            {modalityInfo.badge}
          </span>
        </div>

        {onReport && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReport();
            }}
            aria-label="Report or Block options"
            className="w-9 h-9 rounded-full bg-slate-900/70 backdrop-blur-xs border border-white/20 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        )}
      </div>

      {/* Bottom Information Scrim */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 pt-24 pb-4 px-5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent text-left flex flex-col justify-end pointer-events-auto cursor-pointer"
        onClick={onExpand}
      >
        {/* Row 1: Name, Age, Compatibility Badge */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {candidate.displayName}, <span className="font-semibold text-slate-200">{candidate.age}</span>
            </h3>
            <p className="text-sm font-medium text-slate-300 mt-0.5">
              {candidate.occupation}
              {candidate.collegeOrCompany && ` • ${candidate.collegeOrCompany}`}
            </p>
          </div>

          <CompatibilityBadge
            score={candidate.compatibilityScore}
            size="md"
            onClick={onExpand}
          />
        </div>

        {/* Row 2: Location and Budget */}
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 mt-2">
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="truncate">{locationLabel}</span>
          <span className="text-slate-400">•</span>
          <span>
            {formatINR(candidate.budgetRange.min)} - {formatINR(candidate.budgetRange.max)}/mo
          </span>
        </div>

        {/* Row 3: Lifestyle Chips */}
        {candidate.topHighlights && candidate.topHighlights.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            {candidate.topHighlights.slice(0, 3).map((highlight, idx) => (
              <LifestyleChip
                key={idx}
                label={highlight}
                variant="preview"
                status="harmony"
              />
            ))}
          </div>
        )}

        {/* Row 4: Bio Snippet */}
        {candidate.bio && (
          <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed opacity-95">
            &ldquo;{candidate.bio}&rdquo;
          </p>
        )}

        {/* Row 5: Tap for details trigger */}
        <div className="mt-3 flex items-center justify-center gap-1 text-[11px] font-bold text-teal-400 hover:text-teal-300 tracking-wide uppercase">
          <span>Tap for Full Lifestyle Harmony</span>
          <svg className="w-3.5 h-3.5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  );
};

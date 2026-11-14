'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import { DiscoveryCardItem, CandidateDetailResponse, MatchItem } from '@/lib/api/types';
import { MatchCard } from '@/components/features/MatchCard';
import { InteractionControls } from '@/components/features/InteractionControls';
import { FilterDrawer, FilterState } from '@/components/features/FilterDrawer';
import { ProfileDetailModal } from '@/components/features/ProfileDetailModal';
import { MatchCelebrationModal } from '@/components/features/MatchCelebrationModal';
import { Button } from '@/components/ui/Button';

export default function DiscoverPage() {
  const router = useRouter();

  // Feed State
  const [cards, setCards] = useState<DiscoveryCardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [history, setHistory] = useState<{ card: DiscoveryCardItem; action: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Swipe gesture physics state
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  // Modals & Panels
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [detailCandidate, setDetailCandidate] = useState<CandidateDetailResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [celebrationMatch, setCelebrationMatch] = useState<MatchItem | null>(null);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);

  // Active filters
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    modalities: ['MODALITY_1', 'MODALITY_4'],
    suburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM'],
    maxBudget: 10000,
    minScore: 70,
    onlyVerified: false,
    strictNonSmoker: false,
  });

  // Load feed
  const loadFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getDiscoveryFeed({
        suburbs: activeFilters.suburbs,
        maxBudget: activeFilters.maxBudget,
        modalities: activeFilters.modalities,
      });
      setCards(res.cards);
      setCurrentIndex(0);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const currentCard = cards[currentIndex];

  // Action: Swipe execution
  const executeSwipe = useCallback(
    async (action: 'LIKE' | 'PASS' | 'SUPERLIKE') => {
      if (!currentCard) return;

      const swipedCard = currentCard;
      setHistory((prev) => [...prev, { card: swipedCard, action }]);
      setCurrentIndex((prev) => prev + 1);
      setDragOffset({ x: 0, y: 0 });

      try {
        const response = await api.swipe({
          candidateUserId: swipedCard.userId,
          action,
          clientMutationId: `mut-${Date.now()}`,
        });

        if (response.isMutualMatch && response.match) {
          setCelebrationMatch(response.match);
          setIsCelebrationOpen(true);
        }
      } catch {
        // Fallback demo match
        if (action === 'LIKE' || action === 'SUPERLIKE') {
          setCelebrationMatch({
            id: 'match-' + Date.now(),
            matchedUserId: swipedCard.userId,
            matchedUserDisplayName: swipedCard.displayName,
            matchedUserAvatarUrl:
              swipedCard.photos?.[0]?.photoUrl ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            compatibilityScore: swipedCard.compatibilityScore,
            matchedAt: new Date().toISOString(),
            conversationId: 'conv-001',
          });
          setIsCelebrationOpen(true);
        }
      }
    },
    [currentCard]
  );

  // Action: Rewind / Undo
  const handleRewind = async () => {
    if (history.length === 0 || currentIndex === 0) return;
    try {
      await api.rewind();
      setHistory((prev) => prev.slice(0, -1));
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } catch {
      setHistory((prev) => prev.slice(0, -1));
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  // Inspect detail
  const handleExpandDetail = async () => {
    if (!currentCard) return;
    try {
      const detail = await api.getCandidateDetail(currentCard.userId);
      setDetailCandidate(detail);
      setIsDetailOpen(true);
    } catch {
      // Fallback
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDetailOpen || isFilterOpen || isCelebrationOpen) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        executeSwipe('PASS');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        executeSwipe('LIKE');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        executeSwipe('SUPERLIKE');
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleRewind();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleExpandDetail();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeSwipe, isDetailOpen, isFilterOpen, isCelebrationOpen]);

  // Touch handlers for swipe physics
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const { x, y } = dragOffset;
    const swipeThreshold = 100;

    if (x > swipeThreshold) {
      executeSwipe('LIKE');
    } else if (x < -swipeThreshold) {
      executeSwipe('PASS');
    } else if (y < -swipeThreshold) {
      executeSwipe('SUPERLIKE');
    } else {
      // Snap-back elastic spring
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Calculate card transformation
  const rotationAngle = (dragOffset.x / 400) * 18; // Max 18 deg rotation
  const cardTransform = isDragging
    ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotationAngle}deg)`
    : 'translate3d(0, 0, 0) rotate(0deg)';

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 w-full max-w-5xl mx-auto">
      {/* Top Bar for Micro-Market & Filter Trigger */}
      <div className="w-full max-w-md md:max-w-4xl flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Micro-Market:
          </span>
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-teal-800 shadow-xs hover:border-teal-400"
          >
            <span>{activeFilters.suburbs.join(', ').toLowerCase()}</span>
            <svg className="w-3.5 h-3.5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          aria-label="Open discovery filters"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs hover:border-teal-500 hover:text-teal-700 transition-colors"
        >
          <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <span>Filters</span>
        </button>
      </div>

      {/* Main Discovery Deck / Split Inspector Layout */}
      <div className="w-full max-w-md md:max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Center / Primary Card Stack (7 cols on Desktop) */}
        <div className="md:col-span-7 flex flex-col items-center w-full">
          {isLoading ? (
            <div className="w-full h-[520px] rounded-3xl bg-slate-200/60 animate-pulse flex items-center justify-center text-slate-400 font-bold">
              Loading verified candidates...
            </div>
          ) : currentCard ? (
            <div
              className="relative w-full touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                transform: cardTransform,
                transition: isDragging ? 'none' : 'transform 240ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
            >
              <MatchCard
                candidate={currentCard}
                dragDeltaX={dragOffset.x}
                dragDeltaY={dragOffset.y}
                onExpand={handleExpandDetail}
                onReport={() => alert('Report dialog opened for trust & safety review.')}
              />
            </div>
          ) : (
            /* Queue Exhausted Empty State */
            <div className="w-full h-[520px] rounded-3xl bg-white border border-slate-200 shadow-card flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">You&apos;ve Caught Up!</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                You have reviewed all available profiles matching your current lifestyle and suburb filters in Trivandrum.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    setCurrentIndex(0);
                    setHistory([]);
                  }}
                >
                  Review Feed Again
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsFilterOpen(true)}
                >
                  Adjust Filters
                </Button>
              </div>
            </div>
          )}

          {/* Floating Interaction Controls (Thumb-Zone) */}
          {currentCard && (
            <div className="w-full mt-4">
              <InteractionControls
                onPass={() => executeSwipe('PASS')}
                onLike={() => executeSwipe('LIKE')}
                onSuperLike={() => executeSwipe('SUPERLIKE')}
                onRewind={handleRewind}
                canRewind={history.length > 0}
                candidateName={currentCard.displayName}
                showShortcuts={true}
              />
            </div>
          )}
        </div>

        {/* Desktop Inspector / Real-Time Harmony Preview (5 cols on Desktop) */}
        <div className="hidden md:flex md:col-span-5 flex-col gap-4 text-left">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">
              Keyboard Hotkeys
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Pass Candidate:</span>
                <kbd className="px-2 py-0.5 bg-slate-100 rounded font-mono font-bold text-slate-800">
                  ← (Left Arrow)
                </kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Like Profile:</span>
                <kbd className="px-2 py-0.5 bg-slate-100 rounded font-mono font-bold text-slate-800">
                  → (Right Arrow)
                </kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Super-Like:</span>
                <kbd className="px-2 py-0.5 bg-slate-100 rounded font-mono font-bold text-slate-800">
                  ↑ (Up Arrow)
                </kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Undo / Rewind:</span>
                <kbd className="px-2 py-0.5 bg-slate-100 rounded font-mono font-bold text-slate-800">
                  Z
                </kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Full Lifestyle Harmony:</span>
                <kbd className="px-2 py-0.5 bg-slate-100 rounded font-mono font-bold text-slate-800">
                  Space / Enter
                </kbd>
              </div>
            </div>
          </div>

          {currentCard && (
            <div className="bg-teal-50/70 border border-teal-200 rounded-3xl p-5 text-teal-950 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-teal-800">
                  Compatibility Insight
                </span>
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {currentCard.compatibilityScore}% Harmonic Fit
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                Based on your early sleep routine and strict non-smoking preference, you and{' '}
                <strong>{currentCard.displayName}</strong> share identical non-negotiables!
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-white text-teal-800 border-teal-300 font-bold"
                onClick={handleExpandDetail}
              >
                Inspect 7-Vector Comparison &gt;
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={activeFilters}
        onApply={(newFilters) => {
          setActiveFilters(newFilters);
          loadFeed();
        }}
        onReset={() => {
          setActiveFilters({
            modalities: ['MODALITY_1', 'MODALITY_4'],
            suburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM'],
            maxBudget: 10000,
            minScore: 75,
            onlyVerified: false,
            strictNonSmoker: false,
          });
        }}
        totalMatchesCount={cards.length}
      />

      {/* Profile Detail Bottom Sheet */}
      {detailCandidate && (
        <ProfileDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          detail={detailCandidate}
          onPass={() => {
            setIsDetailOpen(false);
            executeSwipe('PASS');
          }}
          onLike={() => {
            setIsDetailOpen(false);
            executeSwipe('LIKE');
          }}
          onReport={() => alert('Profile reported for moderator review.')}
          onBlock={() => {
            setIsDetailOpen(false);
            executeSwipe('PASS');
          }}
        />
      )}

      {/* Mutual Match Celebration Dialog */}
      <MatchCelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        match={celebrationMatch}
        onOpenChat={(convId) => router.push(`/chat/${convId}`)}
      />
    </div>
  );
}

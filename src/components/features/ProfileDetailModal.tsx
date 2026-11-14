import React from 'react';
import { formatINR, getModalityLabel, getSuburbLabel } from '@/lib/utils';
import { CandidateDetailResponse } from '@/lib/api/types';
import { Drawer } from '@/components/ui/Drawer';
import { TrustBadge } from '@/components/ui/Badge';
import { CompatibilityBadge } from './CompatibilityBadge';
import { Button } from '@/components/ui/Button';

export interface ProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  detail: CandidateDetailResponse;
  onLike?: () => void;
  onPass?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  isOpen,
  onClose,
  detail,
  onLike,
  onPass,
  onReport,
  onBlock,
}) => {
  const { profile, compatibility, roomListing } = detail;
  const modalityInfo = getModalityLabel(profile.modality);
  const locationLabel = profile.preferredSuburbs
    .map((s) => getSuburbLabel(s))
    .join(', ');

  const vectorRows = [
    {
      key: 'sleep',
      name: 'Sleep & Rhythm',
      data: compatibility.vectors.sleep,
    },
    {
      key: 'cleanliness',
      name: 'Cleanliness Standards',
      data: compatibility.vectors.cleanliness,
    },
    {
      key: 'dietary',
      name: 'Diet & Kitchen Policy',
      data: compatibility.vectors.dietary,
    },
    {
      key: 'social',
      name: 'Guests & Social Policy',
      data: compatibility.vectors.social,
    },
    {
      key: 'substances',
      name: 'Substances (Smoking/Alcohol)',
      data: compatibility.vectors.substances,
    },
    {
      key: 'financial',
      name: 'Rent & Expense Splitting',
      data: compatibility.vectors.financial,
    },
    {
      key: 'work',
      name: 'Work Rhythm & Noise',
      data: compatibility.vectors.work,
    },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`${profile.displayName}'s Profile`}>
      <div className="space-y-6 pb-20 text-left">
        {/* 1. Header Hero Card */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-64 shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              profile.photos?.[0]?.photoUrl ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
            }
            alt={profile.displayName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-5">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {profile.displayName}, {profile.age}
                </h3>
                <p className="text-sm font-medium text-slate-200 mt-0.5">
                  {profile.occupation} • {profile.collegeOrCompany}
                </p>
                <p className="text-xs font-semibold text-teal-300 mt-1">
                  {locationLabel} • {formatINR(profile.minBudget)} - {formatINR(profile.maxBudget)}/mo
                </p>
              </div>
              <CompatibilityBadge score={compatibility.overallScore} size="lg" />
            </div>
          </div>
        </div>

        {/* 2. Affiliation and Modality Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <TrustBadge
            type={profile.verificationBadge}
            affiliationName={profile.collegeOrCompany}
          />
          <span className="bg-teal-50 text-teal-900 border border-teal-200 px-3 py-1 rounded-full text-xs font-bold">
            {modalityInfo.badge}
          </span>
        </div>

        {/* 3. About Me Bio */}
        {profile.bio && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              About Me
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed italic">
              &ldquo;{profile.bio}&rdquo;
            </p>
          </div>
        )}

        {/* 4. AI Harmony Note (Assistive LLM Insights) */}
        {compatibility.aiHarmonyNote && (
          <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-teal-900">
              <svg className="w-5 h-5 text-teal-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              <h4 className="font-bold text-sm">Compatibility Harmony Summary</h4>
            </div>

            <p className="text-sm font-semibold text-teal-950">
              {compatibility.aiHarmonyNote.headline}
            </p>

            <ul className="text-xs text-teal-900 space-y-1.5 list-disc pl-4">
              {compatibility.aiHarmonyNote.lifestyleHarmonies.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>

            {compatibility.aiHarmonyNote.potentialCompromises && (
              <div className="bg-white/80 rounded-lg p-2.5 text-xs text-slate-700 border border-teal-100">
                <strong className="text-amber-800">Points to Discuss: </strong>
                {compatibility.aiHarmonyNote.potentialCompromises}
              </div>
            )}

            {compatibility.aiHarmonyNote.icebreakerPrompt && (
              <p className="text-xs font-medium text-teal-800">
                💡 <em>Icebreaker Tip: {compatibility.aiHarmonyNote.icebreakerPrompt}</em>
              </p>
            )}
          </div>
        )}

        {/* 5. 7-Vector Comparative Breakdown Table */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            7-Vector Compatibility Breakdown
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
            {vectorRows.map(({ key, name, data }) => {
              const isHigh = data.status === 'HIGH_ALIGNMENT';
              const isDiscussion = data.status === 'DISCUSSION_POINT';

              return (
                <div key={key} className="p-3 bg-white hover:bg-slate-50 flex flex-col gap-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-800">{name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isHigh
                          ? 'bg-emerald-100 text-emerald-800'
                          : isDiscussion
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {Math.round(data.affinityScore * 100)}% Harmony
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 mt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Their Habit</span>
                      <span className="font-medium text-slate-900">{data.candidateChoice}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Your Habit</span>
                      <span className="font-medium text-slate-900">{data.userChoice}</span>
                    </div>
                  </div>
                  {data.notes && (
                    <p className="text-[11px] text-slate-500 italic mt-0.5">{data.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Optional Room Listing Details (Modality 1) */}
        {roomListing && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Room Details Attached
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block">Room Type:</span>
                <strong className="text-slate-800">{roomListing.roomType.replace('_', ' ')}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Bathroom:</span>
                <strong className="text-slate-800">{roomListing.bathroomType.replace('_', ' ')}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Rent / Deposit:</span>
                <strong className="text-teal-700">
                  {formatINR(roomListing.monthlyRent)} / {formatINR(roomListing.securityDeposit)}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Available From:</span>
                <strong className="text-slate-800">{roomListing.availableFrom}</strong>
              </div>
            </div>

            {roomListing.amenities && (
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Amenities Included:</span>
                <div className="flex flex-wrap gap-1.5">
                  {roomListing.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="bg-white border border-slate-200 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. Safety Block & Report */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
          {onReport && (
            <button
              type="button"
              onClick={onReport}
              className="text-slate-500 hover:text-rose-600 font-semibold"
            >
              Report Profile
            </button>
          )}
          {onBlock && (
            <button
              type="button"
              onClick={onBlock}
              className="text-slate-500 hover:text-rose-600 font-semibold"
            >
              Block {profile.displayName}
            </button>
          )}
        </div>
      </div>

      {/* Fixed bottom decision bar */}
      <div className="sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 p-4 flex items-center gap-3">
        {onPass && (
          <Button variant="outline" className="flex-1 text-rose-600 border-rose-200" onClick={onPass}>
            Pass
          </Button>
        )}
        {onLike && (
          <Button variant="primary" className="flex-2" onClick={onLike}>
            Like {profile.displayName}
          </Button>
        )}
      </div>
    </Drawer>
  );
};

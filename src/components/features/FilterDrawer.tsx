import React, { useState } from 'react';
import { formatINR, getSuburbLabel } from '@/lib/utils';
import { TrivandrumSuburbEnum, DiscoveryModalityEnum } from '@/lib/api/types';
import { Drawer } from '@/components/ui/Drawer';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';

export interface FilterState {
  modalities: DiscoveryModalityEnum[];
  suburbs: TrivandrumSuburbEnum[];
  maxBudget: number;
  minScore: number;
  onlyVerified: boolean;
  strictNonSmoker: boolean;
}

export interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (newFilters: FilterState) => void;
  onReset: () => void;
  totalMatchesCount?: number;
}

const ALL_SUBURBS: TrivandrumSuburbEnum[] = [
  'KAZHAKKOOTTAM',
  'KARIAVATTOM',
  'SREEKARYAM',
  'ULLOOR',
  'PATTOM',
  'KOWDIAR',
  'MANACAUD',
  'VELLAYAMBALAM',
];

const MODALITY_OPTIONS: { id: DiscoveryModalityEnum; label: string; desc: string }[] = [
  { id: 'MODALITY_1', label: 'M1: Has Room Available', desc: 'Private or shared bedroom offered' },
  { id: 'MODALITY_4', label: 'M4: Team Up First', desc: 'Find person first, lease flat together' },
  { id: 'MODALITY_2', label: 'M2: Looking for Accommodation', desc: 'Seeking vacancy' },
  { id: 'MODALITY_3', label: 'M3: Flat Leased / Relocating', desc: 'Co-tenant replacement' },
];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
  totalMatchesCount = 14,
}) => {
  const [draft, setDraft] = useState<FilterState>(filters);

  const toggleModality = (id: DiscoveryModalityEnum) => {
    setDraft((prev) => ({
      ...prev,
      modalities: prev.modalities.includes(id)
        ? prev.modalities.filter((m) => m !== id)
        : [...prev.modalities, id],
    }));
  };

  const toggleSuburb = (suburb: TrivandrumSuburbEnum) => {
    setDraft((prev) => ({
      ...prev,
      suburbs: prev.suburbs.includes(suburb)
        ? prev.suburbs.filter((s) => s !== suburb)
        : [...prev.suburbs, suburb],
    }));
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleReset = () => {
    onReset();
    setDraft({
      modalities: ['MODALITY_1', 'MODALITY_4'],
      suburbs: ['KAZHAKKOOTTAM', 'KARIAVATTOM'],
      maxBudget: 10000,
      minScore: 75,
      onlyVerified: false,
      strictNonSmoker: false,
    });
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Discovery Filters">
      <div className="space-y-6 pb-6 text-left">
        {/* 1. Modality Filter */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Discovery Modalities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MODALITY_OPTIONS.map((opt) => {
              const isChecked = draft.modalities.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => toggleModality(opt.id)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    isChecked
                      ? 'border-teal-600 bg-teal-50/60 text-teal-950'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold">{opt.label}</p>
                    <p className="text-[11px] text-slate-500">{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Micro-Markets */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Trivandrum Micro-Markets
          </h3>
          <div className="flex flex-wrap gap-2">
            {ALL_SUBURBS.map((suburb) => {
              const isSelected = draft.suburbs.includes(suburb);
              return (
                <button
                  key={suburb}
                  type="button"
                  onClick={() => toggleSuburb(suburb)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {getSuburbLabel(suburb)}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Maximum Monthly Budget Per Head */}
        <div>
          <Slider
            label="Maximum Monthly Rent (per person)"
            min={4000}
            max={20000}
            step={500}
            value={draft.maxBudget}
            onChange={(val) => setDraft((p) => ({ ...p, maxBudget: val }))}
            valueFormatter={(val) => formatINR(val)}
          />
        </div>

        {/* 4. Minimum Compatibility Score */}
        <div>
          <Slider
            label="Minimum Compatibility Score"
            min={50}
            max={95}
            step={5}
            value={draft.minScore}
            onChange={(val) => setDraft((p) => ({ ...p, minScore: val }))}
            valueFormatter={(val) => `At least ${val}% match`}
          />
        </div>

        {/* 5. Trust & Habit Safeguards */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.onlyVerified}
              onChange={(e) => setDraft((p) => ({ ...p, onlyVerified: e.target.checked }))}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm font-semibold text-slate-800">
              Verified corporate or college domain email only
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.strictNonSmoker}
              onChange={(e) => setDraft((p) => ({ ...p, strictNonSmoker: e.target.checked }))}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm font-semibold text-slate-800">
              Strict Non-Smokers only (Dealbreaker)
            </span>
          </label>
        </div>

        {/* 6. Footer Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset All
          </Button>
          <Button variant="primary" className="flex-2" onClick={handleApply}>
            Apply Filters ({totalMatchesCount} Candidates)
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

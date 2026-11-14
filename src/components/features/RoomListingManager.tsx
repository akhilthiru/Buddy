import React, { useState } from 'react';
import { formatINR, getSuburbLabel } from '@/lib/utils';
import { CreateRoomListingRequest, TrivandrumSuburbEnum, RoomTypeEnum, BathroomTypeEnum } from '@/lib/api/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface RoomListingManagerProps {
  initialListing?: Partial<CreateRoomListingRequest>;
  onSave: (listing: CreateRoomListingRequest) => Promise<void>;
  isLoading?: boolean;
}

const COMMON_AMENITIES = [
  'AC in Bedroom',
  'Geyser / Hot Water',
  'High-Speed Wi-Fi',
  'Washing Machine',
  'Power Backup / Inverter',
  'Covered Two-Wheeler Parking',
  'Covered Car Park',
  'Balcony Access',
  'Kitchen Access',
];

const SUBURBS: TrivandrumSuburbEnum[] = [
  'KAZHAKKOOTTAM',
  'KARIAVATTOM',
  'SREEKARYAM',
  'ULLOOR',
  'PATTOM',
  'KOWDIAR',
];

export const RoomListingManager: React.FC<RoomListingManagerProps> = ({
  initialListing,
  onSave,
  isLoading = false,
}) => {
  const [roomType, setRoomType] = useState<RoomTypeEnum>(initialListing?.roomType || 'PRIVATE_ROOM');
  const [bathroomType, setBathroomType] = useState<BathroomTypeEnum>(
    initialListing?.bathroomType || 'ATTACHED_PRIVATE'
  );
  const [monthlyRent, setMonthlyRent] = useState<number>(initialListing?.monthlyRent || 7500);
  const [securityDeposit, setSecurityDeposit] = useState<number>(
    initialListing?.securityDeposit || 15000
  );
  const [availableFrom, setAvailableFrom] = useState<string>(
    initialListing?.availableFrom || new Date().toISOString().split('T')[0]
  );
  const [locationSuburb, setLocationSuburb] = useState<TrivandrumSuburbEnum>(
    initialListing?.locationSuburb || 'KAZHAKKOOTTAM'
  );
  const [amenities, setAmenities] = useState<string[]>(
    initialListing?.amenities || ['AC in Bedroom', 'High-Speed Wi-Fi', 'Washing Machine']
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      roomType,
      bathroomType,
      monthlyRent,
      securityDeposit,
      availableFrom,
      locationSuburb,
      amenities,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Room listing published successfully! Visible to accommodation seekers.</span>
        </div>
      )}

      {/* 1. Room Arrangement */}
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Room Arrangement
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRoomType('PRIVATE_ROOM')}
            className={`p-3 rounded-xl border-2 text-left transition-all ${
              roomType === 'PRIVATE_ROOM'
                ? 'border-teal-600 bg-teal-50/60 text-teal-950 font-bold'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            <p className="text-sm">Private Bedroom</p>
            <p className="text-xs text-slate-500 font-normal mt-0.5">Single occupancy room</p>
          </button>

          <button
            type="button"
            onClick={() => setRoomType('SHARED_ROOM')}
            className={`p-3 rounded-xl border-2 text-left transition-all ${
              roomType === 'SHARED_ROOM'
                ? 'border-teal-600 bg-teal-50/60 text-teal-950 font-bold'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            <p className="text-sm">Shared Bedroom</p>
            <p className="text-xs text-slate-500 font-normal mt-0.5">2 beds in room</p>
          </button>
        </div>
      </div>

      {/* 2. Bathroom Attachment */}
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Bathroom Setup
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setBathroomType('ATTACHED_PRIVATE')}
            className={`p-3 rounded-xl border-2 text-left transition-all ${
              bathroomType === 'ATTACHED_PRIVATE'
                ? 'border-teal-600 bg-teal-50/60 text-teal-950 font-bold'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            <p className="text-sm">Attached Private Bath</p>
            <p className="text-xs text-slate-500 font-normal mt-0.5">Ensuite bathroom</p>
          </button>

          <button
            type="button"
            onClick={() => setBathroomType('SHARED')}
            className={`p-3 rounded-xl border-2 text-left transition-all ${
              bathroomType === 'SHARED'
                ? 'border-teal-600 bg-teal-50/60 text-teal-950 font-bold'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            <p className="text-sm">Shared Common Bath</p>
            <p className="text-xs text-slate-500 font-normal mt-0.5">Shared with flatmates</p>
          </button>
        </div>
      </div>

      {/* 3. Financials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            label="Monthly Rent (per head in ₹)"
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            helperText={`Formatted: ${formatINR(monthlyRent)} / month`}
          />
        </div>
        <div>
          <Input
            label="Security Deposit (in ₹)"
            type="number"
            value={securityDeposit}
            onChange={(e) => setSecurityDeposit(Number(e.target.value))}
            helperText={`Refundable: ${formatINR(securityDeposit)}`}
          />
        </div>
      </div>

      {/* 4. Suburb & Available Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Micro-Market Location
          </label>
          <select
            value={locationSuburb}
            onChange={(e) => setLocationSuburb(e.target.value as TrivandrumSuburbEnum)}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {SUBURBS.map((s) => (
              <option key={s} value={s}>
                {getSuburbLabel(s)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Input
            label="Available From Date"
            type="date"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
          />
        </div>
      </div>

      {/* 5. Amenities Checklist */}
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Amenities Included
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COMMON_AMENITIES.map((item) => {
            const isChecked = amenities.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleAmenity(item)}
                className={`p-2.5 rounded-lg border text-left text-xs font-semibold transition-all ${
                  isChecked
                    ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {isChecked ? '✓ ' : '+ '}
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          Publish / Update Room Listing
        </Button>
      </div>
    </form>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import {
  UserProfileResponse,
  LifestyleProfileResponse,
  CreateRoomListingRequest,
} from '@/lib/api/types';
import { formatINR, getModalityLabel, getSuburbLabel } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { TrustBadge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { RoomListingManager } from '@/components/features/RoomListingManager';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [lifestyle, setLifestyle] = useState<LifestyleProfileResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LIFESTYLE' | 'ROOM_LISTING'>('OVERVIEW');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const [prof, life] = await Promise.all([
          api.getMyProfile(),
          api.getMyLifestyle(),
        ]);
        setProfile(prof);
        setLifestyle(life);
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveRoomListing = async (data: CreateRoomListingRequest) => {
    await api.createRoomListing(data);
  };

  if (isLoading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 font-bold p-6">
        Loading profile...
      </div>
    );
  }

  const modalityInfo = getModalityLabel(profile.modality);
  const locationLabel = profile.preferredSuburbs.map((s) => getSuburbLabel(s)).join(', ');

  const tabs = [
    { id: 'OVERVIEW', label: 'Overview' },
    { id: 'LIFESTYLE', label: '7-Vector Habits' },
    { id: 'ROOM_LISTING', label: 'My Room Listing' },
  ];

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full p-4 sm:p-6 text-left space-y-6">
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <Avatar
          src={profile.avatarUrl}
          alt={profile.displayName}
          size="xl"
          verificationBadge={profile.verificationBadge}
        />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {profile.displayName}, {profile.age}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {profile.occupation} • {profile.collegeOrCompany}
              </p>
            </div>
            <TrustBadge
              type={profile.verificationBadge}
              affiliationName={profile.collegeOrCompany}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {modalityInfo.badge}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {locationLabel}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              Budget: {formatINR(profile.minBudget)} - {formatINR(profile.maxBudget)}/mo
            </span>
          </div>

          {profile.bio && (
            <p className="text-xs text-slate-600 italic mt-3 leading-relaxed">
              &ldquo;{profile.bio}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onSelect={(id) => setActiveTab(id as typeof activeTab)}
      />

      {/* TAB 1: Overview */}
      {activeTab === 'OVERVIEW' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Account &amp; Trust Credentials
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </span>
                <div>
                  <p className="font-bold text-slate-900">Phone Number Verified</p>
                  <p className="text-slate-500">+91 *******210 (Masked for DPDP compliance)</p>
                </div>
              </div>
              <span className="text-emerald-700 font-bold">Active</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  🛡
                </span>
                <div>
                  <p className="font-bold text-slate-900">Technopark Organization Domain</p>
                  <p className="text-slate-500">Verified via corporate email (@infosys.com)</p>
                </div>
              </div>
              <span className="text-sky-700 font-bold">Verified Professional</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/setup')}
            >
              Re-take Lifestyle Onboarding
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:bg-rose-50"
              onClick={() => router.push('/login')}
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: 7-Vector Lifestyle Habits */}
      {activeTab === 'LIFESTYLE' && lifestyle && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Active Lifestyle Profile
            </h2>
            <button
              type="button"
              onClick={() => router.push('/setup')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              Edit Preferences &gt;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">1. Sleep Chronotype</span>
              <p className="font-bold text-slate-900">{lifestyle.sleep.pattern.replace('_', ' ')}</p>
              <p className="text-slate-500">Noise: {lifestyle.sleep.noiseSensitivity.replace('_', ' ')}</p>
              {lifestyle.sleep.isDealbreaker && (
                <span className="inline-block text-[10px] font-bold text-coral-700 bg-coral-50 px-2 py-0.5 rounded">
                  Non-Negotiable Dealbreaker
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">2. Cleanliness Standard</span>
              <p className="font-bold text-slate-900">{lifestyle.cleanliness.level} Level</p>
              <p className="text-slate-500">Dishes: {lifestyle.cleanliness.sinkRule.replace('_', ' ')}</p>
              {lifestyle.cleanliness.isDealbreaker && (
                <span className="inline-block text-[10px] font-bold text-coral-700 bg-coral-50 px-2 py-0.5 rounded">
                  Non-Negotiable Dealbreaker
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">3. Dietary Policy</span>
              <p className="font-bold text-slate-900">{lifestyle.dietary.dietType.replace('_', ' ')}</p>
              <p className="text-slate-500">{lifestyle.dietary.kitchenPolicy.replace(/_/g, ' ')}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">4. Substances (Smoking)</span>
              <p className="font-bold text-slate-900">{lifestyle.substances.smokingHabit.replace(/_/g, ' ')}</p>
              {lifestyle.substances.isDealbreaker && (
                <span className="inline-block text-[10px] font-bold text-coral-700 bg-coral-50 px-2 py-0.5 rounded">
                  Strict Smoke-Free Dealbreaker
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">5. Financial Split</span>
              <p className="font-bold text-slate-900">{lifestyle.financial.rentPaymentHabit.replace(/_/g, ' ')}</p>
              <p className="text-slate-500">{lifestyle.financial.groceryTracking.replace(/_/g, ' ')}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">6. Work Rhythm</span>
              <p className="font-bold text-slate-900">{lifestyle.work.workMode} WFH Rhythm</p>
              <p className="text-slate-500">{lifestyle.work.workspacePreference.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Room Listing Manager */}
      {activeTab === 'ROOM_LISTING' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Manage Your Room Listing</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              If you have a vacant room in your flat (Modality 1 or 3), specify rent and amenities here.
            </p>
          </div>

          <RoomListingManager onSave={handleSaveRoomListing} />
        </div>
      )}
    </div>
  );
}

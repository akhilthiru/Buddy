'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DiscoveryModalityEnum,
  TrivandrumSuburbEnum,
  SleepVector,
  CleanlinessVector,
  DietaryVector,
  SocialVector,
  SubstancesVector,
  FinancialVector,
  WorkVector,
} from '@/lib/api/types';
import { api } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LifestyleChip } from '@/components/features/LifestyleChip';

export default function SetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Modality
  const [modality, setModality] = useState<DiscoveryModalityEnum>('MODALITY_4');

  // Step 2: Demographics
  const [displayName, setDisplayName] = useState('Mathews Varghese');
  const [age, setAge] = useState<number>(25);
  const [occupation, setOccupation] = useState('Frontend Engineer');
  const [collegeOrCompany, setCollegeOrCompany] = useState('Infosys Technopark');
  const [selectedSuburbs, setSelectedSuburbs] = useState<TrivandrumSuburbEnum[]>([
    'KAZHAKKOOTTAM',
    'KARIAVATTOM',
  ]);
  const [minBudget, setMinBudget] = useState(6000);
  const [maxBudget, setMaxBudget] = useState(9000);

  // Step 3: 7-Vector Lifestyle
  const [sleep, setSleep] = useState<SleepVector>({
    pattern: 'EARLY_BIRD',
    shiftSchedule: 'NORMAL_DAY',
    noiseSensitivity: 'LIGHT_SLEEPER',
    isDealbreaker: true,
  });

  const [cleanliness, setCleanliness] = useState<CleanlinessVector>({
    level: 'MODERATE',
    sinkRule: 'SAME_DAY',
    maidPreference: 'OPEN_TO_MAID',
    isDealbreaker: true,
  });

  const [dietary, setDietary] = useState<DietaryVector>({
    dietType: 'NON_VEGETARIAN',
    kitchenPolicy: 'SEPARATE_UTENSILS_OK',
    isDealbreaker: false,
  });

  const [social, setSocial] = useState<SocialVector>({
    guestFrequency: 'OCCASIONAL_FRIENDS',
    overnightGuestPolicy: 'SAME_GENDER_ONLY',
    partyPreference: 'NEVER_AT_HOME',
    isDealbreaker: false,
  });

  const [substances, setSubstances] = useState<SubstancesVector>({
    smokingHabit: 'NON_SMOKER_STRICT',
    alcoholHabit: 'SOCIAL_DRINKER',
    isDealbreaker: true,
  });

  const [financial, setFinancial] = useState<FinancialVector>({
    rentPaymentHabit: 'STRICT_1ST_OF_MONTH',
    acBillSplit: 'PROPORTIONAL_TO_USAGE',
    groceryTracking: 'SPLITWISE_APP',
    isDealbreaker: true,
  });

  const [work, setWork] = useState<WorkVector>({
    workMode: 'HYBRID',
    callFrequency: 'LOW',
    workspacePreference: 'PRIVATE_ROOM_DESK',
    isDealbreaker: false,
  });

  const suburbsList: TrivandrumSuburbEnum[] = [
    'KAZHAKKOOTTAM',
    'KARIAVATTOM',
    'SREEKARYAM',
    'ULLOOR',
    'PATTOM',
    'KOWDIAR',
  ];

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep((p) => p + 1);
    } else {
      setIsLoading(true);
      try {
        await api.updateMyProfile({
          displayName,
          gender: 'MALE',
          birthDate: '2001-05-10',
          occupation,
          collegeOrCompany,
          modality,
          minBudget,
          maxBudget,
          preferredSuburbs: selectedSuburbs,
        });

        await api.updateMyLifestyle({
          sleep,
          cleanliness,
          dietary,
          social,
          substances,
          financial,
          work,
        });

        router.push('/discover');
      } catch {
        // Fallback for demo
        router.push('/discover');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((p) => p - 1);
    }
  };

  const toggleSuburb = (s: TrivandrumSuburbEnum) => {
    setSelectedSuburbs((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full p-4 sm:p-6 text-left">
      {/* Top Stepper Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
          <span>STEP {currentStep} OF 4</span>
          <span>{Math.round((currentStep / 4) * 100)}% COMPLETE</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-teal-600 transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Discovery Modality Selection */}
      {currentStep === 1 && (
        <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-fade-up">
          <h2 className="text-xl font-bold text-slate-900">How do you want to find a flatmate?</h2>
          <p className="text-xs text-slate-500">
            Flatmate is person-first. Whether you already have a flat or want to team up, we match by lifestyle compatibility.
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                id: 'MODALITY_4',
                label: 'M4: Team Up First & Search Together',
                desc: 'Find a compatible flatmate first, then scout flats together near Technopark or college.',
              },
              {
                id: 'MODALITY_1',
                label: 'M1: I Have a Room Available',
                desc: 'You have a flat/house in Trivandrum and are looking to fill an empty private or shared bedroom.',
              },
              {
                id: 'MODALITY_2',
                label: 'M2: Seeking Accommodation with Flatmate',
                desc: 'You need a room immediately and want to move into an existing flat with a verified host.',
              },
              {
                id: 'MODALITY_3',
                label: 'M3: Flat Leased / Looking to Relocate',
                desc: 'You currently lease a flat and want a replacement flatmate to sign a new lease.',
              },
            ].map((item) => {
              const isSelected = modality === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setModality(item.id as DiscoveryModalityEnum)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50 text-teal-950 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: Demographics & Micro-Markets */}
      {currentStep === 2 && (
        <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-fade-up">
          <h2 className="text-xl font-bold text-slate-900">About You &amp; Your Micro-Market</h2>
          <p className="text-xs text-slate-500">
            Tell us about your work, preferred suburbs, and budget target.
          </p>

          <div className="space-y-4 pt-2">
            <Input
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                required
              />
              <Input
                label="Occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                required
              />
            </div>

            <Input
              label="Company or College"
              value={collegeOrCompany}
              onChange={(e) => setCollegeOrCompany(e.target.value)}
              placeholder="e.g. Infosys / CET"
            />

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Target Suburbs in Trivandrum
              </label>
              <div className="flex flex-wrap gap-2">
                {suburbsList.map((s) => {
                  const isChecked = selectedSuburbs.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSuburb(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        isChecked
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {s.toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Min Monthly Budget (₹)"
                type="number"
                value={minBudget}
                onChange={(e) => setMinBudget(Number(e.target.value))}
              />
              <Input
                label="Max Monthly Budget (₹)"
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: 7-Vector Lifestyle Profiling Stepper */}
      {currentStep === 3 && (
        <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-fade-up">
          <div>
            <h2 className="text-xl font-bold text-slate-900">7-Vector Lifestyle Compatibility</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your habits and pin non-negotiable dealbreakers with the padlock icon.
            </p>
          </div>

          {/* 1. Sleep */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              1. Sleep &amp; Circadian Chronotype
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <LifestyleChip
                label="Early Bird (Sleeps by 11 PM)"
                variant="interactive"
                isSelected={sleep.pattern === 'EARLY_BIRD'}
                isDealbreaker={sleep.isDealbreaker}
                onToggle={() => setSleep((p) => ({ ...p, pattern: 'EARLY_BIRD' }))}
                onToggleDealbreaker={() => setSleep((p) => ({ ...p, isDealbreaker: !p.isDealbreaker }))}
              />
              <LifestyleChip
                label="Night Owl (Awake past 1 AM)"
                variant="interactive"
                isSelected={sleep.pattern === 'NIGHT_OWL'}
                isDealbreaker={sleep.isDealbreaker}
                onToggle={() => setSleep((p) => ({ ...p, pattern: 'NIGHT_OWL' }))}
                onToggleDealbreaker={() => setSleep((p) => ({ ...p, isDealbreaker: !p.isDealbreaker }))}
              />
            </div>
          </div>

          {/* 2. Cleanliness */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              2. Cleanliness &amp; Dishes in Sink
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <LifestyleChip
                label="Same-Day Sink Wash Discipline"
                variant="interactive"
                isSelected={cleanliness.sinkRule === 'SAME_DAY'}
                isDealbreaker={cleanliness.isDealbreaker}
                onToggle={() => setCleanliness((p) => ({ ...p, sinkRule: 'SAME_DAY' }))}
                onToggleDealbreaker={() => setCleanliness((p) => ({ ...p, isDealbreaker: !p.isDealbreaker }))}
              />
              <LifestyleChip
                label="Immediate Dish Clean After Eating"
                variant="interactive"
                isSelected={cleanliness.sinkRule === 'IMMEDIATE_WASH'}
                isDealbreaker={cleanliness.isDealbreaker}
                onToggle={() => setCleanliness((p) => ({ ...p, sinkRule: 'IMMEDIATE_WASH' }))}
                onToggleDealbreaker={() => setCleanliness((p) => ({ ...p, isDealbreaker: !p.isDealbreaker }))}
              />
            </div>
          </div>

          {/* 3. Dietary */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              3. Dietary &amp; Kitchen Restrictions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <LifestyleChip
                label="Non-Veg Ok / Separate Utensils"
                variant="interactive"
                isSelected={dietary.kitchenPolicy === 'SEPARATE_UTENSILS_OK'}
                isDealbreaker={dietary.isDealbreaker}
                onToggle={() => setDietary((p) => ({ ...p, kitchenPolicy: 'SEPARATE_UTENSILS_OK' }))}
                onToggleDealbreaker={() => setDietary((p) => ({ ...p, isDealbreaker: !p.isDealbreaker }))}
              />
              <LifestyleChip
                label="Pure Vegetarian Kitchen Only"
                variant="interactive"
                isSelected={dietary.kitchenPolicy === 'VEG_ONLY_KITCHEN'}
                isDealbreaker={dietary.isDealbreaker}
                onToggle={() => setDietary((p) => ({ ...p, kitchenPolicy: 'VEG_ONLY_KITCHEN' }))}
                onToggleDealbreaker={() => setDietary((p) => ({ ...p, isDealbreaker: !p.isDealbreaker }))}
              />
            </div>
          </div>

          {/* 4. Substances */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              4. Substances (Smoking Policy)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <LifestyleChip
                label="Strict Non-Smoker (Smoke-Free Flat)"
                variant="interactive"
                isSelected={substances.smokingHabit === 'NON_SMOKER_STRICT'}
                isDealbreaker={substances.isDealbreaker}
                onToggle={() => setSubstances((p) => ({ ...p, smokingHabit: 'NON_SMOKER_STRICT' }))}
                onToggleDealbreaker={() => setSubstances((p) => ({ ...p, isDealbreaker: !p.isDealbreaker }))}
              />
              <LifestyleChip
                label="Smoker (Balcony Allowed)"
                variant="interactive"
                isSelected={substances.smokingHabit === 'BALCONY_ONLY'}
                isDealbreaker={substances.isDealbreaker}
                onToggle={() => setSubstances((p) => ({ ...p, smokingHabit: 'BALCONY_ONLY' }))}
                onToggleDealbreaker={() => setSubstances((p) => ({ ...p, isDealbreaker: !p.isDealbreaker }))}
              />
            </div>
          </div>

          {/* 5. Finances */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              5. Financial Expense Splitting
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <LifestyleChip
                label="Strict 1st of Month via Splitwise"
                variant="interactive"
                isSelected={financial.rentPaymentHabit === 'STRICT_1ST_OF_MONTH'}
                isDealbreaker={financial.isDealbreaker}
                onToggle={() => setFinancial((p) => ({ ...p, rentPaymentHabit: 'STRICT_1ST_OF_MONTH' }))}
                onToggleDealbreaker={() => setFinancial((p) => ({ ...p, isDealbreaker: !p.isDealbreaker }))}
              />
              <LifestyleChip
                label="Flexible Rent (Before 5th)"
                variant="interactive"
                isSelected={financial.rentPaymentHabit === 'BEFORE_5TH'}
                isDealbreaker={financial.isDealbreaker}
                onToggle={() => setFinancial((p) => ({ ...p, rentPaymentHabit: 'BEFORE_5TH' }))}
                onToggleDealbreaker={() => setFinancial((p) => ({ ...p, isDealbreaker: !p.isDealbreaker }))}
              />
            </div>
          </div>

          {/* 6. Work */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              6. Work Pattern &amp; WFH Rhythm
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <LifestyleChip
                label="Hybrid (2-3 Days WFH)"
                variant="interactive"
                isSelected={work.workMode === 'HYBRID'}
                isDealbreaker={work.isDealbreaker}
                onToggle={() => setWork((p) => ({ ...p, workMode: 'HYBRID' }))}
                onToggleDealbreaker={() => setWork((p) => ({ ...p, isDealbreaker: !p.isDealbreaker }))}
              />
              <LifestyleChip
                label="Daily Office (Technopark / Campus)"
                variant="interactive"
                isSelected={work.workMode === 'OFFICE_DAILY'}
                isDealbreaker={work.isDealbreaker}
                onToggle={() => setWork((p) => ({ ...p, workMode: 'OFFICE_DAILY' }))}
                onToggleDealbreaker={() => setWork((p) => ({ ...p, isDealbreaker: !p.isDealbreaker }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Complete */}
      {currentStep === 4 && (
        <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-fade-up text-center">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">You&apos;re All Set!</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Your lifestyle preferences will be matched deterministically against active candidates in Trivandrum. We never reveal your personal phone number or exact address.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 mt-4">
            <div className="flex justify-between">
              <span className="text-slate-500">Name &amp; Age:</span>
              <strong className="text-slate-800">{displayName}, {age}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Occupation:</span>
              <strong className="text-slate-800">{occupation}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Modality:</span>
              <strong className="text-teal-700">{modality}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Budget Range:</span>
              <strong className="text-slate-800">₹{minBudget} - ₹{maxBudget} / mo</strong>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 mt-6">
        {currentStep > 1 && (
          <Button variant="outline" className="flex-1" onClick={handleBack}>
            &larr; Back
          </Button>
        )}
        <Button
          variant="primary"
          className="flex-2"
          onClick={handleNext}
          isLoading={isLoading}
        >
          {currentStep === 4 ? 'Launch Discovery Deck &gt;' : 'Continue &gt;'}
        </Button>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();

  // Mode: phone OTP or institutional email verification
  const [authStep, setAuthStep] = useState<'PHONE_INPUT' | 'OTP_INPUT' | 'INSTITUTION_INPUT'>('PHONE_INPUT');
  const [phoneNumber, setPhoneNumber] = useState('+919876543210');
  const [otp, setOtp] = useState('');
  const [institutionEmail, setInstitutionEmail] = useState('');
  const [institutionToken, setInstitutionToken] = useState('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(300);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authStep === 'OTP_INPUT' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authStep, resendTimer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // E.164 validation: Indian 10-digit mobile
    const e164Regex = /^\+91[6-9]\d{9}$/;
    if (!e164Regex.test(phoneNumber.trim())) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number prefixed with +91.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.sendOtp({ phoneNumber: phoneNumber.trim() });
      setSuccessMessage(res.message);
      setAuthStep('OTP_INPUT');
      setResendTimer(res.expiresInSeconds || 300);
    } catch (err) {
      const problem = err instanceof ApiError ? err.problem.detail : 'Failed to send OTP.';
      setErrorMessage(problem);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otp.length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP received via SMS (Demo OTP: 123456).');
      return;
    }

    setIsLoading(true);
    try {
      const session = await api.verifyOtp({
        phoneNumber: phoneNumber.trim(),
        otp: otp.trim(),
      });
      if (session.isNewUser || !session.user.isOnboardingCompleted) {
        router.push('/setup');
      } else {
        router.push('/discover');
      }
    } catch (err) {
      const problem = err instanceof ApiError ? err.problem.detail : 'Invalid OTP. Please try again.';
      setErrorMessage(problem);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!institutionEmail.includes('@')) {
      setErrorMessage('Please enter a valid collegiate or corporate email address.');
      return;
    }

    setIsLoading(true);
    try {
      if (!isVerifyingEmail) {
        const res = await api.verifyInstitution({ institutionEmail: institutionEmail.trim() });
        setSuccessMessage(res.message);
        setIsVerifyingEmail(true);
      } else {
        const res = await api.confirmInstitution({ token: institutionToken.trim() });
        setSuccessMessage(`Verified as ${res.badge} at ${res.institutionName}!`);
        setTimeout(() => router.push('/discover'), 1500);
      }
    } catch (err) {
      const problem = err instanceof ApiError ? err.problem.detail : 'Verification failed.';
      setErrorMessage(problem);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-modal text-left">
        {/* Brand Banner */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-extrabold text-xl shadow-xs">
            F
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Flatmate</h1>
            <p className="text-xs text-slate-500 font-medium">Trivandrum Lifestyle Compatibility</p>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div role="alert" className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div role="status" className="mb-4 p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs font-semibold">
            {successMessage}
          </div>
        )}

        {/* Step 1: Phone Input */}
        {authStep === 'PHONE_INPUT' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Sign in with Phone</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your mobile number to receive a secure 6-digit verification code.
              </p>
            </div>

            <Input
              label="Indian Mobile Number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+919876543210"
              helperText="E.164 formatted number starting with +91"
              required
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
              Send Verification Code &gt;
            </Button>

            <div className="pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setAuthStep('INSTITUTION_INPUT')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                Verify Work or College domain email instead &gt;
              </button>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {authStep === 'OTP_INPUT' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Enter Verification Code</h2>
              <p className="text-xs text-slate-500 mt-1">
                Sent to <strong className="text-slate-800">{phoneNumber}</strong>. (Demo OTP: <strong className="text-teal-700">123456</strong>)
              </p>
            </div>

            <Input
              label="6-Digit OTP"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="text-center text-xl font-bold tracking-widest"
              required
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
              Verify &amp; Continue &gt;
            </Button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setAuthStep('PHONE_INPUT')}
                className="text-slate-500 hover:text-slate-800 font-medium"
              >
                &larr; Change Phone
              </button>
              <button
                type="button"
                disabled={resendTimer > 0}
                onClick={handleSendOtp}
                className={resendTimer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-teal-700 font-bold'}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Institutional Domain Verification */}
        {authStep === 'INSTITUTION_INPUT' && (
          <form onSubmit={handleVerifyInstitution} className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Work or College Verification</h2>
              <p className="text-xs text-slate-500 mt-1">
                Unlock trusted badges with your CET, SCT, Technopark or UST email.
              </p>
            </div>

            <Input
              label="Institutional Email"
              type="email"
              value={institutionEmail}
              onChange={(e) => setInstitutionEmail(e.target.value)}
              placeholder="name@ust.com or user@cet.ac.in"
              disabled={isVerifyingEmail}
              required
            />

            {isVerifyingEmail && (
              <Input
                label="Confirmation Token"
                type="text"
                value={institutionToken}
                onChange={(e) => setInstitutionToken(e.target.value)}
                placeholder="Enter 6-digit token from email"
                required
              />
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
              {isVerifyingEmail ? 'Confirm Badge &gt;' : 'Send Verification Link &gt;'}
            </Button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setAuthStep('PHONE_INPUT')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                &larr; Back to Phone Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Layers, 
  ShieldCheck, 
  Smartphone, 
  UserCheck, 
  Landmark,
  ArrowRight,
  Lock,
  Mail,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuth, UserRole, PRESET_USERS } from '@/lib/auth-context';
import { SITE_CONFIG } from '@/lib/site-config';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const initialType = searchParams.get('type');
  const [authTab, setAuthTab] = useState<'officer' | 'citizen'>(
    initialType === 'citizen' ? 'citizen' : 'officer'
  );

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'citizen') {
      setAuthTab('citizen');
    } else if (type === 'authority' || type === 'officer') {
      setAuthTab('officer');
    }
  }, [searchParams]);

  // Officer form state
  const [officerEmail, setOfficerEmail] = useState('director.nhai@nic.in');
  const [officerPassword, setOfficerPassword] = useState('••••••••••••');
  const [officerRole, setOfficerRole] = useState<UserRole>('pia');
  const [captchaValue, setCaptchaValue] = useState('7K94M');
  const [captchaInput, setCaptchaInput] = useState('7K94M');
  const [officerError, setOfficerError] = useState<string | null>(null);

  // Citizen form state
  const [citizenId, setCitizenId] = useState('4892 8419 1029');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [citizenError, setCitizenError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(code);
    setCaptchaInput('');
  };

  const handleOfficerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setOfficerError(null);

    if (!officerEmail.trim()) {
      setOfficerError('Please enter your official Government / NIC email ID.');
      return;
    }

    if (captchaInput.toUpperCase() !== captchaValue.toUpperCase()) {
      setOfficerError('Security CAPTCHA verification failed. Please try again.');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(officerRole);
      router.push(PRESET_USERS[officerRole].dashboardRoute);
    }, 600);
  };

  const handleSendOtp = () => {
    if (!citizenId.trim() || citizenId.replace(/\s/g, '').length < 10) {
      setCitizenError('Please enter a valid 12-digit Aadhaar or 10-digit registered mobile number.');
      return;
    }
    setCitizenError(null);
    setOtpSent(true);
    setOtpCode('123456'); // Pre-fill demo OTP
  };

  const handleCitizenLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOtp();
      return;
    }
    if (otpCode !== '123456') {
      setCitizenError('Invalid OTP. For demonstration, use the pre-filled code: 123456');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      login('citizen');
      router.push(PRESET_USERS.citizen.dashboardRoute);
    }, 600);
  };



  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top National Tricolor Micro-Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

      {/* Top Government Strip */}
      <div className="bg-[#0b213b] text-slate-200 py-1.5 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-amber-400 uppercase text-[11px]">
              {SITE_CONFIG.governmentEntity.countryHindi} | {SITE_CONFIG.governmentEntity.country}
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline text-[11px]">
              {SITE_CONFIG.name} Statutory Gateway
            </span>
          </div>
          <Link 
            href="/" 
            className="text-slate-300 hover:text-white transition-colors text-[11px] flex items-center space-x-1.5"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Public Portal</span>
          </Link>
        </div>
      </div>

      {/* Main Login Body */}
      <div className="flex-1 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-xl">
          {/* Logo & Portal Identity */}
          <div className="text-center">
            <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 text-[#0F2E53] shadow-sm mb-3">
              <Layers className="h-7 w-7 text-[#166534]" />
            </Link>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F2E53]">
              {SITE_CONFIG.name} <span className="text-[#166534] font-bold">{SITE_CONFIG.hindiName}</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              RFCTLARR Act, 2013 Statutory Access & Authentication Gateway
            </p>
            <div className="inline-flex items-center space-x-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Role-Specific Workspace Access (Demo Mode)</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Tab Selection */}
            <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setAuthTab('citizen')}
                className={`py-3.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center space-x-2 cursor-pointer ${
                  authTab === 'citizen'
                    ? 'border-[#166534] text-[#0F2E53] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className={`h-4 w-4 ${authTab === 'citizen' ? 'text-[#166534]' : 'text-slate-400'}`} />
                <span>Citizen / Landowner Login</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthTab('officer')}
                className={`py-3.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center space-x-2 cursor-pointer ${
                  authTab === 'officer'
                    ? 'border-[#166534] text-[#0F2E53] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Landmark className={`h-4 w-4 ${authTab === 'officer' ? 'text-[#166534]' : 'text-slate-400'}`} />
                <span>Authority / Department SSO</span>
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* TAB 1: CITIZEN / PAF LOGIN */}
              {authTab === 'citizen' && (
                <form onSubmit={handleCitizenLogin} className="space-y-4">
                  {citizenError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                      <span>{citizenError}</span>
                    </div>
                  )}

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
                    <span className="font-bold">Project Affected Families:</span> Sign in to securely inspect your compensation ledger, statutory award status, solatium sheet, and PFMS payment records.
                  </div>

                  {/* Aadhaar / Mobile Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      12-Digit Aadhaar Number / Registered Mobile
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={citizenId}
                        onChange={(e) => setCitizenId(e.target.value)}
                        placeholder="4892 8419 1029"
                        required
                        className="w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* OTP State */}
                  {otpSent && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          One-Time Password (OTP)
                        </label>
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          OTP Sent to linked mobile (••••1029)
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          required
                          className="w-full pl-9 pr-3 py-2.5 text-xs font-bold tracking-widest bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none font-mono text-center text-base"
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Didn&apos;t receive OTP? <button type="button" onClick={() => alert('Demo OTP resent: 123456')} className="text-[#166534] font-semibold hover:underline">Resend OTP</button></span>
                        <span className="font-mono text-slate-400">Auto-fill: 123456</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#166534] hover:bg-[#12542a] text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : otpSent ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Verify OTP & Enter Citizen Console</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4" />
                        <span>Send Demo Verification OTP</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: OFFICER / AUTHORITY LOGIN */}
              {authTab === 'officer' && (
                <form onSubmit={handleOfficerLogin} className="space-y-4">
                  {officerError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                      <span>{officerError}</span>
                    </div>
                  )}

                  {/* Role Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Designated Authority Role
                    </label>
                    <div className="relative">
                      <select
                        value={officerRole}
                        onChange={(e) => {
                          const r = e.target.value as UserRole;
                          setOfficerRole(r);
                          setOfficerEmail(PRESET_USERS[r].identifier);
                        }}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none"
                      >
                        <option value="pia">Project Implementing Agency (PIA) - Col. R. K. Sharma</option>
                        <option value="cala">Competent Authority / Collector (CALA) - Dr. S. Mukherjee, IAS</option>
                        <option value="revenue-officer">Field Revenue Officer / Tehsildar - Rajesh Kumar</option>
                        <option value="central">Central Monitoring Authority - Joint Secretary, MoRTH</option>
                      </select>
                    </div>
                  </div>

                  {/* Officer Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Government Email ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        value={officerEmail}
                        onChange={(e) => setOfficerEmail(e.target.value)}
                        placeholder="officer.name@gov.in"
                        required
                        className="w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        SSO Password
                      </label>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert('Password management is handled via the government SSO service desk.'); }} className="text-[11px] text-[#166534] hover:underline">
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type="password"
                        value={officerPassword}
                        onChange={(e) => setOfficerPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Security Captcha */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Security Verification (CAPTCHA)
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="bg-slate-200 border border-slate-300 px-4 py-2 rounded-xl select-none font-mono tracking-widest text-base font-bold text-[#0F2E53] line-through decoration-slate-400">
                        {captchaValue}
                      </div>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Generate New CAPTCHA"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <input
                        type="text"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="Enter CAPTCHA"
                        maxLength={5}
                        required
                        className="flex-1 px-3 py-2 text-xs font-mono font-bold uppercase bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#0F2E53] hover:bg-[#0a203a] text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>Sign In to Official Workspace</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Statutory Security Disclaimer */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-[11px] text-slate-500 max-w-lg mx-auto">
              <strong>Notice:</strong> In demonstration mode, session roles control local UI workspace views. Enforceable authorization and database security are managed by backend access control policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">Loading statutory login gateway...</div>}>
      <LoginContent />
    </Suspense>
  );
}

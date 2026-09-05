'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Building2, 
  Layers, 
  ShieldCheck, 
  Smartphone, 
  Scale, 
  UserCheck, 
  Landmark,
  ArrowRight,
  Lock,
  Mail,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Info,
  Globe
} from 'lucide-react';
import { useAuth, UserRole, PRESET_USERS } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  const [authTab, setAuthTab] = useState<'officer' | 'citizen'>('officer');

  // Officer form state
  const [officerEmail, setOfficerEmail] = useState('director.nhai@nic.in');
  const [officerPassword, setOfficerPassword] = useState('••••••••••••');
  const [officerRole, setOfficerRole] = useState<UserRole>('pia');
  const [captchaValue, setCaptchaValue] = useState('7K94M');
  const [captchaInput, setCaptchaInput] = useState('7K94M');
  const [officerError, setOfficerError] = useState<string | null>(null);
  const [officerInfo, setOfficerInfo] = useState<string | null>(null);

  // Citizen form state
  const [citizenId, setCitizenId] = useState('4892 8419 1029');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [citizenError, setCitizenError] = useState<string | null>(null);
  const [citizenInfo, setCitizenInfo] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Handle URL query parameters if present (?tab=citizen or ?role=pia)
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'citizen') {
      setAuthTab('citizen');
    }
    const roleParam = searchParams.get('role') as UserRole;
    if (roleParam && PRESET_USERS[roleParam]) {
      setOfficerRole(roleParam);
      setOfficerEmail(PRESET_USERS[roleParam].identifier);
    }
  }, [searchParams]);

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
    setOfficerInfo(null);

    if (!officerEmail.trim()) {
      setOfficerError(language === 'HI' ? 'कृपया अपना शासकीय / NIC ईमेल दर्ज करें।' : 'Please enter your official Government / NIC email ID.');
      return;
    }

    if (captchaInput.toUpperCase() !== captchaValue.toUpperCase()) {
      setOfficerError(language === 'HI' ? 'सुरक्षा कैप्चा सत्यापन विफल। कृपया पुनः प्रयास करें।' : 'Security CAPTCHA verification failed. Please try again.');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(officerRole);
      router.push(PRESET_USERS[officerRole].dashboardRoute);
    }, 500);
  };

  const handleSendOtp = () => {
    if (!citizenId.trim() || citizenId.replace(/\s/g, '').length < 10) {
      setCitizenError(language === 'HI' ? 'कृपया मान्य 12-अंकीय आधार या 10-अंकीय मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 12-digit Aadhaar or 10-digit registered mobile number.');
      return;
    }
    setCitizenError(null);
    setOtpSent(true);
    setOtpCode('123456'); // Pre-fill demo OTP
    setCitizenInfo(language === 'HI' ? 'डेमो सत्यापन ओटीपी 123456 स्वतः प्रविष्ट कर दिया गया है।' : 'Demo OTP: 123456 has been pre-filled for instant verification.');
  };

  const handleCitizenLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOtp();
      return;
    }
    if (otpCode !== '123456') {
      setCitizenError(language === 'HI' ? 'अमान्य ओटीपी कोड। परीक्षण हेतु कोड 123456 दर्ज करें।' : 'Invalid OTP. For demonstration, use the pre-filled code: 123456');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      login('citizen');
      router.push(PRESET_USERS.citizen.dashboardRoute);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top National Tricolor Micro-Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

      {/* Top Government Strip */}
      <div className="bg-[#0b213b] text-slate-100 py-2 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center space-x-2.5">
            <span className="font-extrabold text-amber-400 uppercase text-xs">
              {t('portal.gov_india', 'भारत सरकार | Government of India')}
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-200 hidden sm:inline text-xs font-semibold">
              {t('portal.morth', 'सड़क परिवहन एवं राजमार्ग मंत्रालय (MoRTH)')}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-xl border border-emerald-500/50 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{language === 'EN' ? 'हिन्दी (Hindi)' : 'English'}</span>
            </button>
            <Link 
              href="/" 
              className="text-slate-300 hover:text-white transition-colors text-xs sm:text-sm font-bold flex items-center space-x-1"
            >
              <span>{language === 'HI' ? '← मुख्य पोर्टल पर वापस जाएं' : '← Back to Public Portal'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Login Body */}
      <div className="flex-1 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
          {/* Logo & Portal Identity */}
          <div className="text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border-2 border-emerald-600 text-[#166534] shadow-md mb-3">
              <Layers className="h-8 w-8 text-[#166534]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F2E53]">
              BhuSetu <span className="text-[#166534] font-bold">भूसेतु</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-700 mt-1 font-semibold">
              {language === 'HI' 
                ? 'RFCTLARR अधिनियम, 2013 सांविधिक पहुंच एवं प्रमाणीकरण प्रवेशद्वार' 
                : 'RFCTLARR Act, 2013 Statutory Access & Authentication Gateway'}
            </p>
            <div className="inline-flex items-center space-x-2 mt-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-xs sm:text-sm text-emerald-900 font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>{language === 'HI' ? 'राष्ट्रीय एकल साइन-ऑन (परिचय SSO / आधार OTP)' : 'National Single Sign-On (Parichay SSO / Aadhaar OTP)'}</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="mt-8 bg-white rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden">
            {/* Tab Selection */}
            <div className="grid grid-cols-2 border-b-2 border-slate-200 bg-slate-50/70">
              <button
                type="button"
                onClick={() => setAuthTab('officer')}
                className={`py-4 text-sm sm:text-base font-black transition-all border-b-4 flex items-center justify-center space-x-2.5 cursor-pointer ${
                  authTab === 'officer'
                    ? 'border-[#166534] text-[#0F2E53] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Landmark className={`h-5 w-5 ${authTab === 'officer' ? 'text-[#166534]' : 'text-slate-400'}`} />
                <span>{t('login.tab_officer', 'Officer / Authority SSO')}</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthTab('citizen')}
                className={`py-4 text-sm sm:text-base font-black transition-all border-b-4 flex items-center justify-center space-x-2.5 cursor-pointer ${
                  authTab === 'citizen'
                    ? 'border-[#166534] text-[#0F2E53] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <UserCheck className={`h-5 w-5 ${authTab === 'citizen' ? 'text-[#166534]' : 'text-slate-400'}`} />
                <span>{t('login.tab_citizen', 'Citizen / Landowner OTP')}</span>
              </button>
            </div>

            <div className="p-6 sm:p-10">
              {/* TAB 1: OFFICER LOGIN */}
              {authTab === 'officer' && (
                <form onSubmit={handleOfficerLogin} className="space-y-5">
                  {officerError && (
                    <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl text-sm text-rose-900 flex items-center space-x-2.5 font-semibold">
                      <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                      <span>{officerError}</span>
                    </div>
                  )}

                  {officerInfo && (
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl text-sm text-blue-900 flex items-center space-x-2.5 font-semibold">
                      <Info className="h-5 w-5 shrink-0 text-blue-600" />
                      <span>{officerInfo}</span>
                    </div>
                  )}

                  {/* Role Selector */}
                  <div>
                    <label className="block text-sm font-extrabold text-slate-800 mb-1.5">
                      {t('login.role_label', 'Official Role / Statutory Designation')}
                    </label>
                    <div className="relative">
                      <select
                        suppressHydrationWarning
                        value={officerRole}
                        onChange={(e) => {
                          const r = e.target.value as UserRole;
                          setOfficerRole(r);
                          setOfficerEmail(PRESET_USERS[r].identifier);
                        }}
                        className="w-full text-sm font-bold bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3.5 text-slate-900 focus:bg-white focus:border-[#166534] focus:outline-none cursor-pointer"
                      >
                        <option value="pia">
                          {language === 'HI' ? 'परियोजना कार्यान्वयन एजेंसी (PIA) - कर्नल आर. के. शर्मा' : 'Project Implementing Agency (PIA) - Col. R. K. Sharma'}
                        </option>
                        <option value="cala">
                          {language === 'HI' ? 'सक्षम प्राधिकारी (CALA) / जिला समाहर्ता - डॉ. एस. मुखर्जी, IAS' : 'CALA / District Collector - Dr. S. Mukherjee, IAS'}
                        </option>
                        <option value="revenue-officer">
                          {language === 'HI' ? 'क्षेत्रीय राजस्व अधिकारी / तहसीलदार - राजेश कुमार' : 'Field Revenue Officer / Tehsildar - Rajesh Kumar'}
                        </option>
                        <option value="central">
                          {language === 'HI' ? 'केंद्रीय शीर्ष प्राधिकरण / MoRTH - संयुक्त सचिव' : 'Central Authority / Apex - Joint Secretary, MoRTH'}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Officer Email */}
                  <div>
                    <label className="block text-sm font-extrabold text-slate-800 mb-1.5">
                      {t('login.email_label', 'Official NIC / Government Email ID')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        suppressHydrationWarning
                        type="email"
                        value={officerEmail}
                        onChange={(e) => setOfficerEmail(e.target.value)}
                        placeholder="officer.name@nic.in"
                        required
                        className="w-full pl-12 pr-4 py-3.5 text-base font-bold bg-slate-50 border-2 border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:border-[#166534] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-extrabold text-slate-800">
                        {t('login.password_label', 'Parichay / SSO Password')}
                      </label>
                      <button
                        type="button"
                        onClick={() => setOfficerInfo(language === 'HI' ? 'एसएसओ डेमो मोड: आधिकारिक पदनाम हेतु पासवर्ड पूर्व-सत्यापित है।' : 'SSO Demo Mode: password pre-verified for official roles.')}
                        className="text-xs font-bold text-[#166534] hover:underline cursor-pointer"
                      >
                        {language === 'HI' ? 'पासवर्ड सहायता' : 'Password Help'}
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        suppressHydrationWarning
                        type="password"
                        value={officerPassword}
                        onChange={(e) => setOfficerPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-12 pr-4 py-3.5 text-base font-bold bg-slate-50 border-2 border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:border-[#166534] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Security Captcha */}
                  <div>
                    <label className="block text-sm font-extrabold text-slate-800 mb-1.5">
                      {t('login.captcha_label', 'Security Verification (CAPTCHA)')}
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="bg-slate-200 border-2 border-slate-300 px-5 py-2.5 rounded-2xl select-none font-mono tracking-widest text-lg font-black text-[#0F2E53] line-through decoration-slate-500">
                        {captchaValue}
                      </div>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="p-3 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
                        title="Generate New CAPTCHA"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                      <input
                        suppressHydrationWarning
                        type="text"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="CAPTCHA"
                        maxLength={5}
                        required
                        className="flex-1 px-4 py-3 text-base font-mono font-black uppercase bg-slate-50 border-2 border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:border-[#166534] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 flex items-center justify-center space-x-2.5 py-4 px-6 rounded-2xl bg-[#0F2E53] hover:bg-[#0a203a] text-white text-base font-black shadow-md transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <ShieldCheck className="h-5 w-5" />
                        <span>{t('login.btn_officer', 'Sign In via NIC Parichay SSO')}</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: CITIZEN / PAF LOGIN */}
              {authTab === 'citizen' && (
                <form onSubmit={handleCitizenLogin} className="space-y-5">
                  {citizenError && (
                    <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl text-sm text-rose-900 flex items-center space-x-2.5 font-semibold">
                      <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                      <span>{citizenError}</span>
                    </div>
                  )}

                  {citizenInfo && (
                    <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-sm text-emerald-900 flex items-center space-x-2.5 font-semibold">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                      <span>{citizenInfo}</span>
                    </div>
                  )}

                  <div className="p-4 bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl text-sm text-emerald-950 leading-relaxed font-medium">
                    <span className="font-extrabold text-emerald-800">
                      {language === 'HI' ? 'परियोजना प्रभावित परिवारों हेतु सूचना:' : 'Notice to Project Affected Families:'}
                    </span>{' '}
                    {language === 'HI'
                      ? 'अपने आधार या पंजीकृत मोबाइल से लॉगिन कर अपने खसरे का मदवार मुआवजा, 100% तोषण विवरण, आपत्ति स्थिति एवं PFMS DBT बैंक भुगतान खाता जांचें।'
                      : 'Access your itemized compensation ledger, award status, solatium breakdown, and PFMS DBT bank details using your Aadhaar or registered mobile.'}
                  </div>

                  {/* Aadhaar / Mobile Input */}
                  <div>
                    <label className="block text-sm font-extrabold text-slate-800 mb-1.5">
                      {t('login.aadhaar_label', '12-Digit Aadhaar Number / Registered Mobile')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <input
                        suppressHydrationWarning
                        type="text"
                        value={citizenId}
                        onChange={(e) => setCitizenId(e.target.value)}
                        placeholder="4892 8419 1029"
                        required
                        className="w-full pl-12 pr-4 py-3.5 text-base font-bold bg-slate-50 border-2 border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:border-[#166534] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* OTP State */}
                  {otpSent && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-extrabold text-slate-800">
                          {t('login.otp_label', 'One-Time Password (OTP)')}
                        </label>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          {language === 'HI' ? 'ओटीपी प्रेषित: ••••1029' : 'OTP Sent to ••••1029'}
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="h-5 w-5" />
                        </div>
                        <input
                          suppressHydrationWarning
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="123456"
                          maxLength={6}
                          required
                          className="w-full pl-12 pr-4 py-3.5 text-xl font-black tracking-widest bg-slate-50 border-2 border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:border-[#166534] focus:outline-none font-mono text-center"
                        />
                      </div>
                      <div className="text-xs text-slate-600 flex items-center justify-between font-medium">
                        <span>
                          {language === 'HI' ? 'ओटीपी नहीं मिला?' : "Didn't receive OTP?"}{' '}
                          <button 
                            type="button" 
                            onClick={() => setCitizenInfo(language === 'HI' ? 'ओटीपी 123456 पुनः प्रेषित किया गया।' : 'OTP 123456 resent successfully!')} 
                            className="text-[#166534] font-bold hover:underline cursor-pointer"
                          >
                            {t('login.resend_otp', 'Resend OTP')}
                          </button>
                        </span>
                        <span className="font-mono text-slate-500 font-bold">Auto-fill: 123456</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 flex items-center justify-center space-x-2.5 py-4 px-6 rounded-2xl bg-[#166534] hover:bg-[#12542a] text-white text-base font-black shadow-md transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : otpSent ? (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        <span>{t('login.btn_verify_otp', 'Verify OTP & Open Citizen Console')}</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-5 w-5" />
                        <span>{t('login.btn_send_otp', 'Send Aadhaar OTP')}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Statutory Security Disclaimer */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-xs text-slate-600 max-w-lg mx-auto font-medium">
              {t('login.statutory_warning', 'Statutory Warning: Unauthorized access or tampering with official land acquisition records is a cognizable offence under Section 66 of the Information Technology Act, 2000 and Section 84 of the RFCTLARR Act, 2013.')}
            </p>
            <div className="flex items-center justify-center space-x-3 text-xs text-slate-500 font-semibold">
              <span>{t('login.ssl_notice', 'National Informatics Centre (NIC) • 256-Bit SSL Encrypted • PFMS Integrated')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-600">Loading BhuSetu Gateway...</div>}>
      <LoginForm />
    </Suspense>
  );
}

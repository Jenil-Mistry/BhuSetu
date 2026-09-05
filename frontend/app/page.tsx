'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/app-header';
import { 
  Building2, 
  MapPin, 
  Layers, 
  ShieldCheck, 
  Smartphone, 
  Scale, 
  UserCheck, 
  Landmark,
  ArrowRight,
  Search,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  BarChart3,
  HelpCircle,
  X,
  Printer,
  QrCode,
  Sparkles,
  Lock,
  Globe,
  FileCheck2
} from 'lucide-react';
import { useAuth, UserRole } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';

export default function GovernmentLandingPage() {
  const { language, t } = useLanguage();

  // Citizen Khasra Inquiry State
  const [selectedState, setSelectedState] = useState('Haryana');
  const [selectedDistrict, setSelectedDistrict] = useState('Gurugram');
  const [selectedTehsil, setSelectedTehsil] = useState('Pataudi');
  const [selectedVillage, setSelectedVillage] = useState('Fazilpur');
  const [khasraQuery, setKhasraQuery] = useState('204');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Gazette Modal Preview State
  const [selectedGazette, setSelectedGazette] = useState<any | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleKhasraSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setSearchResult({
        khasraNo: khasraQuery,
        village: selectedVillage,
        district: selectedDistrict,
        state: selectedState,
        ownerName: language === 'HI' ? 'रमेश चंद्र यादव एवं 3 सह-खातेदार' : 'Ramesh Chandra Yadav & 3 Co-sharers',
        totalAreaHa: 1.15,
        acquiredAreaHa: 0.85,
        projectCorridor: language === 'HI' ? 'NH-48 ग्रीनफील्ड स्पर (चेनेज 8+150)' : 'NH-48 Greenfield Spur (Chainage 8+150)',
        currentStage: language === 'HI' ? 'अवार्ड घोषित (धारा 19 ई-राजपत्र में प्रकाशित)' : 'Award Declared (Sec 19 Published)',
        statutoryStatus: language === 'HI' ? 'PFMS प्रत्यक्ष लाभ अंतरण (DBT) भुगतान आदेश जारी' : 'PFMS DBT Payment Initiated',
        totalAwardAmount: '₹ 38,50,000',
        solatiumPercentage: language === 'HI' ? '100% अनिवार्य तोषण राशि जोड़ी गई (धारा 30)' : '100% Solatium Applied (Sec 30)',
        gazetteRef: 'CG-DL-E-18092024-254192',
        notificationDate: language === 'HI' ? '18 अगस्त 2024' : '18 Aug 2024',
        hearingDate: language === 'HI' ? '14 दिसंबर 2024 को निस्तारित' : 'Disposed on 14 Dec 2024',
      });
    }, 450);
  };

  const handleTriggerDownload = (ref: string) => {
    const msg = language === 'HI' 
      ? `आधिकारिक राजपत्र अधिसूचना ${ref} सफलतापूर्वक डाउनलोड हुई।`
      : `Official Gazette notification ${ref} downloaded successfully.`;
    setDownloadToast(msg);
    setTimeout(() => setDownloadToast(null), 4000);
  };

  const gazetteNotices = [
    {
      id: 'GZ-2024-01',
      ref: 'S.O. 4192(E)',
      stretch: language === 'HI' ? 'NH-48 ग्रीनफील्ड स्पर • पैकेज 01 (Ch 0+000 से 26+400)' : 'NH-48 Greenfield Spur • Package 01 (Ch 0+000 to 26+400)',
      district: language === 'HI' ? 'गुरुग्राम' : 'Gurugram',
      section: language === 'HI' ? 'धारा 19 उद्घोषणा (अंतिम अवार्ड)' : 'Section 19 Declaration (Final Award)',
      date: language === 'HI' ? '02 सित 2024' : '02 Sep 2024',
      status: language === 'HI' ? 'प्रकाशित' : 'Published',
    },
    {
      id: 'GZ-2024-02',
      ref: 'S.O. 3918(E)',
      stretch: language === 'HI' ? 'NH-48 ग्रीनफील्ड स्पर • पैकेज 02 (Ch 26+400 से 54+800)' : 'NH-48 Greenfield Spur • Package 02 (Ch 26+400 to 54+800)',
      district: language === 'HI' ? 'नूंह' : 'Nuh',
      section: language === 'HI' ? 'धारा 11 प्रारंभिक अधिसूचना' : 'Section 11 Preliminary Notification',
      date: language === 'HI' ? '28 अग 2024' : '28 Aug 2024',
      status: language === 'HI' ? 'आपत्ति अधीन (Sec 15)' : 'Under Objection (Sec 15)',
    },
    {
      id: 'GZ-2024-03',
      ref: 'S.O. 3410(E)',
      stretch: language === 'HI' ? 'रेवाड़ी फीडर लिंक • पैकेज 03 (Ch 54+800 से 88+200)' : 'Rewari Feeder Link • Package 03 (Ch 54+800 to 88+200)',
      district: language === 'HI' ? 'रेवाड़ी' : 'Rewari',
      section: language === 'HI' ? 'धारा 15 जन-सुनवाई समय-सारणी' : 'Section 15 Hearing Disposition Schedule',
      date: language === 'HI' ? '15 अग 2024' : '15 Aug 2024',
      status: language === 'HI' ? 'सुनवाई सक्रिय' : 'Hearing Active',
    },
    {
      id: 'GZ-2024-04',
      ref: 'S.O. 3105(E)',
      stretch: language === 'HI' ? 'पश्चिमी पेरिफेरल एक्सप्रेसवे कनेक्टर (स्पर बी)' : 'Western Peripheral Expressway Connector (Spur B)',
      district: language === 'HI' ? 'झज्जर' : 'Jhajjar',
      section: language === 'HI' ? 'धारा 26 बाजार मूल्य निर्धारण आदेश' : 'Section 26 Market Value Determination Order',
      date: language === 'HI' ? '08 जुला 2024' : '08 Jul 2024',
      status: language === 'HI' ? 'अधिसूचित' : 'Gazetted',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Official Government Header with Live Font Scaler, Language Toggle & Notifications */}
      <AppHeader />

      {/* Download Notification Toast */}
      {downloadToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#166534] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center space-x-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-300" />
          <span>{downloadToast}</span>
          <button onClick={() => setDownloadToast(null)} className="ml-2 text-white/80 hover:text-white cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Statutory Announcement Ticker */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs sm:text-sm text-amber-950 font-medium">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="font-extrabold uppercase tracking-wider bg-amber-200 text-amber-900 px-2.5 py-1 rounded-md text-xs shrink-0">
              {t('ticker.alert', 'Statutory Gazette Alert')}
            </span>
            <div className="truncate text-xs sm:text-sm font-semibold text-amber-950">
              {t('ticker.content', 'Declaration of Awards under Section 19 for NH-48 Greenfield Spur (Pkg 01 & 02) now gazetted • Direct Benefit Transfer (DBT) PFMS portal integration live • Online Section 15 objection submissions enabled for Rewari district.')}
            </div>
          </div>
          <Link 
            href="#gazette-notices" 
            className="hidden md:inline-flex items-center space-x-1 text-xs sm:text-sm font-extrabold text-amber-950 hover:underline shrink-0 ml-4"
          >
            <span>{t('ticker.view_all', 'View All Gazettes')}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <main className="flex-1">
        {/* HERO SECTION: Authentic Government Style with National Single Sign-On Gateway */}
        <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Mission, Act & Directives */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs sm:text-sm font-bold text-[#166534]">
                  <ShieldCheck className="h-4 w-4 text-[#166534]" />
                  <span>{t('hero.tag', 'RFCTLARR Act, 2013 Statutory Portal • MoRTH Digital Initiative')}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0F2E53] leading-tight">
                  {t('hero.title', 'Transparent, Cadastral GIS-Linked Land Acquisition for National Infrastructure')}
                </h1>

                <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-normal">
                  {t('hero.desc', 'BhuSetu unifies the entire statutory lifecycle under the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013. Connecting Project Implementing Agencies, District Collectors, Field Revenue Officers, and Affected Families with real-time cadastral verification and automated PFMS Direct Benefit Transfer.')}
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center space-x-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-[#0F2E53] hover:bg-[#0a203a] text-white text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <span>{t('hero.cta_login', 'Access Official Portal')}</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>

                  <a
                    href="#citizen-inquiry"
                    className="flex items-center justify-center space-x-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-[#166534] text-sm sm:text-base font-bold border-2 border-emerald-300 shadow-sm transition-all"
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-[#166534]" />
                    <span>{t('hero.cta_search', 'Track Land Parcel (Khasra)')}</span>
                  </a>

                  <a
                    href="#statutory-framework"
                    className="flex items-center justify-center space-x-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold border border-slate-300 transition-all"
                  >
                    <FileText className="h-4 w-4 text-slate-500" />
                    <span>{t('hero.cta_guidelines', 'RFCTLARR Guidelines')}</span>
                  </a>
                </div>

                {/* Core Statutory Trust Badges */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-6 text-sm text-slate-700 font-semibold">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-[#166534]" />
                    <span>{t('hero.badge_solatium', '100% Solatium Admissibility')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-[#166534]" />
                    <span>{t('hero.badge_pfms', 'PFMS DBT Direct Disbursal')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-[#166534]" />
                    <span>{t('hero.badge_gis', 'MapLibre Cadastral GIS Engine')}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: National Single Sign-On Gateway Card (NO DEMO ROLE SWITCH BUTTONS) */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                        {t('gateway.tag', 'Official National Gateway')}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        {t('gateway.secure_node', 'Secure NIC Node')}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#0F2E53] mt-1">
                      {t('gateway.title', 'National Single Sign-On Gateway')}
                    </h2>
                    <p className="text-sm text-slate-600 mt-0.5 font-medium">
                      {t('gateway.subtitle', 'Authorized Government Official & Citizen Identity Assurance System')}
                    </p>
                  </div>

                  {/* Official Authentication Channels Info */}
                  <div className="space-y-3.5">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center space-x-2.5 text-sm font-extrabold text-[#0F2E53]">
                        <Landmark className="h-5 w-5 text-[#166534]" />
                        <span>{t('gateway.officer_sso_title', 'Parichay Single Sign-On (SSO)')}</span>
                      </div>
                      <p className="text-xs text-slate-600 pl-7 leading-relaxed font-medium">
                        {t('gateway.officer_sso_desc', 'Cadre-based secure authentication for NHAI, MoRTH, District Collectors (CALA), and Revenue Tehsildars.')}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center space-x-2.5 text-sm font-extrabold text-[#0F2E53]">
                        <Smartphone className="h-5 w-5 text-amber-600" />
                        <span>{t('gateway.citizen_sso_title', 'Aadhaar e-KYC & Digilocker')}</span>
                      </div>
                      <p className="text-xs text-slate-600 pl-7 leading-relaxed font-medium">
                        {t('gateway.citizen_sso_desc', 'Direct OTP-based identity verification for landowners and affected families to track awards and DBT payments.')}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center space-x-2.5 text-sm font-extrabold text-[#0F2E53]">
                        <Lock className="h-5 w-5 text-indigo-700" />
                        <span>{t('gateway.audit_title', 'Statutory 256-Bit Audit Security')}</span>
                      </div>
                      <p className="text-xs text-slate-600 pl-7 leading-relaxed font-medium">
                        {t('gateway.audit_desc', 'Cryptographic compliance under Section 66 IT Act & RFCTLARR Act 2013 with digital signature verification.')}
                      </p>
                    </div>
                  </div>

                  {/* Single Authoritative Access Button to Login */}
                  <div className="pt-2">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center space-x-2.5 py-4 px-6 rounded-2xl bg-[#0F2E53] hover:bg-[#0a203a] text-white text-base font-black shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      <ShieldCheck className="h-5 w-5" />
                      <span>{t('gateway.btn_login', 'Sign In to Official Gateway')}</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NATIONAL TRANSPARENCY COUNTERS: High-Level Govt Stats (Large Typography) */}
        <section className="bg-white border-b border-slate-200 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 rounded-3xl bg-slate-50 border-2 border-slate-200">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  {t('stats.corridors_title', 'Corridors Under Acquisition')}
                </span>
                <span className="text-2xl sm:text-4xl font-black text-[#0F2E53] font-mono mt-1 block">
                  1,450.0 <span className="text-base font-sans font-bold text-slate-500">km</span>
                </span>
                <span className="text-xs sm:text-sm text-emerald-800 font-bold mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{t('stats.corridors_desc', 'Greenfield Expressways & Economic Corridors')}</span>
                </span>
              </div>

              <div className="p-4 sm:p-6 rounded-3xl bg-slate-50 border-2 border-slate-200">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  {t('stats.parcels_title', 'Cadastral Parcels Mapped')}
                </span>
                <span className="text-2xl sm:text-4xl font-black text-[#0F2E53] font-mono mt-1 block">
                  4,210 <span className="text-base font-sans font-bold text-slate-500">{language === 'HI' ? 'खसरे' : 'Plots'}</span>
                </span>
                <span className="text-xs sm:text-sm text-[#166534] font-bold mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#166534] shrink-0" />
                  <span>{t('stats.parcels_desc', 'ULPIN / Bhu-Aadhaar Geo-Referenced')}</span>
                </span>
              </div>

              <div className="p-4 sm:p-6 rounded-3xl bg-slate-50 border-2 border-slate-200">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  {t('stats.compensation_title', 'Direct Compensation Disbursed')}
                </span>
                <span className="text-2xl sm:text-4xl font-black text-[#166534] font-mono mt-1 block">
                  ₹ 318.2 <span className="text-base font-sans font-bold text-slate-500">{language === 'HI' ? 'करोड़' : 'Cr'}</span>
                </span>
                <span className="text-xs sm:text-sm text-slate-700 font-bold mt-2 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>{t('stats.compensation_desc', 'PFMS DBT Disbursed with 100% Solatium')}</span>
                </span>
              </div>

              <div className="p-4 sm:p-6 rounded-3xl bg-slate-50 border-2 border-slate-200">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  {t('stats.turnaround_title', 'Statutory Turnaround Days')}
                </span>
                <span className="text-2xl sm:text-4xl font-black text-[#0F2E53] font-mono mt-1 block">
                  148 <span className="text-base font-sans font-bold text-slate-500">{language === 'HI' ? 'दिवस' : 'Days'}</span>
                </span>
                <span className="text-xs sm:text-sm text-emerald-800 font-bold mt-2 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{t('stats.turnaround_desc', '52% below statutory timeline cap')}</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CITIZEN KHASRA INQUIRY WIDGET (BHU-KHOJ) */}
        <section id="citizen-inquiry" className="py-14 bg-slate-50 border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
              <span className="text-sm font-extrabold text-[#166534] uppercase tracking-wider bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-300">
                {t('khasra.section_tag', 'Citizen & Landowner Service Portal • Bhu-Khoj')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F2E53]">
                {t('khasra.title', 'Check Land Acquisition Status by Khasra / Survey Number')}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 font-medium">
                {t('khasra.desc', 'Landowners and co-sharers can inspect notification stages, joint survey records, solatium computations, and PFMS payment dispatch status without signing in.')}
              </p>
            </div>

            {/* Search Form Card */}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border-2 border-slate-200 p-6 sm:p-8">
              <form onSubmit={handleKhasraSearch} suppressHydrationWarning className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">{t('khasra.state_label', 'State')}</label>
                  <select
                    suppressHydrationWarning
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full text-sm font-bold bg-slate-50 border-2 border-slate-300 rounded-2xl px-3.5 py-3 text-slate-900 focus:bg-white focus:border-[#166534] focus:outline-none cursor-pointer"
                  >
                    <option value="Haryana">{language === 'HI' ? 'हरियाणा' : 'Haryana'}</option>
                    <option value="Rajasthan">{language === 'HI' ? 'राजस्थान' : 'Rajasthan'}</option>
                    <option value="Uttar Pradesh">{language === 'HI' ? 'उत्तर प्रदेश' : 'Uttar Pradesh'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">{t('khasra.district_label', 'District')}</label>
                  <select
                    suppressHydrationWarning
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full text-sm font-bold bg-slate-50 border-2 border-slate-300 rounded-2xl px-3.5 py-3 text-slate-900 focus:bg-white focus:border-[#166534] focus:outline-none cursor-pointer"
                  >
                    <option value="Gurugram">{language === 'HI' ? 'गुरुग्राम' : 'Gurugram'}</option>
                    <option value="Nuh">{language === 'HI' ? 'नूंह' : 'Nuh'}</option>
                    <option value="Rewari">{language === 'HI' ? 'रेवाड़ी' : 'Rewari'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">{t('khasra.tehsil_label', 'Tehsil')}</label>
                  <select
                    suppressHydrationWarning
                    value={selectedTehsil}
                    onChange={(e) => setSelectedTehsil(e.target.value)}
                    className="w-full text-sm font-bold bg-slate-50 border-2 border-slate-300 rounded-2xl px-3.5 py-3 text-slate-900 focus:bg-white focus:border-[#166534] focus:outline-none cursor-pointer"
                  >
                    <option value="Pataudi">{language === 'HI' ? 'पटौदी' : 'Pataudi'}</option>
                    <option value="Sohna">{language === 'HI' ? 'सोहना' : 'Sohna'}</option>
                    <option value="Manesar">{language === 'HI' ? 'मानेसर' : 'Manesar'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">{t('khasra.no_label', 'Khasra / Parcel No.')}</label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    value={khasraQuery}
                    onChange={(e) => setKhasraQuery(e.target.value)}
                    placeholder="204"
                    required
                    className="w-full text-base font-bold bg-slate-50 border-2 border-slate-300 rounded-2xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#166534] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <button
                    suppressHydrationWarning
                    type="submit"
                    disabled={isSearching}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-[#166534] hover:bg-[#12542a] text-white text-base font-extrabold shadow-md transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSearching ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        <span>{t('khasra.btn_search', 'Search Record')}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Instant Search Results: Visual BhuCard */}
              {searchResult && (
                <div className="mt-8 pt-8 border-t-2 border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-emerald-50/60 rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-[#166534] uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                            {searchResult.currentStage}
                          </span>
                          <span className="text-sm font-extrabold text-emerald-800">
                            {searchResult.solatiumPercentage}
                          </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-[#0F2E53] mt-2">
                          {language === 'HI' ? 'खसरा संख्या' : 'Khasra #'}{searchResult.khasraNo} • {language === 'HI' ? 'ग्राम' : 'Village'} {searchResult.village}, {searchResult.district}
                        </h3>
                      </div>

                      {/* Official Login Link to Authenticate and Claim Award (NO BYPASS BUTTON) */}
                      <Link
                        href="/login?tab=citizen"
                        className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#0F2E53] text-white text-sm sm:text-base font-extrabold hover:bg-[#0b213b] shadow-md transition-all self-start sm:self-auto cursor-pointer"
                      >
                        <UserCheck className="h-5 w-5" />
                        <span>{t('khasra.claim_award_btn', 'Authenticate with Aadhaar to Claim Award')}</span>
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-emerald-200 text-sm">
                      <div>
                        <span className="text-slate-500 font-medium block">{t('khasra.owner', 'Registered Landowner:')}</span>
                        <strong className="text-slate-900 font-bold block mt-1 text-base">{searchResult.ownerName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block">{t('khasra.acquired_area', 'Acquired / Total Area:')}</span>
                        <strong className="text-slate-900 font-mono font-bold block mt-1 text-base">{searchResult.acquiredAreaHa} Ha / {searchResult.totalAreaHa} Ha</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block">{t('khasra.award_amount', 'Total Award Amount:')}</span>
                        <strong className="text-emerald-800 font-mono font-black text-lg sm:text-xl block mt-1">{searchResult.totalAwardAmount}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block">{t('khasra.payment_status', 'Payment Status:')}</span>
                        <strong className="text-[#166534] font-bold block mt-1 text-base flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>{searchResult.statutoryStatus}</span>
                        </strong>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-600 gap-2 px-1">
                      <span>{t('khasra.gazette_ref', 'Gazette Ref:')} <strong className="font-mono text-slate-900">{searchResult.gazetteRef}</strong> ({searchResult.notificationDate})</span>
                      <span>{t('khasra.project', 'Project Corridor:')} <strong className="text-[#0F2E53]">{searchResult.projectCorridor}</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5 STAKEHOLDER PORTAL PILLARS */}
        <section id="stakeholder-modules" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
              <span className="text-xs font-extrabold text-[#0F2E53] uppercase tracking-wider bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
                {t('pillars.tag', 'Statutory Architecture & Designated Cadres')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F2E53]">
                {t('pillars.title', 'Five Administrative Pillars for National Land Governance')}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 font-medium">
                {t('pillars.desc', 'Designed according to statutory mandates specified in the RFCTLARR Act 2013 and National Highways Act 1956.')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Pillar 1: PIA */}
              <div className="rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between hover:border-emerald-500">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-[#166534] border-2 border-emerald-200 flex items-center justify-center mb-5 shadow-xs">
                    <Landmark className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-[#0F2E53]">
                    {t('pillars.pia_title', '1. Project Implementing Agency (PIA)')}
                  </h3>
                  <div className="text-xs font-bold text-[#166534] mt-1">
                    {t('pillars.pia_role', 'NHAI / MoRTH Project Directorate')}
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-medium">
                    {t('pillars.pia_desc', 'Operated by NHAI, State PWD, and Railway Authorities to design RoW corridors, overlay CAD/KML alignments, trigger Section 11 notices, and eliminate Right-of-Way bottlenecks.')}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-700 font-semibold">
                    <li className="flex items-center gap-2">• {language === 'HI' ? 'मैपलिब्रे वेक्टर कैडस्ट्रल पार्सल विज़ुअलाइज़र' : 'MapLibre vector cadastral parcel visualizer'}</li>
                    <li className="flex items-center gap-2">• {language === 'HI' ? 'चेनेज पैकेज एवं मील का पत्थर निगरानी' : 'Chainage package & milestone monitoring'}</li>
                    <li className="flex items-center gap-2">• {language === 'HI' ? 'स्वचालित केएमएल/शेपफाइल संरेखण विश्लेषण' : 'Automated KML/Shapefile corridor ingestion'}</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link 
                    href="/login?role=pia" 
                    className="inline-flex items-center space-x-2 text-sm sm:text-base font-extrabold text-[#166534] hover:underline cursor-pointer"
                  >
                    <span>{t('pillars.access_btn', 'Official Portal Access →')}</span>
                  </Link>
                </div>
              </div>

              {/* Pillar 2: CALA */}
              <div className="rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between hover:border-blue-500">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#0F2E53] border-2 border-blue-200 flex items-center justify-center mb-5 shadow-xs">
                    <Scale className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-[#0F2E53]">
                    {t('pillars.cala_title', '2. Competent Authority (CALA / Collector)')}
                  </h3>
                  <div className="text-xs font-bold text-[#0F2E53] mt-1">
                    {t('pillars.cala_role', 'District Collectorate & Land Acquisition Officer')}
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-medium">
                    {t('pillars.cala_desc', 'Quasi-judicial portal for District Collectors and SDMs to conduct Section 15 objection hearings, pronounce statutory Section 19 awards, and approve PFMS payment mandates.')}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-700 font-semibold">
                    <li className="flex items-center gap-2">• {language === 'HI' ? 'धारा 15 जन-सुनवाई एवं वाद सूची प्रबंधन' : 'Section 15 hearing docket management'}</li>
                    <li className="flex items-center gap-2">• {language === 'HI' ? '100% तोषण एवं मदवार मुआवजा अधिनिर्णय' : '100% Solatium & itemized award calculation'}</li>
                    <li className="flex items-center gap-2">• {language === 'HI' ? 'PFMS डिजिटल हस्ताक्षर कोषागार भुगतान' : 'PFMS e-Sign treasury authorization'}</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link 
                    href="/login?role=cala" 
                    className="inline-flex items-center space-x-2 text-sm sm:text-base font-extrabold text-[#0F2E53] hover:underline cursor-pointer"
                  >
                    <span>{t('pillars.access_btn', 'Official Portal Access →')}</span>
                  </Link>
                </div>
              </div>

              {/* Pillar 3: Field Revenue Officer */}
              <div className="rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between hover:border-teal-500">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-800 border-2 border-teal-200 flex items-center justify-center mb-5 shadow-xs">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-[#0F2E53]">
                    {t('pillars.ro_title', '3. Field Revenue Officer / Patwari')}
                  </h3>
                  <div className="text-xs font-bold text-teal-800 mt-1">
                    {t('pillars.ro_role', 'Tehsildar, Kanungo & Patwari Cadre')}
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-medium">
                    {t('pillars.ro_desc', 'Offline-first Progressive Web Application allowing field verification officers to inspect physical parcel boundaries, log tree and structural assets, and snap geotagged photos.')}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-700 font-semibold">
                    <li className="flex items-center gap-2">• {language === 'HI' ? 'ऑफलाइन जीपीएस जियो-टैग्ड भौतिक सत्यापन' : 'Offline GPS geo-tagged inspection queue'}</li>
                    <li className="flex items-center gap-2">• {language === 'HI' ? 'उद्यानिकी एवं संरचनात्मक परिसंपत्ति मूल्यांकन' : 'Horticultural & structural valuation ledger'}</li>
                    <li className="flex items-center gap-2">• {language === 'HI' ? 'संयुक्त स्थल पंचनामा एवं डिजिटल हस्ताक्षर' : 'Joint signature site verification'}</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link 
                    href="/login?role=revenue-officer" 
                    className="inline-flex items-center space-x-2 text-sm sm:text-base font-extrabold text-teal-800 hover:underline cursor-pointer"
                  >
                    <span>{t('pillars.access_btn', 'Official Portal Access →')}</span>
                  </Link>
                </div>
              </div>

              {/* Pillar 4: Citizen & PAF */}
              <div className="rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between hover:border-amber-500">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-800 border-2 border-amber-200 flex items-center justify-center mb-5 shadow-xs">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-[#0F2E53]">
                    {t('pillars.citizen_title', '4. Citizen & Landowner (PAF) Portal')}
                  </h3>
                  <div className="text-xs font-bold text-amber-800 mt-1">
                    {t('pillars.citizen_role', 'Affected Families & Titleholders')}
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-medium">
                    {t('pillars.citizen_desc', 'Dedicated mobile-responsive transparency portal for project-affected families to review solatium calculations, verify Aadhaar bank KYC, and lodge Section 64 dispute references.')}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-700 font-semibold">
                    <li className="flex items-center gap-2">• {language === 'HI' ? 'द्विभाषी (हिन्दी एवं अंग्रेजी) पाठ व वाक् समर्थन' : 'Bilingual Hindi/English & speech assistance'}</li>
                    <li className="flex items-center gap-2">• {language === 'HI' ? 'मदवार अवार्ड गणना एवं 100% तोषण विवरण' : 'Itemized award & solatium breakdown'}</li>
                    <li className="flex items-center gap-2">• {language === 'HI' ? 'PFMS DBT बैंक भुगतान स्थिति रीयल-टाइम ट्रैकिंग' : 'PFMS DBT payment status tracking'}</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link 
                    href="/login?tab=citizen" 
                    className="inline-flex items-center space-x-2 text-sm sm:text-base font-extrabold text-amber-800 hover:underline cursor-pointer"
                  >
                    <span>{t('pillars.access_btn', 'Official Portal Access →')}</span>
                  </Link>
                </div>
              </div>

              {/* Pillar 5: Central Authority */}
              <div className="rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between md:col-span-2 lg:col-span-2 hover:border-indigo-500">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-800 border-2 border-indigo-200 flex items-center justify-center mb-5 shadow-xs">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-[#0F2E53]">
                    {t('pillars.central_title', '5. Central Authority & Inter-Ministerial Apex Oversight')}
                  </h3>
                  <div className="text-xs font-bold text-indigo-800 mt-1">
                    {t('pillars.central_role', 'Ministry of Road Transport & Highways & PM GatiShakti')}
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-medium">
                    {t('pillars.central_desc', 'High-level executive dashboard for the Ministry of Road Transport & Highways, Cabinet Secretariat, and PM GatiShakti Apex Committee to audit national corridor velocity and statutory compliance.')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm text-slate-700 font-semibold">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">• {language === 'HI' ? 'अंतर-राज्यीय एसएलए अनुपालन विश्लेषिकी' : 'Inter-state SLA adherence analytics'}</li>
                      <li className="flex items-center gap-2">• {language === 'HI' ? '12-माह सांविधिक समयसीमा पूर्व-चेतावनी' : '12-Month statutory deadline warnings'}</li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">• {language === 'HI' ? 'वन एवं पर्यावरण स्वीकृतियों का अंतर-विभागीय समन्वय' : 'Cross-department forest/defense clearance tracking'}</li>
                      <li className="flex items-center gap-2">• {language === 'HI' ? 'राष्ट्रीय राजकोषीय निधि संवितरण लेखापरीक्षा' : 'National treasury fund release audits'}</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link 
                    href="/login?role=central" 
                    className="inline-flex items-center space-x-2 text-sm sm:text-base font-extrabold text-indigo-800 hover:underline cursor-pointer"
                  >
                    <span>{t('pillars.access_btn', 'Official Portal Access →')}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RECENT STATUTORY GAZETTE NOTICES */}
        <section id="gazette-notices" className="py-14 bg-slate-50 border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-extrabold text-[#166534] uppercase tracking-wider">
                  {t('gazette.tag', 'The Gazette of India • Extraordinary')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F2E53] mt-1">
                  {t('gazette.title', 'Recent Statutory Gazette Publications')}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  {t('gazette.desc', 'Public notifications published in the Gazette of India under Part II, Section 3, Sub-section (ii).')}
                </p>
              </div>

              <a
                href="https://egazette.gov.in"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white text-slate-800 hover:bg-slate-100 text-sm font-bold border-2 border-slate-300 shadow-xs transition-colors self-start cursor-pointer"
              >
                <ExternalLink className="h-4 w-4 text-slate-600" />
                <span>{language === 'HI' ? 'ई-राजपत्र अभिलेखागार' : 'eGazette Archives'}</span>
              </a>
            </div>

            {/* Gazette Table */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                    <th className="py-4 px-5">{t('gazette.col_ref', 'Gazette Reference')}</th>
                    <th className="py-4 px-5">{t('gazette.col_stretch', 'Corridor Stretch / Package')}</th>
                    <th className="py-4 px-5">{t('gazette.col_district', 'District')}</th>
                    <th className="py-4 px-5">{t('gazette.col_section', 'Statutory Act Section')}</th>
                    <th className="py-4 px-5">{t('gazette.col_date', 'Notification Date')}</th>
                    <th className="py-4 px-5 text-right">{t('gazette.col_action', 'Official Document')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {gazetteNotices.map((gz) => (
                    <tr key={gz.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-5 font-mono font-black text-[#0F2E53] text-sm sm:text-base">
                        {gz.ref}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-800">
                        {gz.stretch}
                      </td>
                      <td className="py-4 px-5 text-slate-700">
                        {gz.district}
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-extrabold text-[#166534] bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 text-xs sm:text-sm">
                          {gz.section}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-600 font-mono text-sm">
                        {gz.date}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedGazette(gz)}
                          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-[#166534] text-slate-800 font-bold text-xs sm:text-sm transition-colors border border-slate-300 cursor-pointer"
                        >
                          <Download className="h-4 w-4 text-[#166534]" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Gazette Preview Modal */}
        {selectedGazette && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-2 border-slate-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-[#0F2E53]">
                      {language === 'HI' ? 'भारत का राजपत्र' : 'The Gazette of India'}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">Reference: {selectedGazette.ref}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedGazette(null)} 
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3 text-sm text-slate-800">
                <p><strong>{language === 'HI' ? 'कॉरिडोर पैकेज:' : 'Corridor Package:'}</strong> {selectedGazette.stretch}</p>
                <p><strong>{language === 'HI' ? 'प्रशासनिक जिला:' : 'Administrative District:'}</strong> {selectedGazette.district}</p>
                <p><strong>{language === 'HI' ? 'सांविधिक धारा:' : 'Statutory Provision:'}</strong> {selectedGazette.section}</p>
                <p><strong>{language === 'HI' ? 'प्रकाशन तिथि:' : 'Publication Date:'}</strong> {selectedGazette.date}</p>
                <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-200">
                  {language === 'HI' 
                    ? 'भारत सरकार के ई-राजपत्र केंद्रीय भंडार से प्रमाणित डिजिटल प्रतिलिपि।'
                    : 'Certified digital reproduction authenticated via Government of India e-Gazette repository.'}
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGazette(null)}
                  className="px-5 py-2.5 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 text-sm cursor-pointer"
                >
                  {language === 'HI' ? 'बंद करें' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleTriggerDownload(selectedGazette.ref);
                    setSelectedGazette(null);
                  }}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-[#166534] hover:bg-[#12542a] text-white text-sm font-bold shadow-md cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>{language === 'HI' ? 'राजपत्र पीडीएफ डाउनलोड करें' : 'Download Gazette PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATUTORY ACTS & COMPLIANCE FRAMEWORK */}
        <section id="statutory-framework" className="py-14 bg-white border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-extrabold text-[#0F2E53] uppercase tracking-wider">
                {t('legal.tag', 'Statutory Architecture')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F2E53] mt-1">
                {t('legal.title', 'Legal & Statutory Compliance Framework')}
              </h2>
              <p className="text-base text-slate-600 font-medium mt-1">
                {language === 'HI'
                  ? 'भूसेतु संसद द्वारा पारित कानूनी उपबंधों और समयसीमाओं के पूर्ण अनुपालन हेतु अभिकल्पित है।'
                  : 'BhuSetu is coded strictly to enforce statutory checks and timelines mandated by Parliament.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200">
                <div className="text-xs font-black text-[#166534] uppercase tracking-wider mb-2">
                  RFCTLARR Act, 2013
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0F2E53]">
                  {language === 'HI' ? 'उचित प्रतिकर का अधिकार (2013 का अधिनियम 30)' : 'Right to Fair Compensation (Act 30 of 2013)'}
                </h3>
                <p className="text-sm text-slate-600 mt-2.5 leading-relaxed font-medium">
                  {language === 'HI'
                    ? '100% अनिवार्य तोषण (Solatium), धारा 11 अधिसूचना से अवार्ड दिनांक तक 12% अतिरिक्त ब्याज तथा धारा 11 से धारा 19 के मध्य 12-माह की अनिवार्य सांविधिक समयसीमा।'
                    : 'Mandatory 100% Solatium, 12% additional interest per annum from Section 11 notice to award date, and statutory 12-month limit between Sec 11 and Sec 19.'}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200">
                <div className="text-xs font-black text-[#0F2E53] uppercase tracking-wider mb-2">
                  NH Act, 1956
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0F2E53]">
                  {language === 'HI' ? 'राष्ट्रीय राजमार्ग अधिनियम (धारा 3A से 3G)' : 'National Highways Act (Sections 3A to 3G)'}
                </h3>
                <p className="text-sm text-slate-600 mt-2.5 leading-relaxed font-medium">
                  {language === 'HI'
                    ? 'राष्ट्रीय अवसंरचना हेतु त्वरित अधिग्रहण ढांचा, सक्षम प्राधिकारी (CALA) की सांविधिक नियुक्ति, भूमि में प्रवेश का अधिकार तथा बाजार मूल्य निर्धारण प्रक्रिया।'
                    : 'Fast-track acquisition framework for national infrastructure with statutory appointment of CALA, power to enter land, and determination of market value.'}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200">
                <div className="text-xs font-black text-amber-700 uppercase tracking-wider mb-2">
                  DILRMP & PFMS
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0F2E53]">
                  {language === 'HI' ? 'डिजिटल भू-अभिलेख एवं प्रत्यक्ष लाभ अंतरण' : 'Digital Land Records & Direct Benefit Transfer'}
                </h3>
                <p className="text-sm text-slate-600 mt-2.5 leading-relaxed font-medium">
                  {language === 'HI'
                    ? 'राज्य राजस्व अभिलेखों (भू-नक्शा / भूलेखा) के साथ रीयल-टाइम समन्वय तथा प्रमाणित बैंक खातों में बिना किसी मध्यस्थ के शून्य-रिसाव प्रत्यक्ष मुआवजा अंतरण।'
                    : 'Real-time synchronization with state land revenue records (Bhoomi / Bhulekh) and zero-leakage Direct Benefit Transfer compensation directly to verified bank accounts.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* GIGW-COMPLIANT STANDARD GOVERNMENT FOOTER */}
      <footer className="bg-[#0b213b] text-slate-300 text-sm border-t-4 border-[#166534]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Ministry Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5">
                <Layers className="h-6 w-6 text-emerald-400" />
                <span className="font-extrabold text-base text-white">BhuSetu भूसेतु</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {t('footer.portal_desc', 'National Land Acquisition & Management System administered under the RFCTLARR Act, 2013.')}
              </p>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">
                <p className="font-bold text-slate-200">{t('footer.gov_heading', 'Ministry of Road Transport & Highways, Government of India')}</p>
                <p>{language === 'HI' ? 'परिवहन भवन, 1, संसद मार्ग' : 'Transport Bhawan, 1, Parliament Street'}</p>
                <p>{language === 'HI' ? 'नई दिल्ली - 110001, भारत' : 'New Delhi - 110001, India'}</p>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-3">
                {t('footer.links_heading', 'Important Portals')}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
                <li><a href="https://morth.nic.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">{language === 'HI' ? 'सड़क परिवहन एवं राजमार्ग मंत्रालय' : 'Ministry of Road Transport & Highways'}</a></li>
                <li><a href="https://nhai.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">{language === 'HI' ? 'भारतीय राष्ट्रीय राजमार्ग प्राधिकरण' : 'National Highways Authority of India'}</a></li>
                <li><a href="https://dolr.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">{language === 'HI' ? 'भूमि संसाधन विभाग (DoLR)' : 'Department of Land Resources (DoLR)'}</a></li>
                <li><a href="https://pfms.nic.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">{language === 'HI' ? 'सार्वजनिक वित्तीय प्रबंधन प्रणाली (PFMS)' : 'Public Financial Management System (PFMS)'}</a></li>
                <li><a href="https://egazette.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">{language === 'HI' ? 'भारत का ई-राजपत्र (eGazette)' : 'The Gazette of India (eGazette)'}</a></li>
              </ul>
            </div>

            {/* Column 3: Website Policies */}
            <div>
              <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-3">
                {t('footer.compliance_heading', 'Website Policies (GIGW)')}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
                <li><span className="hover:text-white cursor-pointer transition-colors">{language === 'HI' ? 'नियम एवं शर्तें' : 'Terms & Conditions'}</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">{language === 'HI' ? 'गोपनीयता नीति' : 'Privacy Policy'}</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">{language === 'HI' ? 'कॉपीराइट नीति' : 'Copyright Policy'}</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">{language === 'HI' ? 'हाइपरलिंकिंग नीति' : 'Hyperlinking Policy'}</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">{language === 'HI' ? 'वेब सूचना प्रबंधक' : 'Web Information Manager'}</span></li>
              </ul>
            </div>

            {/* Column 4: Helpdesk & Security */}
            <div>
              <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-3">
                {t('footer.helpdesk_heading', 'Statutory Helpdesk')}
              </h4>
              <div className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
                <p>{language === 'HI' ? 'टोल-फ्री हेल्पलाइन:' : 'Toll Free Helpline:'} <strong className="text-white font-mono">1800-11-9922</strong></p>
                <p>{language === 'HI' ? 'अधिकारी सहायता:' : 'Officer Helpdesk:'} <strong className="text-slate-200">bhusetu-support@nic.in</strong></p>
                <p>{language === 'HI' ? 'नागरिक शिकायत:' : 'Citizen Grievance:'} <strong className="text-slate-200">CPGRAMS Integrated</strong></p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-slate-800 text-emerald-400 rounded-lg text-xs font-mono font-bold border border-slate-700">
                    {language === 'HI' ? 'आगंतुक संख्या:' : 'Visitor Count:'} 1,482,910
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Compliance & Hosting Line */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              {t('footer.disclaimer', 'Website Content Managed by Ministry of Road Transport and Highways, Government of India. Designed, developed and hosted by National Informatics Centre (NIC).')}
            </p>
            <div className="flex items-center space-x-3 text-slate-400 text-xs">
              <span>{language === 'HI' ? 'अंतिम अद्यतन: 04 सितंबर 2026' : 'Last Updated: 04 Sep 2026'}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">W3C WAI-AA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

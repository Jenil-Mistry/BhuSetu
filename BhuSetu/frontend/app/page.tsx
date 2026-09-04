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
  HelpCircle
} from 'lucide-react';

export default function GovernmentLandingPage() {
  // Citizen Khasra Inquiry State
  const [selectedState, setSelectedState] = useState('Haryana');
  const [selectedDistrict, setSelectedDistrict] = useState('Gurugram');
  const [selectedTehsil, setSelectedTehsil] = useState('Pataudi');
  const [selectedVillage, setSelectedVillage] = useState('Fazilpur');
  const [khasraQuery, setKhasraQuery] = useState('204');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);

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
        ownerName: 'Ramesh Chandra Yadav & 3 Co-sharers',
        totalAreaHa: 1.15,
        acquiredAreaHa: 0.85,
        projectCorridor: 'NH-48 Greenfield Spur (Chainage 8+150)',
        currentStage: 'Award Declared (Sec 19 Published)',
        statutoryStatus: 'PFMS DBT Payment Initiated',
        totalAwardAmount: '₹ 38,50,000',
        solatiumPercentage: '100% Solatium Applied',
        gazetteRef: 'CG-DL-E-18092024-254192',
        notificationDate: '18 Aug 2024',
        hearingDate: 'Disposed on 14 Dec 2024',
      });
    }, 450);
  };

  const gazetteNotices = [
    {
      id: 'GZ-2024-01',
      ref: 'S.O. 4192(E)',
      stretch: 'NH-48 Greenfield Spur • Package 01 (Ch 0+000 to 26+400)',
      district: 'Gurugram',
      section: 'Section 19 Declaration (Final Award)',
      date: '02 Sep 2024',
      status: 'Published',
    },
    {
      id: 'GZ-2024-02',
      ref: 'S.O. 3918(E)',
      stretch: 'NH-48 Greenfield Spur • Package 02 (Ch 26+400 to 54+800)',
      district: 'Nuh',
      section: 'Section 11 Preliminary Notification',
      date: '28 Aug 2024',
      status: 'Under Objection (Sec 15)',
    },
    {
      id: 'GZ-2024-03',
      ref: 'S.O. 3410(E)',
      stretch: 'Rewari Feeder Link • Package 03 (Ch 54+800 to 88+200)',
      district: 'Rewari',
      section: 'Section 15 Hearing Disposition Schedule',
      date: '15 Aug 2024',
      status: 'Hearing Active',
    },
    {
      id: 'GZ-2024-04',
      ref: 'S.O. 3105(E)',
      stretch: 'Western Peripheral Expressway Connector (Spur B)',
      district: 'Jhajjar',
      section: 'Section 26 Market Value Determination Order',
      date: '08 Jul 2024',
      status: 'Gazetted',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Official Government Header */}
      <AppHeader />

      {/* Statutory Announcement Ticker */}
      <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-950">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-hidden">
            <span className="font-bold uppercase tracking-wider bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded text-[10px] shrink-0">
              Statutory Gazette Alert
            </span>
            <div className="truncate text-[11px] font-medium text-amber-900">
              Declaration of Awards under Section 19 for NH-48 Greenfield Spur (Pkg 01 & 02) now gazetted • Direct Benefit Transfer (DBT) PFMS portal integration live • Online Section 15 objection submissions enabled for Rewari district.
            </div>
          </div>
          <Link 
            href="#gazette-notices" 
            className="hidden md:inline-flex items-center space-x-1 text-xs font-bold text-amber-900 hover:text-amber-950 shrink-0 ml-4 hover:underline"
          >
            <span>View All Gazettes</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <main className="flex-1">
        {/* HERO SECTION: Authentic Government Style */}
        <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Mission, Act & Directives */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#166534]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#166534]" />
                  <span>RFCTLARR Act, 2013 Statutory Portal • MoRTH Digital Initiative</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F2E53] leading-tight">
                  Transparent, Cadastral GIS-Linked Land Acquisition for National Infrastructure
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                  BhuSetu (<span className="text-[#166534] font-bold">भूसेतु</span>) unifies the entire statutory lifecycle under the 
                  <em> Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013</em>. 
                  Connecting Project Implementing Agencies, District Collectors, Field Revenue Officers, and Affected Families with real-time cadastral verification and automated PFMS Direct Benefit Transfer.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#0F2E53] hover:bg-[#0a203a] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <span>Access Official Portal (Login)</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href="#citizen-inquiry"
                    className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 shadow-xs transition-all"
                  >
                    <Search className="h-4 w-4 text-[#166534]" />
                    <span>Track Land Parcel (Khasra Inquiry)</span>
                  </a>

                  <a
                    href="#statutory-framework"
                    className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                  >
                    <FileText className="h-4 w-4 text-slate-500" />
                    <span>RFCTLARR Act Guidelines</span>
                  </a>
                </div>

                {/* Core Statutory Trust Badges */}
                <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#166534]" />
                    <span>100% Solatium Admissibility</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#166534]" />
                    <span>PFMS DBT Direct Disbursal</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#166534]" />
                    <span>MapLibre Cadastral GIS Engine</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Official Gateway & Role Access Card */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-7 space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Official Gateway
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Secure NIC Node
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-[#0F2E53] mt-1">
                      Statutory Role Portals
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select your designated administrative capacity to enter your secure console.
                    </p>
                  </div>

                  {/* Role Entry Grid */}
                  <div className="space-y-2.5">
                    <Link
                      href="/login"
                      className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-[#166534] transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-lg bg-emerald-100/60 text-[#166534] flex items-center justify-center font-bold">
                          <Landmark className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F2E53] group-hover:text-[#166534]">
                            PIA Executive Console
                          </div>
                          <div className="text-[11px] text-slate-500">
                            NHAI & MoRTH Project Alignment & RoW
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#166534]" />
                    </Link>

                    <Link
                      href="/login"
                      className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-[#0F2E53] transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-lg bg-blue-100/60 text-[#0F2E53] flex items-center justify-center font-bold">
                          <Scale className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F2E53]">
                            CALA / District Collectorate
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Sec 15 Hearings, Awards & DBT Mandates
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0F2E53]" />
                    </Link>

                    <Link
                      href="/login"
                      className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-emerald-600 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-lg bg-teal-100/60 text-teal-800 flex items-center justify-center font-bold">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F2E53]">
                            Field Revenue Officer / Patwari
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Geo-Tagged Boundary & Tree/Crop Survey
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-700" />
                    </Link>

                    <Link
                      href="/login"
                      className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-amber-600 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-lg bg-amber-100/60 text-amber-800 flex items-center justify-center font-bold">
                          <UserCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F2E53]">
                            Citizen & Affected Family (PAF)
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Aadhaar Login, Solatium Sheet & KYC
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-amber-700" />
                    </Link>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#0F2E53] hover:bg-[#0a203a] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>Proceed to Official Login Gate</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NATIONAL TRANSPARENCY COUNTERS: High-Level Govt Stats */}
        <section className="bg-white border-b border-slate-200 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Corridors Under Acquisition
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E53] font-mono mt-1 block">
                  1,450.0 <span className="text-sm font-sans font-semibold text-slate-500">km</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>12 National Highway Spurs</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Cadastral Parcels Mapped
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E53] font-mono mt-1 block">
                  4,210 <span className="text-sm font-sans font-semibold text-slate-500">Parcels</span>
                </span>
                <span className="text-[11px] text-[#166534] font-medium mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>DILRMP PostGIS Synchronized</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Direct Compensation Disbursed
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#166534] font-mono mt-1 block">
                  ₹ 318.2 <span className="text-sm font-sans font-semibold text-slate-500">Cr</span>
                </span>
                <span className="text-[11px] text-slate-600 font-medium mt-1 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>2,618 PAF Bank Accounts Credited</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Statutory Turnaround Days
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E53] font-mono mt-1 block">
                  148 <span className="text-sm font-sans font-semibold text-slate-500">Days Avg</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>58% below 365-day statutory cap</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CITIZEN KHASRA INQUIRY WIDGET */}
        <section id="citizen-inquiry" className="py-12 bg-slate-50 border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-2 mb-8">
              <span className="text-xs font-bold text-[#166534] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Citizen Transparency Service
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2E53]">
                Check Land Acquisition Status by Khasra / Survey Number
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Landowners and co-sharers can inspect notification stages, joint survey records, solatium computations, and PFMS payment dispatch status without signing in.
              </p>
            </div>

            {/* Search Form Card */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <form onSubmit={handleKhasraSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:border-[#166534] focus:outline-none"
                  >
                    <option value="Haryana">Haryana</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:border-[#166534] focus:outline-none"
                  >
                    <option value="Gurugram">Gurugram</option>
                    <option value="Nuh">Nuh</option>
                    <option value="Rewari">Rewari</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tehsil / Sub-Div</label>
                  <select
                    value={selectedTehsil}
                    onChange={(e) => setSelectedTehsil(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:border-[#166534] focus:outline-none"
                  >
                    <option value="Pataudi">Pataudi</option>
                    <option value="Sohna">Sohna</option>
                    <option value="Manesar">Manesar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khasra / Parcel No.</label>
                  <input
                    type="text"
                    value={khasraQuery}
                    onChange={(e) => setKhasraQuery(e.target.value)}
                    placeholder="e.g. 204"
                    required
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:border-[#166534] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#166534] hover:bg-[#12542a] text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSearching ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        <span>Search Record</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Instant Search Results Box */}
              {searchResult && (
                <div className="mt-6 pt-6 border-t border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Statutory Land Record Result:
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {searchResult.currentStage}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0F2E53] mt-1">
                        Khasra No. {searchResult.khasraNo} • Village {searchResult.village}, {searchResult.district}
                      </h3>
                    </div>

                    <Link
                      href="/login"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0F2E53] text-white text-xs font-bold hover:bg-[#0b213b] transition-colors self-start"
                    >
                      <span>Login with Aadhaar to Claim / Update KYC</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 block">Identified Titleholder(s):</span>
                      <strong className="text-slate-800 font-medium block mt-0.5">{searchResult.ownerName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Acquired / Total Area:</span>
                      <strong className="text-slate-800 font-mono block mt-0.5">{searchResult.acquiredAreaHa} Ha / {searchResult.totalAreaHa} Ha</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Determined Total Award:</span>
                      <strong className="text-emerald-700 font-mono font-bold text-sm block mt-0.5">{searchResult.totalAwardAmount}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Statutory Payment:</span>
                      <strong className="text-slate-800 font-medium block mt-0.5">{searchResult.statutoryStatus}</strong>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-500 px-1">
                    <span>Gazette Ref: <strong className="font-mono text-slate-700">{searchResult.gazetteRef}</strong> ({searchResult.notificationDate})</span>
                    <span>Corridor: <strong className="text-[#0F2E53]">{searchResult.projectCorridor}</strong></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5 STAKEHOLDER PORTAL PILLARS */}
        <section id="stakeholder-modules" className="py-14 bg-white border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-2 mb-10">
              <span className="text-xs font-bold text-[#0F2E53] uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                End-to-End Governance Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2E53]">
                Specialized Administrative Pillars for Every Stakeholder
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Designed according to statutory mandates specified in the RFCTLARR Act 2013 and National Highways Act 1956.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: PIA */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-[#166534] border border-emerald-100 flex items-center justify-center mb-4">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F2E53]">
                    1. Project Implementing Agency (PIA)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Operated by NHAI, State PWD, and Railway Authorities to design RoW corridors, overlay CAD/KML alignments, trigger Section 11 notices, and eliminate Right-of-Way bottlenecks.
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">• MapLibre vector cadastral parcel visualizer</li>
                    <li className="flex items-center gap-1.5">• Chainage package & milestone monitoring</li>
                    <li className="flex items-center gap-1.5">• Automated KML/Shapefile corridor ingestion</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link href="/login" className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#166534] hover:underline">
                    <span>Enter PIA Portal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 2: CALA */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#0F2E53] border border-blue-100 flex items-center justify-center mb-4">
                    <Scale className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F2E53]">
                    2. Competent Authority (CALA / Collector)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Quasi-judicial portal for District Collectors and SDMs to conduct Section 15 objection hearings, pronounce statutory Section 19 awards, and approve PFMS payment mandates.
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">• Section 15 hearing docket management</li>
                    <li className="flex items-center gap-1.5">• 100% Solatium & itemized award calculation</li>
                    <li className="flex items-center gap-1.5">• PFMS e-Sign treasury authorization</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link href="/login" className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0F2E53] hover:underline">
                    <span>Enter CALA Portal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Field Revenue Officer */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-100 flex items-center justify-center mb-4">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F2E53]">
                    3. Field Revenue Officer / Patwari
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Offline-first Progressive Web Application (PWA) allowing field verification officers to inspect physical parcel boundaries, log tree and structural assets, and snap geotagged photos.
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">• Offline GPS geo-tagged inspection queue</li>
                    <li className="flex items-center gap-1.5">• Horticultural & structural valuation ledger</li>
                    <li className="flex items-center gap-1.5">• Joint signature biometric verification</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link href="/login" className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-800 hover:underline">
                    <span>Enter Field Officer Console</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 4: Citizen & PAF */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-100 flex items-center justify-center mb-4">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F2E53]">
                    4. Citizen & Landowner (PAF) Portal
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Dedicated mobile-responsive transparency portal for project-affected families to review solatium calculations, verify Aadhaar bank KYC, and lodge Section 64 dispute references.
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">• Bhashini multilingual translation support</li>
                    <li className="flex items-center gap-1.5">• Itemized award & solatium breakdown</li>
                    <li className="flex items-center gap-1.5">• PFMS DBT payment status tracking</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link href="/login" className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-800 hover:underline">
                    <span>Enter Citizen Portal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 5: Central Authority */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between md:col-span-2 lg:col-span-2">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-100 flex items-center justify-center mb-4">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F2E53]">
                    5. Central Authority & Inter-Ministerial Apex Oversight
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    High-level executive dashboard for the Ministry of Road Transport & Highways, Cabinet Secretariat, and PM GatiShakti Apex Committee to audit national corridor velocity and statutory compliance.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs text-slate-600">
                    <ul className="space-y-1.5">
                      <li className="flex items-center gap-1.5">• Inter-state SLA adherence analytics</li>
                      <li className="flex items-center gap-1.5">• 12-Month statutory deadline warnings</li>
                    </ul>
                    <ul className="space-y-1.5">
                      <li className="flex items-center gap-1.5">• Cross-department forest/defense clearance tracking</li>
                      <li className="flex items-center gap-1.5">• National treasury fund release audits</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link href="/login" className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-800 hover:underline">
                    <span>Enter Central Authority Console</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RECENT STATUTORY GAZETTE NOTICES */}
        <section id="gazette-notices" className="py-12 bg-slate-50 border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-[#166534] uppercase tracking-wider">
                  The Gazette of India • Extraordinary
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-[#0F2E53] mt-0.5">
                  Recent Statutory Gazette Publications
                </h2>
                <p className="text-xs text-slate-500">
                  Public notifications published in the Gazette of India under Part II, Section 3, Sub-section (ii).
                </p>
              </div>

              <button
                onClick={() => alert('Opening National Gazette of India e-Repository (egazette.nic.in)...')}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold border border-slate-300 shadow-xs transition-colors self-start"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                <span>eGazette Archives</span>
              </button>
            </div>

            {/* Gazette Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">Gazette Reference</th>
                    <th className="py-3 px-4">Corridor Stretch / Package</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4">Statutory Act Section</th>
                    <th className="py-3 px-4">Notification Date</th>
                    <th className="py-3 px-4 text-right">Official Document</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gazetteNotices.map((gz) => (
                    <tr key={gz.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0F2E53]">
                        {gz.ref}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {gz.stretch}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {gz.district}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#166534] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {gz.section}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {gz.date}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => alert(`Downloading Gazette ${gz.ref} (PDF)...`)}
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                        >
                          <Download className="h-3 w-3 text-slate-500" />
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

        {/* STATUTORY ACTS & COMPLIANCE FRAMEWORK */}
        <section id="statutory-framework" className="py-12 bg-white border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-bold text-[#0F2E53] uppercase tracking-wider">
                Statutory Architecture
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-[#0F2E53] mt-0.5">
                Legal & Statutory Compliance Framework
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                BhuSetu is coded strictly to enforce statutory checks and timelines mandated by Parliament.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-[#166534] uppercase tracking-wider mb-1">
                  RFCTLARR Act, 2013
                </div>
                <h3 className="text-sm font-bold text-[#0F2E53]">
                  Right to Fair Compensation (Act 30 of 2013)
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Mandatory 100% Solatium, 12% additional interest per annum from Section 11 notice to award date, and statutory 12-month limit between Sec 11 and Sec 19.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-[#0F2E53] uppercase tracking-wider mb-1">
                  NH Act, 1956
                </div>
                <h3 className="text-sm font-bold text-[#0F2E53]">
                  National Highways Act (Sections 3A to 3G)
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Fast-track acquisition framework for national infrastructure with statutory appointment of CALA, power to enter land, and determination of market value.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                  DILRMP & PFMS
                </div>
                <h3 className="text-sm font-bold text-[#0F2E53]">
                  Digital Land Records & Direct Benefit Transfer
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Real-time synchronization with state land revenue records (Bhoomi / Bhulekh) and zero-leakage Direct Benefit Transfer compensation directly to verified bank accounts.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* GIGW-COMPLIANT STANDARD GOVERNMENT FOOTER */}
      <footer className="bg-[#0b213b] text-slate-300 text-xs border-t-4 border-[#166534]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Ministry Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-sm text-white">BhuSetu भूसेतु</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                National Land Acquisition & Management System administered under the RFCTLARR Act, 2013.
              </p>
              <div className="text-[11px] text-slate-400">
                <p className="font-semibold text-slate-200">Ministry of Road Transport & Highways</p>
                <p>Transport Bhawan, 1, Parliament Street</p>
                <p>New Delhi - 110001, India</p>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                Important Portals
              </h4>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li><a href="https://morth.nic.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Ministry of Road Transport & Highways</a></li>
                <li><a href="https://nhai.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">National Highways Authority of India</a></li>
                <li><a href="https://dolr.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Department of Land Resources (DoLR)</a></li>
                <li><a href="https://pfms.nic.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Public Financial Management System (PFMS)</a></li>
                <li><a href="https://egazette.nic.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">The Gazette of India (eGazette)</a></li>
              </ul>
            </div>

            {/* Column 3: Website Policies */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                Website Policies (GIGW)
              </h4>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Terms of Use compliant with GIGW 3.0 standards.'); }} className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: All Aadhaar and personal data protected per IT Act.'); }} className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Copyright Policy: Content owned by MoRTH, Government of India.'); }} className="hover:text-white transition-colors">Copyright Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Hyperlinking Policy: Permission required for external framing.'); }} className="hover:text-white transition-colors">Hyperlinking Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Web Information Manager: Joint Secretary, MoRTH.'); }} className="hover:text-white transition-colors">Web Information Manager</a></li>
              </ul>
            </div>

            {/* Column 4: Helpdesk & Security */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                Statutory Helpdesk
              </h4>
              <div className="space-y-2 text-[11px] text-slate-400">
                <p>Toll Free Helpline: <strong className="text-white font-mono">1800-11-9922</strong></p>
                <p>Officer Helpdesk: <strong className="text-slate-200">bhusetu-support@nic.in</strong></p>
                <p>Citizen Grievance: <strong className="text-slate-200">CPGRAMS Integrated</strong></p>
                <div className="pt-2">
                  <span className="inline-block px-2 py-1 bg-slate-800 text-emerald-400 rounded text-[10px] font-mono border border-slate-700">
                    Visitor Count: 1,482,910
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Compliance & Hosting Line */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              Website Content Managed by <strong>Ministry of Road Transport and Highways, Government of India</strong>. Designed, developed and hosted by <strong>National Informatics Centre (NIC)</strong>.
            </p>
            <div className="flex items-center space-x-3 text-slate-400 text-[10px]">
              <span>Last Updated: 04 Sep 2026</span>
              <span>•</span>
              <span>W3C WAI-AA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

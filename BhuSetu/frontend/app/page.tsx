import React from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/app-header';
import { 
  Building2, 
  MapPin, 
  Layers, 
  ShieldCheck, 
  Scale, 
  UserCheck, 
  Landmark,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  Compass,
  CreditCard,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/site-config';

export default function GovernmentLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Official Government Header */}
      <AppHeader />

      <main className="flex-1">
        {/* HERO SECTION: Concise, Authoritative & Accessible */}
        <section className="bg-gradient-to-b from-white via-slate-50/50 to-slate-100/60 border-b border-slate-200/80 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Clear Value Proposition */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#166534]">
                  <ShieldCheck className="h-4 w-4 text-[#166534]" />
                  <span>RFCTLARR Act, 2013 Statutory Platform</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F2E53] leading-tight">
                  Transparent, Cadastral GIS-Linked Land Acquisition
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                  BhuSetu (<span className="text-[#166534] font-bold">भूसेतु</span>) unifies the statutory land acquisition lifecycle under the <em>RFCTLARR Act, 2013</em>. Connecting project authorities, revenue officers, and affected families with verified milestone tracking and transparent compensation records.
                </p>

                {/* Primary Audience-Specific Actions (Point 5.3) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <Link
                    href="/login?type=citizen"
                    className="flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-[#166534] hover:bg-[#12542a] text-white text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Citizen / Landowner Login</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/login?type=authority"
                    className="flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-[#0F2E53] hover:bg-[#0a203a] text-white text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <Landmark className="h-4 w-4" />
                    <span>Authority / Department Login</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Restrained Trust Indicators */}
                <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-[#166534]" />
                    <span>Statutory RFCTLARR Compliance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-[#166534]" />
                    <span>Cadastral GIS Verification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-[#166534]" />
                    <span>PFMS DBT Disbursement Tracking</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Platform Overview & Quick Gateway Card */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-7 space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534]">
                        Official Access
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Demonstration Gateway
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-[#0F2E53] mt-1">
                      Choose Your Designated Workspace
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select your designated role to enter the appropriate secure console.
                    </p>
                  </div>

                  {/* Dual Audience Choice Cards */}
                  <div className="space-y-3">
                    <Link
                      href="/login?type=citizen"
                      className="group block p-4 rounded-xl border border-slate-200 bg-emerald-50/30 hover:bg-emerald-50/70 hover:border-emerald-300 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2.5">
                          <div className="h-8 w-8 rounded-lg bg-emerald-100 text-[#166534] flex items-center justify-center font-bold">
                            <UserCheck className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F2E53] group-hover:text-[#166534]">
                              Citizen & Affected Family Portal
                            </span>
                            <span className="block text-[11px] text-slate-500">
                              Track parcel status, solatium sheets & compensation
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#166534] transition-colors" />
                      </div>
                    </Link>

                    <Link
                      href="/login?type=authority"
                      className="group block p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-[#0F2E53] transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2.5">
                          <div className="h-8 w-8 rounded-lg bg-blue-100/60 text-[#0F2E53] flex items-center justify-center font-bold">
                            <Landmark className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F2E53]">
                              Official & Authority Workspace
                            </span>
                            <span className="block text-[11px] text-slate-500">
                              PIA, CALA / Collector, Revenue Officers & Apex Oversight
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0F2E53] transition-colors" />
                      </div>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Authorized GoI Demonstration</span>
                    <Link href="#statutory-process" className="text-[#166534] font-semibold hover:underline">
                      View Statutory Stages ↓
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: HOW BHUSETU WORKS (Capabilities - Point 5.9) */}
        <section id="capabilities" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-2 mb-12">
              <span className="text-xs font-bold text-[#166534] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Platform Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2E53]">
                How BhuSetu Supports the Acquisition Process
              </h2>
              <p className="text-sm text-slate-600">
                Designed to provide transparent, verifiable lifecycle management for statutory land acquisition projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Capability Card 1 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-[#0F2E53] border border-blue-100 flex items-center justify-center mb-5">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F2E53]">
                    Workflow Visibility & Milestone Tracking
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    Tracks proposals, stakeholder reviews, statutory deadlines, and gazette publication stages across Section 11, Section 15, and Section 19.
                  </p>
                  <ul className="mt-5 space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#166534] shrink-0" />
                      <span>Section 15 objection hearing docket tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#166534] shrink-0" />
                      <span>Statutory 12-month timeline monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#166534] shrink-0" />
                      <span>Inter-departmental proposal review trails</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <Link href="/login?type=authority" className="inline-flex items-center space-x-1 text-xs font-bold text-[#0F2E53] hover:underline">
                    <span>Explore Official Console</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Capability Card 2 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 text-[#166534] border border-emerald-100 flex items-center justify-center mb-5">
                    <Compass className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F2E53]">
                    GIS-Assisted Spatial Verification
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    Connects infrastructure project alignments with cadastral parcel boundaries, satellite overlays, and ground verification evidence.
                  </p>
                  <ul className="mt-5 space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#166534] shrink-0" />
                      <span>MapLibre GL cadastral vector overlay</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#166534] shrink-0" />
                      <span>Right-of-Way (RoW) buffer zone visualization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#166534] shrink-0" />
                      <span>Field surveyor inspection & photo logging</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <Link href="/login?type=authority" className="inline-flex items-center space-x-1 text-xs font-bold text-[#166534] hover:underline">
                    <span>View Cadastral GIS Engine</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Capability Card 3 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-800 border border-amber-100 flex items-center justify-center mb-5">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F2E53]">
                    Compensation & R&R Monitoring
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    Records transparent award assessments, 100% solatium calculations, PFMS payment dispatch status, and rehabilitation entitlements.
                  </p>
                  <ul className="mt-5 space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#166534] shrink-0" />
                      <span>Statutory solatium and interest computation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#166534] shrink-0" />
                      <span>Direct Benefit Transfer (DBT) status tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#166534] shrink-0" />
                      <span>Project Affected Family (PAF) census ledger</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <Link href="/login?type=citizen" className="inline-flex items-center space-x-1 text-xs font-bold text-amber-800 hover:underline">
                    <span>Citizen Claim Status</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: COMPACT STATUTORY PROCESS */}
        <section id="statutory-process" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold text-[#0F2E53] uppercase tracking-wider">
                Statutory Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2E53] mt-1">
                Governing Land Acquisition Stages
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                BhuSetu structures project milestones in alignment with statutory procedures defined by Parliament in the RFCTLARR Act, 2013.
              </p>
            </div>

            {/* 4 Process Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Stage 01
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400">Section 11</span>
                </div>
                <h3 className="text-sm font-bold text-[#0F2E53]">
                  Preliminary Notification
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Publication of intent to acquire land, triggering cadastral joint survey and prohibition on unauthorized transactions.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Stage 02
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400">Section 15</span>
                </div>
                <h3 className="text-sm font-bold text-[#0F2E53]">
                  Hearing of Objections
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Quasi-judicial 60-day window for affected landowners to file objections regarding area, public purpose, or rights.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Stage 03
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400">Section 19</span>
                </div>
                <h3 className="text-sm font-bold text-[#0F2E53]">
                  Declaration of Acquisition
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Formal declaration after Collector report approval, establishing conclusive evidence of required public land.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Stage 04
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400">Section 23 & 30</span>
                </div>
                <h3 className="text-sm font-bold text-[#0F2E53]">
                  Award & Disbursement
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Determination of market value, addition of 100% solatium, and direct treasury payment disbursal to verified accounts.
                </p>
              </div>
            </div>

            {/* Legal Notice & Information Banner */}
            <div className="mt-8 p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start space-x-3">
              <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">Legal Notice & Public Information Disclaimer</p>
                <p className="text-amber-800 mt-0.5 leading-relaxed">
                  {SITE_CONFIG.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* GIGW-COMPLIANT GOVERNMENT FOOTER */}
      <footer className="bg-[#0b213b] text-slate-300 text-xs border-t-4 border-[#166534]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Ministry / System Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-sm text-white">{SITE_CONFIG.name} {SITE_CONFIG.hindiName}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {SITE_CONFIG.tagline} administered under the {SITE_CONFIG.governingAct}.
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                <p className="font-semibold text-slate-200">{SITE_CONFIG.governmentEntity.responsibleAuthority}</p>
                <p>{SITE_CONFIG.governmentEntity.country}</p>
              </div>
            </div>

            {/* Column 2: Official Portals */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                Official Resources
              </h4>
              <ul className="space-y-2 text-[11px] text-slate-400">
                {SITE_CONFIG.verifiedPortals.map((portal) => (
                  <li key={portal.label}>
                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors flex items-center space-x-1"
                    >
                      <span>{portal.label}</span>
                      <ExternalLink className="h-3 w-3 text-slate-500" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Website Policies (GIGW Standards) */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                Platform Standards
              </h4>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li><span className="text-slate-300">Accessibility:</span> W3C WAI-AA Guideline Adherence</li>
                <li><span className="text-slate-300">Data Integrity:</span> Tamper-Evident Audit Logging</li>
                <li><span className="text-slate-300">Privacy Standard:</span> Beneficiary PII Data Masking</li>
                <li><span className="text-slate-300">GIGW 3.0:</span> Guidelines for Indian Government Websites</li>
              </ul>
            </div>

            {/* Column 4: Helpdesk & Support */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                Support & Inquiries
              </h4>
              <div className="space-y-2 text-[11px] text-slate-400">
                <p>Toll Free Helpline: <strong className="text-white font-mono">{SITE_CONFIG.contact.helpline}</strong></p>
                <p>Official Helpdesk: <strong className="text-slate-200">{SITE_CONFIG.contact.email}</strong></p>
                <p>Grievance Redressal: <strong className="text-slate-200">{SITE_CONFIG.contact.grievancePortal}</strong></p>
                <p className="text-[10px] text-slate-400 pt-1">{SITE_CONFIG.contact.operatingHours}</p>
              </div>
            </div>
          </div>

          {/* Bottom Attribution Line */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              BhuSetu Platform • Digital Initiative for RFCTLARR Act 2013 Governance • {SITE_CONFIG.governmentEntity.country}
            </p>
            <div className="flex items-center space-x-3 text-slate-400 text-[10px]">
              <span>Demo Persona Mode Active</span>
              <span>•</span>
              <Link href="/login" className="text-emerald-400 hover:underline">
                Portal Login Gate
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

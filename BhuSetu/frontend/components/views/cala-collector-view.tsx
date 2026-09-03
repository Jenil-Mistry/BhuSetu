'use client';

import React, { useState } from 'react';
import { 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  KeyRound, 
  RotateCcw, 
  Download, 
  MapPin, 
  Check, 
  X, 
  Eye, 
  ShieldCheck,
  SendHorizontal,
  FileCheck2,
  Clock
} from 'lucide-react';

interface PatwariCase {
  id: string;
  khasraNo: string;
  village: string;
  tehsil: string;
  landowner: string;
  areaHa: number;
  baseCircleRatePerHa: number;
  assetsValuation: number;
  slaDaysLeft: number;
  photoUrl: string;
  patwariName: string;
  surveyDate: string;
  remarks: string;
}

const MOCK_CALA_CASES: PatwariCase[] = [
  {
    id: 'case-01',
    khasraNo: '188/3',
    village: 'Fazilpur',
    tehsil: 'Gurugram',
    landowner: 'Deepak Yadav & Suman Yadav',
    areaHa: 2.10,
    baseCircleRatePerHa: 11000000,
    assetsValuation: 3200000,
    slaDaysLeft: 11, // < 15 days -> Flashes red
    photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    patwariName: 'Sunil Kataria (Patwari Cir. 4)',
    surveyDate: '2026-02-04',
    remarks: 'Field demarcation verified. 1 tubewell and 22 mature Sheesham trees mapped.',
  },
  {
    id: 'case-02',
    khasraNo: '312/1',
    village: 'Kherki Daula',
    tehsil: 'Gurugram',
    landowner: 'Gram Panchayat',
    areaHa: 1.80,
    baseCircleRatePerHa: 9500000,
    assetsValuation: 450000,
    slaDaysLeft: 14, // < 15 days -> Flashes red
    photoUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80',
    patwariName: 'R. K. Meena (Patwari Cir. 2)',
    surveyDate: '2026-02-18',
    remarks: 'Common grazing land. Resolution passed by Gram Sabha on 12-Jan-2026.',
  },
  {
    id: 'case-03',
    khasraNo: '512/3',
    village: 'Pataudi Rural',
    tehsil: 'Pataudi',
    landowner: 'Sukhdev Singh Dhillon',
    areaHa: 2.75,
    baseCircleRatePerHa: 8200000,
    assetsValuation: 4100000,
    slaDaysLeft: 28,
    photoUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80',
    patwariName: 'Devender Rawat (Patwari Cir. 7)',
    surveyDate: '2026-01-28',
    remarks: 'Commercial godown boundary wall and paved driveway assessed.',
  },
];

export const CalaCollectorView: React.FC = () => {
  const [cases, setCases] = useState<PatwariCase[]>(MOCK_CALA_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-01');
  const [isDscModalOpen, setIsDscModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isReverifyModalOpen, setIsReverifyModalOpen] = useState(false);
  const [reverifyNotes, setReverifyNotes] = useState('');
  const [isDscSigning, setIsDscSigning] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // RFCTLARR Mandatory Solatium & Award Computation
  // Multiplier Factor for Rural Land under Schedule 1 = 1.25x or 1.0x (using 1.0x for urban/fringe)
  const baseLandValue = activeCase.baseCircleRatePerHa * activeCase.areaHa;
  const totalAssets = activeCase.assetsValuation;
  const subtotalBeforeSolatium = baseLandValue + totalAssets;
  const solatium100Percent = subtotalBeforeSolatium; // 100% Solatium under Section 30(1)
  const additionalInterest12Percent = (subtotalBeforeSolatium * 0.12 * 0.75); // approx 9 months interest Sec 30(3)
  const grandTotalAward = subtotalBeforeSolatium + solatium100Percent + additionalInterest12Percent;

  const handleSimulatedDscSign = () => {
    setIsDscSigning(true);
    setTimeout(() => {
      setIsDscSigning(false);
      setSignSuccess(true);
      setTimeout(() => {
        setSignSuccess(false);
        setIsDscModalOpen(false);
        setCases((prev) => prev.filter((c) => c.id !== activeCase.id));
      }, 1600);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              Competent Authority for Land Acquisition (CALA)
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">District Collector Adjudication</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F2E53] mt-0.5">
            CALA Scrutiny & Statutory Award Pronouncement (RFCTLARR Sec 23–30)
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-500">Jurisdiction:</span>
          <span className="text-xs font-bold text-slate-800 bg-white px-3 py-1.5 rounded-xl shadow-xs">
            District Collectorate Gurugram & Rewari
          </span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* KPI 1: Pending Scrutiny */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pending Scrutiny
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F2E53]/10 text-[#0F2E53]">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-[#0F2E53]">
              28 <span className="text-sm font-normal text-slate-500">Draft Awards</span>
            </span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              Patwari Submissions
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Joint measurement sheets requiring Section 23 inquiry and compensation sign-off
          </p>
        </div>

        {/* KPI 2: Approaching SLA Deadline (Flashes red if <15 days) */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" /> Approaching SLA Deadline
            </span>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-rose-600 animate-pulse">
              4 Stretches <span className="text-sm font-normal text-slate-500">(&lt;15 Days)</span>
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
              Statutory Lapse Risk
            </span>
          </div>
          <p className="mt-1 text-xs text-rose-500 font-medium">
            Section 19 awards must be published before 12-month expiry under RFCTLARR Section 25.
          </p>
        </div>

        {/* KPI 3: Ready for Award */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ready for Award
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-emerald-600">
              19 Parcels <span className="text-sm font-normal text-slate-500">(₹ 38.4 Cr)</span>
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              DSC Signature Ready
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Compensation escrow funds verified in PFMS; ready for direct treasury push
          </p>
        </div>
      </div>

      {/* Case Selector Strip */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mr-2">
          Select Draft File:
        </span>
        {cases.map((c) => {
          const isSelected = c.id === selectedCaseId;
          const isUrgent = c.slaDaysLeft < 15;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all font-medium ${
                isSelected
                  ? 'bg-[#0F2E53] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Kh. {c.khasraNo} ({c.village})</span>
              {isUrgent && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700 animate-pulse'
                }`}>
                  {c.slaDaysLeft}d SLA
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Split-Screen Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Patwari Submitted Data & Automated Compensation Table (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-white p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                  Patwari Measurement Sheet • Circle Office Record
                </span>
                <h3 className="text-lg font-bold text-[#0F2E53] mt-0.5">
                  Khasra No: {activeCase.khasraNo} • {activeCase.village}
                </h3>
                <p className="text-xs text-slate-500">
                  Landowner: <span className="font-semibold text-slate-800">{activeCase.landowner}</span> (Tehsil: {activeCase.tehsil})
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-700 block">
                  Area: {activeCase.areaHa} Hectares
                </span>
                <span className="text-[11px] text-slate-400">
                  Survey: {activeCase.surveyDate}
                </span>
              </div>
            </div>

            {/* Officer Remarks */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 text-xs text-slate-600">
              <span className="font-semibold text-slate-800 block mb-1">
                Patwari Verification Notes ({activeCase.patwariName}):
              </span>
              <p>{activeCase.remarks}</p>
            </div>

            {/* Automated RFCTLARR Compensation Calculation Table */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F2E53]">
                  Statutory Compensation Breakdown (RFCTLARR 2013)
                </h4>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                  Rule 26-30 Applied
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between">
                  <div>
                    <span className="font-medium text-slate-700 block">1. Base Market Land Value (Sec 26)</span>
                    <span className="text-[11px] text-slate-400">
                      {activeCase.areaHa} Ha @ Circle Rate ₹{(activeCase.baseCircleRatePerHa / 10000000).toFixed(2)} Cr/Ha
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-800">
                    ₹ {baseLandValue.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="py-2.5 flex justify-between">
                  <div>
                    <span className="font-medium text-slate-700 block">2. Immovable Assets & Trees (Sec 29)</span>
                    <span className="text-[11px] text-slate-400">Horticulture & PWD Building Valuer Schedule</span>
                  </div>
                  <span className="font-mono font-bold text-slate-800">
                    ₹ {totalAssets.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="py-2.5 flex justify-between bg-slate-50/50 px-2 rounded-lg">
                  <span className="font-semibold text-slate-700">Subtotal (Base + Assets)</span>
                  <span className="font-mono font-bold text-slate-800">
                    ₹ {subtotalBeforeSolatium.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="py-2.5 flex justify-between text-[#166534]">
                  <div>
                    <span className="font-bold block">3. Mandatory 100% Solatium (Sec 30(1))</span>
                    <span className="text-[11px] opacity-80">100% over and above aggregate market value</span>
                  </div>
                  <span className="font-mono font-bold">
                    ₹ {solatium100Percent.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="py-2.5 flex justify-between text-slate-600">
                  <div>
                    <span className="font-medium block">4. Additional Statutory Interest 12% (Sec 30(3))</span>
                    <span className="text-[11px] text-slate-400">From date of preliminary notification to award</span>
                  </div>
                  <span className="font-mono font-bold">
                    ₹ {Math.round(additionalInterest12Percent).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Final Grand Total Award */}
                <div className="py-3 flex justify-between text-sm font-bold bg-[#0F2E53]/5 px-3 rounded-xl mt-2 text-[#0F2E53]">
                  <span>Total Statutory Award (Payable to PAF)</span>
                  <span className="font-mono text-base font-extrabold text-[#0F2E53]">
                    ₹ {Math.round(grandTotalAward).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Panel */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={() => setIsReverifyModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Send Back for Re-verification</span>
            </button>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-[#166534]" />
              <span>Generate Sec 11/19 Draft</span>
            </button>

            <button
              onClick={() => setIsDscModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#166534] hover:bg-[#259492] shadow-xs transition-all"
            >
              <KeyRound className="h-4 w-4 stroke-[2.5]" />
              <span>Digitally Sign & Approve Award</span>
            </button>
          </div>
        </div>

        {/* Right Pane: GIS Map Overlay & Geo-tagged Evidence Photos (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0F2E53]">GIS Cadastral Overlay & Ground Truth Evidence</h3>
              <p className="text-xs text-slate-400">Photographs uploaded with encrypted DGPS coordinates</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              GPS Verified
            </span>
          </div>

          {/* Geo-tagged Evidence Photo */}
          <div className="rounded-xl overflow-hidden border border-slate-100 relative group">
            <img
              src={activeCase.photoUrl}
              alt="Patwari Ground Verification"
              className="w-full h-56 object-cover"
            />
            {/* Watermark Overlay Box */}
            <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-slate-900/85 backdrop-blur-xs p-3 text-white text-[11px] font-mono">
              <div className="flex justify-between items-center text-[#166534] font-bold">
                <span>Kh. {activeCase.khasraNo} • {activeCase.village}</span>
                <span className="text-emerald-400">WATERMARK CERTIFIED</span>
              </div>
              <div className="mt-1 text-slate-300">
                GPS: 28.3804° N, 76.9912° E (Elevation 234m) • 03-Sep-2026
              </div>
              <div className="text-slate-400 text-[10px]">
                Captured by: {activeCase.patwariName}
              </div>
            </div>
          </div>

          {/* Cadastral RoW Polygon Verification Box */}
          <div className="rounded-xl bg-slate-50 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Cadastral Corridor Alignment Check
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white">
                <span className="text-slate-400 text-[10px] block">RoW Encroachment Check:</span>
                <span className="font-bold text-emerald-600 flex items-center mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> 100% Within RoW Pegs
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white">
                <span className="text-slate-400 text-[10px] block">Forest / Eco Sensitive Area:</span>
                <span className="font-bold text-slate-700 mt-0.5 block">Clear of Eco Buffer</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white">
                <span className="text-slate-400 text-[10px] block">Dispute / Objection Status:</span>
                <span className="font-bold text-emerald-600 mt-0.5 block">0 Objections under Sec 15</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white">
                <span className="text-slate-400 text-[10px] block">Jamabandi Title Verification:</span>
                <span className="font-bold text-slate-800 mt-0.5 block">Record of Rights Match</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DSC Digital Signature Modal */}
      {isDscModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-[#0F2E53]">
                <KeyRound className="h-5 w-5 text-[#166534]" />
                <h3 className="font-bold text-base">DSC Digital Signature</h3>
              </div>
              <button
                onClick={() => setIsDscModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!signSuccess ? (
              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  You are digitally signing statutory Award Declaration under <strong>Section 23 & 30 of RFCTLARR Act, 2013</strong> for:
                </p>
                <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                  <div><strong>Khasra:</strong> {activeCase.khasraNo} ({activeCase.village})</div>
                  <div><strong>Beneficiary:</strong> {activeCase.landowner}</div>
                  <div><strong>Total Sanctioned Award:</strong> ₹{Math.round(grandTotalAward).toLocaleString('en-IN')}</div>
                </div>

                <div className="pt-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Digital Certificate Token:
                  </label>
                  <select className="w-full rounded-xl bg-slate-50 px-3 py-2 border-0 text-slate-800 font-medium">
                    <option>e-Mudhra Class 3 DSC (ID: DC-GGM-2026-8812)</option>
                    <option>NIC CA Government Token (ID: GOV-CALA-4491)</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-3">
                  <button
                    onClick={() => setIsDscModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSimulatedDscSign}
                    disabled={isDscSigning}
                    className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-[#166534] hover:bg-[#259492] text-white font-bold transition-all disabled:opacity-50"
                  >
                    {isDscSigning ? (
                      <>
                        <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing with DSC Token...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4" />
                        <span>Confirm & Push to PFMS</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-base text-[#0F2E53]">Award Declared & Pushed to PFMS!</h4>
                <p className="text-xs text-slate-500">
                  Statutory gazette notification draft generated and payment instruction submitted to Public Financial Management System.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sec 11/19 Draft Gazette PDF Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-[#0F2E53]">
                <FileText className="h-5 w-5 text-[#166534]" />
                <h3 className="font-bold text-base">Gazette Notification Draft (RFCTLARR Sec 19)</h3>
              </div>
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 font-mono text-xs text-slate-800 space-y-3 max-h-80 overflow-y-auto border border-slate-200">
              <div className="text-center font-bold text-slate-900 border-b pb-2">
                THE HARYANA GOVERNMENT GAZETTE (EXTRAORDINARY)<br />
                REVENUE AND DISASTER MANAGEMENT DEPARTMENT<br />
                DECLARATION UNDER SECTION 19 OF ACT 30 OF 2013
              </div>
              <p>
                Whereas it appears to the Government that a total of <strong>{activeCase.areaHa} Hectares</strong> of land is required in <strong>Village {activeCase.village}</strong>, Tehsil {activeCase.tehsil}, District Gurugram for public purpose, namely for construction of <strong>NH-48 Greenfield Expressway Corridor</strong>;
              </p>
              <p>
                Now, therefore, in exercise of the powers conferred by Section 19(1) of the RFCTLARR Act 2013, the Competent Authority hereby declares that:
              </p>
              <p>
                <strong>Parcel Schedule:</strong> Khasra No. {activeCase.khasraNo}, Landowner: {activeCase.landowner}, Total Determined Award: <strong>₹{Math.round(grandTotalAward).toLocaleString('en-IN')}</strong>.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => alert('Downloading official Gazette PDF...')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0F2E53]"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF Draft</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Back for Re-verification Modal */}
      {isReverifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-rose-700">
                <RotateCcw className="h-5 w-5" />
                <h3 className="font-bold text-base">Re-verification Notice to Patwari</h3>
              </div>
              <button
                onClick={() => setIsReverifyModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Specify reason for rejecting measurement sheet for <strong>Kh. {activeCase.khasraNo}</strong>:
              </p>
              <textarea
                rows={4}
                value={reverifyNotes}
                onChange={(e) => setReverifyNotes(e.target.value)}
                placeholder="e.g. Co-sharer partition share requires re-survey with Tehsildar present..."
                className="w-full rounded-xl bg-slate-50 p-3 text-slate-800 border-0 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsReverifyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Re-verification order dispatched to ${activeCase.patwariName}`);
                  setIsReverifyModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Dispatch Objection Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

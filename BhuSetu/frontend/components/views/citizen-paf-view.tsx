'use client';

import React, { useState } from 'react';
import { 
  UserCheck, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Languages, 
  CreditCard, 
  FileQuestion, 
  ChevronRight, 
  Check, 
  X, 
  FileText, 
  ShieldCheck,
  Building,
  Image as ImageIcon
} from 'lucide-react';

const BHASHINI_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
];

export const CitizenPafView: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState('hi');
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [bankSuccess, setBankSuccess] = useState(false);
  const [disputeSuccess, setDisputeSuccess] = useState(false);

  // Form states
  const [bankAccount, setBankAccount] = useState('918237192841');
  const [ifsc, setIfsc] = useState('SBIN0001428');
  const [aadhaar, setAadhaar] = useState('XXXX-XXXX-4812');
  const [disputeText, setDisputeText] = useState('');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Bhashini AI Language Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              Citizen Transparency Portal • MoRTH / NHAI
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">RFCTLARR Beneficiary Ledger</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F2E53] mt-0.5">
            Project Affected Family (PAF) Portal
          </h2>
          <p className="text-xs text-slate-500">
            Welcome, <strong>Shri Rameshwar Singh</strong> • Khasra No: <strong>142/2</strong> (Village: Badshahpur)
          </p>
        </div>

        {/* Bhashini AI Language Selector */}
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl shadow-xs border border-slate-100">
          <Languages className="h-4 w-4 text-[#166534]" />
          <span className="text-[11px] font-bold text-slate-500">Bhashini AI:</span>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="text-xs font-semibold text-[#0F2E53] bg-transparent border-0 focus:ring-0 focus:outline-none cursor-pointer"
          >
            {BHASHINI_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Total Compensation */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Calculated Compensation
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F2E53]/10 text-[#0F2E53]">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold tracking-tight text-[#0F2E53]">
              ₹ 38,50,000
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Full 100% Solatium Included
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Determined under Section 23/30 for 1.45 Hectares of land acquisition
          </p>
        </div>

        {/* Disbursement Status Pill */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Treasury DBT Transfer Status
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#166534]/10 text-[#166534]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-lg font-bold text-[#166534] flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#166534] animate-pulse" />
              <span>Processing via PFMS</span>
            </span>
            <span className="text-xs font-mono font-medium text-slate-500">
              UTR: PFMS-2026-904128
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Payment voucher sanctioned by CALA Rewari. Crediting to SBI A/c ending in <strong>2841</strong> within 48 hours.
          </p>
        </div>
      </div>

      {/* Progress Widget: Vertical E-Commerce Style Timeline */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-[#0F2E53]">
            RFCTLARR Acquisition Lifecycle Journey
          </h3>
          <p className="text-xs text-slate-400">
            Real-time stage tracking from gazette preliminary notification to physical possession
          </p>
        </div>

        <div className="mt-6 relative pl-6 space-y-8 before:absolute before:left-9 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {/* Step 1: Notified */}
          <div className="relative flex items-start space-x-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0 shadow-sm z-10">
              <Check className="h-4 w-4 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-slate-900">1. Preliminary Notification (Section 11)</h4>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded font-semibold">Completed</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Gazette published on <strong>12-Mar-2025</strong> in State Gazette & National Dailies. Public notice served.
              </p>
            </div>
          </div>

          {/* Step 2: Surveyed */}
          <div className="relative flex items-start space-x-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0 shadow-sm z-10">
              <Check className="h-4 w-4 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-slate-900">2. Joint Field Demarcation & Asset Survey</h4>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded font-semibold">Completed</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Patwari verified 1.45 Ha parcel with GPS coordinates. 1 tubewell and 8 trees documented on <strong>18-Jun-2025</strong>.
              </p>
            </div>
          </div>

          {/* Step 3: Award Calculated */}
          <div className="relative flex items-start space-x-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0 shadow-sm z-10">
              <Check className="h-4 w-4 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-slate-900">3. Statutory Award Declaration (Section 23/30)</h4>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded font-semibold">Completed</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Competent Authority CALA sanctioned ₹38,50,000 compensation including 100% solatium on <strong>15-Nov-2025</strong>.
              </p>
            </div>
          </div>

          {/* Step 4: Payment Initiated (Active Step) */}
          <div className="relative flex items-start space-x-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#166534] text-white shrink-0 shadow-sm z-10 ring-4 ring-[#166534]/20 animate-pulse">
              <Clock className="h-4 w-4 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-[#0F2E53]">4. Direct Benefit Transfer (Payment Initiated)</h4>
                <span className="text-[10px] text-[#166534] bg-[#166534]/10 px-2 py-0.2 rounded font-semibold">In Progress</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                PFMS batch transmission active. Escrow funds transferred to treasury clearing. Expected credit: 2 days.
              </p>
            </div>
          </div>

          {/* Step 5: Possession */}
          <div className="relative flex items-start space-x-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-400 shrink-0 z-10">
              <span className="text-xs font-bold">5</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-slate-400">5. Physical Possession Handover (Section 38)</h4>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.2 rounded">Pending Payment</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Handover of land to NHAI for highway construction following successful compensation credit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transparency Panel: Itemized Award Sheet Table & Evidence Gallery */}
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-6">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F2E53]">Itemized Transparency Award Sheet</h3>
            <p className="text-xs text-slate-400">Section 23 Certified Valuation breakdown for Khasra 142/2</p>
          </div>
          <button 
            onClick={() => alert('Downloading official Award Copy signed by CALA...')}
            className="flex items-center space-x-1.5 text-xs font-semibold text-[#166534] hover:underline"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Download Award Order (PDF)</span>
          </button>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                <th className="py-2.5 px-3">Valuation Component</th>
                <th className="py-2.5 px-3">Statutory Provision</th>
                <th className="py-2.5 px-3">Computation Basis</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800">Land Market Value</td>
                <td className="py-3 px-3 text-slate-500">RFCTLARR Section 26</td>
                <td className="py-3 px-3 text-slate-500">1.45 Ha @ ₹1.20 Cr/Ha Circle Rate</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">₹ 17,40,000</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800">Assets Attached to Land</td>
                <td className="py-3 px-3 text-slate-500">RFCTLARR Section 29</td>
                <td className="py-3 px-3 text-slate-500">1 Tubewell Borewell + 8 Sheesham Trees</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">₹ 1,85,000</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="py-2 px-3 font-semibold text-slate-700" colSpan={3}>Subtotal Base Entitlement</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">₹ 19,25,000</td>
              </tr>
              <tr className="text-[#166534]">
                <td className="py-3 px-3 font-bold">100% Mandatory Solatium</td>
                <td className="py-3 px-3 font-medium">RFCTLARR Section 30(1)</td>
                <td className="py-3 px-3">100% of Total Market Value</td>
                <td className="py-3 px-3 text-right font-mono font-bold">₹ 19,25,000</td>
              </tr>
              <tr className="bg-[#0F2E53]/5 text-[#0F2E53] font-bold text-sm">
                <td className="py-3 px-3" colSpan={3}>Total Net Entitlement Payable</td>
                <td className="py-3 px-3 text-right font-mono text-base font-extrabold text-[#0F2E53]">₹ 38,50,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Evidence Gallery */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Patwari Joint Survey Evidence Photos
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border border-slate-100 relative">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80"
                alt="Agricultural Parcel Boundary"
                className="w-full h-40 object-cover"
              />
              <div className="p-2.5 bg-slate-50 text-[11px] text-slate-600 flex justify-between">
                <span>Kh. 142/2 Northern Peg Demarcation</span>
                <span className="font-mono text-slate-400">18-Jun-2025</span>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-100 relative">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80"
                alt="Borewell Asset"
                className="w-full h-40 object-cover"
              />
              <div className="p-2.5 bg-slate-50 text-[11px] text-slate-600 flex justify-between">
                <span>Verified Tubewell & Submersible Pump</span>
                <span className="font-mono text-slate-400">18-Jun-2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Panel: Update Bank Details & Raise Discrepancy */}
      <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#0F2E53]">Need to Update Information or Contest Valuation?</h4>
          <p className="text-xs text-slate-500">
            Submit bank changes or file a statutory Section 64 reference to the Land Acquisition Authority.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsBankModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors"
          >
            <CreditCard className="h-4 w-4 text-[#166534]" />
            <span>Update Bank / Aadhaar Details</span>
          </button>

          <button
            onClick={() => setIsDisputeModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition-colors"
          >
            <FileQuestion className="h-4 w-4" />
            <span>Raise Discrepancy</span>
          </button>
        </div>
      </div>

      {/* Bank Details Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#0F2E53]">Update DBT Bank Account (PFMS KYC)</h3>
              <button onClick={() => setIsBankModalOpen(false)} className="p-1 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!bankSuccess ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setBankSuccess(true);
                  setTimeout(() => {
                    setBankSuccess(false);
                    setIsBankModalOpen(false);
                  }, 1500);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 font-mono text-slate-800 border-0 focus:ring-2 focus:ring-[#166534]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 font-mono text-slate-800 border-0 focus:ring-2 focus:ring-[#166534]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aadhaar (NPCI Seeded)</label>
                  <input
                    type="text"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 font-mono text-slate-800 border-0 focus:ring-2 focus:ring-[#166534]"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsBankModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#166534] text-white font-bold"
                  >
                    Verify & Save Details
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center space-y-2">
                <Check className="h-8 w-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-800">Bank Details Updated!</h4>
                <p className="text-xs text-slate-500">NPCI Aadhaar-mapper verification completed successfully.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Raise Discrepancy Modal */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-rose-700">Raise Discrepancy / Section 64 Dispute</h3>
              <button onClick={() => setIsDisputeModalOpen(false)} className="p-1 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!disputeSuccess ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDisputeSuccess(true);
                  setTimeout(() => {
                    setDisputeSuccess(false);
                    setIsDisputeModalOpen(false);
                  }, 1500);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dispute Classification</label>
                  <select className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border-0 focus:ring-2 focus:ring-rose-500">
                    <option>Measurement / Area Discrepancy</option>
                    <option>Asset Valuation Objection (Trees/Structures)</option>
                    <option>Co-Sharer Apportionment Dispute</option>
                    <option>Solatium Calculation Grievance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Statement of Facts & Ground</label>
                  <textarea
                    rows={4}
                    value={disputeText}
                    onChange={(e) => setDisputeText(e.target.value)}
                    placeholder="Describe your objection clearly..."
                    className="w-full rounded-xl bg-slate-50 p-3 text-slate-800 border-0 focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsDisputeModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold"
                  >
                    File Objection to CALA
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center space-y-2">
                <Check className="h-8 w-8 text-rose-600 mx-auto" />
                <h4 className="font-bold text-slate-800">Objection Form Dispatched!</h4>
                <p className="text-xs text-slate-500">
                  Grievance token <strong>GRV-2026-8812</strong> registered. CALA hearing date will be notified via SMS.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

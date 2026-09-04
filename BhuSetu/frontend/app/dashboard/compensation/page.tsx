'use client';

import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Plus, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  FileCheck2, 
  Building2, 
  CreditCard, 
  Clock, 
  ShieldCheck,
  Send,
  X,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { compensationApi, projectsApi } from '@/lib/api';
import { AwardEntity, PaymentBatchEntity, ProjectEntity } from '@/lib/mock-data';

export default function CompensationPage() {
  const [awards, setAwards] = useState<AwardEntity[]>([]);
  const [batches, setBatches] = useState<PaymentBatchEntity[]>([]);
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('11111111-1111-1111-1111-111111111111');
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'awards' | 'calculator' | 'pfms' | 'possession'>('awards');

  // Calculator State (RFCTLARR Sec 26-30)
  const [calcMarketValue, setCalcMarketValue] = useState(10000000);
  const [calcMultiplier, setCalcMultiplier] = useState(1.5); // Rural factor (1.0 to 2.0)
  const [calcAssetsValue, setCalcAssetsValue] = useState(1200000);
  const [calcMonths, setCalcMonths] = useState(14); // Months between Sec 11 and Award

  // New Award Modal
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [awardNumber, setAwardNumber] = useState('CALA/GGM/2026/AWD-91');
  const [awardMarketValue, setAwardMarketValue] = useState(15000000);
  const [awardAssetsValue, setAwardAssetsValue] = useState(2500000);

  // New PFMS Batch Modal
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchRef, setBatchRef] = useState('PFMS-2026-MORTH-8843');
  const [batchAmount, setBatchAmount] = useState(48500000);
  const [batchBeneficiaries, setBatchBeneficiaries] = useState(14);

  // Possession Record Modal
  const [isPossessionModalOpen, setIsPossessionModalOpen] = useState(false);
  const [possessionKhasra, setPossessionKhasra] = useState('188/3 (Fazilpur)');
  const [possessionRemarks, setPossessionRemarks] = useState('Demarcation pegs installed; land free of encumbrances.');

  useEffect(() => {
    loadData();
  }, [selectedProjectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [awds, projs] = await Promise.all([
        compensationApi.listAwards(selectedProjectId),
        projectsApi.list(),
      ]);
      setAwards(awds);
      setProjects(projs);
    } finally {
      setLoading(false);
    }
  };

  // RFCTLARR Math Computations
  const adjustedMarketValue = calcMarketValue * calcMultiplier;
  const solatiumAmount = adjustedMarketValue; // 100% solatium
  const interestAmount = adjustedMarketValue * 0.12 * (calcMonths / 12); // 12% per annum
  const totalAssessedCompensation = adjustedMarketValue + solatiumAmount + interestAmount + calcAssetsValue;

  const handleDeclareAward = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await compensationApi.declareAward(selectedProjectId, {
      award_number: awardNumber,
      market_value: awardMarketValue,
      assets_value: awardAssetsValue,
      parcels_included: 6,
    });
    setAwards([created, ...awards]);
    setIsAwardModalOpen(false);
    setActionSuccess(`Statutory Award ${created.award_number} declared and logged.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await compensationApi.createPaymentBatch(selectedProjectId, {
      batch_reference: batchRef,
      total_amount: batchAmount,
      total_beneficiaries: batchBeneficiaries,
    });
    setBatches([created, ...batches]);
    setIsBatchModalOpen(false);
    setActionSuccess(`PFMS DBT Escrow Batch ${created.batch_reference} created and queued for bank transfer.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleRecordPossession = async (e: React.FormEvent) => {
    e.preventDefault();
    await compensationApi.recordPossession('kh-101', { remarks: possessionRemarks });
    setIsPossessionModalOpen(false);
    setActionSuccess(`Physical possession of Khasra ${possessionKhasra} successfully recorded.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              RFCTLARR Sections 23-31 • CALA Award Pronouncement
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">PFMS / DBT Direct Benefit Transfer</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F2E53] mt-0.5">
            Awards, Compensation & PFMS Disbursement
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
          >
            <CreditCard className="h-3.5 w-3.5 text-slate-500" />
            <span>Create PFMS Batch</span>
          </button>

          <button
            onClick={() => setIsAwardModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#259492] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Declare Statutory Award</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('awards')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'awards' ? 'bg-[#0F2E53] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pronounced Awards ({awards.length})
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'calculator' ? 'bg-[#0F2E53] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calculator className="h-3.5 w-3.5" />
          <span>RFCTLARR Solatium Calculator</span>
        </button>
        <button
          onClick={() => setActiveTab('pfms')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'pfms' ? 'bg-[#0F2E53] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="h-3.5 w-3.5" />
          <span>PFMS / Escrow Batches</span>
        </button>
        <button
          onClick={() => setActiveTab('possession')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'possession' ? 'bg-[#0F2E53] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="h-3.5 w-3.5" />
          <span>Section 38 Possession Handover</span>
        </button>
      </div>

      {/* TAB 1: AWARDS LIST */}
      {activeTab === 'awards' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {awards.map((award) => (
              <div
                key={award.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:border-[#166534] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0F2E53] bg-slate-100 px-2 py-0.5 rounded">
                      {award.award_number}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      {award.status}
                    </span>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Total Awarded Statutory Compensation
                    </span>
                    <span className="text-xl font-extrabold text-emerald-800 font-mono">
                      ₹ {(award.total_awarded_amount / 100000).toFixed(2)} Lakhs
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Base Market Value</span>
                      <span className="font-mono font-semibold text-slate-700">
                        ₹ {(award.market_value / 100000).toFixed(2)} L
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">100% Solatium</span>
                      <span className="font-mono font-semibold text-emerald-700">
                        ₹ {(award.solatium_amount / 100000).toFixed(2)} L
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">12% Addl. Interest</span>
                      <span className="font-mono font-semibold text-slate-700">
                        ₹ {(award.interest_amount / 100000).toFixed(2)} L
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">Assets Valuation</span>
                      <span className="font-mono font-semibold text-slate-700">
                        ₹ {(award.assets_value / 100000).toFixed(2)} L
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Pronounced: {award.award_date}</span>
                  <span className="font-mono text-emerald-700">SHA-256 Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: RFCTLARR SOLATIUM CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-2xl bg-white p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <Calculator className="h-5 w-5 text-[#166534]" />
              <h3 className="text-base font-bold text-[#0F2E53]">
                Statutory Assessment Multipliers (Sections 26-30)
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Base Market Value (INR per Khasra) *
                </label>
                <input
                  type="number"
                  step="50000"
                  value={calcMarketValue}
                  onChange={(e) => setCalcMarketValue(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-[#166534] focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Determined by Circle Rate or average of top 50% sale deeds per Sec 26.
                </span>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Rural Multiplier Factor:</span>
                  <span className="font-mono text-[#166534]">{calcMultiplier}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.05"
                  value={calcMultiplier}
                  onChange={(e) => setCalcMultiplier(Number(e.target.value))}
                  className="w-full accent-[#166534]"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1.0x (Urban Limits)</span>
                  <span>1.5x (Sub-urban)</span>
                  <span>2.0x (Remote Rural)</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Immovable Assets & Tree/Well Valuation (INR)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={calcAssetsValue}
                  onChange={(e) => setCalcAssetsValue(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Months Elapsed (Sec 11 Publication to Award Date):</span>
                  <span className="font-mono text-[#166534]">{calcMonths} Months</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={calcMonths}
                  onChange={(e) => setCalcMonths(Number(e.target.value))}
                  className="w-full accent-[#166534]"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Under Section 30(3), additional interest of 12% per annum applies for this duration.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Computed Statutory Breakdown */}
          <div className="lg:col-span-6 rounded-2xl bg-white p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#166534] uppercase tracking-wider block">
                Official Compensation Breakdown
              </span>
              <h3 className="text-xl font-extrabold text-[#0F2E53] mt-1">
                Net Awardable Package
              </h3>

              <div className="mt-5 space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-medium">1. Adjusted Market Value (Base × {calcMultiplier}):</span>
                  <span className="font-mono font-bold text-slate-800">
                    ₹ {adjustedMarketValue.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <span className="text-emerald-900 font-bold">2. 100% Solatium (Section 30(1)):</span>
                  <span className="font-mono font-extrabold text-emerald-800">
                    ₹ {solatiumAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                  <span className="text-amber-900 font-medium">3. 12% Additional Interest (Section 30(3)):</span>
                  <span className="font-mono font-bold text-amber-800">
                    ₹ {Math.round(interestAmount).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-medium">4. Assessed Assets & Wells:</span>
                  <span className="font-mono font-bold text-slate-800">
                    ₹ {calcAssetsValue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Assessed Award (Sec 27)
                  </span>
                  <span className="text-2xl font-extrabold text-[#166534] font-mono">
                    ₹ {Math.round(totalAssessedCompensation).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setAwardMarketValue(adjustedMarketValue);
                    setAwardAssetsValue(calcAssetsValue);
                    setIsAwardModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#166534] text-white text-xs font-bold hover:bg-[#259492] shadow-xs"
                >
                  Adopt in Award
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PFMS BATCHES */}
      {activeTab === 'pfms' && (
        <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0F2E53]">
                Public Financial Management System (PFMS) Escrow Batches
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct Benefit Transfer (DBT) transfers into Aadhaar-linked beneficiary accounts.
              </p>
            </div>
            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#166534] text-white text-xs font-bold hover:bg-[#259492]"
            >
              + New Payment Batch
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Batch Reference</th>
                  <th className="px-4 py-3">Disbursement Source</th>
                  <th className="px-4 py-3">Total Amount</th>
                  <th className="px-4 py-3">Beneficiaries</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">UTR Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-[#0F2E53]">PFMS-2026-MORTH-8841</td>
                  <td className="px-4 py-3 text-slate-700">PFMS / SBI Escrow</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-800">₹ 5,21,72,000</td>
                  <td className="px-4 py-3 font-mono">18 / 18 Disbursed</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      RECONCILED
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">SBIN2026082218491209</td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-[#0F2E53]">PFMS-2026-MORTH-8842</td>
                  <td className="px-4 py-3 text-slate-700">PFMS / SBI Escrow</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-800">₹ 3,67,02,000</td>
                  <td className="px-4 py-3 font-mono">7 / 12 Disbursed</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                      TRANSMITTED
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400">Awaiting Bank UTR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SECTION 38 POSSESSION */}
      {activeTab === 'possession' && (
        <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0F2E53]">
                Section 38 Physical Site Possession & Handover
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical possession may only be taken after full payment of compensation has been made.
              </p>
            </div>
            <button
              onClick={() => setIsPossessionModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#166534] text-white text-xs font-bold hover:bg-[#259492]"
            >
              Record Parcel Possession
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#0F2E53]">Khasra 188/3 (Fazilpur)</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Possession Taken</span>
              </div>
              <p className="text-slate-600">Site demarcation verified; pegs installed for 2.10 Ha.</p>
              <div className="text-[10px] text-slate-400 font-mono">Handover Date: 2026-08-28 • CALA Order # 401</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#0F2E53]">Khasra 312/1 (Kherki Daula)</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Possession Taken</span>
              </div>
              <p className="text-slate-600">Gram Panchayat common land boundary pillars erected.</p>
              <div className="text-[10px] text-slate-400 font-mono">Handover Date: 2026-08-30 • CALA Order # 405</div>
            </div>
          </div>
        </div>
      )}

      {/* Declare Award Modal */}
      {isAwardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#0F2E53] mb-1">
              Pronounce Section 23/31 Award
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Formal CALA award declaration with mandatory 100% Solatium.
            </p>

            <form onSubmit={handleDeclareAward} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Award Number</label>
                <input
                  type="text"
                  required
                  value={awardNumber}
                  onChange={(e) => setAwardNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Market Value (INR)</label>
                <input
                  type="number"
                  value={awardMarketValue}
                  onChange={(e) => setAwardMarketValue(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assets Value (INR)</label>
                <input
                  type="number"
                  value={awardAssetsValue}
                  onChange={(e) => setAwardAssetsValue(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-[#166534] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAwardModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#166534] text-white font-bold hover:bg-[#259492]"
                >
                  Pronounce Award
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Possession Modal */}
      {isPossessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#0F2E53] mb-1">
              Record Section 38 Site Possession
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter site handover verification details and memo reference.
            </p>

            <form onSubmit={handleRecordPossession} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Khasra</label>
                <input
                  type="text"
                  value={possessionKhasra}
                  onChange={(e) => setPossessionKhasra(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Handover Memo Remarks</label>
                <textarea
                  rows={3}
                  value={possessionRemarks}
                  onChange={(e) => setPossessionRemarks(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#166534] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPossessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#166534] text-white font-bold hover:bg-[#259492]"
                >
                  Confirm Possession
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

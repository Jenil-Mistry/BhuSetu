'use client';

import React from 'react';
import { KpiGlance } from '@/types/rfctlarr';
import { 
  LandPlot, 
  Wallet, 
  Send, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  TrendingUp,
  Clock
} from 'lucide-react';

interface KpiGlanceProps {
  data: KpiGlance;
  onFilterBottlenecks?: () => void;
}

export const KpiGlanceRow: React.FC<KpiGlanceProps> = ({ data, onFilterBottlenecks }) => {
  const acquisitionPercentage = ((data.landAcquiredHa / data.landRequiredHa) * 100).toFixed(1);
  const disbursementPercentage = ((data.fundsDisbursedCrores / data.fundsWithCalaCrores) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Land Required vs. Acquired */}
      <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Corridor Land Status
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#166534]/10 text-[#166534]">
              <LandPlot className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-[#0F2E53]">
              {data.landAcquiredHa.toLocaleString('en-IN')} <span className="text-sm font-normal text-slate-500">Ha</span>
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {acquisitionPercentage}% Done
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Target: <span className="font-medium text-slate-700">{data.landRequiredHa.toLocaleString('en-IN')} Ha</span> across 4 Packages
          </p>
        </div>

        <div className="mt-5 pt-3">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div 
              className="h-full rounded-full bg-[#166534] transition-all duration-700 ease-out"
              style={{ width: `${acquisitionPercentage}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>Physical Possession: 68%</span>
            <span>Award Declared: 82%</span>
          </div>
        </div>
      </div>

      {/* Card 2: Funds with CALA */}
      <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Funds with CALA
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F2E53]/10 text-[#0F2E53]">
              <Wallet className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-[#0F2E53]">
              ₹ {data.fundsWithCalaCrores.toFixed(2)} <span className="text-sm font-normal text-slate-500">Cr</span>
            </span>
            <span className="text-xs font-medium text-slate-400">
              Escrow Account
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Deposited under Sec 77 RFCTLARR with CALA Rewari & Gurugram
          </p>
        </div>

        <div className="mt-5 pt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-50">
          <span className="flex items-center text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Ready for Award
          </span>
          <span className="font-medium text-slate-700">₹ 164.30 Cr uncommitted</span>
        </div>
      </div>

      {/* Card 3: Funds Disbursed */}
      <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Direct Beneficiary Transfer
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Send className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-[#0F2E53]">
              ₹ {data.fundsDisbursedCrores.toFixed(2)} <span className="text-sm font-normal text-slate-500">Cr</span>
            </span>
            <span className="text-xs font-semibold text-[#166534] bg-[#166534]/10 px-2 py-0.5 rounded-full">
              {disbursementPercentage}% Disbursed
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Credited via PFMS DBT to verified land-title holders
          </p>
        </div>

        <div className="mt-5 pt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-50">
          <span>PAFs Benefited</span>
          <span className="font-semibold text-slate-800">
            {data.disbursedPafCount.toLocaleString('en-IN')} / {data.totalPafCount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Card 4: Bottleneck Alerts */}
      <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
              Bottleneck Alerts
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-rose-600">
              {data.bottleneckCount} <span className="text-sm font-normal text-slate-500">Stretches</span>
            </span>
            <button
              onClick={onFilterBottlenecks}
              className="text-xs font-medium text-[#166534] hover:underline flex items-center"
            >
              Filter Map
              <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </button>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Critical RFCTLARR Section 15 & Court stays needing immediate PIA action
          </p>
        </div>

        <div className="mt-5 pt-3 flex items-center justify-between text-xs border-t border-slate-50">
          <span className="text-rose-600 font-medium flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" /> 2 Overdue &gt;15 Days
          </span>
          <span className="text-slate-500">Rewari Ch 94+300</span>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  LandPlot, 
  Clock, 
  AlertTriangle, 
  Send, 
  Download, 
  CheckCircle2, 
  Flame, 
  FileSpreadsheet, 
  ChevronRight, 
  Check, 
  ShieldAlert,
  ArrowDown,
  X
} from 'lucide-react';

interface DistrictEscalation {
  id: string;
  district: string;
  state: string;
  activeProjects: number;
  totalAcquiredHa: number;
  slaBreachCount: number;
  daysOverdue: number;
  collectorName: string;
  noticeStatus: 'pending' | 'sent';
}

const INITIAL_DISTRICTS: DistrictEscalation[] = [
  {
    id: 'dist-01',
    district: 'Rewari',
    state: 'Haryana',
    activeProjects: 3,
    totalAcquiredHa: 340.2,
    slaBreachCount: 4,
    daysOverdue: 22,
    collectorName: 'Sh. Rahul Narwal, IAS',
    noticeStatus: 'pending',
  },
  {
    id: 'dist-02',
    district: 'Alwar',
    state: 'Rajasthan',
    activeProjects: 2,
    totalAcquiredHa: 190.5,
    slaBreachCount: 3,
    daysOverdue: 18,
    collectorName: 'Dr. Artika Shukla, IAS',
    noticeStatus: 'pending',
  },
  {
    id: 'dist-03',
    district: 'Bulandshahr',
    state: 'Uttar Pradesh',
    activeProjects: 4,
    totalAcquiredHa: 510.8,
    slaBreachCount: 2,
    daysOverdue: 9,
    collectorName: 'Sh. C. P. Singh, IAS',
    noticeStatus: 'pending',
  },
  {
    id: 'dist-04',
    district: 'Gurugram',
    state: 'Haryana',
    activeProjects: 5,
    totalAcquiredHa: 890.4,
    slaBreachCount: 0,
    daysOverdue: 0,
    collectorName: 'Sh. Nishant Kumar Yadav, IAS',
    noticeStatus: 'sent',
  },
];

export const CentralAuthorityView: React.FC = () => {
  const [districts, setDistricts] = useState<DistrictEscalation[]>(INITIAL_DISTRICTS);
  const [activeNoticeId, setActiveNoticeId] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportToast, setReportToast] = useState<string | null>(null);

  const handleSendNotice = (id: string) => {
    setActiveNoticeId(id);
    setTimeout(() => {
      setDistricts((prev) =>
        prev.map((d) => (d.id === id ? { ...d, noticeStatus: 'sent' } : d))
      );
      setActiveNoticeId(null);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {reportToast && (
        <div className="flex items-center justify-between p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-sm font-bold text-[#166534] shadow-sm animate-in fade-in">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{reportToast}</span>
          </div>
          <button onClick={() => setReportToast(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              National Infrastructure Monitoring • Cabinet Committee on Investment
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">PM GatiShakti Integrated Hub</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F2E53] mt-0.5">
            Central & State Land Acquisition Oversight Dashboard
          </h2>
        </div>

        {/* Custom CSV / PDF Report Builder */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setIsGeneratingReport(true);
              setTimeout(() => {
                setIsGeneratingReport(false);
                setReportToast('Statutory Cabinet Land Acquisition Report (National Summary PDF & Cadastral CSV) generated and downloaded successfully!');
              }, 1000);
            }}
            disabled={isGeneratingReport}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-white text-slate-800 hover:bg-slate-50 text-sm font-bold shadow-sm border-2 border-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <FileSpreadsheet className="h-5 w-5 text-[#166534]" />
            <span>{isGeneratingReport ? 'Compiling National Report...' : 'Custom CSV / PDF Report Builder'}</span>
          </button>
        </div>
      </div>

      {/* KPI Row: 3 Cards as specified */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Capex Disbursed */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              National Capex Disbursed
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F2E53]/10 text-[#0F2E53]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-[#0F2E53]">
              ₹ 2,418.50 <span className="text-sm font-normal text-slate-500">Cr</span>
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              +14.2% YoY
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Total statutory compensation released across 18 Priority Corridors
          </p>
        </div>

        {/* Total Hectares Acquired (YTD) */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Hectares Acquired (YTD)
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#166534]/10 text-[#166534]">
              <LandPlot className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-[#0F2E53]">
              8,940 <span className="text-sm font-normal text-slate-500">Ha</span>
            </span>
            <span className="text-xs font-semibold text-[#166534] bg-[#166534]/10 px-2 py-0.5 rounded-full">
              84.2% of Target
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Target: 10,615 Ha for FY 2026-27 Expressway & Dedicated Freight Networks
          </p>
        </div>

        {/* Average Cycle Time */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Average Acquisition Cycle Time
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-slate-800">
              164 <span className="text-sm font-normal text-slate-500">Days</span>
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Target: &lt;180 Days
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            From Section 4 Social Impact Assessment to Section 38 Physical Possession
          </p>
        </div>
      </div>

      {/* Analytics Widgets: Choropleth Heatmap (Left) & Bottleneck Funnel Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Choropleth Heatmap Widget (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0F2E53]">
                District SLA Performance Heatmap
              </h3>
              <p className="text-xs text-slate-400">
                Green (Compliant) to Red (Critical RFCTLARR SLA Delays)
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>&lt;5d Delay</span>
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 ml-1" />
              <span>5-15d Delay</span>
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 ml-1" />
              <span>&gt;15d Breach</span>
            </div>
          </div>

          {/* Choropleth Grid Visualizer */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { district: 'Gurugram', code: 'GGM', breach: 0, status: 'emerald', label: 'On Schedule' },
              { district: 'Rewari', code: 'REW', breach: 4, status: 'rose', label: '22d Overdue' },
              { district: 'Alwar', code: 'ALW', breach: 3, status: 'rose', label: '18d Overdue' },
              { district: 'Bulandshahr', code: 'BUL', breach: 2, status: 'amber', label: '9d Overdue' },
              { district: 'Jaipur Rural', code: 'JPR', breach: 1, status: 'amber', label: '6d Overdue' },
              { district: 'Nuh / Mewat', code: 'NUH', breach: 0, status: 'emerald', label: 'On Schedule' },
              { district: 'Faridabad', code: 'FBD', breach: 0, status: 'emerald', label: 'On Schedule' },
              { district: 'Palwal', code: 'PLW', breach: 0, status: 'emerald', label: 'On Schedule' },
            ].map((item) => (
              <div
                key={item.district}
                className={`p-4 rounded-xl transition-all cursor-pointer ${
                  item.status === 'emerald'
                    ? 'bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950'
                    : item.status === 'amber'
                    ? 'bg-amber-50/70 hover:bg-amber-100 text-amber-950'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-950 ring-1 ring-rose-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold">{item.code}</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      item.status === 'emerald'
                        ? 'bg-emerald-500'
                        : item.status === 'amber'
                        ? 'bg-amber-500'
                        : 'bg-rose-500 animate-ping'
                    }`}
                  />
                </div>
                <div className="mt-2 font-bold text-sm">{item.district}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Critical alerts triggered to Ministry Secretary dashboard</span>
            <span className="text-[#166534] font-semibold">2 Show-Cause Pending Dispatches</span>
          </div>
        </div>

        {/* Bottleneck Funnel Chart (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#0F2E53]">
              Statutory Pipeline Funnel (Hectares)
            </h3>
            <p className="text-xs text-slate-400">
              Attrition & bottleneck progression across statutory RFCTLARR phases
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { stage: '1. Initial Proposal', ha: 12400, percent: 100, color: 'bg-slate-300' },
              { stage: '2. Section 4 SIA Cleared', ha: 11100, percent: 89, color: 'bg-[#0F2E53]' },
              { stage: '3. Section 11 Notified', ha: 9800, percent: 79, color: 'bg-amber-500' },
              { stage: '4. Section 19 Declaration', ha: 7600, percent: 61, color: 'bg-blue-600' },
              { stage: '5. Section 23 Award Finalized', ha: 6200, percent: 50, color: 'bg-indigo-600' },
              { stage: '6. Section 38 Possession Taken', ha: 5400, percent: 43, color: 'bg-emerald-600' },
            ].map((f) => (
              <div key={f.stage} className="text-xs">
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700">{f.stage}</span>
                  <span className="font-mono font-bold text-slate-900">{f.ha.toLocaleString('en-IN')} Ha</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${f.color} transition-all duration-500`}
                    style={{ width: `${f.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Primary Bottleneck: Sec 11 → Sec 19 Transition</span>
            <span className="font-bold text-rose-600">2,200 Ha Held in Hearings</span>
          </div>
        </div>
      </div>

      {/* Action Panel: District Escalation Matrix Table */}
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-[#0F2E53]">
              District Collector Escalation Matrix (Section 25 Compliance)
            </h3>
            <p className="text-xs text-slate-400">
              Defaulting revenue jurisdictions approaching 1-year statutory lapse threshold
            </p>
          </div>
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
            {districts.filter((d) => d.slaBreachCount > 0).length} Action Required
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                <th className="py-3 px-4">District & State</th>
                <th className="py-3 px-4">District Collector / CALA</th>
                <th className="py-3 px-4">Active Projects</th>
                <th className="py-3 px-4">Acquired Area (Ha)</th>
                <th className="py-3 px-4">SLA Breaches</th>
                <th className="py-3 px-4">Days Overdue</th>
                <th className="py-3 px-4 text-right">Escalation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {districts.map((d) => {
                const isOverdue = d.daysOverdue > 0;
                return (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0F2E53]">
                      {d.district}, <span className="font-normal text-slate-500">{d.state}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{d.collectorName}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600">{d.activeProjects}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{d.totalAcquiredHa} Ha</td>
                    <td className="py-3.5 px-4">
                      {d.slaBreachCount > 0 ? (
                        <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold">
                          {d.slaBreachCount} Breaches
                        </span>
                      ) : (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                          Zero
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {isOverdue ? (
                        <span className="font-mono font-bold text-rose-600 animate-pulse">
                          +{d.daysOverdue} Days
                        </span>
                      ) : (
                        <span className="text-slate-400">Within SLA</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {d.noticeStatus === 'sent' ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl text-xs font-semibold">
                          <Check className="h-3.5 w-3.5" />
                          <span>Notice Dispatched</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendNotice(d.id)}
                          disabled={activeNoticeId === d.id}
                          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>
                            {activeNoticeId === d.id ? 'Dispatching...' : '1-Click Show-Cause Notice'}
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

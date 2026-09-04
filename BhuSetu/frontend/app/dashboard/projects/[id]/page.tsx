'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Coins, 
  Building2, 
  FileText, 
  ShieldCheck, 
  ChevronRight, 
  Layers, 
  Send, 
  FileCheck2, 
  RotateCcw, 
  XCircle, 
  Download,
  Calendar,
  User,
  History
} from 'lucide-react';
import { projectsApi, parcelsApi } from '@/lib/api';
import { ProjectEntity } from '@/lib/mock-data';

const RFCTLARR_STAGES = [
  { key: 'DRAFT', title: '1. Draft Proposal', short: 'Draft' },
  { key: 'SUBMITTED', title: '2. Submitted', short: 'Submitted' },
  { key: 'SCRUTINY', title: '3. Scrutiny (SDM)', short: 'Scrutiny' },
  { key: 'APPROVED', title: '4. Statutory Approval', short: 'Approved' },
  { key: 'NOTIFICATION_IN_PROGRESS', title: '5. Section 11 / 19', short: 'Sec 11/19' },
  { key: 'AWARD_IN_PROGRESS', title: '6. Section 23/31 Awards', short: 'Awards' },
  { key: 'COMPENSATION_IN_PROGRESS', title: '7. PFMS Disbursement', short: 'PFMS' },
  { key: 'POSSESSION_IN_PROGRESS', title: '8. Site Possession', short: 'Possession' },
  { key: 'COMPLETED', title: '9. Completed', short: 'Done' },
];

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<ProjectEntity | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [parcels, setParcels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'parcels'>('overview');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [proj, tline, prcls] = await Promise.all([
        projectsApi.get(projectId),
        projectsApi.getTimeline(projectId),
        parcelsApi.list(projectId),
      ]);
      setProject(proj);
      setTimeline(tline);
      setParcels(prcls);
    } finally {
      setLoading(false);
    }
  };

  const handleTransition = async (action: string, comment: string) => {
    setIsProcessing(true);
    try {
      await projectsApi.transition(projectId, action, comment);
      setActionSuccess(`Action "${action}" executed and permanently recorded in audit ledger.`);
      setTimeout(() => setActionSuccess(null), 4000);
      loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#166534] border-t-transparent" />
        <span className="text-xs font-semibold text-slate-500">Loading statutory project dossier...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-lg font-bold text-slate-800">Project record not found</h3>
        <Link href="/dashboard/projects" className="mt-3 inline-block text-xs font-bold text-[#166534]">
          Return to Projects Portfolio
        </Link>
      </div>
    );
  }

  const currentStageIndex = RFCTLARR_STAGES.findIndex(s => s.key === project.status);
  const effectiveStageIndex = currentStageIndex !== -1 ? currentStageIndex : 3;

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

      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-[#0F2E53] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Projects Portfolio</span>
        </Link>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
            UUID: {project.id}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            {project.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Project Header Banner */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-[#166534] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {project.code}
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {project.district_name}, {project.state_name}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-[#0F2E53] tracking-tight mt-1.5">
              {project.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {project.status === 'DRAFT' && (
              <button
                onClick={() => handleTransition('SUBMIT', 'Submitted for formal statutory scrutiny')}
                disabled={isProcessing}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#259492] text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit for Scrutiny</span>
              </button>
            )}

            {project.status === 'SCRUTINY' && (
              <>
                <button
                  onClick={() => handleTransition('APPROVE', 'Proposal scrutinised and cleared for notification')}
                  disabled={isProcessing}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Grant Statutory Approval</span>
                </button>
                <button
                  onClick={() => handleTransition('CLARIFICATION', 'Additional cadastral parcel demarcation required')}
                  disabled={isProcessing}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-bold shadow-xs transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Request Clarification</span>
                </button>
              </>
            )}

            <Link
              href="/dashboard/gis"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
            >
              <Layers className="h-3.5 w-3.5 text-slate-500" />
              <span>View Cadastral Map</span>
            </Link>
          </div>
        </div>

        {/* RFCTLARR 2013 Statutory Stage Progression Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
            RFCTLARR Act 2013 Statutory Lifecycle Progression
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {RFCTLARR_STAGES.map((stg, idx) => {
              const isPast = idx < effectiveStageIndex;
              const isCurrent = idx === effectiveStageIndex;

              return (
                <div
                  key={stg.key}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-[#166534] text-white border-[#166534] shadow-xs ring-2 ring-emerald-200'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200 font-medium'
                      : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {isPast ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : isCurrent ? (
                      <Clock className="h-3.5 w-3.5 text-white animate-pulse" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <div className="text-[10px] font-bold leading-tight line-clamp-2">
                    {stg.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'overview'
              ? 'bg-[#0F2E53] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Corridor Dossier
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'timeline'
              ? 'bg-[#0F2E53] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="h-3.5 w-3.5" />
          <span>Audit Timeline ({timeline.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('parcels')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'parcels'
              ? 'bg-[#0F2E53] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Cadastral Parcels ({parcels.length})</span>
        </button>
      </div>

      {/* Tab 1: Corridor Dossier */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#0F2E53] uppercase tracking-wider">
                Statutory Particulars
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Requiring Body</span>
                  <span className="font-semibold text-slate-800 mt-1 block">{project.requiring_body}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Statutory Purpose</span>
                  <span className="font-semibold text-slate-800 mt-1 block">{project.purpose}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Sanctioned Escrow Outlay</span>
                  <span className="font-bold text-[#166534] font-mono text-sm mt-1 block">
                    ₹ {(project.estimated_budget / 10000000).toFixed(2)} Crores
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Required Corridor Area</span>
                  <span className="font-bold text-slate-800 font-mono text-sm mt-1 block">
                    {project.estimated_area_hectares} Hectares
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-[#0F2E53] uppercase tracking-wider mb-3">
                Statutory Sub-Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="/dashboard/notifications"
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-[#166534] hover:bg-slate-50 transition-all flex flex-col justify-between"
                >
                  <FileText className="h-5 w-5 text-[#166534] mb-2" />
                  <span className="text-xs font-bold text-[#0F2E53]">Gazette Section 11/19</span>
                  <span className="text-[10px] text-slate-500 mt-1">Issue official notification orders</span>
                </Link>

                <Link
                  href="/dashboard/compensation"
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-[#166534] hover:bg-slate-50 transition-all flex flex-col justify-between"
                >
                  <Coins className="h-5 w-5 text-amber-600 mb-2" />
                  <span className="text-xs font-bold text-[#0F2E53]">Section 23/31 Awards</span>
                  <span className="text-[10px] text-slate-500 mt-1">Solatium & 12% interest calculations</span>
                </Link>

                <Link
                  href="/dashboard/rehabilitation"
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-[#166534] hover:bg-slate-50 transition-all flex flex-col justify-between"
                >
                  <Building2 className="h-5 w-5 text-purple-600 mb-2" />
                  <span className="text-xs font-bold text-[#0F2E53]">R&R Entitlements</span>
                  <span className="text-[10px] text-slate-500 mt-1">Second Schedule resettlement grants</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Jurisdiction & Officials */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-[#0F2E53] uppercase tracking-wider mb-4">
                Statutory Jurisdiction
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">State:</span>
                  <span className="font-semibold text-slate-800">{project.state_name || 'Haryana'}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">District:</span>
                  <span className="font-semibold text-slate-800">{project.district_name || 'Gurugram'}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">CALA Authority:</span>
                  <span className="font-semibold text-slate-800">Deputy Commissioner, Gurugram</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Nodal Entity:</span>
                  <span className="font-semibold text-slate-800">{project.organization_name}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 p-5 border border-amber-200 text-xs text-amber-900">
              <div className="flex items-center space-x-2 font-bold mb-1">
                <AlertTriangle className="h-4 w-4 text-amber-700" />
                <span>Statutory 12-Month Rule</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed mt-1">
                Under Section 25 of RFCTLARR Act 2013, the award must be pronounced within 12 months from the date of Section 19 publication, or the acquisition proceedings lapse.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Timeline & Audit History */}
      {activeTab === 'timeline' && (
        <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-[#0F2E53] uppercase tracking-wider mb-6">
            Immutable Audit Trail & Workflow Actions
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {timeline.map((entry, idx) => (
              <div key={entry.id || idx} className="relative">
                <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-[#166534] border-2 border-white ring-2 ring-emerald-100" />
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-[#0F2E53] text-sm">
                      {entry.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-1 text-slate-600 font-medium">
                    {entry.comment}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Actor: <strong>{entry.actor_name}</strong> ({entry.actor_role})
                    </span>
                    <span className="font-mono text-emerald-700">Audit Logged (SHA-256)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Cadastral Parcels */}
      {activeTab === 'parcels' && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0F2E53]">
                Cadastral Survey Parcels on Corridor Alignment
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Total {parcels.length} registered Khasras mapped via PostGIS
              </p>
            </div>

            <Link
              href="/dashboard/gis"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#166534] text-white text-xs font-bold hover:bg-[#259492] transition-colors"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Open in GIS Map</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Khasra No</th>
                  <th className="px-4 py-3">Village / Tehsil</th>
                  <th className="px-4 py-3">Landowner</th>
                  <th className="px-4 py-3">Area (Ha)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Total Compensation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parcels.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#0F2E53]">{p.khasraNo}</td>
                    <td className="px-4 py-3 text-slate-700">{p.village} ({p.tehsil})</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{p.landowner}</td>
                    <td className="px-4 py-3 font-mono">{p.areaHectares} Ha</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {p.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-800">
                      ₹ {(p.totalCompensation || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

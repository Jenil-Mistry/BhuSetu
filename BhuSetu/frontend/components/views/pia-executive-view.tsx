'use client';

import React, { useState } from 'react';
import { KpiGlanceRow } from '@/components/pia/kpi-glance';
import { MapClientWrapper } from '@/components/pia/map-client-wrapper';
import { MilestoneTracker } from '@/components/pia/milestone-tracker';
import { InitiateAcquisitionModal } from '@/components/pia/initiate-acquisition-modal';
import { 
  MOCK_KPI, 
  MOCK_PARCELS, 
  MOCK_CHAINAGE_PACKAGES 
} from '@/lib/mock-data';
import { CadastralParcel, ChainagePackage, RfctlarrStatus } from '@/types/rfctlarr';
import { 
  Plus, 
  Download, 
  AlertTriangle, 
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

export const PiaExecutiveView: React.FC = () => {
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<CadastralParcel | null>(null);
  const [mapFilter, setMapFilter] = useState<RfctlarrStatus | 'all'>('all');
  const [packagesList, setPackagesList] = useState<ChainagePackage[]>(MOCK_CHAINAGE_PACKAGES);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleNewStretchAdded = (newStretch: any) => {
    const newPkg: ChainagePackage = {
      id: `pkg-0${packagesList.length + 1}`,
      code: `PKG-0${packagesList.length + 1}`,
      title: newStretch.stretchName,
      district: newStretch.district,
      chainageStart: newStretch.chainageStart,
      chainageEnd: newStretch.chainageEnd,
      lengthKm: 34.5,
      totalParcels: 342,
      sec11Count: 342,
      sec19Count: 0,
      awardCount: 0,
      possessionCount: 0,
      possessionPercentage: 0,
      criticalFlag: false,
      slaDaysLeft: 180,
      bottleneckSummary: 'Freshly initiated under Sec 11; Patwari field verification queued',
    };
    setPackagesList([newPkg, ...packagesList]);
  };

  const handleExportLedger = () => {
    setExportNotice('Exporting RoW Cadastral Ledger (CSV & GeoJSON)... Download started.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Export Toast Banner if active */}
      {exportNotice && (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{exportNotice}</span>
          </div>
          <button 
            onClick={() => setExportNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Action Panel Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              NHAI / National Highways Authority of India
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">RFCTLARR Statutory Console</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F2E53] mt-0.5">
            Project Implementing Agency (PIA) Dashboard
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportLedger}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold border border-slate-200 shadow-xs transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export RoW Ledger</span>
          </button>

          <button
            onClick={() => setIsInitiateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#259492] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Initiate New Acquisition</span>
          </button>
        </div>
      </div>

      {/* KPI Row: The Glance (4 High-Contrast Cards) */}
      <section aria-label="KPI Glance">
        <KpiGlanceRow 
          data={MOCK_KPI} 
          onFilterBottlenecks={() => setMapFilter('disputed')} 
        />
      </section>

      {/* Bento Grid: Spatial Widget (50% Viewport) & Corridor Intelligence */}
      <section aria-label="Spatial Widget & Corridor Analytics" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spatial Widget (Occupies 50% / 8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <MapClientWrapper
            parcels={MOCK_PARCELS}
            selectedParcelId={selectedParcel?.id}
            onSelectParcel={setSelectedParcel}
            filterStatus={mapFilter}
          />
        </div>

        {/* Side Bento Cards: Statutory Health & Immediate RoW Blockers */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          {/* Card 1: Statutory Compliance Meter */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Statutory Health
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  94.2% Compliant
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-[#0F2E53]">
                RFCTLARR Act 2013 Timeline Integrity
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Strict 12-month statutory window between Section 11 Preliminary Notification and Section 19 Award Declaration.
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Section 11 to 19 Cycle Time:</span>
                  <span className="font-semibold text-slate-800 font-mono">148 Days Avg</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Sec 15 Objections Cleared:</span>
                  <span className="font-semibold text-emerald-600 font-mono">214 / 262</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">CALA Award Pronouncements:</span>
                  <span className="font-semibold text-slate-800 font-mono">1,860 Parcels</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Last updated: 14 mins ago</span>
              <span className="text-[#166534] font-medium">Bhoomi API Sync OK</span>
            </div>
          </div>

          {/* Card 2: Immediate Bottlenecks Needing PIA Action */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-rose-600 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  High Priority RoW Blockers
                </h4>
              </div>

              <div className="space-y-3 mt-3">
                <div 
                  onClick={() => {
                    const p = MOCK_PARCELS.find(p => p.khasraNo === '204');
                    if (p) setSelectedParcel(p);
                  }}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-rose-50/50 cursor-pointer transition-colors border border-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">Kh. 204 • Fazilpur (Ch 8+150)</span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">High Court Stay</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Co-sharer partition dispute halting 1.15 Ha of main carriageway alignment.
                  </p>
                </div>

                <div 
                  onClick={() => {
                    const p = MOCK_PARCELS.find(p => p.khasraNo === '550/1');
                    if (p) setSelectedParcel(p);
                  }}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 cursor-pointer transition-colors border border-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">Kh. 550/1 • Pataudi (Ch 24+150)</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Sec 64 Dispute</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Landowner objection regarding horticultural asset valuation in solatium computation.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setMapFilter('disputed')}
                className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-semibold text-[#0F2E53] hover:bg-slate-50 transition-colors"
              >
                <span>Highlight All 14 Bottlenecks on Vector Map</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Milestone Tracker Data Table */}
      <section aria-label="Milestone Tracker">
        <MilestoneTracker 
          packages={packagesList}
          onSelectPackage={(pkg) => {
            alert(`Selected ${pkg.title}. Filtered map zoom to Chainage ${pkg.chainageStart} to ${pkg.chainageEnd}`);
          }}
        />
      </section>

      {/* Initiate New Acquisition Modal */}
      <InitiateAcquisitionModal
        isOpen={isInitiateModalOpen}
        onClose={() => setIsInitiateModalOpen(false)}
        onSubmitSuccess={handleNewStretchAdded}
      />
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  MapPin, 
  Coins, 
  Layers, 
  Users, 
  FileText,
  Building2,
  Calendar
} from 'lucide-react';
import { reportsApi } from '@/lib/api';

export default function ReportsPage() {
  const [activeExport, setActiveExport] = useState<{ id: string; name: string; status: string } | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExport = async (reportType: string, filename: string) => {
    setActiveExport({ id: 'exp-init', name: filename, status: 'PROCESSING' });
    setExportNotice(`Generating asynchronous MIS report "${filename}"...`);
    
    try {
      const res = await reportsApi.triggerExport(reportType);
      setActiveExport({ id: res.export_id, name: filename, status: 'COMPLETED' });
      setExportNotice(`Report "${filename}" generated successfully. Ready for download.`);
    } catch {
      setActiveExport(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {exportNotice && (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{exportNotice}</span>
          </div>
          <button onClick={() => setExportNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              Management Information System (MIS) • Ministry Dashboard
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Asynchronous Analytical Exports</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F2E53] mt-0.5">
            Executive MIS Reports & Export Center
          </h2>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>Report Cut-off: <strong>04 Sep 2026</strong></span>
        </div>
      </div>

      {/* National Analytics KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Acquisition Efficiency</span>
          <div className="mt-2 text-2xl font-extrabold text-[#0F2E53] font-mono">68.0%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#166534] h-full rounded-full w-[68%]" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
            <span>Acquired: 985.4 Ha</span>
            <span>Req: 1,450 Ha</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Disbursement Rate</span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-700 font-mono">66.0%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full w-[66%]" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
            <span>Disbursed: ₹ 318.2 Cr</span>
            <span>CALA: ₹ 482.5 Cr</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Beneficiary PAF Reach</span>
          <div className="mt-2 text-2xl font-extrabold text-blue-700 font-mono">68.2%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full w-[68.2%]" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
            <span>Disbursed: 2,618 PAFs</span>
            <span>Total: 3,840 PAFs</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Section 11/19 Compliance</span>
          <div className="mt-2 text-2xl font-extrabold text-purple-800 font-mono">94.2%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full w-[94.2%]" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
            <span>Cycle: 148 Days Avg</span>
            <span>Lapsed: 0</span>
          </div>
        </div>
      </div>

      {/* Asynchronous Export Center */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#0F2E53]">
            Asynchronous Statutory Export Jobs
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Download certified audit exports for CAG, Public Accounts Committee (PAC), or Ministry oversight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-8 w-8 text-[#166534]" />
              <div>
                <h4 className="text-xs font-bold text-[#0F2E53]">Complete RoW Cadastral Ledger</h4>
                <p className="text-[11px] text-slate-500">Every Khasra, ULPIN, owner, and statutory status (CSV)</p>
              </div>
            </div>
            <button
              onClick={() => handleExport('ROW_CADASTRE', 'RoW_Cadastral_Ledger_2026.csv')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-[#0F2E53] shadow-xs"
            >
              Export CSV
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-8 w-8 text-amber-600" />
              <div>
                <h4 className="text-xs font-bold text-[#0F2E53]">PFMS DBT Disbursement Reconciliation</h4>
                <p className="text-[11px] text-slate-500">Batch IDs, UTR transaction refs, and bank transfers (CSV)</p>
              </div>
            </div>
            <button
              onClick={() => handleExport('PFMS_RECON', 'PFMS_DBT_Disbursements_2026.csv')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-[#0F2E53] shadow-xs"
            >
              Export CSV
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-8 w-8 text-purple-600" />
              <div>
                <h4 className="text-xs font-bold text-[#0F2E53]">Second Schedule R&R Beneficiary Register</h4>
                <p className="text-[11px] text-slate-500">All affected families, house allotments, and grants (CSV)</p>
              </div>
            </div>
            <button
              onClick={() => handleExport('RR_REGISTER', 'RR_Affected_Families_2026.csv')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-[#0F2E53] shadow-xs"
            >
              Export CSV
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Layers className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="text-xs font-bold text-[#0F2E53]">PostGIS Cadastral Vector Polygon Layer</h4>
                <p className="text-[11px] text-slate-500">GeoJSON boundary package with geodetic area metadata</p>
              </div>
            </div>
            <button
              onClick={() => handleExport('GEOJSON_LAYER', 'Cadastral_Vector_Layer.geojson')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-[#0F2E53] shadow-xs"
            >
              Export GeoJSON
            </button>
          </div>
        </div>

        {activeExport && activeExport.status === 'COMPLETED' && (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center space-x-2 font-semibold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{activeExport.name} is ready for download.</span>
            </div>
            <button
              onClick={() => setExportNotice(`Downloaded MIS Report archive: ${activeExport.name} (CSV/PDF format).`)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#166534] text-white text-xs sm:text-sm font-bold hover:bg-[#12542a] shadow-sm cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download File</span>
            </button>
          </div>
        )}
      </div>

      {/* District Comparison Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-[#0F2E53]">
            District CALA Performance Comparison
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time acquisition metrics across Haryana, Delhi-NCR, and Western Corridor
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Active Projects</th>
                <th className="px-4 py-3">Total Acquired</th>
                <th className="px-4 py-3">Disbursed (Cr)</th>
                <th className="px-4 py-3">SLA Status</th>
                <th className="px-4 py-3">CALA Authority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-[#0F2E53]">Gurugram</td>
                <td className="px-4 py-3 text-slate-600">Haryana</td>
                <td className="px-4 py-3 font-mono">5 Projects</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-800">890.4 Ha</td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-800">₹ 284.5 Cr</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                    On Schedule
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">Sh. Nishant Kumar Yadav, IAS</td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-[#0F2E53]">Rewari</td>
                <td className="px-4 py-3 text-slate-600">Haryana</td>
                <td className="px-4 py-3 font-mono">3 Projects</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-800">340.2 Ha</td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-800">₹ 92.1 Cr</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                    Sec 15 Hearing Active
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">Sh. Rahul Narwal, IAS</td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-[#0F2E53]">Nuh</td>
                <td className="px-4 py-3 text-slate-600">Haryana</td>
                <td className="px-4 py-3 font-mono">2 Projects</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-800">190.5 Ha</td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-800">₹ 48.6 Cr</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                    On Schedule
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">Sh. Dhirendra Khadgata, IAS</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Coins, 
  Calendar, 
  FileText, 
  Send,
  X,
  ExternalLink
} from 'lucide-react';
import { projectsApi } from '@/lib/api';
import { ProjectEntity } from '@/lib/mock-data';

const STATUS_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Draft Proposal' },
  SUBMITTED: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Submitted for Scrutiny' },
  SCRUTINY: { bg: 'bg-amber-50', text: 'text-amber-800', label: 'Under Scrutiny' },
  RECOMMENDED: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Recommended by CALA' },
  APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-800', label: 'Statutory Approval Granted' },
  NOTIFICATION_IN_PROGRESS: { bg: 'bg-teal-50', text: 'text-teal-800', label: 'Section 11/19 Active' },
  AWARD_IN_PROGRESS: { bg: 'bg-purple-50', text: 'text-purple-800', label: 'Award & Solatium Active' },
  COMPENSATION_IN_PROGRESS: { bg: 'bg-cyan-50', text: 'text-cyan-800', label: 'PFMS Disbursement' },
  POSSESSION_IN_PROGRESS: { bg: 'bg-green-50', text: 'text-green-800', label: 'Possession & Site Handover' },
  RR_IN_PROGRESS: { bg: 'bg-rose-50', text: 'text-rose-800', label: 'R&R Resettlement' },
  COMPLETED: { bg: 'bg-emerald-100', text: 'text-emerald-900', label: 'Acquisition Completed' },
  ON_HOLD: { bg: 'bg-rose-100', text: 'text-rose-900', label: 'Statutory Hold' },
  REJECTED: { bg: 'bg-red-50', text: 'text-red-700', label: 'Rejected' },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState('Gurugram');
  const [budget, setBudget] = useState('850000000');
  const [area, setArea] = useState('68.5');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsApi.list();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await projectsApi.create({
        name,
        code: code || `NH48-${Math.floor(100 + Math.random() * 900)}`,
        description,
        district_name: district,
        estimated_budget: Number(budget),
        estimated_area_hectares: Number(area),
        purpose: purpose || 'Greenfield corridor acquisition',
      });
      setProjects([created, ...projects]);
      setIsNewModalOpen(false);
      setActionSuccess(`Proposal "${created.name}" initiated successfully.`);
      setTimeout(() => setActionSuccess(null), 4000);
      setName('');
      setCode('');
      setDescription('');
      setPurpose('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (p.district_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const totalBudget = projects.reduce((acc, p) => acc + (p.estimated_budget || 0), 0);
  const totalArea = projects.reduce((acc, p) => acc + (p.estimated_area_hectares || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
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

      {/* Header & New Proposal Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              RFCTLARR Act 2013 • Proposal Intake & Scrutiny
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">National Acquisition Portfolio</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F2E53] mt-0.5">
            Land Acquisition Projects & Proposals
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#259492] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Initiate New Proposal</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Active Projects</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <FolderKanban className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-[#0F2E53] font-mono">{projects.length}</div>
          <div className="mt-1 text-xs text-slate-500">Across Delhi-NCR & Western Corridor</div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated RoW Land</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-[#0F2E53] font-mono">{totalArea.toFixed(1)} <span className="text-sm font-semibold">Ha</span></div>
          <div className="mt-1 text-xs text-slate-500">Linear highway corridor right-of-way</div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Financial Outlay</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-[#0F2E53] font-mono">₹ {(totalBudget / 10000000).toFixed(1)} <span className="text-sm font-semibold">Cr</span></div>
          <div className="mt-1 text-xs text-slate-500">Approved budget & escrow allocations</div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Statutory SLA Compliance</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-emerald-700 font-mono">94.2%</div>
          <div className="mt-1 text-xs text-slate-500">Adhering to Sec 11 to 19 timeline</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project name, code, or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#166534]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto scrollbar-none">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-semibold shrink-0">Stage:</span>
          {['ALL', 'DRAFT', 'SUBMITTED', 'SCRUTINY', 'APPROVED', 'NOTIFICATION_IN_PROGRESS'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-[#0F2E53] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="col-span-2 py-12 flex justify-center items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#166534] border-t-transparent" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-2 py-12 text-center bg-white rounded-2xl border border-slate-200">
            <FolderKanban className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">No projects match the selected criteria.</p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const badge = STATUS_BADGES[project.status] || { bg: 'bg-slate-100', text: 'text-slate-700', label: project.status };
            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-[#166534] transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {project.code}
                      </span>
                      <h3 className="text-base font-bold text-[#0F2E53] mt-2 leading-snug">
                        {project.name}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">District & State</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-[#166534]" />
                        {project.district_name || 'Gurugram'}, {project.state_name || 'Haryana'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Estimated Budget</span>
                      <span className="font-semibold text-slate-700 font-mono mt-0.5 block">
                        ₹ {(project.estimated_budget / 10000000).toFixed(2)} Cr
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">RoW Corridor Area</span>
                      <span className="font-semibold text-slate-700 font-mono mt-0.5 block">
                        {project.estimated_area_hectares} Hectares
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">SLA Window</span>
                      <span className="font-semibold text-amber-700 font-mono mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {project.sla_days_left || 60} Days Left
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </span>

                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#166534] hover:text-[#259492] transition-colors"
                  >
                    <span>View Lifecycle & Audit</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Project Proposal Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FolderKanban className="h-5 w-5 text-[#166534]" />
                <h3 className="text-base font-bold text-[#0F2E53]">Initiate Acquisition Proposal</h3>
              </div>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Corridor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NH-48 Greenfield Connector (Package 04)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#166534] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Project Code</label>
                  <input
                    type="text"
                    placeholder="e.g. NH48-PKG-04"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District Jurisdiction *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#166534] focus:outline-none bg-white"
                  >
                    <option value="Gurugram">Gurugram (Haryana)</option>
                    <option value="Rewari">Rewari (Haryana)</option>
                    <option value="Nuh">Nuh (Haryana)</option>
                    <option value="Faridabad">Faridabad (Haryana)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Budget (INR)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#166534] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Area (Hectares)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#166534] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Public Purpose & Alignment Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the statutory public purpose under Section 2(1) of RFCTLARR Act 2013..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#166534] focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  Creating a proposal registers an initial draft. It will require uploading DPR/KML alignments before formal submission for statutory scrutiny.
                </span>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#166534] text-white font-bold hover:bg-[#259492] transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Register Project Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Home, 
  Coins, 
  Plus, 
  CheckCircle2, 
  HeartHandshake, 
  Building2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  X,
  Send,
  AlertCircle
} from 'lucide-react';
import { rehabilitationApi, projectsApi } from '@/lib/api';
import { AffectedFamilyEntity, ProjectEntity } from '@/lib/mock-data';

export default function RehabilitationPage() {
  const [families, setFamilies] = useState<AffectedFamilyEntity[]>([]);
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('11111111-1111-1111-1111-111111111111');
  const [loading, setLoading] = useState(true);
  const [isNewFamilyModalOpen, setIsNewFamilyModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form State
  const [headName, setHeadName] = useState('');
  const [category, setCategory] = useState<'LANDOWNER' | 'AGRICULTURAL_LABOURER' | 'TENANT' | 'RURAL_ARTISAN'>('LANDOWNER');
  const [village, setVillage] = useState('Fazilpur');
  const [membersCount, setMembersCount] = useState(4);
  const [isDisplaced, setIsDisplaced] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedProjectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fams, projs] = await Promise.all([
        rehabilitationApi.listFamilies(selectedProjectId),
        projectsApi.list(),
      ]);
      setFamilies(fams);
      setProjects(projs);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await rehabilitationApi.registerFamily(selectedProjectId, {
        family_head_name: headName,
        category,
        village_name: village,
        members_count: membersCount,
        is_displaced: isDisplaced,
      });
      setFamilies([created, ...families]);
      setIsNewFamilyModalOpen(false);
      setActionSuccess(`Affected Family head "${created.family_head_name}" registered in R&R ledger.`);
      setTimeout(() => setActionSuccess(null), 4000);
      setHeadName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalDisplaced = families.filter(f => f.is_displaced).length;
  const totalBeneficiaries = families.reduce((acc, f) => acc + f.members_count, 0);

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
              RFCTLARR Act 2013 • Second Schedule Entitlements
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Rehabilitation & Resettlement (R&R)</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F2E53] mt-0.5">
            Project Affected Families (PAF) & Resettlement
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsNewFamilyModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#259492] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Register Affected Family</span>
          </button>
        </div>
      </div>

      {/* R&R KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Families</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-[#0F2E53] font-mono">{families.length}</div>
          <div className="mt-1 text-xs text-slate-500">Total {totalBeneficiaries} individual members</div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Physically Displaced</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <Home className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-rose-700 font-mono">{totalDisplaced}</div>
          <div className="mt-1 text-xs text-slate-500">Eligible for resettlement house allotment</div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subsistence Allowance</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-[#166534] font-mono">₹ 50,000 <span className="text-xs font-medium">/ family</span></div>
          <div className="mt-1 text-xs text-slate-500">Statutory lump-sum subsistence grant</div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rehabilitation Progress</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <HeartHandshake className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-purple-800 font-mono">87.5%</div>
          <div className="mt-1 text-xs text-slate-500">Entitlements sanctioned & disbursed</div>
        </div>
      </div>

      {/* Second Schedule Statutory Entitlements Guide */}
      <div className="rounded-2xl bg-blue-50/70 p-5 border border-blue-200 text-xs text-blue-950 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-blue-900">
          <ShieldCheck className="h-4 w-4 text-blue-700" />
          <span>Statutory Protection of Displaced Persons</span>
        </div>
        <p className="text-[11px] text-blue-800 leading-relaxed">
          Per RFCTLARR Act 2013 Second Schedule: Each displaced family in rural areas must be given a free pucca house (minimum 50 sq. m carpet area) or one-time financial assistance in lieu of house, plus ₹50,000 subsistence allowance and transport subsidy.
        </p>
      </div>

      {/* Families List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#166534] border-t-transparent" />
          </div>
        ) : families.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">No affected families registered yet.</p>
          </div>
        ) : (
          families.map((fam) => (
            <div
              key={fam.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:border-[#166534] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-[#0F2E53]">
                      {fam.family_head_name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {fam.category.replace(/_/g, ' ')}
                    </span>
                    {fam.is_displaced && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                        Displaced Family
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Village: <strong>{fam.village_name}</strong> • Family Members: <strong>{fam.members_count}</strong> • Aadhaar: <span className="font-mono">{fam.aadhaar_masked}</span>
                  </p>
                </div>

                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {fam.entitlements.length} Entitlements Mapped
                </span>
              </div>

              {/* Entitlements Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                {fam.entitlements.map((ent, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#0F2E53] text-[11px]">
                          {ent.type.replace(/_/g, ' ')}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          ent.status === 'DISBURSED' || ent.status === 'POSSESSION_GIVEN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ent.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {ent.description}
                      </p>
                    </div>

                    {ent.amount && (
                      <div className="mt-2 pt-1.5 border-t border-slate-200 text-right font-mono font-bold text-emerald-800">
                        ₹ {ent.amount.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Register Family Modal */}
      {isNewFamilyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#0F2E53] mb-1">
              Register Project Affected Family (PAF)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter beneficiary details for Second Schedule R&R entitlement allocation.
            </p>

            <form onSubmit={handleRegisterFamily} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Family Head Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Singh Yadav"
                  value={headName}
                  onChange={(e) => setHeadName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#166534] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="LANDOWNER">Landowner</option>
                    <option value="AGRICULTURAL_LABOURER">Agri Labourer</option>
                    <option value="TENANT">Tenant / Sharecropper</option>
                    <option value="RURAL_ARTISAN">Rural Artisan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Village *</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Members Count</label>
                  <input
                    type="number"
                    min="1"
                    value={membersCount}
                    onChange={(e) => setMembersCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <label className="flex items-center space-x-2 mt-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDisplaced}
                      onChange={(e) => setIsDisplaced(e.target.checked)}
                      className="rounded text-[#166534] focus:ring-[#166534]"
                    />
                    <span className="font-semibold text-slate-700">Physically Displaced</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewFamilyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#166534] text-white font-bold hover:bg-[#259492]"
                >
                  {isSubmitting ? 'Registering...' : 'Register in R&R Ledger'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

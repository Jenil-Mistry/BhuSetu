'use client';

import React, { useState } from 'react';
import { ChainagePackage } from '@/types/rfctlarr';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Filter, 
  Search, 
  Download,
  Calendar,
  Layers,
  Clock
} from 'lucide-react';

interface MilestoneTrackerProps {
  packages: ChainagePackage[];
  onSelectPackage?: (pkg: ChainagePackage) => void;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({
  packages,
  onSelectPackage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'healthy'>('all');

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = 
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'critical') return matchesSearch && pkg.criticalFlag;
    if (selectedFilter === 'healthy') return matchesSearch && !pkg.criticalFlag;
    return matchesSearch;
  });

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-[#166534]" />
            <h3 className="text-lg font-bold text-[#0F2E53] tracking-tight">
              Milestone Tracker: Chainage-Wise Readiness
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Real-time tracking of RFCTLARR Act 2013 statutory milestones from Section 11 to Section 38 Physical Possession.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search chainage, district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-[#166534] focus:outline-none w-48 text-slate-800"
            />
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex rounded-xl bg-slate-50 p-1 text-xs font-medium">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedFilter === 'all' ? 'bg-white text-[#0F2E53] shadow-xs' : 'text-slate-500'
              }`}
            >
              All ({packages.length})
            </button>
            <button
              onClick={() => setSelectedFilter('critical')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedFilter === 'critical' ? 'bg-white text-rose-600 shadow-xs font-semibold' : 'text-slate-500'
              }`}
            >
              Bottlenecks ({packages.filter((p) => p.criticalFlag).length})
            </button>
            <button
              onClick={() => setSelectedFilter('healthy')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedFilter === 'healthy' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              On Schedule ({packages.filter((p) => !p.criticalFlag).length})
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
              <th className="py-3 px-4">Package / Chainage</th>
              <th className="py-3 px-4">District</th>
              <th className="py-3 px-4">Length</th>
              <th className="py-3 px-4">Total Parcels</th>
              <th className="py-3 px-4">Sec 11 Notified</th>
              <th className="py-3 px-4">Sec 19 Declared</th>
              <th className="py-3 px-4">Award Status</th>
              <th className="py-3 px-4 min-w-[140px]">Possession Taken</th>
              <th className="py-3 px-4">Statutory SLA</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredPackages.map((pkg) => {
              const isBottleneck = pkg.criticalFlag;
              return (
                <tr
                  key={pkg.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => onSelectPackage?.(pkg)}
                >
                  {/* Package Code & Title */}
                  <td className="py-4 px-4 font-medium text-slate-800">
                    <div className="font-bold text-[#0F2E53] flex items-center space-x-1.5">
                      <span>{pkg.code}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        (Ch {pkg.chainageStart} to {pkg.chainageEnd})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{pkg.title}</div>
                    {pkg.bottleneckSummary && (
                      <div className="text-[10px] text-rose-600 mt-1 flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1 shrink-0" />
                        {pkg.bottleneckSummary}
                      </div>
                    )}
                  </td>

                  {/* District */}
                  <td className="py-4 px-4 text-slate-600 font-medium">{pkg.district}</td>

                  {/* Length */}
                  <td className="py-4 px-4 text-slate-600 font-mono">{pkg.lengthKm} km</td>

                  {/* Total Parcels */}
                  <td className="py-4 px-4 font-semibold text-slate-700">{pkg.totalParcels}</td>

                  {/* Sec 11 */}
                  <td className="py-4 px-4">
                    <span className="font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      {pkg.sec11Count} / {pkg.totalParcels}
                    </span>
                  </td>

                  {/* Sec 19 */}
                  <td className="py-4 px-4">
                    <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      {pkg.sec19Count}
                    </span>
                  </td>

                  {/* Award */}
                  <td className="py-4 px-4">
                    <span className="font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {pkg.awardCount}
                    </span>
                  </td>

                  {/* Possession % */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-slate-800">{pkg.possessionPercentage}%</span>
                      <span className="text-slate-400">{pkg.possessionCount} Khasras</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pkg.possessionPercentage > 80
                            ? 'bg-emerald-500'
                            : pkg.possessionPercentage > 50
                            ? 'bg-[#166534]'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${pkg.possessionPercentage}%` }}
                      />
                    </div>
                  </td>

                  {/* SLA */}
                  <td className="py-4 px-4">
                    {isBottleneck ? (
                      <span className="inline-flex items-center space-x-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                        <Clock className="h-3 w-3" />
                        <span>{pkg.slaDaysLeft}d SLA Left</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{pkg.slaDaysLeft}d Left</span>
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-right">
                    <button 
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-[#166534] hover:text-[#0F2E53] transition-colors p-1"
                      title="View Stretch Details"
                    >
                      <span>Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

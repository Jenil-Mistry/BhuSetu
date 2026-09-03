'use client';

import React from 'react';
import { 
  Building2, 
  MapPin, 
  Layers, 
  ShieldCheck, 
  Smartphone, 
  Briefcase, 
  FileSpreadsheet, 
  Scale, 
  UserCheck, 
  Landmark,
  ChevronDown,
  Bell
} from 'lucide-react';

interface AppHeaderProps {
  currentRole?: string;
  onRoleChange?: (role: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  currentRole = 'pia', 
  onRoleChange 
}) => {
  const roles = [
    { id: 'pia', label: 'PIA Executive', icon: Landmark, badge: 'Desktop' },
    { id: 'revenue-officer', label: 'Field Officer', icon: Smartphone, badge: 'PWA' },
    { id: 'cala', label: 'CALA / Collector', icon: Scale, badge: 'Tablet/Web' },
    { id: 'citizen', label: 'Citizen / PAF', icon: UserCheck, badge: 'Mobile Web' },
    { id: 'central', label: 'Central Authority', icon: Building2, badge: 'Executive' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-[#0b213b]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 text-xs text-slate-200">
          <div className="flex items-center space-x-3">
            <span className="font-semibold tracking-wider text-amber-400 uppercase">Government of India</span>
            <span className="text-slate-500">•</span>
            <span className="hidden sm:inline">Ministry of Road Transport & Highways / MoRTH</span>
            <span className="text-slate-500">•</span>
            <span className="font-medium text-slate-300">RFCTLARR Act, 2013 Statutory Portal</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-mono">PFMS / Bhoomi Live</span>
            </div>
            <button className="relative p-1 hover:text-white transition-colors text-slate-300" title="Statutory Notifications">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-rose-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 bg-white">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-[#0F2E53]">
            <Layers className="h-6 w-6 text-[#166534]" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-[#0F2E53] font-sans">BhuSetu</h1>
              <span className="text-sm font-medium text-[#166534]">भूसेतु</span>
              <span className="text-[10px] tracking-wide uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-[#166534] border border-emerald-100">v2.4 Live</span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Real-Time National Land Acquisition & Management System
            </p>
          </div>
        </div>

        {/* Project Selector Badge */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs">
            <MapPin className="h-3.5 w-3.5 text-[#166534]" />
            <div>
              <span className="text-slate-500 text-[10px] block leading-tight">Active Project Corridor</span>
              <span className="font-medium text-[#0F2E53]">NH-48 Greenfield Spur (Ch 0+000 - 120+000)</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="h-8 w-8 rounded-full bg-[#166534] flex items-center justify-center text-xs font-bold text-white shadow-inner">
              PA
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-medium text-[#0F2E53] leading-tight">Col. R. K. Sharma</div>
              <div className="text-[10px] text-slate-500">Project Director, PIA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Navigation Strip */}
      <div className="bg-white px-4 sm:px-6 border-t border-b border-slate-200 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center space-x-1 overflow-x-auto scrollbar-none pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-2 shrink-0 py-1.5">
            Lifecycle View:
          </span>
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = currentRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => onRoleChange?.(role.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs transition-all border-b-2 ${
                  isActive
                    ? 'text-[#0F2E53] font-bold border-[#166534]'
                    : 'text-slate-600 font-medium hover:text-[#0F2E53] border-transparent hover:border-slate-300'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#166534]' : 'text-slate-400'}`} />
                <span>{role.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-[#0F2E53]/10 text-[#0F2E53]' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {role.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

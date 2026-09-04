'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  MapPin, 
  Layers, 
  UserCheck, 
  ChevronDown,
  Bell,
  LogOut,
  LogIn,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { DashboardSubNav } from '@/components/dashboard/dashboard-subnav';
import { SITE_CONFIG } from '@/lib/site-config';

export const AppHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDashboardPage = pathname?.startsWith('/dashboard');

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      {/* Top National Tricolor Micro-Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

      {/* Top Utility Government Bar */}
      <div className="bg-[#0b213b] text-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6 text-xs">
          <div className="flex items-center space-x-2.5 flex-wrap">
            <span className="font-semibold tracking-wider text-amber-400 uppercase text-[11px]">
              {SITE_CONFIG.governmentEntity.countryHindi} | {SITE_CONFIG.governmentEntity.country}
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-300 text-[11px]">
              सड़क परिवहन एवं राजमार्ग मंत्रालय | MoRTH
            </span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="hidden md:inline font-medium text-slate-400 text-[11px]">
              RFCTLARR Act, 2013 Statutory System
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-mono text-[11px]">Workflow Live</span>
            </div>
            
            {/* Quick Language indicator */}
            <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-400 border-l border-slate-700 pl-3">
              <span className="hover:text-white cursor-pointer transition-colors" title="Standard View">A</span>
              <span className="hover:text-white cursor-pointer font-bold transition-colors" title="Enlarge Text">A+</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-300 font-medium cursor-pointer">हिन्दी</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand & Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 bg-white">
        {/* Logo & National Entity Identification */}
        <Link href="/" className="flex items-center space-x-3.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-[#0F2E53] shadow-xs group-hover:border-[#166534] transition-colors">
            <Layers className="h-6 w-6 text-[#166534]" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight text-[#0F2E53] font-sans">{SITE_CONFIG.name}</h1>
              <span className="text-sm font-bold text-[#166534]">{SITE_CONFIG.hindiName}</span>
              <span className="text-[10px] tracking-wide uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-[#166534] border border-emerald-200 font-bold">
                National Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              National Land Acquisition & Management System (RFCTLARR Act, 2013)
            </p>
          </div>
        </Link>

        {/* Dynamic Center / Right Controls based on Page Type */}
        {isDashboardPage ? (
          /* AUTHENTICATED DASHBOARD HEADER CONTROLS */
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Active Corridor Badge */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <MapPin className="h-3.5 w-3.5 text-[#166534] shrink-0" />
              <div>
                <span className="text-slate-500 text-[10px] block leading-tight">Active Project Corridor</span>
                <span className="font-semibold text-[#0F2E53] truncate max-w-[200px] block">
                  NH-48 Greenfield Spur (Ch 0 - 120 km)
                </span>
              </div>
            </div>

            {/* Official User Profile Popover */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2.5 pl-2 pr-3 py-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                aria-expanded={isProfileOpen}
              >
                <div className="h-8 w-8 rounded-full bg-[#166534] flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  {user?.initials || 'GOI'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-[#0F2E53] leading-tight flex items-center gap-1">
                    <span>{user?.name || 'Authorized Officer'}</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate max-w-[180px]">
                    {user?.designation || user?.badge}
                  </div>
                </div>
              </button>

              {/* Profile Info & Sign Out Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white p-2 shadow-xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <div className="text-xs font-bold text-[#0F2E53]">{user?.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{user?.designation}</div>
                    <div className="text-[11px] text-slate-500">{user?.department}</div>
                    <div className="text-[10px] font-mono text-emerald-700 mt-1.5">{user?.identifier}</div>
                  </div>

                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role & Jurisdiction</div>
                    <div className="text-xs font-semibold text-[#0F2E53]">{user?.badge}</div>
                    <div className="text-[11px] text-slate-500">{user?.jurisdiction}</div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out from Console</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <button 
              className="relative p-2 rounded-lg text-slate-500 hover:text-[#0F2E53] hover:bg-slate-100 transition-colors"
              title="Statutory Notices"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
          </div>
        ) : (
          /* PUBLIC LANDING / LOGIN NAVIGATION */
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-600">
              <Link href="/" className="hover:text-[#0F2E53] transition-colors">
                Home
              </Link>
              <Link href="#how-it-works" className="hover:text-[#0F2E53] transition-colors">
                How It Works
              </Link>
              <Link href="#capabilities" className="hover:text-[#0F2E53] transition-colors">
                Capabilities
              </Link>
              <Link href="#statutory-process" className="hover:text-[#0F2E53] transition-colors">
                Statutory Process
              </Link>
            </nav>

            {/* Public Header Action - Clear Login action, removing "Go to Official Dashboard" per point 5.6 */}
            <div className="flex items-center space-x-2">
              <Link
                href="/login?type=citizen"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5 text-[#166534]" />
                <span>Citizen Login</span>
              </Link>

              <Link
                href="/login?type=authority"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#0F2E53] hover:bg-[#0b213b] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Authority Login</span>
              </Link>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile navigation drawer for public page */}
      {!isDashboardPage && isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2 text-xs">
          <Link 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium hover:text-[#0F2E53]"
          >
            Home
          </Link>
          <Link 
            href="#how-it-works" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium hover:text-[#0F2E53]"
          >
            How It Works
          </Link>
          <Link 
            href="#capabilities" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium hover:text-[#0F2E53]"
          >
            Capabilities
          </Link>
          <Link 
            href="#statutory-process" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium hover:text-[#0F2E53]"
          >
            Statutory Process
          </Link>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login?type=citizen"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold"
            >
              <UserCheck className="h-4 w-4 text-[#166534]" />
              <span>Citizen / Affected Family Login</span>
            </Link>
            <Link
              href="/login?type=authority"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-[#0F2E53] text-white font-bold"
            >
              <LogIn className="h-4 w-4" />
              <span>Authority / Department Login</span>
            </Link>
          </div>
        </div>
      )}

      {/* Breadcrumb / Role Header Strip on Dashboard Pages */}
      {isDashboardPage && user && (
        <div className="bg-slate-50 px-4 sm:px-6 py-2 border-t border-b border-slate-200 text-xs">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-600">
              <Link href="/" className="hover:text-[#0F2E53] font-medium text-[11px]">
                BhuSetu Portal
              </Link>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-[#0F2E53] text-[11px]">{user.badge} Console</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 text-[11px] hidden sm:inline">{user.jurisdiction}</span>
            </div>

            <div className="flex items-center space-x-3 text-[11px]">
              <span className="hidden md:inline text-slate-500 font-mono">
                Session: <strong className="text-slate-700">Authenticated</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Statutory Sub Navigation on Dashboard Pages */}
      {isDashboardPage && <DashboardSubNav />}
    </header>
  );
};

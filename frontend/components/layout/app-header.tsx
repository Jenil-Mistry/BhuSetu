'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Smartphone, 
  Scale, 
  UserCheck, 
  Landmark, 
  ChevronDown, 
  Bell, 
  LogOut, 
  User, 
  Shield, 
  ExternalLink, 
  Menu, 
  X,
  Globe,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth, UserRole } from '@/lib/auth-context';
import { DashboardSubNav } from '@/components/dashboard/dashboard-subnav';
import { useLanguage } from '@/lib/language-context';

interface AppHeaderProps {
  currentRole?: string;
  onRoleChange?: (role: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentRole: propRole, onRoleChange }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'standard' | 'large' | 'xlarge'>('standard');
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const isDashboardPage = pathname?.startsWith('/dashboard');

  // Sync font size on load
  useEffect(() => {
    const savedSize = localStorage.getItem('bhusetu_font_size') as 'standard' | 'large' | 'xlarge';
    if (savedSize) {
      setFontSize(savedSize);
      document.documentElement.setAttribute('data-font-size', savedSize);
    }
  }, []);

  const handleFontSizeChange = (size: 'standard' | 'large' | 'xlarge') => {
    setFontSize(size);
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem('bhusetu_font_size', size);
  };

  const handleLogout = () => {
    logout();
    setIsRoleDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all duration-150">
      {/* Top National Tricolor Micro-Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

      {/* Top Utility Government Bar */}
      <div className="bg-[#0b213b] text-slate-100 w-full overflow-hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <span className="font-extrabold tracking-wide text-amber-400 uppercase text-[11px] sm:text-sm shrink-0">
              भारत सरकार <span className="hidden sm:inline">| Government of India</span>
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-200 text-xs sm:text-sm font-medium truncate">
              सड़क परिवहन एवं राजमार्ग मंत्रालय (MoRTH)
            </span>
            <span className="text-slate-500 hidden md:inline">•</span>
            <span className="hidden md:inline font-semibold text-emerald-400 text-xs sm:text-sm shrink-0">
              RFCTLARR Act, 2013 Statutory System
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <div className="hidden sm:flex items-center space-x-2 bg-slate-900/60 px-2.5 py-1 rounded-full border border-slate-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-mono text-xs font-bold">PFMS / Bhoomi LIVE</span>
            </div>
            
            {/* Functional Font Size Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-slate-300 sm:border-l sm:border-slate-700 sm:pl-3">
              <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-600">
                <button
                  type="button"
                  onClick={() => handleFontSizeChange('standard')}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold transition-colors cursor-pointer ${
                    fontSize === 'standard' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Standard Font Size (100%)"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => handleFontSizeChange('large')}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-black transition-colors cursor-pointer ${
                    fontSize === 'large' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Large Font Size (115%)"
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => handleFontSizeChange('xlarge')}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-black transition-colors cursor-pointer ${
                    fontSize === 'xlarge' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Extra Large Font Size (128%)"
                >
                  A++
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand & Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3.5 bg-white">
        {/* Logo & National Entity Identification */}
        <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3.5 group min-w-0">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-emerald-50 border-2 border-emerald-600 text-[#166534] shadow-sm group-hover:scale-105 transition-all shrink-0">
            <Layers className="h-5 w-5 sm:h-7 sm:w-7 text-[#166534]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline space-x-1.5 sm:space-x-2">
              <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[#0F2E53]">BhuSetu</span>
              <span className="text-base sm:text-lg md:text-xl font-black text-[#166534]">भूसेतु</span>
              <span className="hidden sm:inline-block text-[10px] sm:text-xs font-extrabold uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-100 text-[#166534] border border-emerald-300 shrink-0">
                National Portal
              </span>
            </div>
            <p className="hidden md:block text-xs sm:text-sm text-slate-600 font-semibold tracking-tight truncate">
              National Land Acquisition & Transparency System (RFCTLARR 2013)
            </p>
          </div>
        </Link>

        {/* Dynamic Center / Right Controls based on Page Type */}
        {isDashboardPage ? (
          /* AUTHENTICATED DASHBOARD HEADER CONTROLS */
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Active Corridor Badge */}
            <div className="hidden xl:flex items-center space-x-2.5 bg-emerald-50/70 border border-emerald-200 px-3.5 py-2 rounded-xl text-sm">
              <MapPin className="h-4 w-4 text-[#166534] shrink-0" />
              <div>
                <span className="text-slate-500 text-xs font-semibold block leading-tight">{t('nav.active_corridor', 'Active Corridor')}</span>
                <span className="font-bold text-[#0F2E53] truncate max-w-[200px] block">
                  NH-48 Greenfield Spur
                </span>
              </div>
            </div>

            {/* DEDICATED HIGH-VISIBILITY LANGUAGE TOGGLE (Visible on Every Page) */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border-2 border-emerald-600/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer shrink-0"
              title="Change Language / भाषा बदलें"
            >
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#166534]" />
              <span className="hidden sm:inline">{language === 'EN' ? 'हिन्दी (Hindi)' : 'English'}</span>
              <span className="sm:hidden">{language === 'EN' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* Notifications Button & Dropdown */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setUnreadNotifications(0);
                }}
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-[#0F2E53] hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                title="Statutory Notices & Alerts"
                aria-expanded={isNotificationsOpen}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-rose-600 ring-2 ring-white" />
                )}
              </button>

              {/* Notifications Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white p-4 shadow-2xl border-2 border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-[#0F2E53] flex items-center gap-1.5">
                      <Bell className="h-4 w-4 text-[#166534]" />
                      <span>{t('nav.notifications', 'Statutory Notifications')}</span>
                    </h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {t('nav.realtime_feed', 'Real-time Feed')}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 mt-2 space-y-2">
                    <div className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Sec 19 Award Gazetted
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">Just now</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        Award order published for NH-48 Greenfield Spur Pkg 01. PFMS payment queue active.
                      </p>
                    </div>

                    <div className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span className="text-amber-700 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> Hearing Notice (Sec 15)
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">2 hrs ago</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        CALA Collectorate scheduled 8 public objections hearing in Tehsil Pataudi.
                      </p>
                    </div>

                    <div className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span className="text-blue-700 flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" /> DILRMP Sync Completed
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">Today 10:30 AM</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        4,210 cadastral parcel boundaries synced from state revenue database.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="w-full text-center py-2 text-xs font-bold text-[#166534] hover:underline cursor-pointer"
                    >
                      {t('nav.close_notifications', 'Close Notifications')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Official User Profile Popover (SWITCH ROLE REMOVED POST-LOGIN) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center space-x-3 pl-2 pr-3.5 py-1.5 rounded-2xl hover:bg-slate-100 border border-slate-200 bg-slate-50/80 transition-all cursor-pointer"
                aria-expanded={isRoleDropdownOpen}
              >
                <div className="h-9 w-9 rounded-xl bg-[#166534] flex items-center justify-center text-sm font-black text-white shadow-sm">
                  {user?.initials || 'GOI'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-bold text-[#0F2E53] leading-tight flex items-center gap-1.5">
                    <span>{user?.name || 'Authorized Officer'}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <div className="text-xs text-slate-600 font-semibold truncate max-w-[190px]">
                    {user?.designation || user?.badge}
                  </div>
                </div>
              </button>

              {/* User Profile Details Menu (Clean, No Role Switching) */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-3 shadow-2xl border-2 border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-3 border-b border-slate-100 bg-slate-50 rounded-xl">
                    <div className="text-sm font-extrabold text-[#0F2E53]">{user?.name}</div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">{user?.department}</div>
                    <div className="text-xs font-mono text-emerald-800 font-bold mt-1.5">{user?.identifier}</div>
                  </div>

                  <div className="py-3 px-3.5 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500 font-semibold">Active Role:</span>
                      <span className="font-extrabold text-[#166534] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {user?.badge}
                      </span>
                    </div>
                    <div className="pb-2 border-b border-slate-100">
                      <span className="text-slate-500 font-semibold block">Designation:</span>
                      <span className="font-bold text-slate-800 text-xs block mt-0.5">{user?.designation}</span>
                    </div>
                    <div className="pb-2 border-b border-slate-100">
                      <span className="text-slate-500 font-semibold block">Jurisdiction:</span>
                      <span className="font-bold text-slate-800 text-xs block mt-0.5">{user?.jurisdiction}</span>
                    </div>
                    <div className="pt-1 flex items-center space-x-1.5 text-emerald-800 font-bold">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>NIC Parichay SSO Authenticated</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2 mt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('nav.sign_out', 'Sign Out from Official Console')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-[#0F2E53] hover:bg-slate-100 border border-slate-200 md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        ) : (
          /* PUBLIC LANDING / LOGIN NAVIGATION */
          <div className="flex items-center space-x-4">
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-bold text-slate-700">
              <Link href="/" className="hover:text-[#166534] transition-colors py-1">
                {t('nav.home', 'Home')}
              </Link>
              <Link href="#citizen-inquiry" className="hover:text-[#166534] transition-colors py-1">
                {t('nav.track_parcel', 'Track Land Parcel')}
              </Link>
              <Link href="#stakeholder-modules" className="hover:text-[#166534] transition-colors py-1">
                {t('nav.modules', 'Role Portals')}
              </Link>
              <Link href="#gazette-notices" className="hover:text-[#166534] transition-colors py-1">
                {t('nav.gazette', 'Gazette Notices')}
              </Link>
              <Link href="#statutory-framework" className="hover:text-[#166534] transition-colors py-1">
                {t('nav.framework', 'RFCTLARR Act')}
              </Link>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* DEDICATED HIGH-VISIBILITY LANGUAGE TOGGLE (Visible on Public Pages) */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center space-x-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border-2 border-emerald-600/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer shrink-0"
                title="Change Language / भाषा बदलें"
              >
                <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#166534]" />
                <span className="hidden sm:inline">{language === 'EN' ? 'हिन्दी (Hindi)' : 'English'}</span>
                <span className="sm:hidden">{language === 'EN' ? 'हिन्दी' : 'EN'}</span>
              </button>

              {isAuthenticated && user ? (
                <Link
                  href={user.dashboardRoute}
                  className="hidden md:flex items-center space-x-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#166534] hover:bg-[#12542a] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer shrink-0"
                >
                  <Shield className="h-4 w-4" />
                  <span>{t('nav.dashboard', 'Go to Official Dashboard')}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-[#0F2E53] hover:bg-[#0b213b] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer shrink-0"
                >
                  <User className="h-4 w-4" />
                  <span>{t('nav.login', 'Official Login')}</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-[#0F2E53] hover:bg-slate-100 border border-slate-300 lg:hidden shrink-0 cursor-pointer"
                aria-label="Toggle Mobile Navigation"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          {/* Prominent Mobile Language Switcher */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#166534]" />
              <span>{language === 'EN' ? 'Language / भाषा:' : 'भाषा / Language:'}</span>
            </span>
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-4 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              {language === 'EN' ? 'हिन्दी में बदलें' : 'Switch to English'}
            </button>
          </div>

          <div className="flex flex-col space-y-2 text-sm font-bold text-slate-800">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50"
            >
              {t('nav.home', 'Home')}
            </Link>
            <Link 
              href="#citizen-inquiry" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50"
            >
              {t('nav.track_parcel', 'Track Land Parcel (Khasra)')}
            </Link>
            <Link 
              href="#stakeholder-modules" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50"
            >
              {t('nav.modules', 'Role Portals')}
            </Link>
            <Link 
              href="#gazette-notices" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50"
            >
              {t('nav.gazette', 'Gazette Notifications')}
            </Link>
          </div>

          {isAuthenticated && user ? (
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <Link
                href={user.dashboardRoute}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-[#166534] hover:bg-[#12542a] text-white rounded-xl text-sm font-bold shadow-sm"
              >
                <Shield className="h-4 w-4" />
                <span>{t('nav.dashboard', 'Go to Official Dashboard')}</span>
              </Link>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-xs font-bold text-emerald-900">{user.name}</div>
                <div className="text-[11px] text-emerald-700">{user.badge} • {user.department}</div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 p-2.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('nav.sign_out', 'Sign Out from Official Console')}</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-[#0F2E53] text-white rounded-xl text-sm font-bold"
              >
                <User className="h-4 w-4" />
                <span>{t('nav.login', 'Official / Citizen Login')}</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Breadcrumb / Role Header Strip on Dashboard Pages (SWITCH ROLE BUTTON REMOVED) */}
      {isDashboardPage && user && (
        <div className="bg-slate-50 px-4 sm:px-6 py-2.5 border-t border-b border-slate-200 text-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center space-x-2.5 text-slate-600 flex-wrap">
              <Link href="/" className="hover:text-[#0F2E53] font-bold text-xs sm:text-sm">
                BhuSetu Portal
              </Link>
              <span className="text-slate-400 font-bold">/</span>
              <span className="font-extrabold text-[#0F2E53] text-xs sm:text-sm">{user.badge} Console</span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-slate-600 text-xs sm:text-sm font-medium hidden sm:inline">{user.jurisdiction}</span>
            </div>

            <div className="flex items-center space-x-3 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 font-bold border border-emerald-300">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>GoI Secure SSO Session Active</span>
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

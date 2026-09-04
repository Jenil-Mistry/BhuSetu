'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FolderKanban, 
  Map, 
  FileText, 
  Coins, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  LayoutDashboard 
} from 'lucide-react';
import { useAuth, ROLE_ALLOWED_ROUTES } from '@/lib/auth-context';

export const DashboardSubNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const roleHome = user.dashboardRoute;

  const allNavItems = [
    {
      label: 'My Role Console',
      href: roleHome,
      icon: LayoutDashboard,
      matchExact: true,
    },
    {
      label: 'Projects & Proposals',
      href: '/dashboard/projects',
      icon: FolderKanban,
      matchPrefix: '/dashboard/projects',
    },
    {
      label: 'Cadastral GIS & Spatial',
      href: '/dashboard/gis',
      icon: Map,
      matchPrefix: '/dashboard/gis',
    },
    {
      label: 'Gazette & Notifications',
      href: '/dashboard/notifications',
      icon: FileText,
      matchPrefix: '/dashboard/notifications',
    },
    {
      label: 'Awards & PFMS Disbursement',
      href: '/dashboard/compensation',
      icon: Coins,
      matchPrefix: '/dashboard/compensation',
    },
    {
      label: 'R&R Rehabilitation',
      href: '/dashboard/rehabilitation',
      icon: Users,
      matchPrefix: '/dashboard/rehabilitation',
    },
    {
      label: 'MIS Reports & Analytics',
      href: '/dashboard/reports',
      icon: BarChart3,
      matchPrefix: '/dashboard/reports',
    },
    {
      label: 'Audit & Hash Verification',
      href: '/dashboard/audit',
      icon: ShieldCheck,
      matchPrefix: '/dashboard/audit',
    },
  ];

  // Filter nav items to only those the current role is allowed to access
  const allowedRoutes = ROLE_ALLOWED_ROUTES[user.role] || [];
  const navItems = allNavItems.filter((item) => {
    // Always show "My Role Console" which is the roleHome
    if (item.matchExact) return true;
    // Check if the nav item's href is in the allowed routes for this role
    return allowedRoutes.some(
      (route) => item.href === route || item.href.startsWith(route + '/')
    );
  });

  return (
    <nav className="w-full bg-white border-b border-slate-200 overflow-x-auto scrollbar-none shadow-xs sticky top-[108px] z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex space-x-1 sm:space-x-2 py-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.matchExact 
              ? pathname === item.href 
              : (item.matchPrefix ? pathname?.startsWith(item.matchPrefix) : false);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#166534] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-[#0F2E53] hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

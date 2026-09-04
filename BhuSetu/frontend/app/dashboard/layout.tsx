'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/app-header';
import { useAuth, isRouteAllowed } from '@/lib/auth-context';
import { ShieldAlert } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/login');
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, user, router]);

  // Show spinner while checking auth / redirecting
  if (isChecking || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#166534] border-t-transparent" />
      </div>
    );
  }

  // Route guard: check if the current path is allowed for this role
  // The base /dashboard path is always allowed (it just redirects)
  const isBaseDashboard = pathname === '/dashboard';
  const isAllowed = isBaseDashboard || isRouteAllowed(user.role, pathname);

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="mx-auto h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center">
              <ShieldAlert className="h-8 w-8 text-rose-500" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">
              Access Restricted
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your role as <strong className="text-[#0F2E53]">{user.badge}</strong> does
              not have authorization to access this section. You can only view
              pages assigned to your role.
            </p>
            <button
              onClick={() => router.replace(user.dashboardRoute)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0F2E53] text-white text-xs font-bold shadow-xs hover:bg-[#0b213b] transition-colors cursor-pointer"
            >
              <span>Return to My Console</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <AppHeader />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}

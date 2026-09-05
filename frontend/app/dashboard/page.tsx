'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Shield } from 'lucide-react';

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.dashboardRoute) {
      router.replace(user.dashboardRoute);
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#166534] border-t-transparent" />
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
          <Shield className="h-4 w-4 text-[#0F2E53]" />
          <span>Verifying official authorization & routing to statutory console...</span>
        </div>
      </div>
    </div>
  );
}

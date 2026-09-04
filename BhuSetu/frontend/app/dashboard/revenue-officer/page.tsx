'use client';

import React, { useEffect } from 'react';
import { RevenueOfficerView } from '@/components/views/revenue-officer-view';
import { useAuth } from '@/lib/auth-context';

export default function RevenueOfficerDashboardPage() {
  const { user, login } = useAuth();

  // Auto-sync active role if user accessed this URL directly
  useEffect(() => {
    if (!user || user.role !== 'revenue-officer') {
      login('revenue-officer');
    }
  }, [user, login]);

  return <RevenueOfficerView />;
}

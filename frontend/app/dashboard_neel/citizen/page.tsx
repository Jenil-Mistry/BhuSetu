'use client';

import React, { useEffect } from 'react';
import { CitizenPafView } from '@/components/views/citizen-paf-view';
import { useAuth } from '@/lib/auth-context';

export default function CitizenDashboardPage() {
  const { user, login } = useAuth();

  // Auto-sync active role if user accessed this URL directly
  useEffect(() => {
    if (!user || user.role !== 'citizen') {
      login('citizen');
    }
  }, [user, login]);

  return <CitizenPafView />;
}

'use client';

import React, { useEffect } from 'react';
import { CentralAuthorityView } from '@/components/views/central-authority-view';
import { useAuth } from '@/lib/auth-context';

export default function CentralAuthorityDashboardPage() {
  const { user, login } = useAuth();

  // Auto-sync active role if user accessed this URL directly
  useEffect(() => {
    if (!user || user.role !== 'central') {
      login('central');
    }
  }, [user, login]);

  return <CentralAuthorityView />;
}

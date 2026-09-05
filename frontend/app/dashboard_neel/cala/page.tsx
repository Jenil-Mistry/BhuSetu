'use client';

import React, { useEffect } from 'react';
import { CalaCollectorView } from '@/components/views/cala-collector-view';
import { useAuth } from '@/lib/auth-context';

export default function CalaDashboardPage() {
  const { user, login } = useAuth();

  // Auto-sync active role if user accessed this URL directly
  useEffect(() => {
    if (!user || user.role !== 'cala') {
      login('cala');
    }
  }, [user, login]);

  return <CalaCollectorView />;
}

'use client';

import React, { useEffect } from 'react';
import { PiaExecutiveView } from '@/components/views/pia-executive-view';
import { useAuth } from '@/lib/auth-context';

export default function PiaDashboardPage() {
  const { user, login } = useAuth();

  // Auto-sync active role if user accessed this URL directly
  useEffect(() => {
    if (!user || user.role !== 'pia') {
      login('pia');
    }
  }, [user, login]);

  return <PiaExecutiveView />;
}

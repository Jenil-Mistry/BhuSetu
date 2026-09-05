'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { CadastralParcel, RfctlarrStatus } from '@/types/rfctlarr';

const CadastralMapInner = dynamic(
  () => import('./cadastral-map').then((mod) => mod.CadastralMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[560px] w-full items-center justify-center rounded-2xl bg-white shadow-sm">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#166534] border-t-transparent" />
          <span className="text-xs font-medium text-slate-500">
            Initializing MapLibre GL Spatial Engine & Cadastral Layers...
          </span>
        </div>
      </div>
    ),
  }
);

interface MapClientWrapperProps {
  parcels: CadastralParcel[];
  selectedParcelId?: string | null;
  onSelectParcel?: (parcel: CadastralParcel | null) => void;
  filterStatus?: RfctlarrStatus | 'all';
}

export const MapClientWrapper: React.FC<MapClientWrapperProps> = (props) => {
  return <CadastralMapInner {...props} />;
};

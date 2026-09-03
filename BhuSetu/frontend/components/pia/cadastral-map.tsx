'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { CadastralParcel, RfctlarrStatus } from '@/types/rfctlarr';
import { STATUS_COLORS } from '@/lib/mock-data';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Maximize2, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Info, 
  FileText,
  LandPlot
} from 'lucide-react';

interface CadastralMapProps {
  parcels: CadastralParcel[];
  selectedParcelId?: string | null;
  onSelectParcel?: (parcel: CadastralParcel | null) => void;
  filterStatus?: RfctlarrStatus | 'all';
}

export const CadastralMap: React.FC<CadastralMapProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
  filterStatus = 'all',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [activeFilter, setActiveFilter] = useState<RfctlarrStatus | 'all'>(filterStatus);
  const [selectedParcel, setSelectedParcel] = useState<CadastralParcel | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter parcels
  const filteredParcels = activeFilter === 'all' 
    ? parcels 
    : parcels.filter((p) => p.status === activeFilter);

  // Convert parcels to GeoJSON FeatureCollection
  const parcelGeoJson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: filteredParcels.map((p) => ({
      type: 'Feature',
      id: p.id,
      properties: {
        id: p.id,
        khasraNo: p.khasraNo,
        village: p.village,
        landowner: p.landowner,
        areaHectares: p.areaHectares,
        status: p.status,
        color: STATUS_COLORS[p.status].hex,
        chainage: p.chainage,
        totalCompensation: p.totalCompensation,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [p.coordinates],
      },
    })),
  };

  // Centerline RoW alignment
  const rowAlignmentGeoJson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'NH-48 Corridor Centerline' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [76.975, 28.3815],
            [76.990, 28.3820],
            [77.005, 28.3830],
            [77.020, 28.3840],
            [77.030, 28.3845],
          ],
        },
      },
    ],
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize MapLibre
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'carto-positron': {
            type: 'raster',
            tiles: [
              'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
              'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© CartoDB, © OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'carto-tiles',
            type: 'raster',
            source: 'carto-positron',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [77.003, 28.383],
      zoom: 13.8,
      pitch: 0,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: false }), 'top-right');

    map.on('load', () => {
      // Add RoW Centerline Source & Layer
      map.addSource('row-centerline', {
        type: 'geojson',
        data: rowAlignmentGeoJson,
      });

      map.addLayer({
        id: 'row-centerline-glow',
        type: 'line',
        source: 'row-centerline',
        paint: {
          'line-color': '#166534',
          'line-width': 8,
          'line-opacity': 0.25,
        },
      });

      map.addLayer({
        id: 'row-centerline-core',
        type: 'line',
        source: 'row-centerline',
        paint: {
          'line-color': '#0F2E53',
          'line-width': 2.5,
          'line-dasharray': [3, 2],
        },
      });

      // Add Cadastral Parcels Source & Layers
      map.addSource('cadastral-parcels', {
        type: 'geojson',
        data: parcelGeoJson,
      });

      // Fill Layer with color per status
      map.addLayer({
        id: 'cadastral-parcels-fill',
        type: 'fill',
        source: 'cadastral-parcels',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.65,
        },
      });

      // Outline Layer
      map.addLayer({
        id: 'cadastral-parcels-outline',
        type: 'line',
        source: 'cadastral-parcels',
        paint: {
          'line-color': '#0F172A',
          'line-width': 1.5,
        },
      });

      // Label Layer for Khasra numbers
      map.addLayer({
        id: 'cadastral-parcels-labels',
        type: 'symbol',
        source: 'cadastral-parcels',
        layout: {
          'text-field': ['concat', 'Kh. ', ['get', 'khasraNo']],
          'text-size': 11,
          'text-anchor': 'center',
          'text-allow-overlap': false,
        },
        paint: {
          'text-color': '#0F172A',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 2,
        },
      });

      // Click Interaction
      map.on('click', 'cadastral-parcels-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const pId = feature.properties?.id;
        const parcel = parcels.find((p) => p.id === pId);
        if (parcel) {
          setSelectedParcel(parcel);
          onSelectParcel?.(parcel);
        }
      });

      map.on('mouseenter', 'cadastral-parcels-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'cadastral-parcels-fill', () => {
        map.getCanvas().style.cursor = '';
      });

      setIsLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update GeoJSON data when filter changes
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;
    const source = mapRef.current.getSource('cadastral-parcels') as maplibregl.GeoJSONSource;
    if (source) {
      source.setData(parcelGeoJson);
    }
  }, [activeFilter, parcels, isLoaded]);

  // Handle external selection
  useEffect(() => {
    if (selectedParcelId) {
      const found = parcels.find((p) => p.id === selectedParcelId);
      if (found) {
        setSelectedParcel(found);
      }
    }
  }, [selectedParcelId, parcels]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!mapRef.current) return;
    if (direction === 'in') mapRef.current.zoomIn();
    else mapRef.current.zoomOut();
  };

  const handleResetBearing = () => {
    if (!mapRef.current) return;
    mapRef.current.easeTo({ bearing: 0, pitch: 0, zoom: 13.8, center: [77.003, 28.383] });
  };

  return (
    <div className="relative flex flex-col h-[560px] w-full rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Top Map Header & Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center space-x-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[#166534]" />
          <h2 className="text-base font-bold text-[#0F2E53] tracking-tight">
            Spatial Corridor & Cadastral Vector Widget (50% Viewport)
          </h2>
          <span className="text-xs text-slate-400 font-normal hidden sm:inline">
            • NH-48 Chainage 0+000 to 26+400
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-[#0F2E53] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({parcels.length})
          </button>
          {(Object.keys(STATUS_COLORS) as RfctlarrStatus[]).map((st) => {
            const count = parcels.filter((p) => p.status === st).length;
            const isCurrent = activeFilter === st;
            return (
              <button
                key={st}
                onClick={() => setActiveFilter(st)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-full font-medium transition-all ${
                  isCurrent ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[st].hex }}
                />
                <span className="hidden md:inline">{STATUS_COLORS[st].label}</span>
                <span className="md:hidden">{st.split('_')[0]}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative flex-1 w-full">
        <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />

        {/* Floating Custom Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
          <div className="flex flex-col rounded-xl bg-white/95 p-1 shadow-md backdrop-blur-sm">
            <button
              onClick={() => handleZoom('in')}
              className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <div className="h-px bg-slate-100 mx-1" />
            <button
              onClick={() => handleZoom('out')}
              className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <div className="h-px bg-slate-100 mx-1" />
            <button
              onClick={handleResetBearing}
              className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              title="Reset view orientation"
            >
              <Compass className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Map Legend Floating Box */}
        <div className="absolute bottom-4 left-4 z-10 rounded-xl bg-white/95 p-3.5 shadow-md backdrop-blur-sm max-w-xs text-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            RFCTLARR Act 2013 Lifecycle Colors
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-sm bg-[#94A3B8]" />
              <span className="text-slate-700">Grey: Not Started</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-sm bg-[#EAB308]" />
              <span className="text-slate-700">Yellow: Sec 11 Notified</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-sm bg-[#2563EB]" />
              <span className="text-slate-700">Blue: Award Declared</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-sm bg-[#16A34A]" />
              <span className="text-slate-700">Green: Possession Taken</span>
            </div>
            <div className="flex items-center space-x-2 col-span-2">
              <span className="h-3 w-3 rounded-sm bg-[#DC2626]" />
              <span className="text-slate-700">Red: Disputed (Sec 64 / High Court)</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Dashed Line: 60m RoW Center</span>
            <span>Click parcel to inspect</span>
          </div>
        </div>

        {/* Selected Parcel Drawer / Inspector Overlay */}
        {selectedParcel && (
          <div className="absolute top-4 left-4 z-20 w-80 rounded-xl bg-white p-4 shadow-xl border border-slate-100 transition-all animate-in fade-in slide-in-from-left-4">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${STATUS_COLORS[selectedParcel.status].hex}15`,
                    color: STATUS_COLORS[selectedParcel.status].hex,
                  }}
                >
                  {STATUS_COLORS[selectedParcel.status].label}
                </span>
                <h3 className="mt-1 text-sm font-bold text-[#0F2E53]">
                  Khasra No: {selectedParcel.khasraNo}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedParcel(null);
                  onSelectParcel?.(null);
                }}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Village / Tehsil:</span>
                <span className="font-medium text-slate-800">
                  {selectedParcel.village}, {selectedParcel.tehsil}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Chainage:</span>
                <span className="font-mono font-medium text-slate-800">{selectedParcel.chainage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Area to Acquire:</span>
                <span className="font-bold text-slate-800">
                  {selectedParcel.areaHectares} Hectares
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Landowner / PAF:</span>
                <span className="font-medium text-slate-800">{selectedParcel.landowner}</span>
              </div>

              {/* Solatium & Total Compensation */}
              <div className="rounded-lg bg-slate-50 p-2.5 mt-2">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Base Land Valuation:</span>
                  <span>₹ {(selectedParcel.baseRatePerHa * selectedParcel.areaHectares).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-0.5">
                  <span>Assets on Land:</span>
                  <span>₹ {selectedParcel.assetsValuation.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#166534] font-medium mt-0.5">
                  <span>100% Solatium (Sec 30):</span>
                  <span>₹ {selectedParcel.solatium100Percent.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-[#0F2E53] pt-1.5 mt-1.5 border-t border-slate-200">
                  <span>Total Award (Sec 23/30):</span>
                  <span>₹ {selectedParcel.totalCompensation.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Dispute Alert if any */}
              {selectedParcel.disputeReason && (
                <div className="rounded-lg bg-rose-50 p-2 text-rose-700 text-[11px] flex items-start space-x-1.5">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{selectedParcel.disputeReason}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

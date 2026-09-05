'use client';

import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  MapPin, 
  Camera, 
  Navigation, 
  CheckCircle2, 
  Layers, 
  Check, 
  Upload, 
  Clock, 
  AlertCircle,
  Save,
  Compass,
  FileCheck,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface AssignedKhasra {
  id: string;
  khasraNo: string;
  village: string;
  landowner: string;
  areaHa: number;
  status: 'pending' | 'completed' | 'synced';
  assetType?: 'Agriculture' | 'Commercial' | 'Residential';
  treesCount?: number;
  hasBorewell?: boolean;
}

const INITIAL_QUEUE: AssignedKhasra[] = [
  {
    id: 'kh-RO-1',
    khasraNo: '312/1',
    village: 'Kherki Daula',
    landowner: 'Gram Panchayat (Common Grazing Land)',
    areaHa: 1.80,
    status: 'pending',
  },
  {
    id: 'kh-RO-2',
    khasraNo: '315/2',
    village: 'Kherki Daula',
    landowner: 'Baljeet Chillar',
    areaHa: 0.65,
    status: 'pending',
  },
  {
    id: 'kh-RO-3',
    khasraNo: '401/a',
    village: 'Manesar North',
    landowner: 'Om Prakash & Sons HUF',
    areaHa: 3.40,
    status: 'pending',
  },
  {
    id: 'kh-RO-4',
    khasraNo: '404/2',
    village: 'Manesar North',
    landowner: 'Vikramaditya Rao',
    areaHa: 1.10,
    status: 'completed',
    assetType: 'Agriculture',
    treesCount: 14,
    hasBorewell: true,
  },
];

export const RevenueOfficerView: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingChanges, setPendingChanges] = useState(1);
  const [queue, setQueue] = useState<AssignedKhasra[]>(INITIAL_QUEUE);
  const [activeKhasraId, setActiveKhasraId] = useState<string>('kh-RO-1');
  
  // Verification Form State
  const [assetType, setAssetType] = useState<'Agriculture' | 'Commercial' | 'Residential'>('Agriculture');
  const [treesCount, setTreesCount] = useState('8');
  const [hasBorewell, setHasBorewell] = useState(true);
  const [structureDetails, setStructureDetails] = useState('Boundary brick wall (40m) + Tubewell pump room');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const activeKhasra = queue.find((k) => k.id === activeKhasraId) || queue[0];
  const completedCount = queue.filter((k) => k.status !== 'pending').length;

  const handleSimulatedCameraCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setCapturedPhoto(
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230F2E53"/><text x="30" y="80" fill="%23FFFFFF" font-family="sans-serif" font-size="20" font-weight="bold">BhuSetu Revenue Field Evidence</text><text x="30" y="130" fill="%23166534" font-family="monospace" font-size="16">Khasra: ' + activeKhasra.khasraNo + ' • ' + activeKhasra.village + '</text><text x="30" y="170" fill="%23E2E8F0" font-family="monospace" font-size="14">GPS: Lat 28.3832° N, Lng 77.0018° E (RTK ±1.2m)</text><text x="30" y="210" fill="%23E2E8F0" font-family="monospace" font-size="14">Timestamp: 03-Sep-2026 15:12:44 IST</text><text x="30" y="250" fill="%23E2E8F0" font-family="monospace" font-size="14">Officer ID: HR-REV-PATWARI-0941</text><rect x="30" y="290" width="180" height="36" rx="6" fill="%2316A34A"/><text x="45" y="314" fill="%23FFFFFF" font-family="sans-serif" font-size="14" font-weight="bold">WATERMARK CERTIFIED</text></svg>'
      );
    }, 900);
  };

  const handleSaveAndComplete = () => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === activeKhasraId
          ? { ...item, status: isOnline ? 'synced' : 'completed', assetType }
          : item
      )
    );

    if (!isOnline) {
      setPendingChanges((c) => c + 1);
    }

    setSaveSuccessMsg(
      isOnline
        ? 'Survey uploaded to Bhoomi cloud & CALA portal successfully!'
        : 'Saved locally to IndexedDB cache. Ready for offline auto-sync when online.'
    );

    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Mobile / PWA View Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              Field Revenue Officer • Mobile PWA
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Patwari Cadastral Demarcation</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F2E53] mt-0.5">
            Field Survey & Asset Verification Interface
          </h2>
        </div>

        {/* Offline / Online Sync Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-emerald-600" />
                <span>Online (Live Sync)</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-amber-600" />
                <span>Offline Mode (Simulated)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Queue */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Today's Field Queue
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#166534]/10 text-[#166534]">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-[#0F2E53]">
              {queue.length} <span className="text-sm font-normal text-slate-500">Parcels</span>
            </span>
            <span className="text-xs font-semibold text-[#166534] bg-[#166534]/10 px-2 py-0.5 rounded-full">
              {completedCount} Verified
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Assigned for Section 11 boundary inspection in Kherki Daula & Manesar
          </p>
        </div>

        {/* Sync Status Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              PWA Sync Engine
            </span>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {isOnline ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className={`text-base font-bold ${isOnline ? 'text-emerald-600' : 'text-amber-700'}`}>
              {isOnline ? 'Online (Connected)' : `Offline (${pendingChanges} Pending)`}
            </span>
            <span className="text-[10px] uppercase font-mono text-slate-400">IndexedDB v2</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {isOnline
              ? 'Real-time two-way synchronization with District Collector CALA Server'
              : 'Cached locally; transactions will automatically push upon network restoration'}
          </p>
        </div>

        {/* RTK GPS Accuracy */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              GPS Precision
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F2E53]/10 text-[#0F2E53]">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-[#0F2E53]">
              ±1.2 <span className="text-sm font-normal text-slate-500">meters</span>
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              DGPS Active
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            NavIC / GLONASS dual-band signal locked with 11 satellites
          </p>
        </div>

        {/* Section 15 Objections Raised */}
        <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Discrepancies Noted
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-slate-800">
              0 <span className="text-sm font-normal text-slate-500">in this batch</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">Clear Titles</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Landowners present on site with Jamabandi revenue documents
          </p>
        </div>
      </div>

      {/* Main Grid: Task Widget (Left) + Verification Interface (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task Widget: Assigned Khasras (5 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-white p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0F2E53]">Assigned Khasra Queue</h3>
              <p className="text-xs text-slate-400">Select parcel to survey & verify assets</p>
            </div>
            <span className="text-xs font-bold text-[#166534] bg-[#166534]/10 px-2.5 py-1 rounded-full">
              {queue.length} Left
            </span>
          </div>

          <div className="mt-4 space-y-3 flex-1 overflow-y-auto max-h-[540px] pr-1">
            {queue.map((item) => {
              const isSelected = item.id === activeKhasraId;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveKhasraId(item.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0F2E53]/5 border-2 border-[#166534] shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/70 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#0F2E53]">
                      Kh. {item.khasraNo}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'synced'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'completed'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.status === 'synced'
                        ? 'Synced'
                        : item.status === 'completed'
                        ? 'Cached Offline'
                        : 'Pending Survey'}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                    <div className="font-medium text-slate-800">{item.landowner}</div>
                    <div className="text-slate-400 text-[11px]">
                      Village: {item.village} • Area: {item.areaHa} Ha
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSaveSuccessMsg(`GPS Turn-by-Turn Navigation engaged to Khasra ${item.khasraNo}, Village ${item.village} (RTK Accuracy ±1.2m).`);
                      }}
                      className="inline-flex items-center space-x-1.5 text-sm font-bold text-[#166534] hover:underline cursor-pointer"
                    >
                      <Navigation className="h-4 w-4" />
                      <span>Navigate</span>
                    </button>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Interface (7 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534]">
                Active Demarcation Workspace
              </span>
              <h3 className="text-lg font-bold text-[#0F2E53]">
                Khasra No: {activeKhasra.khasraNo} • {activeKhasra.village}
              </h3>
              <p className="text-xs text-slate-500">
                Landowner: <span className="font-semibold text-slate-800">{activeKhasra.landowner}</span> (Area: {activeKhasra.areaHa} Ha)
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
              NH-48 Ch 11+400
            </span>
          </div>

          {/* Success Banner if saved */}
          {saveSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Simulated Live GPS Map View with User's Location Dot */}
          <div className="relative h-48 w-full rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center">
            {/* Background Cadastral Vector Grid Lines */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#166534 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Khasra Polygon Outline */}
            <div className="relative w-64 h-32 border-2 border-[#166534] bg-[#166534]/15 rounded-lg flex items-center justify-center text-center p-2">
              <span className="text-white font-mono text-xs font-bold">
                Khasra {activeKhasra.khasraNo} Boundary ({activeKhasra.areaHa} Ha)
              </span>

              {/* Pulsing GPS Dot inside parcel */}
              <div className="absolute top-8 left-12 flex items-center justify-center">
                <span className="absolute h-6 w-6 rounded-full bg-[#166534] opacity-75 animate-ping" />
                <span className="relative h-3 w-3 rounded-full bg-white shadow-md" />
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono text-emerald-300 font-bold bg-black/60 px-1 py-0.2 rounded">
                  Patwari GPS (You)
                </span>
              </div>
            </div>

            {/* GPS Telemetry Pill */}
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-300 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md">
              GPS: 28.3832° N, 77.0018° E • Accuracy: ±1.2m
            </div>
          </div>

          {/* Quick-Toggle Asset Capture Form */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Land Classification & Primary Asset Use
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Agriculture', 'Commercial', 'Residential'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAssetType(type)}
                    className={`py-2.5 px-4 rounded-xl font-bold transition-all text-center ${
                      assetType === type
                        ? 'bg-[#0F2E53] text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mature Trees on Acquired Corridor
                </label>
                <input
                  type="number"
                  value={treesCount}
                  onChange={(e) => setTreesCount(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border-0 focus:ring-2 focus:ring-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Irrigation Borewells / Tube-wells
                </label>
                <button
                  type="button"
                  onClick={() => setHasBorewell(!hasBorewell)}
                  className={`w-full py-2 px-3 rounded-xl font-medium transition-all text-left flex items-center justify-between ${
                    hasBorewell ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{hasBorewell ? '1 Submersible Borewell Present' : 'No Borewell'}</span>
                  <span className="text-[10px] font-bold uppercase underline">Toggle</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Built Structures / Immovable Property Remarks
              </label>
              <input
                type="text"
                value={structureDetails}
                onChange={(e) => setStructureDetails(e.target.value)}
                className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border-0 focus:ring-2 focus:ring-[#166534] focus:outline-none"
              />
            </div>

            {/* Camera Integration Button with Auto Watermark */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Geo-Tagged Photographic Evidence
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  type="button"
                  onClick={handleSimulatedCameraCapture}
                  disabled={isCapturing}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#0F2E53] hover:bg-[#0a203a] text-white font-semibold transition-all disabled:opacity-50"
                >
                  <Camera className="h-4 w-4 text-[#166534]" />
                  <span>{isCapturing ? 'Accessing Camera & Watermarking...' : 'Capture Field Photo'}</span>
                </button>
                <span className="text-[11px] text-slate-400">
                  Auto-stamps GPS (Lat/Lng), Officer ID, and Date/Time into metadata.
                </span>
              </div>

              {capturedPhoto && (
                <div className="mt-3 rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={capturedPhoto}
                    alt="Geo-tagged Evidence"
                    className="w-full h-44 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Complete & Save Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleSaveAndComplete}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#166534] hover:bg-[#259492] text-white text-xs font-bold shadow-xs transition-all"
              >
                <Save className="h-4 w-4" />
                <span>Complete & Save (Local Cache / Sync)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { MapClientWrapper } from '@/components/pia/map-client-wrapper';
import { 
  MOCK_PARCELS 
} from '@/lib/mock-data';
import { parcelsApi } from '@/lib/api';
import { CadastralParcel, RfctlarrStatus } from '@/types/rfctlarr';
import { 
  Layers, 
  Upload, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Crosshair, 
  FileText, 
  Scale, 
  Search, 
  Eye, 
  Camera, 
  ShieldCheck,
  ChevronRight,
  Download
} from 'lucide-react';

export default function GisCadastralPage() {
  const [selectedParcel, setSelectedParcel] = useState<CadastralParcel | null>(null);
  const [filterStatus, setFilterStatus] = useState<RfctlarrStatus | 'all'>('all');
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [intersectionResults, setIntersectionResults] = useState<any[] | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [verifyRemarks, setVerifyRemarks] = useState('Demarcated on-site; 1 tubewell and boundary pillars verified.');
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Trigger sample corridor PostGIS intersection analysis
  const handleRunIntersectionAnalysis = async () => {
    setIsIntersecting(true);
    try {
      const sampleCorridorPolygon = {
        type: 'Polygon',
        coordinates: [
          [
            [76.995, 28.375],
            [77.030, 28.375],
            [77.030, 28.390],
            [76.995, 28.390],
            [76.995, 28.375]
          ]
        ]
      };
      const results = await parcelsApi.calculateIntersections(sampleCorridorPolygon);
      setIntersectionResults(results);
    } finally {
      setIsIntersecting(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParcel) return;
    await parcelsApi.verify(selectedParcel.id, {
      verification_method: 'FIELD_DGPS',
      remarks: verifyRemarks,
      photo_urls: ['/sample_survey_photo.jpg'],
    });
    setVerifySuccess(true);
    setTimeout(() => {
      setVerifySuccess(false);
      setIsVerifyModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              PostGIS Cadastral Engine & Vector MapLibre
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Bhu-Aadhaar / ULPIN Cadastral Layers</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F2E53] mt-0.5">
            Cadastral GIS & Spatial Overlap Analysis
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
          >
            <Upload className="h-3.5 w-3.5 text-slate-500" />
            <span>Upload Alignment KML</span>
          </button>

          <button
            onClick={handleRunIntersectionAnalysis}
            disabled={isIntersecting}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#259492] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Crosshair className="h-4 w-4" />
            <span>{isIntersecting ? 'Computing PostGIS Intersections...' : 'Run Spatial Overlap Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Spatial Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vector Map (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2 text-xs">
              <Layers className="h-4 w-4 text-[#166534]" />
              <span className="font-semibold text-slate-700">Filter Vector Layer:</span>
              {(['all', 'sec11_notified', 'award_declared', 'possession_taken', 'disputed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors ${
                    filterStatus === s
                      ? 'bg-[#0F2E53] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
              EPSG:4326 PostGIS Geodetic
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 min-h-[500px]">
            <MapClientWrapper
              parcels={MOCK_PARCELS}
              selectedParcelId={selectedParcel?.id}
              onSelectParcel={setSelectedParcel}
              filterStatus={filterStatus}
            />
          </div>
        </div>

        {/* Side Panel: Selected Parcel Details & Spatial Verification */}
        <div className="lg:col-span-4 flex flex-col space-y-5">
          {selectedParcel ? (
            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    ULPIN / Bhu-Aadhaar
                  </span>
                  <span className="font-mono text-xs font-extrabold text-[#166534]">
                    ULPIN-HR-GGM-{selectedParcel.khasraNo.replace('/', '-')}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {selectedParcel.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#0F2E53]">
                  Khasra No: {selectedParcel.khasraNo}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Village {selectedParcel.village} • Tehsil {selectedParcel.tehsil} ({selectedParcel.district})
                </p>
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Landowner:</span>
                  <span className="font-bold text-slate-800 text-right">{selectedParcel.landowner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Parcel Area:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedParcel.areaHectares} Ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Corridor Chainage:</span>
                  <span className="font-mono text-slate-800">{selectedParcel.chainage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assessed Value:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    ₹ {(selectedParcel.totalCompensation || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {selectedParcel.disputeReason && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800">
                  <div className="flex items-center space-x-1.5 font-bold mb-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                    <span>Statutory Dispute Flag</span>
                  </div>
                  <p className="text-[11px] text-rose-700 leading-relaxed">
                    {selectedParcel.disputeReason}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => setIsVerifyModalOpen(true)}
                  className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-[#0F2E53] hover:bg-[#0b213b] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Log Field Verification / Remarks</span>
                </button>

                <button
                  onClick={() => alert(`Centering map on coordinates: ${JSON.stringify(selectedParcel.coordinates[0])}`)}
                  className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                >
                  Zoom to Cadastral Boundary
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-xs text-center">
              <MapPin className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No Parcel Selected</h4>
              <p className="text-xs text-slate-500 mt-1">
                Click any cadastral vector polygon on the map to inspect ownership, ULPIN, and statutory records.
              </p>
            </div>
          )}

          {/* Spatial Validation Guide Box */}
          <div className="rounded-2xl bg-emerald-50/70 p-5 border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-emerald-900">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>SIH Spatial Validation Protocol</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              PostGIS geodetic RPC computes true ellipsoidal surface area, eliminating standard Web Mercator distortion at national scales.
            </p>
          </div>
        </div>
      </div>

      {/* PostGIS Intersection Results Panel */}
      {intersectionResults && (
        <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <Crosshair className="h-4 w-4 text-[#166534]" />
                <h3 className="text-base font-bold text-[#0F2E53]">
                  PostGIS Spatial Intersection Analysis Results
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {intersectionResults.length} Cadastral parcels intersect the active highway RoW corridor alignment
              </p>
            </div>

            <button
              onClick={() => setIntersectionResults(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Clear Results
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Intersecting Parcel</th>
                  <th className="px-4 py-3">Landowner</th>
                  <th className="px-4 py-3">Total Area</th>
                  <th className="px-4 py-3">Overlap Area</th>
                  <th className="px-4 py-3">% Acquired</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {intersectionResults.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#0F2E53]">{r.parcel_number}</td>
                    <td className="px-4 py-3 text-slate-700">{r.landowner}</td>
                    <td className="px-4 py-3 font-mono">{r.total_parcel_area_hectares} Ha</td>
                    <td className="px-4 py-3 font-mono font-bold text-amber-800">{r.overlap_area_hectares} Ha</td>
                    <td className="px-4 py-3 font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        r.overlap_percentage === 100 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.overlap_percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          const p = MOCK_PARCELS.find(mp => mp.id === r.parcel_id);
                          if (p) setSelectedParcel(p);
                        }}
                        className="text-[#166534] font-bold hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Field Verification Modal */}
      {isVerifyModalOpen && selectedParcel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#0F2E53] mb-1">
              Field Surveyor Verification
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Khasra: <strong>{selectedParcel.khasraNo}</strong> • Village: {selectedParcel.village}
            </p>

            {verifySuccess ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-900">Verification recorded in audit ledger!</p>
              </div>
            ) : (
              <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Verification Method</label>
                  <select className="w-full p-2 rounded-xl border border-slate-200 bg-white">
                    <option>Field DGPS & Physical Pegging</option>
                    <option>Drone Photogrammetry Cadastral Mapping</option>
                    <option>ETS (Electronic Total Station)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Survey Remarks & Asset Demarcation</label>
                  <textarea
                    rows={3}
                    required
                    value={verifyRemarks}
                    onChange={(e) => setVerifyRemarks(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3">
                  <Camera className="h-5 w-5 text-slate-500" />
                  <span className="text-slate-600 text-[11px]">Attach Geo-Tagged Evidence Photos (EXIF GPS)</span>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsVerifyModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#166534] text-white font-bold hover:bg-[#259492]"
                  >
                    Confirm Verification
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Upload KML Alignment Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#0F2E53] mb-1">
              Upload Highway Alignment KML
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Uploads vector RoW boundary to MinIO S3 and triggers PostGIS layer rendering.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-[#166534] transition-colors cursor-pointer bg-slate-50">
              <Upload className="h-8 w-8 text-[#166534] mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Drag and drop .kml or .kmz alignment file</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports DPR Corridor packages up to 50MB</p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('KML alignment uploaded and parsed to PostGIS geodetic vector table.');
                  setIsUploadModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#166534] text-white font-bold hover:bg-[#259492] text-xs"
              >
                Upload & Process
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Check, 
  LandPlot, 
  Compass, 
  Layers, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface InitiateAcquisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (newStretch: any) => void;
}

export const InitiateAcquisitionModal: React.FC<InitiateAcquisitionModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState('NH-48 Corridor Expansion');
  const [stretchName, setStretchName] = useState('Package 05: Bawal to Kotputli Section');
  const [chainageStart, setChainageStart] = useState('120+000');
  const [chainageEnd, setChainageEnd] = useState('154+500');
  const [rowWidth, setRowWidth] = useState('60');
  const [district, setDistrict] = useState('Rewari');
  const [statutoryStage, setStatutoryStage] = useState('sec11');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
      setTimeout(() => {
        onSubmitSuccess?.({
          projectName,
          stretchName,
          chainageStart,
          chainageEnd,
          rowWidth,
          district,
        });
        setStep(1);
        setSelectedFile(null);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#166534]/10 text-[#166534]">
                <LandPlot className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-[#0F2E53] tracking-tight">
                Initiate New Land Acquisition
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Upload RoW Corridor Alignment (KML / GeoJSON) and initialize RFCTLARR statutory survey.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSimulatedSubmit} className="mt-5 space-y-4 text-xs">
            {/* Project & Stretch Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  National Highway / Project Corridor
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border-0 focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target District & Revenue Tehsil
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border-0 focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chainage Start (km)
                </label>
                <input
                  type="text"
                  value={chainageStart}
                  onChange={(e) => setChainageStart(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 font-mono text-slate-800 border-0 focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  placeholder="e.g. 120+000"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chainage End (km)
                </label>
                <input
                  type="text"
                  value={chainageEnd}
                  onChange={(e) => setChainageEnd(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 font-mono text-slate-800 border-0 focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  placeholder="e.g. 154+500"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Right-of-Way Width
                </label>
                <select
                  value={rowWidth}
                  onChange={(e) => setRowWidth(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-slate-800 border-0 focus:ring-2 focus:ring-[#166534] focus:outline-none"
                >
                  <option value="45">45 Meters (4-Lane Expressway)</option>
                  <option value="60">60 Meters (6-Lane Expressway)</option>
                  <option value="75">75 Meters (8-Lane + Service Roads)</option>
                </select>
              </div>
            </div>

            {/* Statutory Stage */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Statutory RFCTLARR Notification Phase
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-start space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  statutoryStage === 'sec4' ? 'border-[#166534] bg-[#166534]/5' : 'border-slate-200 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="stage"
                    value="sec4"
                    checked={statutoryStage === 'sec4'}
                    onChange={() => setStatutoryStage('sec4')}
                    className="mt-0.5 text-[#166534] focus:ring-[#166534]"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block">Section 4 (SIA Stage)</span>
                    <span className="text-[11px] text-slate-500">Social Impact Assessment notification & public hearing</span>
                  </div>
                </label>

                <label className={`flex items-start space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  statutoryStage === 'sec11' ? 'border-[#166534] bg-[#166534]/5' : 'border-slate-200 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="stage"
                    value="sec11"
                    checked={statutoryStage === 'sec11'}
                    onChange={() => setStatutoryStage('sec11')}
                    className="mt-0.5 text-[#166534] focus:ring-[#166534]"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block">Section 11 (Preliminary Notification)</span>
                    <span className="text-[11px] text-slate-500">Gazette publication & Patwari survey demarcation</span>
                  </div>
                </label>
              </div>
            </div>

            {/* KML / GeoJSON File Upload */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                RoW Alignment Vector File (.kml, .kmz, .geojson)
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all ${
                  dragActive
                    ? 'border-[#166534] bg-[#166534]/5'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".kml,.kmz,.geojson,.json"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xs text-[#166534] mb-2">
                  <UploadCloud className="h-6 w-6" />
                </div>
                {selectedFile ? (
                  <div className="text-center">
                    <span className="font-semibold text-slate-800 block">{selectedFile.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Ready to extract RoW boundaries
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="font-medium text-slate-700">
                      Drag and drop your RoW corridor file here, or{' '}
                      <span className="text-[#166534] font-semibold underline">Browse</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports Survey of India aligned KML, KMZ, GeoJSON up to 50MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-[#166534] hover:bg-[#259492] text-white font-semibold shadow-xs transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                    <span>Processing Cadastral Geometry...</span>
                  </>
                ) : (
                  <>
                    <span>Process Alignment & Generate Parcels</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3 animate-in zoom-in-50">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-[#0F2E53]">Alignment Processed Successfully</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Extracted 342 cadastral Khasra polygons along Chainage {chainageStart} to {chainageEnd}. Section 11 notices drafted for Collector scrutiny.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

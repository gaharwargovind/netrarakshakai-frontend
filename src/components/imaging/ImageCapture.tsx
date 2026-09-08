import React, { useState, useRef } from 'react';
import { PatientInfo, Eye } from '../../types/screening';
import { RetinalReticle } from './RetinalReticle';
import {
  Upload,
  ArrowRight,
  Eye as EyeIcon,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Camera,
  Layers,
} from 'lucide-react';
import { CLINICAL_CASE_PRESETS } from '../../data/clinicalCases';

interface ImageCaptureProps {
  patient: PatientInfo;
  selectedImageUrl: string | null;
  selectedFile?: File;
  activePresetId?: string;
  onImageSelected: (imageUrl: string, file?: File, presetId?: string) => void;
  onEyeChange?: (eye: Eye) => void;
  onClearImage?: () => void;
  onProceedToQuality: () => void;
}

export const ImageCapture: React.FC<ImageCaptureProps> = ({
  patient,
  selectedImageUrl,
  selectedFile,
  activePresetId,
  onImageSelected,
  onEyeChange,
  onClearImage,
  onProceedToQuality,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showReticle, setShowReticle] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        onImageSelected(url, file, undefined);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        onImageSelected(url, file, undefined);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = CLINICAL_CASE_PRESETS.find((c) => c.id === presetId);
    if (preset) {
      onImageSelected(preset.imageUrl, undefined, preset.id);
    }
  };

  const isLiveUpload = !activePresetId && (!!selectedFile || !!selectedImageUrl);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs mb-2">
            <span>STEP 02</span>
            <span>·</span>
            <span>RETINAL FUNDUS ACQUISITION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Fundus Imaging Viewport
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Acquire or select a 45° macular-disc non-mydriatic fundus photograph for clinical quality auditing.
          </p>
        </div>

        {/* Patient & Eye Identification Bar */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto bg-[#11171F] border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs">
          <div>
            <span className="text-slate-400">PATIENT: </span>
            <span className="text-white font-semibold">{patient.patientId}</span>
          </div>
          <span className="text-slate-700">|</span>

          {/* Quick Eye Identification / Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">EYE:</span>
            {onEyeChange ? (
              <div className="inline-flex rounded bg-[#0B0F14] p-0.5 border border-slate-800">
                <button
                  type="button"
                  id="toggle-eye-od"
                  onClick={() => onEyeChange('OD')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    patient.eye === 'OD'
                      ? 'bg-rose-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  OD (Right)
                </button>
                <button
                  type="button"
                  id="toggle-eye-os"
                  onClick={() => onEyeChange('OS')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    patient.eye === 'OS'
                      ? 'bg-rose-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  OS (Left)
                </button>
              </div>
            ) : (
              <span className="text-rose-400 font-bold">{patient.eye} Field</span>
            )}
          </div>
        </div>
      </div>

      {/* Mode Status Pill */}
      {activePresetId ? (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase border border-amber-500/30">
              DEMONSTRATION BENCHMARK
            </span>
            <span>Scenario: {CLINICAL_CASE_PRESETS.find((c) => c.id === activePresetId)?.shortLabel}</span>
          </div>
          <span className="text-[10px] text-amber-300/80">Synthetic Benchmark Illustration</span>
        </div>
      ) : isLiveUpload ? (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-emerald-300">LIVE PATIENT ACQUISITION</span>
            <span>· Ready for Optical Quality Verification</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">FastAPI E015 Target</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Retinal Viewing Surface (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Primary Viewport Canvas */}
          <div
            className={`relative w-full aspect-square max-w-[620px] mx-auto rounded-2xl bg-[#070A0E] border ${
              isDragging ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-slate-800'
            } overflow-hidden shadow-2xl flex items-center justify-center transition-all group`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {/* The Retina Image with Strict Aspect Ratio Preservation */}
            {selectedImageUrl ? (
              <div className="relative w-full h-full flex items-center justify-center p-3">
                <img
                  src={selectedImageUrl}
                  alt={`Retinal Fundus Image ${patient.eye}`}
                  className="w-full h-full object-contain rounded-xl select-none"
                  referrerPolicy="no-referrer"
                />
                <RetinalReticle showReticle={showReticle} eye={patient.eye} />
              </div>
            ) : (
              /* Empty Drop Zone State */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="text-center p-8 max-w-sm cursor-pointer hover:scale-[1.01] transition-transform"
              >
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:border-rose-500/50 group-hover:text-rose-400 transition-colors">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  Upload Retinal Fundus Photograph
                </h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed font-sans">
                  Click to browse or drop non-mydriatic fundus photo (PNG, JPG, TIFF).
                </p>
                <button
                  type="button"
                  id="browse-files-btn"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-medium inline-flex items-center gap-2 shadow-md transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Select Image File</span>
                </button>
              </div>
            )}

            {/* In-Viewport Controls (Floating at bottom-left when image is loaded) */}
            {selectedImageUrl && (
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                <button
                  type="button"
                  id="toggle-reticle-btn"
                  onClick={() => setShowReticle(!showReticle)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 transition-colors cursor-pointer min-h-[36px]"
                >
                  Graticule: {showReticle ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  id="replace-fundus-image-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
                >
                  <Upload className="w-3 h-3 text-rose-400" />
                  <span>Replace Image</span>
                </button>
                {onClearImage && (
                  <button
                    type="button"
                    id="clear-fundus-image-btn"
                    onClick={onClearImage}
                    className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="Clear Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Eye watermark tag */}
            {selectedImageUrl && (
              <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded bg-black/70 backdrop-blur-sm border border-slate-800 text-xs font-mono font-bold text-rose-400">
                {patient.eye} FIELD
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.dcm,.tiff"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Acquisition Guidance Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#11171F] border border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-slate-300">
                Acquisition standard: 45° Non-Mydriatic Fundus
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              Format: PNG, JPEG, TIFF, DICOM Export
            </span>
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <button
              type="button"
              id="proceed-to-quality-btn"
              onClick={onProceedToQuality}
              disabled={!selectedImageUrl}
              className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 hover:shadow-rose-900/50 transition-all cursor-pointer min-h-[44px]"
            >
              <span>Verify Quality Assessment (Stage 03)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar: Case Selection & Protocol Checklist (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Quick Benchmark Preset Switcher */}
          <div className="bg-[#11171F] border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Benchmark Scenarios
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                Offline Demo
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Load an illustrative benchmark case to test pipeline steps without camera hardware:
            </p>

            <div className="space-y-2">
              {CLINICAL_CASE_PRESETS.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    id={`image-case-${preset.id}`}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-rose-500/80 text-white shadow-md ring-1 ring-rose-500/30'
                        : 'bg-[#0B0F14]/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="truncate">{preset.shortLabel}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-1" />}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 font-sans">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frontline Acquisition Protocol */}
          <div className="bg-[#11171F] border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
              Acquisition Checklist
            </h3>
            <ul className="text-xs text-slate-400 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono text-xs">01</span>
                <span>Dim ambient examination room lighting to encourage pupil dilation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono text-xs">02</span>
                <span>Instruct patient to fixate on the internal green fixation target.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono text-xs">03</span>
                <span>Ensure optic disc sits in nasal field and macula is centrally positioned.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono text-xs">04</span>
                <span>Focus retinal blood vessels sharply before triggering image capture.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

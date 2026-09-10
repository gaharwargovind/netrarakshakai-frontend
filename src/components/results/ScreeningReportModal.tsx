import { API_BASE_URL } from '../../services/screeningApi';
import React, { useState } from 'react';
import { ScreeningResponse, PatientInfo } from '../../types/screening';
import {
  Printer,
  X,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  RefreshCw,
  Send,
  Building2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export type ReportMode = 'screening_report' | 'referral_summary' | 'quality_failure' | 'backend_failure';

export interface ClinicianReviewData {
  decision?: string;
  notes?: string;
  name?: string;
  regNo?: string;
}

interface ScreeningReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ReportMode;
  patient: PatientInfo;
  screening?: ScreeningResponse | null;
  imageUrl?: string;
  clinicianReview?: ClinicianReviewData;
  backendErrorMessage?: string;
  onRecapture?: () => void;
  onRouteHumanReview?: () => void;
}

export const ScreeningReportModal: React.FC<ScreeningReportModalProps> = ({
  isOpen,
  onClose,
  mode,
  patient,
  screening,
  imageUrl,
  clinicianReview,
  backendErrorMessage,
  onRecapture,
  onRouteHumanReview,
}) => {
  const [activeTab, setActiveTab] = useState<'document' | 'attribution' | 'technical'>('document');
  const [attributionOpacity, setAttributionOpacity] = useState<number>(70);
  const [zoom, setZoom] = useState<number>(1.0);

  if (!isOpen) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      // Handled in sandboxed environments
    }
  };

  const isSimulation = screening?.is_simulation ?? false;
  const isReferable = screening?.recommendation.referable ?? false;
  const isQualityPass = screening?.quality.overall_status === 'PASS';

  // Determine Title and Subtitle based on mode
  let documentTitle = 'NETRARAKSHAKAI SCREENING REPORT';
  let documentSubtitle = 'Designed for a PHC-oriented clinical decision-support workflow.';

  if (mode === 'referral_summary') {
    documentTitle = 'PROTOTYPE REFERRAL SUMMARY';
    documentSubtitle = 'Prototype Referral Summary · Qualified Practitioner Review Required';
  } else if (mode === 'quality_failure' || (!isQualityPass && screening)) {
    documentTitle = 'AUTOMATED SCREENING NOT COMPLETED';
    documentSubtitle = 'Reason: IMAGE QUALITY INSUFFICIENT · Recapture or Qualified Human Review Required';
  } else if (mode === 'backend_failure') {
    documentTitle = 'LIVE SCREENING REPORT UNAVAILABLE';
    documentSubtitle = 'BACKEND UNAVAILABLE — LIVE INFERENCE BLOCKED';
  }

  // Patient identifier display: strictly differentiate benchmark vs real patient
  const displayPatientId = isSimulation
    ? `DEMO-${screening?.image_id || 'BENCHMARK'}`
    : patient.patientId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="report-print-container relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-[#0B0F14] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-h-none print:rounded-none">
        {/* Modal Top Control Bar (Screen only, hidden in print) */}
        <div className="no-print flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#11171F] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white tracking-tight truncate">
                {documentTitle}
              </h2>
              <p className="text-[10px] sm:text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate">
                {documentSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation Controls: Tabs, Print, Close */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* View Switcher for passed screening reports */}
            {isQualityPass && screening && (
              <div className="hidden sm:flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('document')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'document' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Clinical Report
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('attribution')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'attribution' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Visual Attribution
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('technical')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'technical' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Traceability
                </button>
              </div>
            )}

            <button
              type="button"
              id="report-print-btn"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
              title="Print document on A4 standard paper"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Print / Export</span>
            </button>

            <button
              type="button"
              id="report-close-btn"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
              aria-label="Close report"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="report-print-body p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto overflow-x-hidden flex-1 text-slate-200 font-sans print:p-0 print:text-black print:overflow-visible">
          {/* ========================================================= */}
          {/* 1. DOCUMENT HEADER & FACILITY METADATA                    */}
          {/* ========================================================= */}
          <div className="border-b border-slate-800 print:border-slate-300 pb-5 space-y-3 break-inside-avoid">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-mono font-black text-base sm:text-lg tracking-wider">
                    NETRARAKSHAKAI
                  </span>
                  <span className="text-slate-600 print:text-slate-400">|</span>
                  <span className="text-xs sm:text-sm font-mono text-slate-300 print:text-slate-800 font-semibold tracking-wide">
                    AI-ASSISTED RETINAL SCREENING
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold font-mono text-white print:text-black mt-1">
                  {documentTitle}
                </h1>
                <p className="text-xs font-mono text-slate-400 print:text-slate-600">
                  {documentSubtitle}
                </p>
              </div>

              {/* Live vs Demonstration Notice */}
              <div className="sm:text-right font-mono text-xs space-y-1">
                {isSimulation ? (
                  <div className="inline-flex flex-col sm:items-end">
                    <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/60 text-amber-300 font-bold uppercase text-[11px] print:border-amber-700 print:text-amber-800 print:bg-amber-100">
                      DEMONSTRATION SCENARIO
                    </span>
                    <span className="text-[10px] text-amber-400/90 print:text-amber-900 block mt-0.5">
                      Synthetic benchmark illustration · No live inference performed
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex flex-col sm:items-end">
                    <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-bold uppercase text-[11px] print:border-emerald-700 print:text-emerald-800 print:bg-emerald-100">
                      LIVE SCREENING
                    </span>
                    <span className="text-[10px] text-slate-400 print:text-slate-600 block mt-0.5">
                      Configured FastAPI/E015 screening service ({API_BASE_URL})
                    </span>
                  </div>
                )}
                <div className="text-[11px] text-slate-400 print:text-slate-600 mt-1">
                  Facility: <strong className="text-slate-200 print:text-black">{patient.phcLocation || 'PHC Primary Screening Node'}</strong>
                </div>
              </div>
            </div>

            {/* Prototype Disclaimer Banner */}
            <div className="px-3 py-1.5 rounded bg-slate-100 dark:bg-[#11171F] border border-slate-300 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 print:bg-slate-50 print:text-black flex items-center justify-between">
              <span><strong>Notice:</strong> Development prototype only. Not approved for autonomous clinical diagnosis.</span>
              <span className="text-[10px] text-slate-500">Audit Reference: E007 / E015</span>
            </div>

            {/* Benchmark demonstration explicit safeguard banner */}
            {isSimulation && (
              <div className="p-2.5 rounded bg-amber-950/30 border border-amber-500/40 text-[11px] font-mono text-amber-200 print:bg-amber-50 print:text-amber-900 print:border-amber-400">
                <strong>Demonstration Benchmark Scenario:</strong> This document reflects a synthetic demonstration case for system validation and workflow testing. It does NOT represent an authentic patient medical record or autonomous clinical diagnosis.
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* CASE: BACKEND FAILURE STATE                              */}
          {/* ========================================================= */}
          {mode === 'backend_failure' && (
            <div className="space-y-6 break-inside-avoid">
              <div className="p-6 rounded-xl bg-rose-950/30 border-2 border-rose-500/50 print:border-rose-700 print:bg-rose-50 space-y-4">
                <div className="flex items-start gap-3.5">
                  <AlertTriangle className="w-6 h-6 text-rose-400 print:text-rose-700 shrink-0 mt-0.5" />
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-sm font-bold text-rose-300 print:text-rose-800 uppercase tracking-wide">
                      LIVE SCREENING REPORT UNAVAILABLE
                    </div>
                    <div className="text-xs font-semibold text-rose-200 print:text-rose-900">
                      BACKEND UNAVAILABLE — LIVE INFERENCE BLOCKED
                    </div>
                    <p className="text-xs font-sans text-slate-200 print:text-slate-800 leading-relaxed">
                      {backendErrorMessage || 'The local Python E015 inference engine is unreachable. Live inference is blocked to protect against unverified clinical screening.'}
                    </p>
                    <div className="p-3 rounded-lg bg-black/40 print:bg-white print:border print:border-slate-300 text-[11px] space-y-1.5 text-slate-300 print:text-slate-800">
                      <div className="font-bold text-rose-400 print:text-rose-700 uppercase tracking-wider text-[10px]">
                        Required Protocol Next Steps:
                      </div>
                      <div>1. Reconnect the screening engine (FastAPI / E015 service at {API_BASE_URL}).</div>
                      <div>2. Route patient fundus photographs for qualified human ophthalmic review.</div>
                      <div>3. Benchmark Library remains available for offline demonstration and workflow illustration.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screening Information Table for the incident */}
              <div className="p-4 rounded-xl bg-[#11171F] print:bg-slate-50 border border-slate-800 print:border-slate-300 font-mono text-xs">
                <div className="text-xs font-bold text-slate-300 print:text-slate-800 uppercase tracking-wider mb-3">
                  Screening Session Context
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">Patient ID</span>
                    <span className="text-white print:text-black font-bold">{displayPatientId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">Age / Sex</span>
                    <span className="text-slate-200 print:text-slate-800">{patient.age} Yrs / {patient.sex}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">Eye Screened</span>
                    <span className="text-rose-400 print:text-rose-700 font-bold">{patient.eye} ({patient.eye === 'OD' ? 'OD Right' : 'OS Left'})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">Screening Date</span>
                    <span className="text-slate-200 print:text-slate-800">{patient.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Clinician Sign-off Placeholder */}
              <ClinicianSignOffSection review={clinicianReview} isDemonstration={false} />
            </div>
          )}

          {/* ========================================================= */}
          {/* CASE: QUALITY FAILURE STATE                              */}
          {/* ========================================================= */}
          {(mode === 'quality_failure' || (!isQualityPass && screening)) && mode !== 'backend_failure' && (
            <div className="space-y-6 break-inside-avoid">
              <div className="p-6 rounded-xl bg-amber-950/30 border-2 border-amber-500/50 print:border-amber-700 print:bg-amber-50 space-y-4">
                <div className="flex items-start gap-3.5">
                  <AlertTriangle className="w-6 h-6 text-amber-400 print:text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-sm font-bold text-amber-300 print:text-amber-800 uppercase tracking-wide">
                      AUTOMATED SCREENING NOT COMPLETED
                    </div>
                    <div className="text-xs font-semibold text-amber-200 print:text-amber-900">
                      Reason: IMAGE QUALITY INSUFFICIENT
                    </div>
                    <div className="text-xs font-semibold text-amber-300 print:text-amber-800 uppercase">
                      Recommended action: RECAPTURE OR QUALIFIED HUMAN REVIEW
                    </div>
                    <p className="text-xs font-sans text-slate-200 print:text-slate-800 leading-relaxed">
                      This quality assessment concerns suitability for the automated screening workflow and does not establish the presence or absence of retinal disease.
                    </p>
                    {screening?.quality.rejection_reason && (
                      <div className="p-2.5 rounded bg-black/40 print:bg-white print:border print:border-amber-300 text-[11px] text-amber-300 print:text-amber-900">
                        <strong>Quality Audit Rejection:</strong> {screening.quality.rejection_reason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Action Buttons for failed quality (Screen Only) */}
                <div className="no-print pt-2 flex flex-wrap items-center gap-3">
                  {onRecapture && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onRecapture();
                      }}
                      className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>RECAPTURE IMAGE</span>
                    </button>
                  )}
                  {onRouteHumanReview && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onRouteHumanReview();
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-mono border border-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Send className="w-4 h-4 text-amber-400" />
                      <span>ROUTE FOR QUALIFIED HUMAN REVIEW</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Patient and Session Information */}
              <div className="p-4 rounded-xl bg-[#11171F] print:bg-slate-50 border border-slate-800 print:border-slate-300 font-mono text-xs">
                <div className="text-xs font-bold text-slate-300 print:text-slate-800 uppercase tracking-wider mb-3">
                  Screening Information
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">Patient ID</span>
                    <span className="text-white print:text-black font-bold">{displayPatientId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">Age / Sex</span>
                    <span className="text-slate-200 print:text-slate-800">{patient.age} Yrs / {patient.sex}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">Eye Screened</span>
                    <span className="text-rose-400 print:text-rose-700 font-bold">{patient.eye} ({patient.eye === 'OD' ? 'OD Right' : 'OS Left'})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">Screening Date</span>
                    <span className="text-slate-200 print:text-slate-800">{patient.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Evaluated Quality Dimensions */}
              {screening?.quality && (
                <div className="p-4 rounded-xl bg-[#11171F] print:bg-slate-50 border border-slate-800 print:border-slate-300 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 print:text-slate-800 uppercase tracking-wider">
                      E013 Deterministic Quality-Gate Measurements
                    </span>
                    <span className={
                      screening.quality.overall_status === 'PASS'
                        ? 'text-emerald-400 font-bold'
                        : 'text-amber-400 font-bold'
                    }>
                      Gate: {screening.quality.overall_status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                    <div className="p-2 rounded bg-[#0B0F14] print:bg-white print:border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">FOV Coverage:</span>
                      <span className="text-slate-200">{screening.quality.metrics.fov_coverage.displayValue}</span>
                    </div>
                    <div className="p-2 rounded bg-[#0B0F14] print:bg-white print:border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Laplacian Variance:</span>
                      <span className="text-slate-200">{screening.quality.metrics.laplacian_variance.displayValue}</span>
                    </div>
                    <div className="p-2 rounded bg-[#0B0F14] print:bg-white print:border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Edge Density:</span>
                      <span className="text-slate-200">{screening.quality.metrics.edge_density.displayValue}</span>
                    </div>
                    <div className="p-2 rounded bg-[#0B0F14] print:bg-white print:border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Mean Intensity:</span>
                      <span className="text-slate-200">{screening.quality.metrics.mean_intensity.displayValue}</span>
                    </div>
                    <div className="p-2 rounded bg-[#0B0F14] print:bg-white print:border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Dark Fraction:</span>
                      <span className="text-slate-200">{screening.quality.metrics.dark_fraction.displayValue}</span>
                    </div>
                    <div className="p-2 rounded bg-[#0B0F14] print:bg-white print:border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Bright Fraction:</span>
                      <span className="text-slate-200">{screening.quality.metrics.bright_fraction.displayValue}</span>
                    </div>
                    <div className="p-2 rounded bg-[#0B0F14] print:bg-white print:border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">P90–P10 Spread:</span>
                      <span className="text-slate-200">{screening.quality.metrics.percentile_spread_90.displayValue}</span>
                    </div>
                    <div className="p-2 rounded bg-[#0B0F14] print:bg-white print:border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Noise MAD:</span>
                      <span className="text-slate-200">{screening.quality.metrics.noise_mad.displayValue}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Fundus Image Display */}
              {imageUrl && (
                <div className="p-4 rounded-xl bg-[#11171F] print:bg-slate-50 border border-slate-800 print:border-slate-300 font-mono text-xs space-y-2">
                  <div className="text-xs font-bold text-slate-300 print:text-slate-800 uppercase tracking-wider">
                    Captured Retinal Photograph (Failed Automated Gate)
                  </div>
                  <div className="w-full max-w-sm mx-auto aspect-square rounded-xl bg-[#06090D] overflow-hidden flex items-center justify-center p-2 border border-slate-800">
                    <img
                      src={imageUrl}
                      alt="Fundus with quality deficit"
                      className="w-full h-full object-contain rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}

              {/* Clinician Sign-off Placeholder */}
              <ClinicianSignOffSection review={clinicianReview} isDemonstration={isSimulation} />
            </div>
          )}

          {/* ========================================================= */}
          {/* CASE: STANDARD SCREENING & REFERRAL REPORT (PASS CASES)  */}
          {/* ========================================================= */}
          {isQualityPass && screening && (
            <div className="space-y-6">
              {/* 2. SCREENING INFORMATION */}
              <div className="p-4 rounded-xl bg-[#11171F] print:bg-slate-50 border border-slate-800 print:border-slate-300 font-mono text-xs break-inside-avoid">
                <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-200 pb-2 mb-3">
                  <span className="text-xs font-bold text-slate-300 print:text-slate-800 uppercase tracking-wider">
                    Screening Information
                  </span>
                  <span className="text-[10px] text-slate-400 print:text-slate-500">
                    Session ID: {screening.image_id}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">Patient ID</span>
                    <span className="text-white print:text-black font-bold">{displayPatientId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">Age / Biological Sex</span>
                    <span className="text-slate-200 print:text-slate-800">{patient.age} Yrs / {patient.sex}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">Eye Screened</span>
                    <span className="text-rose-400 print:text-rose-700 font-bold">
                      {patient.eye} ({patient.eye === 'OD' ? 'OD Right' : 'OS Left'})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">Screening Date / Time</span>
                    <span className="text-slate-200 print:text-slate-800">{patient.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* 3. IMAGE QUALITY SECTION */}
              <div className="p-4 rounded-xl bg-[#11171F] print:bg-slate-50 border border-slate-800 print:border-slate-300 font-mono text-xs space-y-2 break-inside-avoid">
                <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300 print:text-slate-800 uppercase tracking-wider">
                      Technical Image Quality — E013 Deterministic Gate
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                      screening.quality.overall_status === 'PASS'
                        ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 print:bg-emerald-100 print:text-emerald-800 print:border-emerald-600'
                        : 'bg-rose-950/80 border border-rose-500/50 text-rose-300 print:bg-rose-100 print:text-rose-800 print:border-rose-600'
                    }`}>
                      GATE {screening.quality.overall_status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                  <div>FOV Coverage: <strong className="text-slate-200 print:text-slate-900">{screening.quality.metrics.fov_coverage.displayValue}</strong></div>
                  <div>Laplacian Variance: <strong className="text-slate-200 print:text-slate-900">{screening.quality.metrics.laplacian_variance.displayValue}</strong></div>
                  <div>Edge Density: <strong className="text-slate-200 print:text-slate-900">{screening.quality.metrics.edge_density.displayValue}</strong></div>
                  <div>Mean Intensity: <strong className="text-slate-200 print:text-slate-900">{screening.quality.metrics.mean_intensity.displayValue}</strong></div>
                  <div>Dark Fraction: <strong className="text-slate-200 print:text-slate-900">{screening.quality.metrics.dark_fraction.displayValue}</strong></div>
                  <div>Bright Fraction: <strong className="text-slate-200 print:text-slate-900">{screening.quality.metrics.bright_fraction.displayValue}</strong></div>
                  <div>P90 Spread: <strong className="text-slate-200 print:text-slate-900">{screening.quality.metrics.percentile_spread_90.displayValue}</strong></div>
                  <div>Noise MAD: <strong className="text-slate-200 print:text-slate-900">{screening.quality.metrics.noise_mad.displayValue}</strong></div>
                </div>
                {screening.quality.failed_checks.length > 0 && (
                  <div className="text-[10px] text-rose-400 print:text-rose-700 pt-1 border-t border-slate-800/60 print:border-slate-200">
                    Failed checks: {screening.quality.failed_checks.join(', ')}
                  </div>
                )}
                <div className="text-[10px] text-slate-400 print:text-slate-600 pt-1 border-t border-slate-800/60 print:border-slate-200">
                  This technical quality assessment concerns suitability for the automated screening workflow and does not establish the presence or absence of retinal disease.
                </div>
              </div>

              {/* 4. AI SCREENING RESULT & 5. MODEL CONFIDENCE */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 break-inside-avoid">
                {/* Left: AI Screening Result (7 cols) */}
                <div
                  className={`md:col-span-7 p-5 rounded-xl border flex flex-col justify-between ${
                    isReferable
                      ? 'bg-rose-950/20 border-rose-500/40 print:bg-rose-50 print:border-rose-300'
                      : 'bg-emerald-950/20 border-emerald-500/40 print:bg-emerald-50 print:border-emerald-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 print:text-slate-600">
                        AI SCREENING RESULT
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          isReferable
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 print:bg-rose-100 print:text-rose-800'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 print:bg-emerald-100 print:text-emerald-800'
                        }`}
                      >
                        {isReferable ? 'REFERABLE SCREENING RESULT' : 'NON-REFERABLE SCREENING RESULT'}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-white print:text-black">
                        ICDR Grade {screening.classification.predicted_grade}
                      </span>
                      <span className="text-sm font-mono text-slate-300 print:text-slate-700 font-semibold">
                        — {screening.classification.grade_name}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed font-sans">
                      {screening.classification.clinical_definition}
                    </p>

                    {/* Strict Clinical Safeguard Notice */}
                    <div className="p-2.5 rounded bg-black/40 print:bg-white print:border print:border-slate-300 text-[11px] font-mono text-slate-300 print:text-slate-800 mt-2">
                      {isReferable ? (
                        <span>
                          <strong className="text-rose-400 print:text-rose-700">Clinical Directive:</strong> ICDR Grade ≥ 2 · Specialist assessment recommended. Follow the applicable local referral pathway. Final clinical assessment remains with a qualified practitioner.
                        </span>
                      ) : (
                        <span>
                          <strong className="text-emerald-400 print:text-emerald-700">Clinical Safeguard:</strong> A non-referable AI screening result does not guarantee absence of disease. Continue follow-up according to the applicable local clinical protocol and qualified practitioner guidance.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Model Confidence & Probability (5 cols) */}
                <div className="md:col-span-5 p-5 rounded-xl bg-[#11171F] print:bg-slate-50 border border-slate-800 print:border-slate-300 font-mono text-xs flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 print:text-slate-600 block mb-2">
                      Model Confidence & Probability
                    </span>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-300 print:text-slate-700">Model confidence:</span>
                          <span className="text-white print:text-black font-bold text-sm">
                            {Math.round(screening.calibration.calibrated_confidence * 100)}%
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 print:text-slate-600">
                          Temperature scaling: T = 0.7785 (Development calibration)
                        </div>
                      </div>

                      <div className="pt-1 border-t border-slate-800 print:border-slate-200">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-300 print:text-slate-700">Referable probability P(DR ≥ 2):</span>
                          <span className={`font-bold text-sm ${isReferable ? 'text-rose-400 print:text-rose-700' : 'text-emerald-400 print:text-emerald-700'}`}>
                            {screening.calibration.referable_probability.toFixed(3)}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 print:text-slate-600">
                          Operational cutoff threshold: 0.500
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-[#0B0F14] print:bg-white print:border print:border-slate-200 text-[10px] text-slate-400 print:text-slate-600 leading-relaxed">
                    Confidence reflects the model’s probability estimate and is not a guarantee of clinical correctness.
                  </div>
                </div>
              </div>

              {/* 6. VISUAL ATTRIBUTION (ORIGINAL FUNDUS ALONGSIDE MODEL ATTRIBUTION) */}
              <div className="p-4 rounded-xl bg-[#11171F] print:bg-slate-50 border border-slate-800 print:border-slate-300 font-mono text-xs space-y-3 break-inside-avoid">
                <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-300 print:text-slate-800 uppercase tracking-wider">
                    Visual Attribution (Grad-CAM)
                  </span>
                  <span className="text-[10px] text-slate-400 print:text-slate-600">
                    Target Layer: {screening.explanation.target_layer}
                  </span>
                </div>

                {/* Side-by-Side Fundus & Model Attribution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Original Fundus */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 print:text-slate-600">
                      <span>ORIGINAL FUNDUS</span>
                      <span>{patient.eye} FIELD</span>
                    </div>
                    <div className="relative aspect-square rounded-lg bg-[#06090D] border border-slate-800 print:border-slate-300 overflow-hidden flex items-center justify-center p-1">
                      <img
                        src={imageUrl || screening.explanation.overlay_image_url}
                        alt="Original retinal fundus"
                        className="w-full h-full object-contain rounded"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Model Attribution Heatmap */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 print:text-slate-600">
                      <span>MODEL ATTRIBUTION</span>
                      <span>E007 GRAD-CAM</span>
                    </div>
                    <div className="relative aspect-square rounded-lg bg-[#06090D] border border-slate-800 print:border-slate-300 overflow-hidden flex items-center justify-center p-1">
                      <img
                        src={screening.explanation.overlay_image_url}
                        alt="Grad-CAM model saliency attribution"
                        className="w-full h-full object-contain rounded"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>

                {/* Mandatory Visual Attribution Disclaimer */}
                <div className="p-2.5 rounded bg-amber-950/20 print:bg-amber-50 border border-amber-500/30 print:border-amber-300 text-[11px] text-amber-200 print:text-amber-900 leading-relaxed">
                  <strong>Attribution Notice:</strong> This visualization is model attribution, not definitive lesion segmentation or clinical proof. Saliency maps indicate pixel clusters influencing model classification; they do not prove the presence of microaneurysms, hemorrhages, hard exudates, or neovascularization.
                </div>
              </div>

              {/* 7. SCREENING RECOMMENDATION */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11171F] print:bg-slate-50 border border-slate-200 dark:border-slate-800 print:border-slate-300 font-mono text-xs space-y-2 break-inside-avoid">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 print:border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-300 print:text-slate-800 uppercase tracking-wider">
                    Screening Recommendation
                  </span>
                  {screening.recommendation.timeframe && (
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 print:bg-slate-200 text-slate-800 dark:text-slate-200 print:text-slate-800 text-[10px]">
                      Timeframe: {screening.recommendation.timeframe}
                    </span>
                  )}
                </div>
                <div className="text-xs font-sans text-slate-800 dark:text-slate-200 print:text-slate-800 leading-relaxed">
                  <p><strong>Rationale: </strong>{screening.recommendation.reason}</p>
                  <p className="mt-1"><strong>Directive: </strong>{screening.recommendation.suggested_action}</p>
                </div>
              </div>

              {/* 8. SAFETY / LIMITATIONS & MODEL TRACEABILITY */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11171F] print:bg-slate-50 border border-slate-200 dark:border-slate-800 print:border-slate-300 font-mono text-xs space-y-3 break-inside-avoid">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-300 print:text-slate-800 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 print:border-slate-200 pb-2">
                  Safety, Model Traceability & Calibration Evidence
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  {/* Model Traceability */}
                  <div className="space-y-1">
                    <div className="text-slate-500 dark:text-slate-400 print:text-slate-600 font-bold uppercase text-[10px]">MODEL / PIPELINE</div>
                    <div className="text-slate-800 dark:text-slate-200 print:text-slate-800 font-mono">
                      {screening.metadata?.model_name || 'EfficientNet-B0'} · {screening.metadata?.pipeline_name ? `Pipeline ${screening.metadata.pipeline_name}` : 'Pipeline E015'} · PyTorch
                    </div>
                    {screening.metadata?.device_target && (
                      <div className="text-slate-600 dark:text-slate-400 print:text-slate-600 text-[10px]">
                        Target Execution: {screening.metadata.device_target}
                      </div>
                    )}
                    <div className="text-slate-600 dark:text-slate-400 print:text-slate-600 text-[10px]">
                      {screening.metadata?.calibration_method || 'Temperature scaling T = 0.7785'}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 print:text-slate-600 text-[10px] break-all">
                      Checkpoint SHA: <span className="text-slate-800 dark:text-slate-300 print:text-slate-700">{screening.metadata?.checkpoint_hash || 'a61710e11557bb7d1be60ed488e5bdf5b88c92d16c76441513bbfa4d8b94cc3c'}</span>
                    </div>
                  </div>

                  {/* Calibration Evidence */}
                  <div className="space-y-1">
                    <div className="text-slate-400 print:text-slate-600 font-bold uppercase text-[10px]">CALIBRATION EVIDENCE</div>
                    <div className="text-slate-300 print:text-slate-700 text-[10px]">
                      Multiclass ECE: Before: 0.0797, After: 0.0377
                    </div>
                    <div className="text-slate-300 print:text-slate-700 text-[10px]">
                      Referable ECE: Before: 0.0438, After: 0.0359
                    </div>
                    <div className="text-slate-400 print:text-slate-600 text-[10px]">
                      Development calibration evidence — not clinical certification.
                    </div>
                  </div>
                </div>

                {/* External Safety Gate Statement */}
                <div className="p-2 rounded bg-rose-950/20 print:bg-rose-50 border border-rose-500/30 print:border-rose-200 text-[10px] text-rose-300 print:text-rose-900">
                  <strong>External Validation Target:</strong> External referable sensitivity was 79.61%, below the project's &gt;90% safety target. External safety gate: FAILED. Automated screening is an experimental prototype and cannot replace qualified practitioner assessment.
                </div>

                {/* Privacy Safeguard Notice */}
                <div className="text-[10px] text-slate-400 print:text-slate-600 leading-relaxed border-t border-slate-800/60 print:border-slate-200 pt-2">
                  <strong>Data Privacy Disclosure:</strong> Live screening is configured to use the local NetraRakshakAI FastAPI/E015 service. Patient images are not intentionally sent by this frontend to Gemini or unrelated external AI services. Local processing may generate temporary screening artifacts. Production deployment requires a defined retention, access-control and deletion policy.
                </div>
              </div>

              {/* 9. QUALIFIED CLINICAL REVIEW & CLINICIAN SIGN-OFF PLACEHOLDER */}
              <ClinicianSignOffSection review={clinicianReview} isDemonstration={isSimulation} />
            </div>
          )}
        </div>

        {/* Modal Bottom Control Bar (Screen only, hidden in print) */}
        <div className="no-print px-4 sm:px-6 py-3.5 bg-[#11171F] border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
            NetraRakshakAI Clinical Reporting Suite · Phase 16E
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              id="report-print-bottom-btn"
              onClick={handlePrint}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer min-h-[38px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Document</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// CLINICIAN SIGN-OFF & REVIEW PLACEHOLDER SUB-COMPONENT
// Strict adherence to Section 13 & 14 boundary rules
// =========================================================================
interface ClinicianSignOffSectionProps {
  review?: ClinicianReviewData;
  isDemonstration?: boolean;
}

const ClinicianSignOffSection: React.FC<ClinicianSignOffSectionProps> = ({ review, isDemonstration }) => {
  const hasDecision = Boolean(review?.decision);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#11171F] print:bg-slate-50 border border-slate-800 print:border-slate-300 font-mono text-xs space-y-4 break-inside-avoid">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 print:border-slate-200 pb-2 gap-2">
        <div>
          <span className="text-xs font-bold text-slate-200 print:text-slate-800 uppercase tracking-wider block">
            QUALIFIED CLINICAL REVIEW
          </span>
          <span className="text-[10px] text-slate-400 print:text-slate-600">
            AI SCREENING REFERENCE ↓ Qualified practitioner assessment
          </span>
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
            hasDecision
              ? 'bg-sky-950/80 text-sky-300 border border-sky-500/50 print:bg-sky-100 print:text-sky-800'
              : 'bg-slate-800 text-slate-400 print:bg-slate-200 print:text-slate-600'
          }`}
        >
          {hasDecision ? 'Practitioner Review Documented' : 'Review Pending — Adjudication Required'}
        </span>
      </div>

      {/* Recorded Clinician Review (if available) */}
      {hasDecision ? (
        <div className="p-3 rounded-lg bg-[#0B0F14] print:bg-white print:border print:border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 print:text-slate-600 uppercase text-[10px]">Clinical Decision:</span>
            <span className="text-white print:text-black font-bold">{review?.decision}</span>
          </div>
          {review?.name && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400 print:text-slate-600 uppercase text-[10px]">Practitioner Name:</span>
              <span className="text-slate-200 print:text-slate-800">{review.name}</span>
            </div>
          )}
          {review?.regNo && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400 print:text-slate-600 uppercase text-[10px]">Registration / ID:</span>
              <span className="text-slate-200 print:text-slate-800">{review.regNo}</span>
            </div>
          )}
          {review?.notes && (
            <div className="pt-2 border-t border-slate-800 print:border-slate-200">
              <span className="text-slate-400 print:text-slate-600 uppercase text-[10px] block mb-1">
                Clinical Observations & Directives:
              </span>
              <p className="text-slate-200 print:text-slate-800 font-sans leading-relaxed text-xs">
                {review.notes}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-slate-900/60 print:bg-slate-100 text-slate-400 print:text-slate-600 text-xs">
          Review pending — practitioner adjudication required. Final clinical assessment remains with a qualified practitioner.
        </div>
      )}

      {/* Clinician Sign-Off Placeholder Area (Requirement 14) */}
      <div className="p-4 rounded-lg bg-[#0B0F14] print:bg-white border border-slate-800 print:border-slate-300 space-y-3 font-mono text-xs">
        <div className="text-[11px] font-bold text-slate-300 print:text-slate-800 uppercase tracking-wider">
          Practitioner Sign-Off &amp; Authentication
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1">
            <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">
              Practitioner Name:
            </span>
            <div className="h-7 border-b border-slate-700 print:border-slate-400 flex items-end pb-1 text-slate-200 print:text-black font-semibold">
              {review?.name || ''}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">
              Registration / Credentials:
            </span>
            <div className="h-7 border-b border-slate-700 print:border-slate-400 flex items-end pb-1 text-slate-200 print:text-black">
              {review?.regNo || ''}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">
              Clinical Decision:
            </span>
            <div className="h-7 border-b border-slate-700 print:border-slate-400 flex items-end pb-1 text-slate-200 print:text-black">
              {review?.decision || ''}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase">
              Signature / Authentication:
            </span>
            <div className="h-7 border-b border-slate-700 print:border-slate-400" />
          </div>
        </div>

        {/* Mandatory Prototype Label (Requirement 9 & 14) */}
        <div className="text-[10px] text-slate-400 print:text-slate-600 pt-2 border-t border-slate-800/60 print:border-slate-200 space-y-1">
          <div className="font-bold text-amber-400 print:text-amber-800 uppercase tracking-wide">
            Development prototype only. Not approved for autonomous clinical diagnosis.
          </div>
          <div>
            Prototype workflow — no electronic signature or clinical record submission is performed by this application.
          </div>
        </div>
      </div>
    </div>
  );
};

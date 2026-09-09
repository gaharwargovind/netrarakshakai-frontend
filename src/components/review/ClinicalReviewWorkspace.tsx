import React, { useState } from 'react';
import { ScreeningResponse, PatientInfo, Eye } from '../../types/screening';
import {
  UserCheck,
  FileText,
  RefreshCw,
  User,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Send,
  Building2,
  Stethoscope,
  Info,
  Calendar,
  Eye as EyeIcon,
} from 'lucide-react';

import { ClinicianReviewData } from '../results/ScreeningReportModal';

interface ClinicalReviewWorkspaceProps {
  screening: ScreeningResponse;
  patient: PatientInfo;
  imageUrl: string;
  onBackToResult: () => void;
  onRecapture: () => void;
  onNewPatient: () => void;
  onOpenReferralSlip: (reviewData?: ClinicianReviewData, mode?: 'screening_report' | 'referral_summary') => void;
}

type ClinicianDecision =
  | 'CONCUR_REFERRAL'
  | 'ROUTINE_MONITORING'
  | 'RECAPTURE_REQUESTED'
  | 'CLINICAL_OVERRIDE';

export const ClinicalReviewWorkspace: React.FC<ClinicalReviewWorkspaceProps> = ({
  screening,
  patient,
  imageUrl,
  onBackToResult,
  onRecapture,
  onNewPatient,
  onOpenReferralSlip,
}) => {
  const { classification, calibration, recommendation, is_simulation } = screening;
  const isReferable = recommendation.referable;

  // Clinician review form state (operator workflow placeholder)
  // CRITICAL REQUIREMENT 15: Never automatically mark clinician decision without real clinician action
  const [decision, setDecision] = useState<ClinicianDecision | null>(null);
  const [clinicianName, setClinicianName] = useState('');
  const [clinicianRegNo, setClinicianRegNo] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision) return;
    setIsSaved(true);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Simulation / Benchmark Banner if applicable */}
      {is_simulation && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-[10px] tracking-wider uppercase">
                DEMONSTRATION SCENARIO
              </span>
              <span className="font-semibold text-amber-100">
                Synthetic benchmark illustration
              </span>
            </div>
            <p className="text-[11px] text-amber-300/80">
              Demonstrating the human-in-the-loop review workflow using standardized benchmark features. No live inference performed.
            </p>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 whitespace-nowrap font-bold">
            No live inference performed
          </span>
        </div>
      )}

      {/* Stage Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs mb-2">
              <span>STEP 06</span>
              <span>·</span>
              <span>HUMAN-IN-THE-LOOP CLINICAL REVIEW</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Qualified Clinical Review Pathway
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Frontline PHC documentation pathway. Record qualified clinician evaluation alongside AI screening outputs.
            </p>
          </div>

          {/* Navigation back to Stage 05 */}
          <button
            type="button"
            id="back-to-results-btn"
            onClick={onBackToResult}
            className="self-start md:self-auto px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Stage 05 Results</span>
          </button>
        </div>
      </div>

      {/* Mandatory Operator Workflow Placeholder Notice */}
      <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/40 text-sky-200 flex items-start gap-3 text-xs font-mono">
        <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-sky-300 uppercase tracking-wider">
            OPERATOR WORKFLOW PLACEHOLDER · CLINICAL ADJUDICATION
          </div>
          <p className="text-sky-200/90 leading-relaxed font-sans">
            AI screening outputs are adjunct decision-support indicators. Definitive medical diagnosis requires verified practitioner evaluation and signature in the patient's medical health record. This interface records operator shift workflow and prepares tele-referral documentation.
          </p>
        </div>
      </div>

      {/* Main 2-Column Comparison Layout: AI Recommendation vs Qualified Human Decision */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Column 1: AI Screening Reference (Reference Only, 5 cols) */}
        <div className="lg:col-span-5 bg-[#11171F] border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                AI SCREENING REFERENCE (E015)
              </span>
              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                Decision-support input only
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              REFERENCE
            </span>
          </div>

          {/* Retinal Preview Thumbnail */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-[#0B0F14] border border-slate-800">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-800">
              <img
                src={imageUrl}
                alt="Patient Fundus"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 font-mono text-xs space-y-1">
              <div className="font-bold text-white truncate">
                {patient.patientId}
              </div>
              <div className="text-slate-400">
                Eye: <span className="text-rose-400 font-bold">{patient.eye}</span> · Age: {patient.age}y ({patient.sex})
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {patient.phcLocation}
              </div>
            </div>
          </div>

          {/* AI Metrics Breakdown */}
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-lg bg-[#0B0F14] border border-slate-800/80 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase">Predicted Severity</div>
              <div className="text-base font-bold text-white">
                {classification ? (
  <>ICDR Grade {classification.predicted_grade} · {classification.grade_name}</>
) : (
  <>AI Inference Withheld</>
)}
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1">
                {classification ? classification.clinical_definition : 'No AI classification was generated because the image did not pass the quality gate.'}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0B0F14] border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] uppercase">Calibrated Confidence</span>
                <span className="text-white font-bold">
                  {calibration ? `${Math.round(calibration.calibrated_confidence * 100)}%` : 'N/A — inference withheld'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Temperature Scaled: T = 0.7785 (Development calibration)
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0B0F14] border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] uppercase">Referable Probability P(DR ≥ 2)</span>
                <span className={`font-bold ${isReferable ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {calibration ? calibration.referable_probability.toFixed(3) : 'N/A — inference withheld'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {calibration ? "Decision Boundary Threshold: ≥ 0.500" : "Decision Boundary: Not evaluated"}
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              isReferable
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="font-bold uppercase tracking-wider text-[11px] mb-1">
                AI Recommendation: {recommendation.category}
              </div>
              <div className="text-xs font-sans text-slate-200 leading-relaxed">
                {recommendation.suggested_action}
              </div>
              {recommendation.timeframe && (
                <div className="text-[10px] text-slate-400 mt-2 font-mono">
                  Timeframe: {recommendation.timeframe}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Qualified Human Clinical Decision (Form, 7 cols) */}
        <div className="lg:col-span-7 bg-[#11171F] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                CLINICAL DECISION (QUALIFIED PRACTITIONER)
              </span>
              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                Operator Workflow Placeholder · Active Clinician Action Required
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              HUMAN-IN-THE-LOOP
            </span>
          </div>

          <form onSubmit={handleSaveDecision} className="space-y-6">
            {/* Status indicator if no decision made yet */}
            {!decision && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Action Required: Select clinical adjudication option below. The AI output does not predetermine or finalize clinician assessment.</span>
              </div>
            )}

            {/* Clinical Decision Selection */}
            <div>
              <label className="block text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase mb-3">
                Clinician Adjudication / Next Action
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'CONCUR_REFERRAL' as ClinicianDecision,
                    label: 'Concur with Specialist Referral',
                    desc: 'Route according to the applicable local referral pathway and qualified practitioner guidance.',
                    badge: 'Referral Required',
                    color: 'rose',
                  },
                  {
                    id: 'ROUTINE_MONITORING' as ClinicianDecision,
                    label: 'Routine PHC Re-examination',
                    desc: 'Follow-up according to applicable local clinical protocol and practitioner guidance',
                    badge: 'Protocol Follow-up',
                    color: 'emerald',
                  },
                  {
                    id: 'RECAPTURE_REQUESTED' as ClinicianDecision,
                    label: 'Request Retake / Recapture',
                    desc: 'Image artifact, poor pupil dilation, or media opacity observed',
                    badge: 'Recapture',
                    color: 'amber',
                  },
                  {
                    id: 'CLINICAL_OVERRIDE' as ClinicianDecision,
                    label: 'Clinical Override / Tele-Consult',
                    desc: 'Alternative clinical judgment or asynchronous tele-ophthalmology escalation',
                    badge: 'Clinical Discretion',
                    color: 'sky',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setDecision(opt.id);
                      setIsSaved(false);
                    }}
                    className={`p-3.5 rounded-lg border text-left transition-all min-h-[44px] cursor-pointer ${
                      decision === opt.id
                        ? 'bg-slate-800/90 border-rose-500/80 text-white shadow-md ring-1 ring-rose-500/30'
                        : 'bg-[#0B0F14] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-white">
                        {opt.label}
                      </span>
                      {decision === opt.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-1" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Clinician Identity Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase mb-2">
                  Examining Clinician / Medical Officer
                </label>
                <input
                  type="text"
                  value={clinicianName}
                  onChange={(e) => {
                    setClinicianName(e.target.value);
                    setIsSaved(false);
                  }}
                  className="w-full bg-[#0B0F14] border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                  placeholder="e.g. Dr. Name, MBBS"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase mb-2">
                  Registration / Operator ID
                </label>
                <input
                  type="text"
                  value={clinicianRegNo}
                  onChange={(e) => {
                    setClinicianRegNo(e.target.value);
                    setIsSaved(false);
                  }}
                  className="w-full bg-[#0B0F14] border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                  placeholder="e.g. State Medical Council No."
                />
              </div>
            </div>

            {/* Clinical Notes */}
            <div>
              <label className="block text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase mb-2">
                Clinical Observations & Management Directives
              </label>
              <textarea
                rows={3}
                value={clinicalNotes}
                onChange={(e) => {
                  setClinicalNotes(e.target.value);
                  setIsSaved(false);
                }}
                placeholder="Document patient visual acuity (e.g. 6/9 OD, 6/12 OS), duration of diabetes, glycemic history, and specific instructions for the referral center..."
                className="w-full bg-[#0B0F14] border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-sans leading-relaxed"
              />
            </div>

            {/* Confirmation Feedback */}
            {isSaved && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Clinical decision recorded for session {patient.patientId}. Ready for document generation.</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <button
                type="submit"
                id="save-clinical-decision-btn"
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer min-h-[44px]"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Save Decision Record</span>
              </button>

              {/* View Screening Report (Adjudicated) */}
              <button
                type="button"
                id="view-review-screening-report-btn"
                onClick={() => {
                  const currentReviewData: ClinicianReviewData = {
                    decision: decision
                      ? decision === 'CONCUR_REFERRAL'
                        ? 'Concur with Referral — Specialist Consultation Recommended'
                        : decision === 'ROUTINE_MONITORING'
                        ? 'Routine Clinical Follow-Up Advised'
                        : decision === 'RECAPTURE_REQUESTED'
                        ? 'Recapture Requested — Technical Deficit'
                        : 'Clinical Override — Specialist Consultation'
                      : undefined,
                    name: clinicianName.trim() || undefined,
                    regNo: clinicianRegNo.trim() || undefined,
                    notes: clinicalNotes.trim() || undefined,
                  };
                  onOpenReferralSlip(currentReviewData, 'screening_report');
                }}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs rounded-lg border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
              >
                <FileText className="w-4 h-4 text-slate-300" />
                <span>Screening Report</span>
              </button>

              {/* Prototype Referral Summary */}
              <button
                type="button"
                id="generate-official-slip-btn"
                onClick={() => {
                  const currentReviewData: ClinicianReviewData = {
                    decision: decision
                      ? decision === 'CONCUR_REFERRAL'
                        ? 'Concur with Referral — Specialist Consultation Recommended'
                        : decision === 'ROUTINE_MONITORING'
                        ? 'Routine Clinical Follow-Up Advised'
                        : decision === 'RECAPTURE_REQUESTED'
                        ? 'Recapture Requested — Technical Deficit'
                        : 'Clinical Override — Specialist Consultation'
                      : undefined,
                    name: clinicianName.trim() || undefined,
                    regNo: clinicianRegNo.trim() || undefined,
                    notes: clinicalNotes.trim() || undefined,
                  };
                  onOpenReferralSlip(currentReviewData, 'referral_summary');
                }}
                className="py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer min-h-[44px]"
              >
                <FileText className="w-4 h-4" />
                <span>Prototype Referral Summary</span>
              </button>

              <button
                type="button"
                id="complete-review-next-btn"
                onClick={onNewPatient}
                className="py-3 px-4 bg-[#0B0F14] hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs rounded-lg border border-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Next Intake</span>
              </button>
            </div>
          </form>

          {/* Legal / Clinical Responsibility Statement */}
          <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-300">CLINICAL DIRECTIVE: </span>
            The qualified healthcare provider bears primary responsibility for diagnostic and therapeutic decisions. AI model attribution and risk scores must be evaluated alongside comprehensive patient history and presenting symptoms.
          </div>
        </div>
      </div>
    </div>
  );
};

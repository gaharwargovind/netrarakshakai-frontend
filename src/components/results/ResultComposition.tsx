import React, { useState } from 'react';
import { ScreeningResponse, PatientInfo } from '../../types/screening';
import { ICDRScale } from './ICDRScale';
import { ReferralBadge } from './ReferralBadge';
import { RetinaComparisonViewer } from '../explainability/RetinaComparisonViewer';
import { TechnicalEvidencePanel } from '../safety/TechnicalEvidencePanel';
import { ValidationLimitationPanel } from '../safety/ValidationLimitationPanel';
import { SafetyPanel } from '../safety/SafetyPanel';
import { SafetyStatusCard } from '../safety/SafetyStatusCard';
import { DataPrivacyNotice } from '../safety/DataPrivacyNotice';
import { ClinicalSafetyConfirmationModal } from '../safety/ClinicalSafetyConfirmationModal';
import { ReferralSlipModal } from './ReferralSlipModal';
import {
  FileText,
  Send,
  RefreshCw,
  Eye,
  CheckCircle2,
  Calendar,
  User,
  Activity,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface ResultCompositionProps {
  screening: ScreeningResponse;
  patient: PatientInfo;
  imageUrl: string;
  onProceedToReview?: () => void;
  onRecapture: () => void;
  onNewPatient: () => void;
}

export const ResultComposition: React.FC<ResultCompositionProps> = ({
  screening,
  patient,
  imageUrl,
  onProceedToReview,
  onRecapture,
  onNewPatient,
}) => {
  const [modalMode, setModalMode] = useState<'screening_report' | 'referral_summary' | null>(null);
  const [safetyConfirmationAction, setSafetyConfirmationAction] = useState<'review' | 'referral' | null>(null);

  const { classification, calibration, recommendation, explanation, metadata, timing } = screening;
  const isReferable = recommendation.referable;
  const isSimulation = screening.is_simulation;

  const handleConfirmSafeguard = () => {
    if (safetyConfirmationAction === 'review' && onProceedToReview) {
      onProceedToReview();
    } else if (safetyConfirmationAction === 'referral') {
      setModalMode('referral_summary');
    }
    setSafetyConfirmationAction(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Unified Safety Status Indicator */}
      <SafetyStatusCard
        state={
          isSimulation
            ? 'DEMONSTRATION'
            : isReferable
            ? 'SPECIALIST_REFERRAL'
            : 'NON_REFERABLE'
        }
        customExplanation={
          isSimulation
            ? 'Demonstrating screening triage workflow with standardized benchmark features. No live inference performed.'
            : undefined
        }
      />

      {/* 1. Primary Screening Result Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs mb-2">
              <span>STEP 05</span>
              <span>·</span>
              <span>SCREENING RESULT & CLINICAL TRIAGE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Screening Result
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Calibrated automated assessment for frontline diabetic eye care triage.
            </p>
          </div>

          {/* Patient Quick Context Pill */}
          <div className="flex flex-wrap items-center gap-3 bg-[#11171F] border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs">
            <div>
              <span className="text-slate-400">ID: </span>
              <span className="text-white font-bold">{patient.patientId}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <span className="text-slate-400">AGE: </span>
              <span className="text-white">{patient.age}y</span>
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <span className="text-slate-400">FIELD: </span>
              <span className="text-rose-400 font-bold">{patient.eye}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <span className="text-slate-400">QUALITY: </span>
              <span className="text-emerald-400 font-bold">{screening.quality.overall_status}</span>
            </div>
          </div>
        </div>

        {/* Primary Disclaimer Banner */}
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between mb-4">
          <span>AI-assisted screening prototype result ≠ definitive clinical diagnosis</span>
          <span className="text-slate-400 hidden sm:inline">Model: EfficientNet-B0 · Experiment E007</span>
        </div>

        {/* Main Result Summary Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
          {/* Main Grade Headline (7 cols) */}
          <div
            className={`lg:col-span-7 p-6 sm:p-8 rounded-2xl border flex flex-col justify-between ${
              isReferable
                ? 'bg-gradient-to-br from-rose-950/40 via-[#11171F] to-[#0B0F14] border-rose-500/50 shadow-xl shadow-rose-950/20'
                : 'bg-gradient-to-br from-emerald-950/40 via-[#11171F] to-[#0B0F14] border-emerald-500/50 shadow-xl shadow-emerald-950/20'
            }`}
          >
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                  SCREENING CLASSIFICATION
                </span>
                <span
                  className={`text-[11px] font-mono px-2.5 py-0.5 rounded font-bold uppercase ${
                    isReferable
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isReferable ? 'REFERABLE SCREENING RESULT' : 'NON-REFERABLE SCREENING RESULT'}
                </span>
              </div>

              {/* Huge Numbers & Grade Name */}
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white">
                  ICDR GRADE {classification.predicted_grade}
                </span>
              </div>

              <div className="text-sm font-mono font-semibold text-slate-300 mb-2">
                {isReferable
                  ? 'ICDR Grade ≥ 2 · Specialist assessment recommended'
                  : 'ICDR Grade < 2 · Routine monitoring recommended'}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                {classification.grade_name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed mb-3">
                {classification.clinical_definition}
              </p>

              {/* Strict clinical disclaimer */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-[11px] font-mono text-slate-300">
                {isReferable ? (
                  <span>
                    <strong className="text-rose-400">Clinical Safeguard:</strong> AI-assisted screening result — final clinical assessment remains with a qualified practitioner. Automated referral does not constitute definitive diagnosis.
                  </span>
                ) : (
                  <span>
                    <strong className="text-emerald-400">Clinical Safeguard:</strong> A non-referable AI screening result does not guarantee absence of disease. Continue follow-up according to the applicable local clinical protocol and qualified practitioner guidance.
                  </span>
                )}
              </div>
            </div>

            {/* Referral Triage Statement */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Triage Decision:
              </span>
              <span
                className={`text-sm font-mono font-bold ${
                  isReferable ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {isReferable ? 'REFERABLE (ICDR ≥ 2)' : 'NON-REFERABLE (ICDR < 2)'}
              </span>
            </div>
          </div>

          {/* Calibrated Model Likelihoods (5 cols) */}
          <div className="lg:col-span-5 bg-[#11171F] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Model Calibration & Probabilities
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {calibration.method}
                </span>
              </div>

              <div className="space-y-4">
                {/* Metric 1: Calibrated Confidence */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-300">Calibrated Model Confidence:</span>
                    <span className="text-white font-bold text-base">
                      {Math.round(calibration.calibrated_confidence * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${Math.round(calibration.calibrated_confidence * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block mt-1">
                    Temperature scaled post-processing (T = 0.7785 · Development calibration)
                  </span>
                </div>

                {/* Metric 2: Referable Probability */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-300">Referable Probability P(DR ≥ 2):</span>
                    <span
                      className={`font-bold text-base ${
                        isReferable ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {calibration.referable_probability.toFixed(3)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isReferable ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.round(calibration.referable_probability * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>Cutoff: 0.500</span>
                    <span>Status: {isReferable ? 'Above Threshold' : 'Below Threshold'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note on Confidence */}
            <div className="p-3 rounded-lg bg-[#0B0F14] border border-slate-800 text-[11px] font-mono text-slate-400 leading-relaxed space-y-1">
              <p>
                <strong className="text-slate-300 font-bold">Model Confidence: </strong>
                Confidence describes the model&apos;s probability estimate for its prediction. It is not a guarantee of clinical correctness.
              </p>
              <p className="text-[10px] text-slate-400">
                Calibrated via temperature scaling (T = 0.7785) on development splits. Does not represent clinical certification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Clear Referral Recommendation Badge */}
      <ReferralBadge recommendation={recommendation} />

      {/* 3. ICDR 5-Level Scale Visualization */}
      <ICDRScale classification={classification} />

      {/* 4. Grad-CAM Explainability Section */}
      <RetinaComparisonViewer
        originalImageUrl={imageUrl}
        explanation={explanation}
        patient={patient}
      />

      {/* 5. Primary Pathway to Stage 06: Clinical Decision Support & Review */}
      <div className="bg-[#11171F] border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Stage 06 Review & Clinical Next Steps
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/60 text-sky-400 border border-sky-800/60">
                Human-in-the-Loop Required
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              AI output is decision-support information. Final clinical assessment remains with a qualified practitioner.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            PHC Operator Workflow
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 pt-1">
          {/* Action 1: Proceed to Stage 06 Review (Primary) */}
          {onProceedToReview && (
            <button
              type="button"
              id="proceed-to-review-btn"
              onClick={() => setSafetyConfirmationAction('review')}
              className="p-3.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer min-h-[44px]"
            >
              <UserCheck className="w-4 h-4" />
              <span>Review with Clinician</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Action 2: Prototype Referral Summary (STRICTLY ONLY WHEN REFERABLE) */}
          {isReferable && (
            <button
              type="button"
              id="open-referral-slip-btn"
              onClick={() => setSafetyConfirmationAction('referral')}
              className="p-3.5 rounded-lg bg-rose-950/80 hover:bg-rose-900/80 text-rose-200 hover:text-white font-medium text-xs border border-rose-500/50 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
            >
              <FileText className="w-4 h-4 text-rose-400" />
              <span>Prototype Referral Summary</span>
            </button>
          )}

          {/* Action 3: NetraRakshakAI Screening Report (Available for all passed results) */}
          <button
            type="button"
            id="open-screening-report-btn"
            onClick={() => setModalMode('screening_report')}
            className="p-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
          >
            <FileText className="w-4 h-4 text-slate-300" />
            <span>Screening Report</span>
          </button>

          {/* Action 4: Recapture Retinal Image */}
          <button
            type="button"
            id="recapture-from-results-btn"
            onClick={onRecapture}
            className="p-3.5 rounded-lg bg-[#0B0F14] hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs border border-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span>Recapture Image</span>
          </button>

          {/* Action 5: New Patient Screening */}
          <button
            type="button"
            id="new-patient-from-results-btn"
            onClick={onNewPatient}
            className="p-3.5 rounded-lg bg-[#0B0F14] hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs border border-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
          >
            <User className="w-4 h-4 text-slate-400" />
            <span>Next Intake</span>
          </button>
        </div>
      </div>

      {/* 6. Technical Evidence Panel */}
      <TechnicalEvidencePanel
        metadata={metadata}
        timing={timing}
        calibration={calibration}
      />

      {/* 7. External Validation Limitation Panel */}
      <ValidationLimitationPanel />

      {/* 8. Data Privacy Notice */}
      <DataPrivacyNotice />

      {/* 9. Safety Directive Section */}
      <SafetyPanel />

      {/* Clinical Workflow Safety Safeguard Modal */}
      <ClinicalSafetyConfirmationModal
        isOpen={!!safetyConfirmationAction}
        onClose={() => setSafetyConfirmationAction(null)}
        onConfirm={handleConfirmSafeguard}
        actionTitle={
          safetyConfirmationAction === 'review'
            ? 'Transition to Clinical Review Workspace'
            : 'Generate Prototype Referral Summary'
        }
        actionDescription={
          safetyConfirmationAction === 'review'
            ? 'This initiates Stage 06 clinician adjudication. The model output is decision support; the qualified practitioner conducts the final assessment.'
            : 'Generating a prototype referral summary. This document is a clinical draft requiring practitioner sign-off prior to specialist dispatch.'
        }
        confirmButtonLabel={
          safetyConfirmationAction === 'review'
            ? 'Proceed to Review'
            : 'Open Referral Summary'
        }
      />

      {/* Referral Slip / Screening Report Modal */}
      {modalMode && (
        <ReferralSlipModal
          isOpen={true}
          onClose={() => setModalMode(null)}
          patient={patient}
          screening={screening}
          mode={modalMode}
          imageUrl={imageUrl}
        />
      )}
    </div>
  );
};

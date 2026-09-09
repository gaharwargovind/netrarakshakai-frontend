import React, { useState } from 'react';
import { QualityAssessment, QualityMetric, PatientInfo, ScreeningResponse } from '../../types/screening';
import { CheckCircle2, AlertTriangle, RefreshCw, Send, ArrowRight, ShieldCheck, Eye, Info, FileText } from 'lucide-react';
import { ScreeningReportModal } from '../results/ScreeningReportModal';

interface QualityInspectorProps {
  quality: QualityAssessment;
  imageUrl: string;
  patient: PatientInfo;
  onProceedToAnalysis: () => void;
  onRecapture: () => void;
  onSendHumanReview: () => void;
}

export const QualityInspector: React.FC<QualityInspectorProps> = ({
  quality,
  imageUrl,
  patient,
  onProceedToAnalysis,
  onRecapture,
  onSendHumanReview,
}) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const isPass = quality.overall_status === 'PASS';

  const metricsList: QualityMetric[] = [
    quality.metrics.fov_coverage,
    quality.metrics.laplacian_variance,
    quality.metrics.edge_density,
    quality.metrics.mean_intensity,
    quality.metrics.dark_fraction,
    quality.metrics.bright_fraction,
    quality.metrics.percentile_spread_90,
    quality.metrics.noise_mad,
  ];

  // Synthesize minimal container for quality report modal
  const qualityReportScreening: ScreeningResponse = {
    status: 'quality_failed',
    image_id: `IQA-${patient.patientId}`,
    quality,
    classification: {
      predicted_grade: 0,
      grade_name: 'Unassessed',
      clinical_definition: 'Not evaluated due to quality gate hold',
      probabilities: [1, 0, 0, 0, 0],
      referable: false,
      referable_probability: 0,
    },
    calibration: {
      method: 'Temperature scaling',
      calibrated_confidence: 0,
      referable_probability: 0,
      is_calibrated: true,
      temperature_parameter: 0.7785,
    },
    explanation: {
      method: 'Grad-CAM',
      target_layer: 'N/A',
      overlay_image_url: imageUrl,
      disclaimer: 'Quality gate hold: Automated inference not performed.',
    },
    recommendation: {
      category: 'Recapture required',
      reason: 'Automated screening not completed due to insufficient image quality.',
      suggested_action: 'Recapture retinal image under improved optical conditions or route for qualified human review.',
      referable: false,
      timeframe: 'Immediate recapture / routing',
    },
    metadata: {
      model_name: 'E007',
      pipeline_name: 'E015',
      pipeline_version: '1.0.0-E015',
      calibration_method: 'Temperature scaling (T=0.7785)',
      checkpoint_verification: 'verified',
      checkpoint_hash: 'a61710e11557bb7d1be60ed488e5bdf5b88c92d16c76441513bbfa4d8b94cc3c',
      device_target: 'Local Inference Runtime',
    },
    timing: {
      quality_check_ms: 0,
      inference_ms: 0,
      gradcam_ms: 0,
      total_processing_ms: 0,
    },
    is_simulation: false,
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Step Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 font-mono text-xs mb-2">
            <span>STEP 03</span>
            <span>·</span>
            <span>IMAGE QUALITY VERIFICATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Pre-Screening Quality Audit
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Automated image quality gate protects against diagnostic misclassification from optical artifacts.
          </p>
        </div>

        {/* Status Banner */}
        <div
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border font-mono text-xs ${
            isPass
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}
        >
          {isPass ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <div>
            <div className="font-bold uppercase tracking-wider">
              {isPass ? 'QUALITY ACCEPTABLE' : 'QUALITY INSUFFICIENT'}
            </div>
            <div className="text-[11px] text-slate-400">
              Optical Gate {isPass ? 'PASSED' : 'HOLD'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Retinal Fundus Viewer with Inspection Frame (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative w-full aspect-square rounded-2xl bg-[#06090D] border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center p-3">
            <img
              src={imageUrl}
              alt="Fundus Under Quality Inspection"
              className="w-full h-full object-contain rounded-xl select-none"
              referrerPolicy="no-referrer"
            />
            {/* Dark vignette ring */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-800 pointer-events-none" />

            {/* Quality status overlay pill */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
              <span
                className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md border ${
                  isPass
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                    : 'bg-amber-950/90 text-amber-300 border-amber-500/50'
                }`}
              >
                {isPass ? 'PASS · GRADABLE' : 'QUALITY INSUFFICIENT'}
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded-md">
                {patient.eye} FIELD
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#11171F] border border-slate-800 text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>PATIENT ID: {patient.patientId}</span>
            <span>FIELD: {patient.eye}</span>
          </div>
        </div>

        {/* Right: Scientific Indicators & Decision Workflow (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quality Breakdown Scientific Cards */}
          <div className="bg-[#11171F] border border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                Optical Assessment Parameters
              </span>
              <span className="text-xs font-mono text-slate-400">E013 deterministic quality-gate measurements</span>
            </div>

            <div className="space-y-4">
              {metricsList.map((metric) => {
                const isMetricOk = metric.status === 'acceptable';
                const isWarning = metric.status === 'warning';
                const percentage =
                  metric.name === 'FOV coverage' ||
                  metric.name === 'Dark fraction' ||
                  metric.name === 'Bright fraction'
                    ? Math.max(0, Math.min(100, Math.round(metric.value * 100)))
                    : 100;

                return (
                  <div
                    key={metric.name}
                    className="p-3.5 rounded-lg bg-[#0B0F14] border border-slate-800/80 hover:border-slate-700/80 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isMetricOk
                              ? 'bg-emerald-400'
                              : isWarning
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                        />
                        <span className="text-xs font-mono font-semibold text-slate-200">
                          {metric.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400">
                          {metric.displayValue}
                        </span>
                        <span
                          className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                            isMetricOk
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20'
                              : isWarning
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-950/60 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Scientific Gauge Line */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full ${
                          isMetricOk
                            ? 'bg-emerald-500'
                            : isWarning
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      {metric.clinicalDescription}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Decision State Branching */}
          {isPass ? (
            /* PASS: Proceed to Screening Analysis */
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Image Quality Approved for Inference
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    The deterministic E013 quality gate accepted the image for automated screening triage. This quality assessment evaluates technical suitability, not the presence or absence of disease.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  id="start-inference-btn"
                  onClick={onProceedToAnalysis}
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/50 transition-all cursor-pointer min-h-[44px]"
                >
                  <span>Execute Analysis (Stage 04)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono leading-relaxed pt-1 border-t border-emerald-200 dark:border-emerald-800/40">
                Disclaimer: Quality assessment evaluates technical suitability for automated screening, not the presence or absence of disease.
              </p>
            </div>
          ) : (
            /* FAIL: Recapture / Human Review Workflow */
            <div className="p-6 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-500/40 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-amber-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span>Image quality insufficient</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 font-bold uppercase">
                    Recapture required
                  </span>
                </div>
                <div className="text-xs font-semibold text-amber-800 dark:text-amber-300 font-mono">
                  Qualified human review recommended if recapture is unavailable.
                </div>
                <p className="text-xs text-slate-700 dark:text-amber-200/90 leading-relaxed font-sans">
                  The fundus photograph did not meet optical quality criteria for automated screening. Automated inference is withheld to avoid misclassification.
                </p>
                {quality.rejection_reason && (
                  <div className="p-3 rounded bg-amber-100/70 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/30 text-xs font-mono text-amber-900 dark:text-amber-300">
                    <strong className="text-slate-900 dark:text-white">Deficiency Explanation: </strong>{quality.rejection_reason}
                  </div>
                )}
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/60 p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-slate-800 dark:text-slate-300 font-bold text-[10px] uppercase">Evaluated Optical Dimensions:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px]">
                    <div>FOV coverage: <span className="text-slate-900 dark:text-slate-300 font-bold">{quality.metrics.fov_coverage.displayValue}</span></div>
                    <div>Laplacian variance: <span className="text-slate-900 dark:text-slate-300 font-bold">{quality.metrics.laplacian_variance.displayValue}</span></div>
                    <div>Edge density: <span className="text-slate-900 dark:text-slate-300 font-bold">{quality.metrics.edge_density.displayValue}</span></div>
                    <div>Mean intensity: <span className="text-slate-900 dark:text-slate-300 font-bold">{quality.metrics.mean_intensity.displayValue}</span></div>
                    <div>Dark fraction: <span className="text-slate-900 dark:text-slate-300 font-bold">{quality.metrics.dark_fraction.displayValue}</span></div>
                    <div>Bright fraction: <span className="text-slate-900 dark:text-slate-300 font-bold">{quality.metrics.bright_fraction.displayValue}</span></div>
                    <div>P90–P10 spread: <span className="text-slate-900 dark:text-slate-300 font-bold">{quality.metrics.percentile_spread_90.displayValue}</span></div>
                    <div>Noise MAD: <span className="text-slate-900 dark:text-slate-300 font-bold">{quality.metrics.noise_mad.displayValue}</span></div>
                    <div>Overall Gate: <span className="text-slate-900 dark:text-slate-300 font-bold">{quality.overall_status}</span></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  id="recapture-image-btn"
                  onClick={onRecapture}
                  className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs font-mono rounded-lg flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer min-h-[44px]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>RECAPTURE</span>
                </button>

                <button
                  type="button"
                  id="send-human-review-fail-btn"
                  onClick={onSendHumanReview}
                  className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs font-mono rounded-lg border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>ROUTE FOR HUMAN REVIEW</span>
                </button>

                <button
                  type="button"
                  id="view-quality-report-btn"
                  onClick={() => setIsReportOpen(true)}
                  className="w-full py-3.5 px-4 bg-amber-950/70 hover:bg-amber-900/80 text-amber-200 hover:text-white font-medium text-xs font-mono rounded-lg border border-amber-600/50 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>QUALITY AUDIT REPORT</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono leading-relaxed pt-2 border-t border-amber-200 dark:border-amber-800/40">
                Quality assessment evaluates technical suitability for automated screening, not the presence or absence of disease.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quality Audit Failure Report Modal */}
      {isReportOpen && (
        <ScreeningReportModal
          isOpen={true}
          onClose={() => setIsReportOpen(false)}
          mode="quality_failure"
          patient={patient}
          screening={qualityReportScreening}
          imageUrl={imageUrl}
          onRecapture={onRecapture}
          onRouteHumanReview={onSendHumanReview}
        />
      )}
    </div>
  );
};

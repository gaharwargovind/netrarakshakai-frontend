/**
 * NetraRakshakAI Phase 16D — Safety UX & Human-in-the-Loop Domain Types
 * Standardizes operational safety states, error classifications, and human-in-the-loop boundaries.
 */

export type SafetyOperationalState =
  | 'READY'
  | 'QUALITY_PASS'
  | 'QUALITY_INSUFFICIENT'
  | 'ANALYSIS'
  | 'NON_REFERABLE'
  | 'SPECIALIST_REFERRAL'
  | 'HUMAN_REVIEW'
  | 'RECAPTURE_OR_HUMAN_REVIEW'
  | 'BACKEND_UNAVAILABLE'
  | 'DEMONSTRATION'
  | 'ERROR';

export type ErrorClassification =
  | 'INVALID_FILE'
  | 'UNSUPPORTED_FILE'
  | 'CORRUPTED_IMAGE'
  | 'UPLOAD_FAILURE'
  | 'NETWORK_FAILURE'
  | 'BACKEND_UNAVAILABLE'
  | 'BACKEND_TIMEOUT'
  | 'UNEXPECTED_RESPONSE'
  | 'GRADCAM_UNAVAILABLE'
  | 'ARTIFACT_UNAVAILABLE';

export interface SafetyStateDefinition {
  state: SafetyOperationalState;
  textLabel: string;
  badge: string;
  iconName:
    | 'check-circle'
    | 'alert-triangle'
    | 'alert-octagon'
    | 'alert-circle'
    | 'user-check'
    | 'refresh-cw'
    | 'wifi-off'
    | 'sparkles'
    | 'cpu'
    | 'camera';
  whatHappened: string;
  whyExplanation: string;
  recommendedAction: string;
  theme: 'neutral' | 'emerald' | 'amber' | 'rose' | 'sky';
}

export const SAFETY_STATE_DEFINITIONS: Record<SafetyOperationalState, SafetyStateDefinition> = {
  READY: {
    state: 'READY',
    textLabel: 'READY FOR SCREENING',
    badge: 'WORKSTATION IDLE',
    iconName: 'camera',
    whatHappened: 'Screening instrument is initialized and awaiting patient fundus photograph.',
    whyExplanation: 'Patient identification verified. Optical intake viewport is ready for image acquisition.',
    recommendedAction: 'Acquire or upload 45° macular-centered fundus photograph to proceed.',
    theme: 'neutral',
  },
  QUALITY_PASS: {
    state: 'QUALITY_PASS',
    textLabel: 'QUALITY ACCEPTABLE',
    badge: 'OPTICAL GATE PASSED',
    iconName: 'check-circle',
    whatHappened: 'Image meets automated criteria for focus, illumination, and field-of-view.',
    whyExplanation: 'Pre-screening optical metrics satisfy automated quality thresholds for model inference.',
    recommendedAction: 'Proceed to execute automated screening analysis (Stage 04).',
    theme: 'emerald',
  },
  QUALITY_INSUFFICIENT: {
    state: 'QUALITY_INSUFFICIENT',
    textLabel: 'QUALITY INSUFFICIENT',
    badge: 'OPTICAL GATE HOLD',
    iconName: 'alert-triangle',
    whatHappened: 'Captured image did not meet the automated screening quality gate.',
    whyExplanation:
      'Optical deficiencies (e.g. defocus, media haze, poor illumination, or disc occlusion) risk inaccurate screening. Note: Image quality failure indicates insufficient optical quality for AI analysis, not a clinical diagnosis or disease finding.',
    recommendedAction: 'Recapture fundus photograph or route directly for qualified human review.',
    theme: 'amber',
  },
  ANALYSIS: {
    state: 'ANALYSIS',
    textLabel: 'ANALYSIS IN PROGRESS',
    badge: 'MODEL E007 RUNNING',
    iconName: 'cpu',
    whatHappened: 'Inference pipeline E015 is processing the fundus photograph.',
    whyExplanation: 'Evaluating feature representations, temperature calibration, and Grad-CAM salience mapping.',
    recommendedAction: 'Wait for automated screening inference to finish (typically < 500ms).',
    theme: 'sky',
  },
  NON_REFERABLE: {
    state: 'NON_REFERABLE',
    textLabel: 'NON-REFERABLE SCREENING RESULT',
    badge: 'ICDR GRADE < 2',
    iconName: 'check-circle',
    whatHappened: 'Automated screening indicates non-referable diabetic retinopathy findings.',
    whyExplanation:
      'Predicted ICDR Grade is below specialist threshold (Grade 0 or 1). A non-referable AI screening result does not guarantee absence of disease.',
    recommendedAction:
      'Continue follow-up according to the applicable local clinical protocol and qualified practitioner guidance.',
    theme: 'emerald',
  },
  SPECIALIST_REFERRAL: {
    state: 'SPECIALIST_REFERRAL',
    textLabel: 'REFERABLE SCREENING RESULT',
    badge: 'ICDR GRADE ≥ 2',
    iconName: 'alert-circle',
    whatHappened: 'Automated screening indicates referable diabetic retinopathy (ICDR Grade ≥ 2).',
    whyExplanation:
      'Features consistent with moderate NPDR, severe NPDR, or proliferative DR identified. AI-assisted screening result — final clinical assessment remains with a qualified practitioner.',
    recommendedAction: 'Route patient for qualified specialist assessment and dilated ophthalmic examination.',
    theme: 'rose',
  },
  HUMAN_REVIEW: {
    state: 'HUMAN_REVIEW',
    textLabel: 'HUMAN REVIEW REQUIRED',
    badge: 'CLINICAL ADJUDICATION',
    iconName: 'user-check',
    whatHappened: 'Case flagged for qualified human-in-the-loop clinical adjudication.',
    whyExplanation:
      'Triggered by backend recommendation, optical ambiguity, or operator clinical escalation. The AI screening output remains available as an adjunct reference.',
    recommendedAction: 'Review with qualified practitioner before formulating clinical directives.',
    theme: 'amber',
  },
  RECAPTURE_OR_HUMAN_REVIEW: {
    state: 'RECAPTURE_OR_HUMAN_REVIEW',
    textLabel: 'RECAPTURE OR HUMAN REVIEW',
    badge: 'IMAGE DEFICIT',
    iconName: 'refresh-cw',
    whatHappened: 'Optical quality or positioning deficit precludes confident automated analysis.',
    whyExplanation:
      'Running automated inference on substandard images risks misclassification. The operator must either capture a cleaner fundus photo or seek clinical guidance.',
    recommendedAction: 'Recapture image with improved pupil alignment or route for clinician review.',
    theme: 'amber',
  },
  BACKEND_UNAVAILABLE: {
    state: 'BACKEND_UNAVAILABLE',
    textLabel: 'BACKEND UNAVAILABLE',
    badge: 'LIVE INFERENCE BLOCKED',
    iconName: 'wifi-off',
    whatHappened: 'The local Python E015 screening engine cannot currently be reached.',
    whyExplanation:
      'Live inference is strictly blocked to prevent unverified diagnosis or uncalibrated results. Synthetic fallback is prohibited for real patient care.',
    recommendedAction:
      'Reconnect the local screening engine (127.0.0.1:8000) or route patient image for manual human review.',
    theme: 'rose',
  },
  DEMONSTRATION: {
    state: 'DEMONSTRATION',
    textLabel: 'DEMONSTRATION SCENARIO',
    badge: 'BENCHMARK CASE',
    iconName: 'sparkles',
    whatHappened: 'Standardized demonstration scenario loaded from benchmark library.',
    whyExplanation:
      'Synthetic benchmark illustration for operator training and workflow inspection. No live inference performed.',
    recommendedAction: 'Inspect clinical review workflow and prototype referral summary.',
    theme: 'amber',
  },
  ERROR: {
    state: 'ERROR',
    textLabel: 'PROCESSING ERROR',
    badge: 'OPERATION HALTED',
    iconName: 'alert-octagon',
    whatHappened: 'A system, network, or file format error occurred during processing.',
    whyExplanation: 'The operation could not complete safely. No clinical result was generated.',
    recommendedAction: 'Check file validity, verify local service status, and retry.',
    theme: 'rose',
  },
};

/**
 * NetraRakshakAI Screening Domain Types
 * Strict typing reflecting the Python E015 backend contract.
 */

export type Eye = 'OD' | 'OS'; // OD = Oculus Dexter (Right), OS = Oculus Sinister (Left)

export interface PatientInfo {
  patientId: string;
  age: number | string;
  sex: 'Male' | 'Female' | 'Other';
  eye: Eye;
  timestamp: string;
  phcLocation?: string;
}

export type QualityAssessmentStatus = 'PASS' | 'FAIL';

export interface QualityMetric {
  name: string;
  value: number; // 0.0 - 1.0 (or percentage)
  displayValue: string;
  threshold: number;
  status: 'acceptable' | 'warning' | 'unacceptable';
  clinicalDescription: string;
}

export interface QualityAssessment {
  overall_status: QualityAssessmentStatus;
  quality_score: number; // 0.0 to 1.0
  metrics: {
    focus: QualityMetric;
    field_of_view: QualityMetric;
    illumination: QualityMetric;
    contrast: QualityMetric;
    noise: QualityMetric;
  };
  rejection_reason?: string | null;
}

export type ICDRGrade = 0 | 1 | 2 | 3 | 4;

export interface ICDRClassification {
  predicted_grade: ICDRGrade;
  grade_name: string; // 'No Apparent DR' | 'Mild NPDR' | 'Moderate NPDR' | 'Severe NPDR' | 'Proliferative DR'
  clinical_definition: string;
  probabilities: [number, number, number, number, number];
}

export interface CalibrationData {
  method: 'Temperature scaling';
  calibrated_confidence: number; // e.g. 0.914 (91.4%)
  referable_probability: number; // e.g. 0.892
  is_calibrated: boolean;
  temperature_parameter?: number;
}

export interface ExplanationData {
  method: 'Grad-CAM';
  target_layer: string;
  overlay_image_url: string;
  disclaimer: string;
}

export interface ScreeningRecommendation {
  referable: boolean; // ICDR >= 2
  category: 'Specialist referral recommended' | 'Routine monitoring' | 'Recapture required' | 'Urgent specialist referral';
  reason: string;
  suggested_action: string;
  timeframe: string;
}

export interface TimingMetrics {
  quality_check_ms: number;
  inference_ms: number;
  gradcam_ms: number;
  total_processing_ms: number;
}

export interface PipelineMetadata {
  model_name: string; // 'E007'
  pipeline_name: string; // 'E015'
  pipeline_version: string; // '1.0.0-E015'
  calibration_method: string;
  checkpoint_verification: 'verified' | 'unverified';
  checkpoint_hash: string;
  device_target: string;
}

export interface ScreeningResponse {
  status: 'success' | 'quality_failed' | 'error';
  image_id: string;
  is_simulation?: boolean;
  simulation_label?: string;
  quality: QualityAssessment;
  classification: ICDRClassification;
  calibration: CalibrationData;
  explanation: ExplanationData;
  recommendation: ScreeningRecommendation;
  timing: TimingMetrics;
  metadata: PipelineMetadata;
}

export type WorkflowStep = 'PATIENT' | 'IMAGE' | 'QUALITY' | 'ANALYSIS' | 'RESULT' | 'REVIEW';

export type ExpectedCaseResult =
  | 'Routine (Grade 0)'
  | 'Routine (Grade 1)'
  | 'Referable (Grade 2)'
  | 'Referable (Grade 3)'
  | 'Referable (Grade 4)'
  | 'Quality Insufficient';

export interface ClinicalCasePreset {
  id: string;
  title: string;
  shortLabel: string;
  patient: PatientInfo;
  imageUrl: string;
  description: string;
  expectedResult: ExpectedCaseResult;
  mockResponse: ScreeningResponse;
}


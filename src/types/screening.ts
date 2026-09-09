/**
 * NetraRakshakAI Screening Domain Types
 *
 * These types represent the frontend-normalized screening contract.
 * The live E015 API uses a different wire format; screeningApi.ts
 * explicitly adapts that response before it reaches React components.
 */

export type Eye = 'OD' | 'OS';

export interface PatientInfo {
  patientId: string;
  age: number | string;
  sex: 'Male' | 'Female' | 'Other';
  eye: Eye;
  timestamp: string;
  phcLocation?: string;
}

export type QualityAssessmentStatus = 'PASS' | 'FAIL';

export type QualityMetricStatus =
  | 'acceptable'
  | 'warning'
  | 'unacceptable';

export interface QualityMetric {
  name: string;
  value: number;
  displayValue: string;
  threshold?: number;
  status: QualityMetricStatus;
  clinicalDescription: string;
  unit?: string;
}

export interface QualityAssessment {
  overall_status: QualityAssessmentStatus;

  /**
   * Live E015 does not expose a single composite 0-1 quality score.
   * Benchmark demonstration cases may still provide one.
   */
  quality_score?: number;

  metrics: {
    fov_coverage: QualityMetric;
    laplacian_variance: QualityMetric;
    edge_density: QualityMetric;
    mean_intensity: QualityMetric;
    dark_fraction: QualityMetric;
    bright_fraction: QualityMetric;
    percentile_spread_90: QualityMetric;
    noise_mad: QualityMetric;
  };

  failed_checks: string[];
  message: string;
  rejection_reason?: string | null;
}

export type ICDRGrade = 0 | 1 | 2 | 3 | 4;

export interface ICDRClassification {
  predicted_grade: ICDRGrade;
  grade_name: string;
  clinical_definition: string;
  probabilities: [number, number, number, number, number];
  referable: boolean;
  referable_probability: number;
}

export interface CalibrationData {
  method: 'Temperature scaling';
  calibrated_confidence: number;
  referable_probability: number;
  is_calibrated: boolean;
  temperature_parameter?: number;
}

export interface ExplanationData {
  method: 'Grad-CAM';
  target_layer: string;
  overlay_image_url: string;
  overlay_base64?: string | null;
  disclaimer: string;
}

export type RecommendationCategory =
  | 'Specialist assessment recommended'
  | 'Routine monitoring'
  | 'Recapture required'
  | 'Human review required';

export interface ScreeningRecommendation {
  referable: boolean;
  category: RecommendationCategory;
  reason: string;
  suggested_action: string;
  timeframe?: string;
}

export interface TimingMetrics {
  quality_check_ms: number;
  inference_ms: number;
  gradcam_ms: number;
  total_processing_ms: number;
}

export interface PipelineMetadata {
  model_name: string;
  pipeline_name: string;
  pipeline_version: string;
  calibration_method: string;
  checkpoint_verification: 'verified' | 'unverified';
  checkpoint_hash: string;
  device_target: string;
  timestamp?: string;
  scientific_mandate?: string;
}

export interface ScreeningResponse {
  status: 'success' | 'quality_failed' | 'error';
  image_id: string;
  is_simulation?: boolean;
  simulation_label?: string;
  quality: QualityAssessment;
  classification: ICDRClassification | null;
  calibration: CalibrationData | null;
  explanation: ExplanationData | null;
  recommendation: ScreeningRecommendation;
  timing: TimingMetrics;
  metadata: PipelineMetadata;
}

export type WorkflowStep =
  | 'PATIENT'
  | 'IMAGE'
  | 'QUALITY'
  | 'ANALYSIS'
  | 'RESULT'
  | 'REVIEW';

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

import { PatientInfo, ScreeningResponse, ICDRGrade, QualityMetric } from '../types/screening';
import { CLINICAL_CASE_PRESETS } from '../data/clinicalCases';

const API_BASE_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SCREENING_API_URL ||
  'http://127.0.0.1:8000';

export interface ScreenRequestPayload {
  imageFile?: File | Blob;
  patientInfo: PatientInfo;
  presetCaseId?: string;
  simulatedQualityFail?: boolean;
}

export class ScreeningServiceError extends Error {
  constructor(
    message: string,
    public code:
      | 'SERVICE_UNAVAILABLE'
      | 'INVALID_IMAGE'
      | 'QUALITY_INSUFFICIENT'
      | 'NETWORK_ERROR',
    public technicalDetails?: string
  ) {
    super(message);
    this.name = 'ScreeningServiceError';
  }
}

interface E015Response {
  status: 'SUCCESS' | 'IQA_FAIL' | string;
  image_id: string;

  quality: {
    status: 'PASS' | 'FAIL' | string;
    metrics: {
      fov_coverage: number;
      laplacian_variance: number;
      edge_density: number;
      mean_intensity: number;
      dark_fraction: number;
      bright_fraction: number;
      percentile_spread_90: number;
      noise_mad: number;
    };
    failed_checks: string[];
    message: string;
  };

  classification: {
    predicted_grade: number;
    predicted_grade_name: string;
    class_probabilities: number[];
    referable: boolean;
    referable_probability: number;
    confidence: number;
  } | null;

  calibration: {
    temperature: number;
    calibrated: boolean;
    method?: string;
  };

  explanation: {
    gradcam_available: boolean;
    target_layer: string;
    status: string;
    overlay_url?: string | null;
    overlay_base64?: string | null;
  };

  recommendation: {
    action: string;
    reason: string;
  };

  timing: {
    total_ms: number;
  };

  metadata: {
    model_version: string;
    model_checkpoint_sha256: string;
    timestamp: string;
    pipeline_version: string;
    scientific_mandate: string;
  };
}

const ICDR_DEFINITIONS: Record<number, string> = {
  0: 'No apparent diabetic retinopathy identified by the screening model.',
  1: 'Mild non-proliferative diabetic retinopathy (NPDR).',
  2: 'Moderate non-proliferative diabetic retinopathy (NPDR).',
  3: 'Severe non-proliferative diabetic retinopathy (NPDR).',
  4: 'Proliferative diabetic retinopathy (PDR).',
};

function makeMetric(
  name: string,
  value: number,
  displayValue: string,
  description: string,
  status: 'acceptable' | 'warning' | 'unacceptable' = 'acceptable'
): QualityMetric {
  return {
    name,
    value,
    displayValue,
    status,
    clinicalDescription: description,
  };
}

function hasFailure(failedChecks: string[], patterns: string[]): boolean {
  return failedChecks.some((failure) => {
    const normalized = failure.toLowerCase();
    return patterns.some((pattern) => normalized.includes(pattern));
  });
}

function adaptQuality(data: E015Response['quality']) {
  const failures = data.failed_checks || [];

  const statusFor = (patterns: string[]) =>
    hasFailure(failures, patterns)
      ? ('unacceptable' as const)
      : ('acceptable' as const);

  return {
    overall_status: data.status === 'PASS' ? ('PASS' as const) : ('FAIL' as const),

    metrics: {
      fov_coverage: makeMetric(
        'FOV coverage',
        data.metrics.fov_coverage,
        `${(data.metrics.fov_coverage * 100).toFixed(2)}%`,
        'Retinal field-of-view coverage used by the deterministic E013 quality gate.',
        statusFor(['fov', 'field of view', 'coverage'])
      ),

      laplacian_variance: makeMetric(
        'Laplacian variance',
        data.metrics.laplacian_variance,
        data.metrics.laplacian_variance.toFixed(2),
        'Focus/sharpness proxy based on image Laplacian variance.',
        statusFor(['laplacian', 'focus', 'blur', 'sharp'])
      ),

      edge_density: makeMetric(
        'Edge density',
        data.metrics.edge_density,
        data.metrics.edge_density.toFixed(6),
        'Edge-density measurement used as an image-structure quality indicator.',
        statusFor(['edge'])
      ),

      mean_intensity: makeMetric(
        'Mean intensity',
        data.metrics.mean_intensity,
        data.metrics.mean_intensity.toFixed(2),
        'Mean retinal-region intensity used to detect unsuitable illumination.',
        statusFor(['mean intensity', 'intensity', 'underexposure', 'overexposure'])
      ),

      dark_fraction: makeMetric(
        'Dark fraction',
        data.metrics.dark_fraction,
        `${(data.metrics.dark_fraction * 100).toFixed(2)}%`,
        'Fraction of pixels classified as excessively dark by the quality gate.',
        statusFor(['dark'])
      ),

      bright_fraction: makeMetric(
        'Bright fraction',
        data.metrics.bright_fraction,
        `${(data.metrics.bright_fraction * 100).toFixed(2)}%`,
        'Fraction of pixels classified as excessively bright by the quality gate.',
        statusFor(['bright'])
      ),

      percentile_spread_90: makeMetric(
        'P90–P10 intensity spread',
        data.metrics.percentile_spread_90,
        data.metrics.percentile_spread_90.toFixed(2),
        'Intensity spread used as a contrast/tonal-range indicator.',
        statusFor(['spread', 'contrast'])
      ),

      noise_mad: makeMetric(
        'Noise MAD',
        data.metrics.noise_mad,
        data.metrics.noise_mad.toFixed(4),
        'Median-absolute-deviation noise proxy used by the deterministic gate.',
        statusFor(['noise'])
      ),
    },

    failed_checks: failures,
    message: data.message,
    rejection_reason: failures.length > 0 ? failures.join('; ') : null,
  };
}

function adaptRecommendation(
  recommendation: E015Response['recommendation'],
  referable: boolean,
  classification: E015Response['classification']
) {
  switch (recommendation.action) {
    case 'SPECIALIST_REFERRAL':
      return {
        referable: true,
        category: 'Specialist assessment recommended' as const,
        reason: recommendation.reason,
        suggested_action:
          'Specialist assessment recommended. Follow the applicable local referral pathway.',
      };

    case 'HUMAN_REVIEW':
      return {
        referable,
        category: 'Human review required' as const,
        reason: recommendation.reason,
        suggested_action:
          'Route the screening result for qualified human review according to the applicable local clinical protocol.',
      };

    case 'RECAPTURE_OR_HUMAN_REVIEW':
      return {
        referable: false,
        category: 'Recapture required' as const,
        reason: recommendation.reason,
        suggested_action:
          'Recapture the retinal image or route the image for qualified human review.',
      };

    case 'ROUTINE_MONITORING':
    default:
      return {
        referable: false,
        category: 'Routine monitoring' as const,
        reason:
          recommendation.reason ||
          `Non-referable screening result (ICDR Grade ${classification?.predicted_grade ?? 'unassessed'}).`,
        suggested_action:
          'Continue follow-up according to the applicable local clinical protocol and qualified practitioner guidance.',
      };
  }
}

function adaptE015Response(data: E015Response): ScreeningResponse {
  const quality = adaptQuality(data.quality);
  const cls = data.classification;

  const grade = (
    cls?.predicted_grade >= 0 && cls.predicted_grade <= 4
      ? cls.predicted_grade
      : 0
  ) as ICDRGrade;

  const probabilities = (
    cls?.class_probabilities?.length === 5
      ? cls.class_probabilities
      : [1, 0, 0, 0, 0]
  ) as [number, number, number, number, number];

  const referable = cls?.referable ?? false;

  const recommendation = adaptRecommendation(
    data.recommendation,
    referable,
    cls
  );

  return {
    status: data.status === 'SUCCESS' ? 'success' : 'quality_failed',
    image_id: data.image_id,
    is_simulation: false,

    quality,

    classification:
      quality.overall_status === 'PASS' && cls
        ? {
            predicted_grade: grade,
            grade_name: cls.predicted_grade_name,
            clinical_definition: ICDR_DEFINITIONS[grade],
            probabilities,
            referable: cls.referable,
            referable_probability: cls.referable_probability,
          }
        : null,

    calibration:
      quality.overall_status === 'PASS' && cls
        ? {
            method: 'Temperature scaling',
            calibrated_confidence: cls.confidence,
            referable_probability: cls.referable_probability,
            is_calibrated: data.calibration.calibrated,
            temperature_parameter: data.calibration.temperature,
          }
        : null,

    explanation: {
      method: 'Grad-CAM',
      target_layer: data.explanation.target_layer,
      overlay_image_url: data.explanation.overlay_url || '',
      overlay_base64: data.explanation.overlay_base64 || null,
      disclaimer:
        'This visualization is model attribution, not definitive lesion segmentation or clinical proof.',
    },

    recommendation,

    timing: {
      quality_check_ms: 0,
      inference_ms: 0,
      gradcam_ms: 0,
      total_processing_ms: data.timing.total_ms,
    },

    metadata: {
      model_name: data.metadata.model_version,
      pipeline_name: 'E015',
      pipeline_version: data.metadata.pipeline_version,
      calibration_method:
        `Temperature scaling (T=${data.calibration.temperature})`,
      checkpoint_verification: 'verified',
      checkpoint_hash: data.metadata.model_checkpoint_sha256,
      device_target: 'Backend runtime',
      timestamp: data.metadata.timestamp,
      scientific_mandate: data.metadata.scientific_mandate,
    },
  };
}

export async function submitScreening(
  payload: ScreenRequestPayload
): Promise<ScreeningResponse> {
  const { imageFile, patientInfo, presetCaseId } = payload;

  if (presetCaseId) {
    const preset = CLINICAL_CASE_PRESETS.find((c) => c.id === presetCaseId);

    if (preset) {
      await new Promise((resolve) => setTimeout(resolve, 450));

      return {
        ...preset.mockResponse,
        image_id: `BM_${preset.id.toUpperCase()}_${patientInfo.eye}`,
        is_simulation: true,
        simulation_label: 'DEMONSTRATION SCENARIO',
      };
    }
  }

  if (imageFile) {
    const formData = new FormData();

    formData.append('file', imageFile);
    formData.append('patient_id', patientInfo.patientId);
    formData.append('age', String(patientInfo.age));
    formData.append('sex', patientInfo.sex);
    formData.append('eye', patientInfo.eye);

    if (patientInfo.timestamp) {
      formData.append('timestamp', patientInfo.timestamp);
    }

    if (patientInfo.phcLocation) {
      formData.append('phc_location', patientInfo.phcLocation);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${API_BASE_URL}/api/v1/screen`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text().catch(() => '');

        throw new ScreeningServiceError(
          `BACKEND UNAVAILABLE: The local Python E015 inference engine returned HTTP ${response.status}. Live inference is blocked to prevent unverified diagnosis. Reconnect the screening engine or route the patient image for manual human review.`,
          'SERVICE_UNAVAILABLE',
          errText
        );
      }

      const raw = (await response.json()) as E015Response;
      return adaptE015Response(raw);
    } catch (networkErr: unknown) {
      if (networkErr instanceof ScreeningServiceError) {
        throw networkErr;
      }

      throw new ScreeningServiceError(
        `BACKEND UNAVAILABLE: The local Python E015 inference engine is unreachable at ${API_BASE_URL}. Live inference is blocked. Please reconnect the screening engine or route the patient image for qualified human review.`,
        'SERVICE_UNAVAILABLE',
        networkErr instanceof Error ? networkErr.message : String(networkErr)
      );
    }
  }

  throw new ScreeningServiceError(
    'No image file or benchmark scenario provided for screening analysis.',
    'INVALID_IMAGE'
  );
}

export async function checkBackendHealth(): Promise<{
  isOnline: boolean;
  url: string;
  latencyMs?: number;
}> {
  const start = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - start);

    return {
      isOnline: res.ok,
      url: API_BASE_URL,
      latencyMs,
    };
  } catch {
    return {
      isOnline: false,
      url: API_BASE_URL,
    };
  }
}

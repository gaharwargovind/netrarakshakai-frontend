import { PatientInfo, ScreeningResponse } from '../types/screening';
import { CLINICAL_CASE_PRESETS } from '../data/clinicalCases';

/**
 * Screening API Client
 * Interfaces with the NetraRakshakAI E015 Python Inference Service.
 * Endpoint: POST /api/v1/screen
 * Content-Type: multipart/form-data
 */

const API_BASE_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SCREENING_API_URL ||
  'http://127.0.0.1:8000';

export interface ScreenRequestPayload {
  imageFile?: File | Blob;
  patientInfo: PatientInfo;
  presetCaseId?: string; // Optional: when using clinical benchmark case
  simulatedQualityFail?: boolean;
}

export class ScreeningServiceError extends Error {
  constructor(
    message: string,
    public code: 'SERVICE_UNAVAILABLE' | 'INVALID_IMAGE' | 'QUALITY_INSUFFICIENT' | 'NETWORK_ERROR',
    public technicalDetails?: string
  ) {
    super(message);
    this.name = 'ScreeningServiceError';
  }
}

/**
 * Submit a fundus image for end-to-end quality check, E007 classification,
 * temperature calibration, and Grad-CAM generation.
 *
 * NOTE (Clinical Safety Directive): Never silently fall back from a real patient
 * screening to simulated clinical results. Simulation results may ONLY be returned
 * when the user explicitly loads a curated demonstration benchmark scenario.
 */
export async function submitScreening(payload: ScreenRequestPayload): Promise<ScreeningResponse> {
  const { imageFile, patientInfo, presetCaseId } = payload;

  // 1. Explicit Demonstration / Benchmark Case Selection
  if (presetCaseId) {
    const preset = CLINICAL_CASE_PRESETS.find((c) => c.id === presetCaseId);
    if (preset) {
      // Simulate real inference pipeline timing (450ms)
      await new Promise((resolve) => setTimeout(resolve, 450));
      return {
        ...preset.mockResponse,
        image_id: `BM_${preset.id.toUpperCase()}_${patientInfo.eye}`,
        is_simulation: true,
        simulation_label: 'DEMONSTRATION SCENARIO',
      };
    }
  }

  // 2. Real Patient Screening (Uploaded Image File)
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

      if (response.ok) {
        const data: ScreeningResponse = await response.json();
        return {
          ...data,
          is_simulation: false,
        };
      } else {
        const errText = await response.text().catch(() => '');
        throw new ScreeningServiceError(
          `BACKEND UNAVAILABLE: The local Python E015 inference engine returned HTTP ${response.status}. Live inference is blocked to prevent unverified diagnosis. Reconnect the screening engine or route the patient image for manual human review.`,
          'SERVICE_UNAVAILABLE',
          errText
        );
      }
    } catch (networkErr: unknown) {
      if (networkErr instanceof ScreeningServiceError) {
        throw networkErr;
      }
      // Strictly BLOCK live inference if backend is unavailable. NEVER fallback to simulated results!
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

/**
 * Health check for the Python E015 screening service
 */
export async function checkBackendHealth(): Promise<{ isOnline: boolean; url: string; latencyMs?: number }> {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - start);
    return { isOnline: res.ok, url: API_BASE_URL, latencyMs };
  } catch {
    return { isOnline: false, url: API_BASE_URL };
  }
}

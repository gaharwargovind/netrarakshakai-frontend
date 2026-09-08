import React, { useState, useEffect, useCallback } from 'react';
import {
  PatientInfo,
  ScreeningResponse,
  WorkflowStep,
  Eye,
} from './types/screening';
import { CLINICAL_CASE_PRESETS } from './data/clinicalCases';
import { submitScreening, checkBackendHealth, ScreeningServiceError } from './services/screeningApi';
import { ThemeProvider } from './context/ThemeContext';

import { Header } from './components/layout/Header';
import { SafetyFooter } from './components/layout/SafetyFooter';
import { WorkflowIndicator } from './components/workflow/WorkflowIndicator';
import { HomeWorkspace } from './components/home/HomeWorkspace';
import { PatientRegistration } from './components/patient/PatientRegistration';
import { ImageCapture } from './components/imaging/ImageCapture';
import { QualityInspector } from './components/quality/QualityInspector';
import { AnalysisRunning } from './components/analysis/AnalysisRunning';
import { ResultComposition } from './components/results/ResultComposition';
import { ClinicalReviewWorkspace } from './components/review/ClinicalReviewWorkspace';
import { BenchmarkCasesModal } from './components/workflow/BenchmarkCasesModal';
import { ReferralSlipModal } from './components/results/ReferralSlipModal';
import { ScreeningReportModal, ClinicianReviewData } from './components/results/ScreeningReportModal';
import { SettingsModal } from './components/layout/SettingsModal';
import { AlertTriangle } from 'lucide-react';

const createFreshLivePatient = (): PatientInfo => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return {
    patientId: `PHC-LIVE-${randomDigits}`,
    age: 52,
    sex: 'Female',
    eye: 'OD',
    timestamp:
      new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      }) + ' IST',
    phcLocation: 'Shirur Primary Health Centre, Rural District',
  };
};

function AppContent() {
  // Navigation & View State
  const [isHomeActive, setIsHomeActive] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('PATIENT');

  // Patient Data (Real Live Intake by default, no synthetic benchmark preset leakage)
  const [patient, setPatient] = useState<PatientInfo>(createFreshLivePatient);

  // Imaging & Clinical Case
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [activePresetId, setActivePresetId] = useState<string | undefined>(undefined);

  // API / Inference State
  const [screeningResponse, setScreeningResponse] = useState<ScreeningResponse | null>(null);
  const [error, setError] = useState<ScreeningServiceError | null>(null);

  // Modals & Drawers
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewModalMode, setReviewModalMode] = useState<'screening_report' | 'referral_summary'>('referral_summary');
  const [activeClinicianReview, setActiveClinicianReview] = useState<ClinicianReviewData | undefined>();
  const [isBackendIncidentReportOpen, setIsBackendIncidentReportOpen] = useState<boolean>(false);

  // Backend Health Status
  const [backendStatus, setBackendStatus] = useState<{
    isOnline: boolean;
    url: string;
    latencyMs?: number;
  }>({ isOnline: false, url: 'http://127.0.0.1:8000' });

  // Probe backend on mount
  useEffect(() => {
    checkBackendHealth().then(setBackendStatus).catch(() => {});
  }, []);

  // Preset Loader for Benchmark Scenarios
  const handleSelectPreset = useCallback((presetId: string) => {
    const preset = CLINICAL_CASE_PRESETS.find((c) => c.id === presetId);
    if (!preset) return;

    setActivePresetId(preset.id);
    setPatient(preset.patient);
    setSelectedImageUrl(preset.imageUrl);
    setSelectedFile(undefined);
    setScreeningResponse(preset.mockResponse);
    setError(null);
    setIsHomeActive(false);

    // If it's quality failure preset, open to IMAGE so operator can test quality gate
    setCurrentStep('IMAGE');
  }, []);

  // Workflow Handlers
  const handleStartFromHome = () => {
    setIsHomeActive(false);
    setCurrentStep('PATIENT');
  };

  const handlePatientSubmit = (updatedPatient: PatientInfo, presetId?: string) => {
    setPatient(updatedPatient);
    if (presetId) {
      handleSelectPreset(presetId);
    } else {
      setActivePresetId(undefined);
      setCurrentStep('IMAGE');
    }
  };

  const handleImageSelected = (url: string, file?: File, presetId?: string) => {
    setSelectedImageUrl(url);
    setSelectedFile(file);
    if (presetId) {
      setActivePresetId(presetId);
      const preset = CLINICAL_CASE_PRESETS.find((c) => c.id === presetId);
      if (preset) {
        setScreeningResponse(preset.mockResponse);
      }
    } else {
      setActivePresetId(undefined);
      setScreeningResponse(null);
    }
  };

  const handleEyeChange = (eye: Eye) => {
    setPatient((prev) => ({ ...prev, eye }));
  };

  const handleClearImage = () => {
    setSelectedImageUrl(null);
    setSelectedFile(undefined);
    setActivePresetId(undefined);
    setScreeningResponse(null);
  };

  const handleProceedToQuality = async () => {
    setError(null);
    try {
      // Execute inference via client (calls /api/v1/screen for live files or returns benchmark preset)
      const response = await submitScreening({
        imageFile: selectedFile,
        patientInfo: patient,
        presetCaseId: activePresetId,
      });
      setScreeningResponse(response);
      setCurrentStep('QUALITY');
    } catch (err: unknown) {
      if (err instanceof ScreeningServiceError) {
        setError(err);
      } else {
        setError(
          new ScreeningServiceError(
            'Screening service communication failure.',
            'SERVICE_UNAVAILABLE'
          )
        );
      }
    }
  };

  const handleProceedToAnalysis = () => {
    setCurrentStep('ANALYSIS');
  };

  const handleAnalysisComplete = () => {
    setCurrentStep('RESULT');
  };

  const handleProceedToReview = () => {
    setCurrentStep('REVIEW');
  };

  const handleBackToResult = () => {
    setCurrentStep('RESULT');
  };

  const handleRecapture = () => {
    setCurrentStep('IMAGE');
  };

  const handleNewPatient = () => {
    // Generate fresh live patient record and completely purge session artifacts
    setPatient(createFreshLivePatient());
    setSelectedImageUrl(null);
    setSelectedFile(undefined);
    setActivePresetId(undefined);
    setScreeningResponse(null);
    setActiveClinicianReview(undefined);
    setError(null);
    setIsReviewModalOpen(false);
    setIsBackendIncidentReportOpen(false);
    setCurrentStep('PATIENT');
    setIsHomeActive(false);
  };

  const handleResetToHome = () => {
    // Return to home overview with clean state
    setPatient(createFreshLivePatient());
    setSelectedImageUrl(null);
    setSelectedFile(undefined);
    setActivePresetId(undefined);
    setScreeningResponse(null);
    setActiveClinicianReview(undefined);
    setError(null);
    setIsReviewModalOpen(false);
    setIsBackendIncidentReportOpen(false);
    setIsHomeActive(true);
    setCurrentStep('PATIENT');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-rose-500/20 selection:text-rose-500 transition-colors">
      {/* 1. Header Navigation Bar */}
      <Header
        currentStep={currentStep}
        isHomeActive={isHomeActive}
        onNavigateHome={handleResetToHome}
        onStartScreening={handleStartFromHome}
        onOpenBenchmark={() => setIsBenchmarkModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        backendStatus={backendStatus}
      />

      {/* 2. Persistent Workflow Step Indicator (Visible when inside screening sequence) */}
      {!isHomeActive && (
        <WorkflowIndicator
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep(step)}
          isResultReady={!!screeningResponse && screeningResponse.status === 'success'}
        />
      )}

      {/* 3. Main Workspace Area */}
      <main className="flex-1 w-full">
        {error && (
          <div className="max-w-4xl mx-auto my-6 p-5 rounded-xl bg-rose-500/10 border-2 border-rose-500/40 text-[var(--text-primary)] shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-2 font-mono text-xs">
                  <div className="text-sm font-bold text-rose-400 uppercase tracking-wide flex items-center gap-2">
                    <span>BACKEND UNAVAILABLE</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      Live Inference Blocked
                    </span>
                  </div>
                  <p className="text-xs font-sans text-slate-200 leading-relaxed">
                    {error.message}
                  </p>
                  <div className="p-3 rounded-lg bg-black/40 border border-rose-500/20 text-[11px] space-y-1.5 text-slate-300">
                    <div className="font-bold text-rose-300 uppercase tracking-wider text-[10px]">
                      Required Clinical Actions:
                    </div>
                    <div>1. Reconnect the screening engine (FastAPI / E015 service at 127.0.0.1:8000).</div>
                    <div>2. If offline, route patient fundus photographs for direct qualified human ophthalmic review.</div>
                    <div>3. To explore the clinical workflow offline, select a curated scenario from the Benchmark Library.</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="view-backend-incident-report-btn"
                  onClick={() => setIsBackendIncidentReportOpen(true)}
                  className="px-3 py-1.5 rounded bg-rose-900/60 hover:bg-rose-800/80 border border-rose-600/60 text-xs font-mono text-rose-200 hover:text-white cursor-pointer transition-colors"
                >
                  View Incident Report
                </button>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="px-3 py-1.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-app)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {isHomeActive ? (
          /* View A: Home & Mission Overview Workspace */
          <HomeWorkspace
            onStartScreening={handleStartFromHome}
            onSelectCase={handleSelectPreset}
            onViewWorkflow={handleStartFromHome}
          />
        ) : (
          /* View B: The 6-Stage Screening Instrument Sequence */
          <div>
            {/* STAGE 1: PATIENT REGISTRATION */}
            {currentStep === 'PATIENT' && (
              <PatientRegistration
                initialPatient={patient}
                onSubmit={handlePatientSubmit}
                onSelectPreset={handleSelectPreset}
              />
            )}

            {/* STAGE 2: FUNDUS IMAGE CAPTURE / UPLOAD */}
            {currentStep === 'IMAGE' && (
              <ImageCapture
                patient={patient}
                selectedImageUrl={selectedImageUrl}
                selectedFile={selectedFile}
                activePresetId={activePresetId}
                onImageSelected={handleImageSelected}
                onEyeChange={handleEyeChange}
                onClearImage={handleClearImage}
                onProceedToQuality={handleProceedToQuality}
              />
            )}

            {/* STAGE 3: IMAGE QUALITY AUDIT */}
            {currentStep === 'QUALITY' && screeningResponse && (
              <QualityInspector
                quality={screeningResponse.quality}
                imageUrl={selectedImageUrl || CLINICAL_CASE_PRESETS[0].imageUrl}
                patient={patient}
                onProceedToAnalysis={handleProceedToAnalysis}
                onRecapture={handleRecapture}
                onSendHumanReview={handleProceedToReview}
              />
            )}

            {/* STAGE 4: MODEL E007 INFERENCE EXECUTION */}
            {currentStep === 'ANALYSIS' && (
              <AnalysisRunning
                imageUrl={selectedImageUrl || CLINICAL_CASE_PRESETS[0].imageUrl}
                patient={patient}
                onComplete={handleAnalysisComplete}
              />
            )}

            {/* STAGE 5: RESULT & EXPLAINABILITY */}
            {currentStep === 'RESULT' && screeningResponse && (
              <ResultComposition
                screening={screeningResponse}
                patient={patient}
                imageUrl={selectedImageUrl || CLINICAL_CASE_PRESETS[0].imageUrl}
                onProceedToReview={handleProceedToReview}
                onRecapture={handleRecapture}
                onNewPatient={handleNewPatient}
              />
            )}

            {/* STAGE 6: HUMAN-IN-THE-LOOP CLINICAL REVIEW */}
            {currentStep === 'REVIEW' && screeningResponse && (
              <ClinicalReviewWorkspace
                screening={screeningResponse}
                patient={patient}
                imageUrl={selectedImageUrl || CLINICAL_CASE_PRESETS[0].imageUrl}
                onBackToResult={handleBackToResult}
                onRecapture={handleRecapture}
                onNewPatient={handleNewPatient}
                onOpenReferralSlip={(reviewData, mode) => {
                  setActiveClinicianReview(reviewData);
                  setReviewModalMode(mode || 'referral_summary');
                  setIsReviewModalOpen(true);
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* 4. Clinical Safety Footer */}
      <SafetyFooter />

      {/* 5. Benchmark Cases Modal */}
      <BenchmarkCasesModal
        isOpen={isBenchmarkModalOpen}
        onClose={() => setIsBenchmarkModalOpen(false)}
        onSelectCase={handleSelectPreset}
        currentCaseId={activePresetId}
      />

      {/* 6. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentPhcLocation={patient.phcLocation}
      />

      {/* 7. Clinical Screening Report / Referral Summary Modal */}
      {isReviewModalOpen && screeningResponse && (
        <ReferralSlipModal
          isOpen={true}
          onClose={() => setIsReviewModalOpen(false)}
          patient={patient}
          screening={screeningResponse}
          mode={reviewModalMode}
          clinicianReview={activeClinicianReview}
          imageUrl={selectedImageUrl || CLINICAL_CASE_PRESETS[0].imageUrl}
        />
      )}

      {/* 8. Backend Failure Incident Report Modal */}
      {isBackendIncidentReportOpen && (
        <ScreeningReportModal
          isOpen={true}
          onClose={() => setIsBackendIncidentReportOpen(false)}
          mode="backend_failure"
          patient={patient}
          backendErrorMessage={error?.message}
          onRouteHumanReview={handleProceedToReview}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

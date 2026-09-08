import React, { useState } from 'react';
import { ArrowRight, Eye, ShieldCheck, ChevronRight, PlayCircle, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { CLINICAL_CASE_PRESETS } from '../../data/clinicalCases';
import { Interactive3DRetinalModel } from '../imaging/Interactive3DRetinalModel';

interface HomeWorkspaceProps {
  onStartScreening: () => void;
  onSelectCase: (caseId: string) => void;
  onViewWorkflow: () => void;
}

export const HomeWorkspace: React.FC<HomeWorkspaceProps> = ({
  onStartScreening,
  onSelectCase,
  onViewWorkflow,
}) => {
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(2); // Default to Moderate NPDR (index 2)
  const currentCase = CLINICAL_CASE_PRESETS[activePreviewIndex] || CLINICAL_CASE_PRESETS[0];

  const isReferable = currentCase.expectedResult.includes('Referable');
  const isQualityFail = currentCase.expectedResult.includes('Quality');

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-12 px-3.5 sm:px-6 lg:px-8 space-y-14 sm:space-y-20 overflow-x-hidden">
      {/* 1. Hero Section: Editorial & Instrument Fusion */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
        {/* Left: Editorial Mission Statement (7 cols) */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          {/* Subtle Technical Eyebrow */}
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shrink-0" />
            <span className="font-semibold text-[var(--text-primary)]">NetraRakshakAI</span>
            <span>·</span>
            <span className="truncate">Frontline PHC Screening System</span>
          </div>

          {/* Primary Headline: Confident, Editorial, Responsive Typography */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.15] sm:leading-[1.1] font-sans">
            See the retina.<br />
            <span className="text-[var(--text-muted)] font-normal">Understand the risk.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed font-sans">
            AI-assisted diabetic retinopathy screening designed for frontline eye care in rural Primary Health Centres across India.
          </p>

          {/* Technical Metadata Line (Non-boxed, responsive typographic rhythm) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-2 text-xs text-[var(--text-muted)] border-y border-[var(--border-app)] py-3 font-mono">
            <div>
              <span className="text-[var(--text-secondary)] font-medium">Standard:</span> ICDR 5-Tier Scale
            </div>
            <span className="hidden sm:inline text-[var(--border-subtle)]">/</span>
            <div>
              <span className="text-[var(--text-secondary)] font-medium">Safety:</span> Pre-Inference Quality Gate
            </div>
            <span className="hidden sm:inline text-[var(--border-subtle)]">/</span>
            <div>
              <span className="text-[var(--text-secondary)] font-medium">Explainability:</span> Grad-CAM Visual Attribution
            </div>
          </div>

          {/* Action CTAs: Full width on small mobile, editorial inline on desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <button
              type="button"
              id="home-start-screening-btn"
              onClick={onStartScreening}
              className="py-3.5 px-7 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer min-h-[44px]"
            >
              <span>Start Screening</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="home-view-workflow-btn"
              onClick={onViewWorkflow}
              className="py-3.5 px-6 bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-sunken)] text-[var(--text-primary)] font-medium text-sm rounded-lg border border-[var(--border-app)] flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
            >
              <Eye className="w-4 h-4 text-rose-500" />
              <span>View Clinical Workflow</span>
            </button>
          </div>

          {/* Safe Disclaimer Line */}
          <div className="pt-0.5 text-[11px] text-[var(--text-muted)] font-mono leading-normal">
            AI-assisted screening prototype for PHC workflows. Not for autonomous definitive diagnosis.
          </div>
        </div>

        {/* Right: Retinal Instrument Hero Viewport (5 cols) */}
        <div className="lg:col-span-5 w-full flex flex-col items-center">
          <div className="relative aspect-square w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[430px] rounded-2xl bg-[#04070a] border border-[var(--border-app)] p-2 sm:p-3 shadow-xl overflow-hidden flex items-center justify-center">
            {/* The 3D Responsive Retinal Instrument Model */}
            <Interactive3DRetinalModel
              imageUrl={CLINICAL_CASE_PRESETS[2].imageUrl}
              eye="OD"
              className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
            />
          </div>
          <p className="mt-2 text-[10px] font-mono text-[var(--text-muted)] text-center">
            Educational illustration of retinal anatomy · Not patient-specific geometry
          </p>
        </div>
      </section>

      {/* 2. Benchmark Cases: Clinical Simulation Library */}
      <section className="space-y-6 pt-4 border-t border-[var(--border-app)]" aria-labelledby="benchmark-section-heading">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Benchmark Cases
            </div>
            <h2 id="benchmark-section-heading" className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight mt-0.5">
              Curated Clinical Simulation Library
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] max-w-md">
            Demonstration scenarios for evaluating the 6-stage screening workflow across all ICDR severity tiers and optical gate conditions.
          </p>
        </div>

        {/* Workstation Simulation Workspace: Left Inspection Viewport, Right Indexed Case Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start rounded-xl border border-[var(--border-app)] bg-[var(--bg-surface)] p-4 sm:p-7">
          {/* Featured Case Viewport & Deep Dive (7 cols) */}
          <div className="lg:col-span-7 space-y-4 w-full">
            {/* 1. Case Header */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-muted)]">
                Scenario ID: <strong className="text-[var(--text-primary)]">{currentCase.patient.patientId}</strong>
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium border border-[var(--border-app)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]">
                Demonstration Scenario
              </span>
            </div>

            {/* 2. Fundus Viewport (Shielded dark stage for pixel preservation) */}
            <div className="relative aspect-[16/10] w-full rounded-lg bg-[#04070a] border border-slate-800 overflow-hidden flex items-center justify-center">
              <img
                src={currentCase.imageUrl}
                alt={currentCase.title}
                className="max-h-full max-w-full object-contain"
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-black/75 backdrop-blur-sm text-[10px] sm:text-[11px] font-mono text-slate-200 border border-slate-700">
                Eye: {currentCase.patient.eye} · 45° Field
              </div>
              <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-black/75 backdrop-blur-sm text-[10px] sm:text-[11px] font-mono text-slate-300 border border-slate-700">
                Quality: {currentCase.mockResponse.quality.overall_status} ({Math.round(currentCase.mockResponse.quality.quality_score * 100)}%)
              </div>
            </div>

            {/* 3. Case Status & ICDR Grade */}
            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-center justify-between border-b border-[var(--border-app)] pb-2.5 gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {currentCase.title}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-medium font-mono shrink-0 ${
                    isReferable
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                      : isQualityFail
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {currentCase.expectedResult}
                </span>
              </div>

              <p className="text-[var(--text-secondary)] leading-relaxed">
                {currentCase.description}
              </p>

              {/* 4. Triage / Referral Rationale */}
              <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-app)] space-y-1.5 font-mono text-[11px]">
                <div className="text-[var(--text-muted)]">
                  <span className="text-[var(--text-primary)] font-semibold">Triage Category:</span> {currentCase.mockResponse.recommendation.category}
                </div>
                <div className="text-[var(--text-muted)]">
                  <span className="text-[var(--text-primary)] font-semibold">Clinical Action:</span> {currentCase.mockResponse.recommendation.suggested_action}
                </div>
              </div>

              {/* 5. Technical Evidence Summary */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface-sunken)] p-2.5 rounded-lg border border-[var(--border-app)]">
                <div>
                  <span className="block text-[10px] uppercase text-[var(--text-muted)]">Pre-Inference Gate</span>
                  <span className={isQualityFail ? 'text-amber-500 font-semibold' : 'text-emerald-500 font-semibold'}>
                    {currentCase.mockResponse.quality.overall_status === 'PASS' ? 'Optical Cleared' : 'Hold / Recapture'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[var(--text-muted)]">Model Attribution</span>
                  <span className="text-[var(--text-primary)] font-semibold">
                    Grad-CAM E007
                  </span>
                </div>
              </div>

              {/* 6. Load Case into Screening CTA */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onSelectCase(currentCase.id)}
                  id="load-benchmark-case-btn"
                  className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Load {currentCase.shortLabel} into Screening Workstation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 7. Compact Case Index List (5 cols on desktop, vertical stack below on mobile) */}
          <div className="lg:col-span-5 space-y-3 w-full pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--border-app)]">
            <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider pb-1 flex items-center justify-between">
              <span>Select Benchmark Scenario</span>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">6 Cases</span>
            </div>

            <div className="space-y-2">
              {CLINICAL_CASE_PRESETS.map((preset, index) => {
                const isSelected = index === activePreviewIndex;
                const isItemReferable = preset.expectedResult.includes('Referable');
                const isItemFail = preset.expectedResult.includes('Quality');

                return (
                  <div
                    key={preset.id}
                    onClick={() => setActivePreviewIndex(index)}
                    role="button"
                    tabIndex={0}
                    className={`p-3 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[48px] ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500/5 text-[var(--text-primary)] shadow-sm'
                        : 'border-[var(--border-app)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-medium text-[var(--text-primary)] truncate">
                        {preset.shortLabel}
                      </div>
                      <div className="text-[11px] font-mono text-[var(--text-muted)]">
                        {preset.patient.patientId} · {preset.patient.eye}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                          isItemReferable
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : isItemFail
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {preset.expectedResult.split(' ')[0]}
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected ? 'text-rose-500 translate-x-0.5' : 'text-[var(--text-muted)]'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quality gate reminder note */}
            <div className="p-3 rounded-lg bg-[var(--bg-surface-sunken)] border border-[var(--border-app)] text-[11px] text-[var(--text-muted)] space-y-1">
              <div className="font-medium text-[var(--text-secondary)]">Quality Gating Principle</div>
              <p className="leading-relaxed">
                Optical defects (focus blur, flash vignetting) are stopped before inference to prevent misclassification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Multi-Stage Safeguard Architecture Overview */}
      <section className="space-y-6 pt-4 border-t border-[var(--border-app)]" aria-labelledby="safeguards-heading">
        <div className="border-b border-[var(--border-app)] pb-3">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            System Architecture
          </div>
          <h2 id="safeguards-heading" className="text-xl font-bold text-[var(--text-primary)] tracking-tight mt-0.5">
            Error-Prevention Safeguards Across 6 Pipeline Stages
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-2xl">
            Designed specifically for frontline rural health worker workflows where overconfidence or missed referral has high clinical consequence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2 text-xs">
          <div className="space-y-1.5 border-l-2 border-slate-300 dark:border-slate-700 pl-3">
            <span className="font-mono font-bold text-[var(--text-primary)]">01 · Minimal PHC Intake</span>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Standardized, low-overhead patient tagging (ID, Age, Eye field) optimized for high outpatient volumes.
            </p>
          </div>

          <div className="space-y-1.5 border-l-2 border-rose-500 pl-3">
            <span className="font-mono font-bold text-[var(--text-primary)]">02 · Pre-Inference Quality Gate</span>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Automated optical evaluation (Focus, Field of View, Illumination, Contrast). Rejects poor captures prior to model execution.
            </p>
          </div>

          <div className="space-y-1.5 border-l-2 border-slate-300 dark:border-slate-700 pl-3">
            <span className="font-mono font-bold text-[var(--text-primary)]">03 · E007 Feature Extraction</span>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Deep convolutional backbone trained to detect microaneurysms, hemorrhages, and neovascular proliferations.
            </p>
          </div>

          <div className="space-y-1.5 border-l-2 border-slate-300 dark:border-slate-700 pl-3">
            <span className="font-mono font-bold text-[var(--text-primary)]">04 · Temperature Calibration</span>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Post-hoc calibration scales raw logits to align predicted probabilities with actual empirical risk.
            </p>
          </div>

          <div className="space-y-1.5 border-l-2 border-rose-500 pl-3">
            <span className="font-mono font-bold text-[var(--text-primary)]">05 · Grad-CAM Visual Attribution</span>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Spatial attention maps verify the network attended to clinical lesions rather than camera flash artifacts.
            </p>
          </div>

          <div className="space-y-1.5 border-l-2 border-slate-300 dark:border-slate-700 pl-3">
            <span className="font-mono font-bold text-[var(--text-primary)]">06 · Human-in-the-Loop Triage</span>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Automated generation of structured referral slips for District Hospital review. AI advises; physician decides.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

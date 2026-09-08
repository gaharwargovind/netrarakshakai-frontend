import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';
import { PatientInfo } from '../../types/screening';

interface AnalysisRunningProps {
  imageUrl: string;
  patient: PatientInfo;
  onComplete: () => void;
}

const ANALYSIS_STEPS = [
  { id: 1, title: 'Calibrating Optical Field', detail: 'Normalizing 45° macular-disc field illumination' },
  { id: 2, title: 'Feature Extraction & Classification', detail: 'Executing EfficientNet-B0 (Experiment E007) forward pass' },
  { id: 3, title: 'Probability Calibration', detail: 'Applying temperature scaling (T = 0.7785)' },
  { id: 4, title: 'Visual Attribution Synthesis', detail: 'Generating Grad-CAM feature attribution at convolutional stage' },
];

export const AnalysisRunning: React.FC<AnalysisRunningProps> = ({
  imageUrl,
  patient,
  onComplete,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    // Sequence through the 4 genuine pipeline steps smoothly (~2.2 seconds total)
    const stepInterval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(onComplete, 400);
          return prev;
        }
      });
    }, 550);

    return () => clearInterval(stepInterval);
  }, [onComplete]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs mb-3">
          <Cpu className="w-3.5 h-3.5 text-rose-400" />
          <span>PIPELINE E015 · INFERENCE ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Executing Retinal Screening Analysis
        </h1>
        <p className="text-slate-400 text-xs font-mono">
          Patient: {patient.patientId} · Field: {patient.eye} · Model: EfficientNet-B0 (E007)
        </p>
      </div>

      {/* Main Retinal Analysis Canvas */}
      <div className="relative max-w-md mx-auto aspect-square rounded-2xl bg-[#06090D] border border-slate-800 overflow-hidden shadow-2xl p-4 flex items-center justify-center mb-8">
        <img
          src={imageUrl}
          alt="Retina undergoing analysis"
          className="w-full h-full object-contain rounded-xl select-none"
          referrerPolicy="no-referrer"
        />

        {/* Retinal Scanning Sweep Grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {/* Subtle horizontal scan bar */}
          <div className="absolute w-full h-1 bg-gradient-to-b from-rose-500/40 via-rose-400/80 to-transparent top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_12px_rgba(244,63,94,0.6)]" />

          {/* Precision graticule ring */}
          <div className="absolute inset-4 rounded-full border border-rose-500/20 pointer-events-none" />
          <div className="absolute inset-16 rounded-full border border-sky-400/15 border-dashed pointer-events-none" />

          {/* Focal Macular Pulse */}
          <div className="absolute top-[48%] left-[46%] w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-400/40 animate-ping opacity-25" />
        </div>

        {/* Dynamic HUD Indicator */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between bg-slate-900/90 backdrop-blur-sm border border-slate-800 px-3.5 py-2 rounded-lg text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>STAGE 0{activeStepIndex + 1}/04</span>
          </div>
          <span className="text-slate-400 truncate max-w-[190px]">
            {ANALYSIS_STEPS[activeStepIndex].title}
          </span>
        </div>
      </div>

      {/* Sequential Processing Steps List */}
      <div className="max-w-md mx-auto space-y-2.5">
        {ANALYSIS_STEPS.map((step, idx) => {
          const isDone = idx < activeStepIndex;
          const isCurrent = idx === activeStepIndex;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-lg border transition-all flex items-center gap-3.5 ${
                isCurrent
                  ? 'bg-slate-900/90 border-rose-500/50 text-white shadow-sm ring-1 ring-rose-500/20'
                  : isDone
                  ? 'bg-[#0B0F14]/80 border-slate-800/80 text-slate-300'
                  : 'bg-[#0B0F14]/40 border-slate-900 text-slate-400 opacity-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono shrink-0 transition-colors ${
                  isDone
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    : isCurrent
                    ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold font-mono tracking-tight text-slate-200">
                  {step.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate font-sans">
                  {step.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

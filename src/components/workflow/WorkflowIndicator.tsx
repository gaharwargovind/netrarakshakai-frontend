import React from 'react';
import { WorkflowStep } from '../../types/screening';
import { Check } from 'lucide-react';

interface WorkflowIndicatorProps {
  currentStep: WorkflowStep;
  onStepClick?: (step: WorkflowStep) => void;
  isResultReady: boolean;
}

const STEPS: { key: WorkflowStep; label: string; stageNumber: string; shortLabel: string }[] = [
  { key: 'PATIENT', label: 'PATIENT', stageNumber: '01', shortLabel: '01 Intake' },
  { key: 'IMAGE', label: 'IMAGE', stageNumber: '02', shortLabel: '02 Capture' },
  { key: 'QUALITY', label: 'QUALITY', stageNumber: '03', shortLabel: '03 Quality' },
  { key: 'ANALYSIS', label: 'ANALYSIS', stageNumber: '04', shortLabel: '04 Analysis' },
  { key: 'RESULT', label: 'RESULT', stageNumber: '05', shortLabel: '05 Triage' },
  { key: 'REVIEW', label: 'REVIEW', stageNumber: '06', shortLabel: '06 Review' },
];

export const WorkflowIndicator: React.FC<WorkflowIndicatorProps> = ({
  currentStep,
  onStepClick,
  isResultReady,
}) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
  const activeStepObj = STEPS[currentIndex] || STEPS[0];

  return (
    <div className="w-full bg-[#0D1218] border-b border-slate-800/90 py-2.5 px-3 sm:px-6 lg:px-8 overflow-hidden">
      {/* Mobile Compact Progress Bar Summary (< sm) */}
      <div className="flex sm:hidden items-center justify-between text-xs font-mono pb-2 border-b border-slate-800/60 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
          <span className="text-slate-400">Stage {activeStepObj.stageNumber} of 06</span>
          <span className="text-slate-600">·</span>
          <span className="text-white font-bold">{activeStepObj.label}</span>
        </div>
        <div className="text-[11px] text-slate-400">
          {Math.round(((currentIndex + 1) / STEPS.length) * 100)}%
        </div>
      </div>

      {/* Steps track: Horizontally scrollable on mobile without squashing */}
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {STEPS.map((step, idx) => {
            const isActive = step.key === currentStep;
            const isCompleted = idx < currentIndex || (step.key === 'RESULT' && isResultReady);
            const isClickable = isCompleted && onStepClick;

            return (
              <div key={step.key} className="flex items-center shrink-0">
                <button
                  type="button"
                  id={`workflow-step-${step.key.toLowerCase()}`}
                  onClick={() => isClickable && onStepClick(step.key)}
                  disabled={!isClickable && !isActive}
                  className={`group flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded transition-all text-left shrink-0 min-h-[36px] ${
                    isActive
                      ? 'bg-slate-800/90 border border-rose-500/40 text-white shadow-sm'
                      : isCompleted
                      ? 'text-slate-300 hover:text-white cursor-pointer hover:bg-slate-800/40'
                      : 'text-slate-400 cursor-default opacity-60'
                  }`}
                >
                  {/* Status Indicator Marker */}
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-semibold shrink-0 transition-colors ${
                      isActive
                        ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    ) : (
                      step.stageNumber
                    )}
                  </span>

                  {/* Stage Label */}
                  <span
                    className={`text-[11px] sm:text-xs font-mono font-semibold tracking-wider whitespace-nowrap transition-colors ${
                      isActive
                        ? 'text-white'
                        : isCompleted
                        ? 'text-slate-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>

                {/* Arrow divider */}
                {idx < STEPS.length - 1 && (
                  <span className="mx-1 sm:mx-1.5 text-slate-700 select-none text-xs font-mono shrink-0">
                    →
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Protocol standard badge */}
        <div className="hidden lg:flex items-center gap-2 pl-4 text-[11px] font-mono text-slate-400 border-l border-slate-800 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          <span>ICDR Standard Protocol</span>
        </div>
      </div>
    </div>
  );
};

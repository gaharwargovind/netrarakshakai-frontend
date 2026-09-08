import React, { useState } from 'react';
import { AlertOctagon, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export const ValidationLimitationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-amber-50/60 dark:bg-[#11171F] border border-amber-300 dark:border-amber-900/40 rounded-xl overflow-hidden transition-all shadow-sm">
      <button
        type="button"
        id="toggle-validation-limitation-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-amber-100/40 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 dark:bg-amber-500/10 border border-amber-500/40 dark:border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                Validation Limitation
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800/80 font-bold">
                External safety gate: FAILED
              </span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-400 font-mono mt-0.5 leading-relaxed">
              External validation on the IDRiD cohort produced 79.61% referable sensitivity and 98.68% specificity. This is below the project&apos;s &gt;90% sensitivity safety target. The external safety gate therefore remains FAILED.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 shrink-0 ml-3">
          <span className="hidden sm:inline">{isOpen ? 'Collapse' : 'Inspect External Metrics'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-amber-200 dark:border-slate-800 space-y-4 font-mono text-xs">
          {/* Key honest summary */}
          <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-200/90 leading-relaxed font-sans text-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-950 dark:text-rose-300">Domain-Generalization Boundary (External safety gate: FAILED): </strong>
                External validation on the IDRiD cohort produced 79.61% referable sensitivity and 98.68% specificity. This is below the project&apos;s &gt;90% sensitivity safety target. The external safety gate therefore remains FAILED. This external evaluation demonstrates a domain-generalization limitation across differing camera optics, pupil dilation distributions, and patient populations. Automated screening cannot operate autonomously and mandates qualified clinical review.
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {/* Referable Sensitivity */}
            <div className="p-3 rounded-lg bg-white dark:bg-[#0B0F14] border border-rose-400 dark:border-rose-500/40 space-y-1 shadow-sm dark:shadow-none">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase block">Referable Sensitivity</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold text-lg">79.61%</span>
              <span className="text-[10px] text-rose-700 dark:text-rose-400/90 block font-semibold">Target &gt;90% (FAILED)</span>
            </div>

            {/* Specificity */}
            <div className="p-3 rounded-lg bg-white dark:bg-[#0B0F14] border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm dark:shadow-none">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase block">Specificity</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold text-lg">98.68%</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">High non-referable accuracy</span>
            </div>

            {/* Macro F1 */}
            <div className="p-3 rounded-lg bg-white dark:bg-[#0B0F14] border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm dark:shadow-none">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase block">Macro F1</span>
              <span className="text-slate-900 dark:text-slate-200 font-bold text-lg">0.4266</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">5-class balance metric</span>
            </div>

            {/* QWK */}
            <div className="p-3 rounded-lg bg-white dark:bg-[#0B0F14] border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm dark:shadow-none">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase block">Quadratic Kappa (QWK)</span>
              <span className="text-slate-900 dark:text-slate-200 font-bold text-lg">0.7187</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Substantial agreement</span>
            </div>

            {/* Overall Accuracy */}
            <div className="p-3 rounded-lg bg-white dark:bg-[#0B0F14] border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm dark:shadow-none">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase block">Overall Accuracy</span>
              <span className="text-slate-900 dark:text-slate-200 font-bold text-lg">55.16%</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">5-class raw agreement</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white dark:bg-[#0B0F14] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-400 font-sans leading-relaxed shadow-sm dark:shadow-none">
            <strong className="text-slate-900 dark:text-slate-300">Regulatory & Clinical Stance: </strong>
            This model is an experimental prototype developed under Experiment E007 / Pipeline E015. It is NOT clinically certified or approved for standalone autonomous diagnostic deployment. External failure cannot be solved by frontend alterations and requires further multi-center training and calibration.
          </div>
        </div>
      )}
    </div>
  );
};

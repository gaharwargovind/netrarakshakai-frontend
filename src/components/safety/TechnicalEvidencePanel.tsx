import React, { useState } from 'react';
import { PipelineMetadata, TimingMetrics, CalibrationData } from '../../types/screening';
import { ChevronDown, ChevronUp, Terminal, ShieldCheck, Cpu, Clock, CheckCircle2, Sliders, Layers } from 'lucide-react';

interface TechnicalEvidencePanelProps {
  metadata: PipelineMetadata;
  timing: TimingMetrics;
  calibration: CalibrationData;
}

export const TechnicalEvidencePanel: React.FC<TechnicalEvidencePanelProps> = ({
  metadata,
  timing,
  calibration,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-[#11171F] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all shadow-sm">
      {/* Collapsible Header Toggle */}
      <button
        type="button"
        id="toggle-technical-evidence-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
            <Terminal className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Technical Evidence
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Verified Backend Specification
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono mt-0.5">
              Model: E007 EfficientNet-B0 · PyTorch · Pipeline E015 · Temperature Scaling T = 0.7785
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 shrink-0 ml-3">
          <span className="hidden sm:inline">{isOpen ? 'Collapse' : 'Inspect Audit Log'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Technical Detail Grid */}
      {isOpen && (
        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-5 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {/* Model & Experiment */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider block">
                MODEL
              </span>
              <div className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>E007 EfficientNet-B0</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-0.5">Framework: PyTorch</p>
            </div>

            {/* Pipeline & Framework */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider block">
                PIPELINE
              </span>
              <div className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Pipeline E015</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-0.5">Target: {metadata.device_target || 'Local Inference Runtime (PyTorch)'}</p>
            </div>

            {/* Probability Calibration */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider block">
                CALIBRATION
              </span>
              <div className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>T = 0.7785</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-0.5">Method: Temperature scaling</p>
            </div>

            {/* Checkpoint Verification */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider block">
                CHECKPOINT
              </span>
              <div className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified SHA256</span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate pt-0.5" title={metadata.checkpoint_hash || 'a61710e11557bb7d1be60ed488e5bdf5b88c92d16c76441513bbfa4d8b94cc3c'}>
                {metadata.checkpoint_hash || 'a61710e11557bb7d1be60ed488e5bdf5b88c92d16c76441513bbfa4d8b94cc3c'}
              </p>
            </div>
          </div>

          {/* External Validation & Execution Latency Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* EXTERNAL VALIDATION (Requirement 15) */}
            <div className="md:col-span-8 p-3.5 rounded-lg bg-rose-50/70 dark:bg-[#0B0F14] border border-rose-300 dark:border-rose-900/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-rose-900 dark:text-rose-400 font-bold text-[11px] uppercase tracking-wider">
                  EXTERNAL VALIDATION: IDRiD COHORT
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-950 text-rose-900 dark:text-rose-300 font-bold text-[10px] border border-rose-300 dark:border-rose-800">
                  Safety Gate: FAILED
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                <div>Referable sensitivity: <strong className="text-rose-800 dark:text-rose-300">79.61%</strong> (Target &gt;90%)</div>
                <div>Specificity: <strong className="text-emerald-800 dark:text-emerald-400">98.68%</strong></div>
                <div>Cohort: <span className="text-slate-700 dark:text-slate-300">Indian IDRiD (n=516)</span></div>
              </div>
            </div>

            {/* Execution Latency */}
            <div className="md:col-span-4 p-3.5 rounded-lg bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider block">
                EXECUTION LATENCY
              </span>
              <div className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{timing.total_processing_ms} ms Total</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-0.5">Inference: {timing.inference_ms}ms · Grad-CAM: {timing.gradcam_ms}ms</p>
            </div>
          </div>

          {/* Development Calibration Evidence Table */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-200 dark:border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-slate-900 dark:text-slate-200 font-bold uppercase tracking-wider">
                  Development Calibration Evidence (Experiment E010)
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Development calibration metrics are not clinical certification.
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-2.5 rounded bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Multiclass ECE (Before)</span>
                <span className="text-slate-800 dark:text-slate-300 font-bold text-sm">0.0797</span>
              </div>
              <div className="p-2.5 rounded bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Multiclass ECE (After)</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">0.0377</span>
              </div>
              <div className="p-2.5 rounded bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Referable ECE (Before)</span>
                <span className="text-slate-800 dark:text-slate-300 font-bold text-sm">0.0438</span>
              </div>
              <div className="p-2.5 rounded bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Referable ECE (After)</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">0.0359</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-700 dark:text-slate-400 font-sans leading-relaxed pt-1">
              <strong className="text-slate-900 dark:text-slate-300 font-mono">Notice: </strong>
              Development calibration metrics are not clinical certification. These Expected Calibration Error (ECE) metrics represent retrospective development calibration evidence evaluated on held-out development splits with temperature parameter <span className="font-mono text-slate-900 dark:text-slate-200">T = 0.7785</span>. They do not constitute clinical certification and do not present this individual patient&apos;s personal diagnostic accuracy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};


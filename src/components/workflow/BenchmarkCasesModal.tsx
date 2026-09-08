import React from 'react';
import { CLINICAL_CASE_PRESETS } from '../../data/clinicalCases';
import { X, FolderArchive, ArrowRight, AlertCircle } from 'lucide-react';

interface BenchmarkCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase: (presetId: string) => void;
  currentCaseId?: string;
}

export const BenchmarkCasesModal: React.FC<BenchmarkCasesModalProps> = ({
  isOpen,
  onClose,
  onSelectCase,
  currentCaseId,
}) => {
  if (!isOpen) return null;

  const diseaseCases = CLINICAL_CASE_PRESETS.filter((c) => c.id !== 'case-quality-fail');
  const qualityCases = CLINICAL_CASE_PRESETS.filter((c) => c.id === 'case-quality-fail');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="benchmark-modal-title"
    >
      <div
        className="relative w-full max-w-3xl max-h-[88vh] flex flex-col bg-[var(--bg-surface)] border border-[var(--border-app)] rounded-xl shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--border-app)] bg-[var(--bg-surface-elevated)] shrink-0">
          <div className="flex items-center gap-2.5">
            <FolderArchive className="w-4 h-4 text-rose-500 shrink-0" />
            <div>
              <h3 id="benchmark-modal-title" className="text-sm font-semibold text-[var(--text-primary)]">
                Benchmark Case Library
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Curated scenarios for screening workflow demonstration
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-sunken)] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto overflow-x-hidden flex-1 text-xs">
          {/* Section A: Clinical DR Severity Cases */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Retinal Disease Severity Tiers (ICDR 0–4)
            </div>

            <div className="space-y-2">
              {diseaseCases.map((preset) => {
                const isSelected = currentCaseId === preset.id;
                const isReferable = preset.expectedResult.includes('Referable');

                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onSelectCase(preset.id);
                      onClose();
                    }}
                    role="button"
                    tabIndex={0}
                    className={`p-3 sm:p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-h-[48px] ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500/5 text-[var(--text-primary)] shadow-sm'
                        : 'border-[var(--border-app)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 w-full sm:w-auto">
                      <div className="w-12 h-12 rounded bg-[#04070a] border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={preset.imageUrl}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-[var(--text-primary)]">
                            {preset.title}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                              isReferable
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {preset.expectedResult}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 leading-relaxed">
                          {preset.description}
                        </p>
                        <div className="text-[10px] font-mono text-[var(--text-muted)]">
                          Scenario ID: {preset.patient.patientId} · Eye: {preset.patient.eye}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full sm:w-auto px-3.5 py-2 sm:py-1 rounded bg-[var(--bg-surface-elevated)] hover:bg-rose-600 hover:text-white border border-[var(--border-app)] text-[11px] font-medium text-[var(--text-primary)] flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer min-h-[36px]"
                    >
                      <span>Select Case</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: Optical Quality Failure Scenario */}
          <div className="space-y-2.5 pt-2 border-t border-[var(--border-app)]">
            <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Image Quality Hold & Recapture Scenario</span>
            </div>

            {qualityCases.map((preset) => (
              <div
                key={preset.id}
                onClick={() => {
                  onSelectCase(preset.id);
                  onClose();
                }}
                role="button"
                tabIndex={0}
                className="p-3 sm:p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-h-[48px]"
              >
                <div className="flex items-start gap-3 min-w-0 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded bg-[#04070a] border border-amber-500/40 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={preset.imageUrl}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {preset.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-medium">
                        {preset.expectedResult}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 leading-relaxed">
                      {preset.description}
                    </p>
                    <div className="text-[10px] font-mono text-[var(--text-muted)]">
                      Scenario ID: {preset.patient.patientId} · Optical Gate Test
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full sm:w-auto px-3.5 py-2 sm:py-1 rounded bg-[var(--bg-surface-elevated)] hover:bg-amber-600 hover:text-white border border-amber-500/30 text-[11px] font-medium text-[var(--text-primary)] flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer min-h-[36px]"
                >
                  <span>Select Case</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 sm:px-6 py-3 border-t border-[var(--border-app)] bg-[var(--bg-surface-elevated)] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-sunken)] border border-[var(--border-app)] text-[var(--text-primary)] font-medium text-xs transition-colors min-h-[36px] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Sliders, Shield, Cpu, MapPin, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhcLocation?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentPhcLocation = 'Shirur Rural Primary Health Centre, Pune',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
    >
      <div
        className="w-full max-w-lg max-h-[88vh] flex flex-col bg-[var(--bg-surface)] border border-[var(--border-app)] rounded-xl shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--border-app)] bg-[var(--bg-surface-elevated)] shrink-0">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-rose-500 shrink-0" />
            <h2 id="settings-dialog-title" className="text-sm font-semibold text-[var(--text-primary)]">
              Workstation Settings & Configured Protocol
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-surface-sunken)] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-5 text-xs text-[var(--text-secondary)] overflow-y-auto overflow-x-hidden flex-1">
          {/* Section 1: Referral Threshold */}
          <div>
            <div className="text-[11px] font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-2">
              Clinical Triage Threshold
            </div>
            <div className="p-3.5 rounded-lg border border-[var(--border-app)] bg-[var(--bg-surface-elevated)] space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="font-medium text-[var(--text-primary)]">Referral Action Level</span>
                <span className="font-mono text-rose-500 font-semibold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 self-start sm:self-auto">
                  ICDR Grade ≥ 2 (Moderate NPDR)
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Configured screening protocol cutoff: Grades 0 and 1 indicate non-referable findings with follow-up per local clinical protocol; Grades 2, 3, and 4 generate specialist referral directives.
              </p>
            </div>
          </div>

          {/* Section 2: Facility & Station Identity */}
          <div>
            <div className="text-[11px] font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-2">
              Primary Health Centre Facility
            </div>
            <div className="p-3.5 rounded-lg border border-[var(--border-app)] bg-[var(--bg-surface-elevated)] flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[var(--text-muted)] mt-0.5 shrink-0" />
              <div>
                <div className="font-medium text-[var(--text-primary)]">{currentPhcLocation}</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Referral Link: Prototype workflow demonstration · Follow applicable local referral pathway
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Engine Architecture */}
          <div>
            <div className="text-[11px] font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-2">
              Inference Engine Specification
            </div>
            <div className="p-3.5 rounded-lg border border-[var(--border-app)] bg-[var(--bg-surface-elevated)] space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] text-[var(--text-muted)]">Model Architecture</div>
                  <div className="font-mono text-[var(--text-primary)] font-medium">EfficientNet-B0 (Experiment E007)</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-muted)]">Pipeline Runtime</div>
                  <div className="font-mono text-[var(--text-primary)] font-medium">E015 Edge · PyTorch Checkpoint</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-muted)]">Calibration Method</div>
                  <div className="font-mono text-[var(--text-primary)] font-medium">Temperature Scaling (T = 0.7785 · Dev)</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-muted)]">Target Latency</div>
                  <div className="font-mono text-[var(--text-primary)] font-medium">&lt; 500 ms (Local Inference)</div>
                </div>
              </div>
              <div className="pt-2 border-t border-[var(--border-app)]">
                <div className="text-[10px] text-[var(--text-muted)]">Checkpoint Verification SHA-256</div>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] break-all select-all">
                  a61710e11557bb7d1be60ed488e5bdf5b88c92d16c76441513bbfa4d8b94cc3c
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Clinical Safety Verification */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
            <Shield className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <div className="text-[11px] leading-relaxed">
              <strong>Human Oversight Protocol:</strong> AI-assisted screening prototype for clinical decision-support. Clinical validation and qualified human review remain required. All final clinical decisions and formal referrals remain with licensed medical practitioners.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 sm:px-6 py-3.5 border-t border-[var(--border-app)] bg-[var(--bg-surface-elevated)] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-colors min-h-[40px] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

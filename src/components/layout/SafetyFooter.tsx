import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const SafetyFooter: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border-app)] bg-[var(--bg-surface)] py-7 text-xs font-mono text-[var(--text-muted)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
            <span className="font-semibold text-[var(--text-primary)]">NetraRakshakAI</span>
            <span>·</span>
            <span>Explainable Diabetic Retinopathy Screening</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            <span>Human-in-the-Loop Clinical Decision Support</span>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
          <p>
            AI-assisted screening prototype for clinical decision-support workflows. Clinical validation and qualified human review remain required.
          </p>
          <p className="font-mono">
            E015 Engine · EfficientNet-B0 (E007) · Calibrated (T = 0.7785 · Dev)
          </p>
        </div>
      </div>
    </footer>
  );
};


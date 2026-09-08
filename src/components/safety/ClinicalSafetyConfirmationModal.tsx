import React from 'react';
import { ShieldAlert, UserCheck, X, ArrowRight, Stethoscope, AlertCircle } from 'lucide-react';

interface ClinicalSafetyConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionTitle: string;
  actionDescription?: string;
  confirmButtonLabel?: string;
}

export const ClinicalSafetyConfirmationModal: React.FC<ClinicalSafetyConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionTitle,
  actionDescription,
  confirmButtonLabel = 'Proceed to Clinical Workflow',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#11171F] border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-5 text-left font-sans">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Close Safeguard Dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Safeguard Message */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
            Clinical Workflow Safeguard
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {actionTitle}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {actionDescription ||
              'You are transitioning to human clinical documentation or generating a prototype referral summary.'}
          </p>
        </div>

        {/* Clear Safeguard Principles */}
        <div className="p-3.5 rounded-xl bg-[#080C10] border border-slate-800 space-y-2 font-mono text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">•</span>
            <div>
              <strong className="text-white">AI-assisted screening result:</strong>
              <span className="text-slate-400 block text-[11px] font-sans">
                Predictive risk score is decision-support information, not a certified clinical diagnosis.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">•</span>
            <div>
              <strong className="text-white">Human clinical assessment required:</strong>
              <span className="text-slate-400 block text-[11px] font-sans">
                Final clinical management, referral dispatch, and diagnostic sign-off remain with a qualified practitioner.
              </span>
            </div>
          </div>
        </div>

        <p className="text-[10px] font-mono text-slate-400 leading-relaxed">
          Note: This confirmation is a workflow safety checkpoint, not a diagnosis confirmation.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-clinical-safeguard-btn"
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs font-mono rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer min-h-[44px]"
          >
            <span>{confirmButtonLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

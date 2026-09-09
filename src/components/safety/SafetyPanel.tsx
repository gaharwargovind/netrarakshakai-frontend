import React from 'react';
import { ShieldCheck, AlertCircle, FileCheck, Stethoscope } from 'lucide-react';

export const SafetyPanel: React.FC = () => {
  return (
    <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3 font-mono shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />
        <span>Designed for Screening, Not Definitive Diagnosis</span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
        NetraRakshakAI is an AI-assisted clinical decision support system designed to triage diabetic retinopathy in frontline Indian public health centers.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-400 pt-1 font-sans">
        <div className="flex items-start gap-2">
          <span className="text-rose-600 dark:text-rose-400 font-mono font-bold text-xs mt-0.5">•</span>
          <span><strong>AI-Assisted Screening Only:</strong> Designed to identify patients requiring specialist assessment or routine follow-up.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-rose-600 dark:text-rose-400 font-mono font-bold text-xs mt-0.5">•</span>
          <span><strong>Quality Gating:</strong> Optical deficiencies automatically mandate recapture or reading-center adjudication.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-rose-600 dark:text-rose-400 font-mono font-bold text-xs mt-0.5">•</span>
          <span><strong>Specialist Review:</strong> All referable findings (ICDR ≥ 2) must be evaluated via dilated examination by an ophthalmologist.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-rose-600 dark:text-rose-400 font-mono font-bold text-xs mt-0.5">•</span>
          <span><strong>Human Oversight:</strong> The attending medical officer retains ultimate responsibility for patient care directives.</span>
        </div>
      </div>
    </div>
  );
};

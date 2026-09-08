import React, { useState } from 'react';
import { Lock, ShieldCheck, ChevronDown, ChevronUp, EyeOff, Key, Database, AlertCircle } from 'lucide-react';

interface DataPrivacyNoticeProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const DataPrivacyNotice: React.FC<DataPrivacyNoticeProps> = ({
  className = '',
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`rounded-xl bg-white dark:bg-[#0E141C] border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 transition-all shadow-sm dark:shadow-none ${className}`}
    >
      <button
        type="button"
        id="toggle-data-privacy-notice-btn"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider">
                Prototype Data Privacy & Patient Safety
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Local-Only Intake
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans hidden sm:block">
              Patient data minimization and edge processing guidelines for this research prototype
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span className="hidden sm:inline">{isExpanded ? 'Hide' : 'Inspect Safety Directives'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-200 dark:border-slate-800/80 space-y-3.5 text-xs font-sans text-slate-700 dark:text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Primary Privacy Statement */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#080C10] border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-300 leading-relaxed sm:col-span-2">
              Live screening is configured to use the local NetraRakshakAI FastAPI/E015 service. Patient images are not intentionally sent by this frontend to Gemini or unrelated external AI services. Local processing may generate temporary screening artifacts. Production deployment requires a defined retention, access-control and deletion policy.
            </div>

            {/* Rule 1: Minimized Intake */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#080C10] border border-slate-200 dark:border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold font-mono text-[11px]">
                <EyeOff className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Patient Data Minimization</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Only operational screening attributes (de-identified PHC ID, age, sex, and eye field) are recorded. Direct personal identifiers are intentionally excluded.
              </p>
            </div>

            {/* Rule 2: Local E015 Pipeline */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#080C10] border border-slate-200 dark:border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Local Gateway Routing</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Fundus photographs are evaluated locally via the E015 engine. No images are sent to external cloud AI or generative services.
              </p>
            </div>

            {/* Rule 3: Zero Client Credentials */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#080C10] border border-slate-200 dark:border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold font-mono text-[11px]">
                <Key className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Zero Client Credentials</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                The frontend exposes no secret API keys, authentication tokens, or private credentials.
              </p>
            </div>

            {/* Rule 4: Segregation */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#080C10] border border-slate-200 dark:border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold font-mono text-[11px]">
                <Database className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Live vs Demo Segregation</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Live patient fundus photographs are never commingled with, persisted as, or treated as synthetic benchmark data.
              </p>
            </div>
          </div>

          {/* Prototype Boundary Notice */}
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-slate-900/70 border border-amber-200 dark:border-slate-800 flex items-start gap-2.5 text-[11px] font-mono text-slate-700 dark:text-slate-400 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-slate-300">Prototype Disclaimer:</strong> This system is an investigational research prototype intended for decision-support evaluation. It makes no claims of formal regulatory certification, approval, or statutory compliance. Qualified clinical review remains mandatory.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

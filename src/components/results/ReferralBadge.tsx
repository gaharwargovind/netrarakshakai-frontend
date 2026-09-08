import React from 'react';
import { ScreeningRecommendation } from '../../types/screening';
import { AlertCircle, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface ReferralBadgeProps {
  recommendation: ScreeningRecommendation;
}

export const ReferralBadge: React.FC<ReferralBadgeProps> = ({ recommendation }) => {
  const isReferable = recommendation.referable;
  const rawCat = (recommendation.category || '').toUpperCase().replace(/[\s-]+/g, '_');

  // Determine standardized operational state & exact Requirement 13 wording
  let headline = 'Specialist referral recommended';
  let reason = 'ICDR Grade ≥ 2 identified';
  let action = 'Specialist assessment recommended. Follow the applicable local referral pathway.';
  let timeframe = recommendation.timeframe || 'Per applicable local clinical protocol and practitioner guidance.';
  let themeColor: 'rose' | 'amber' | 'emerald' = 'rose';

  if (rawCat.includes('RECAPTURE') || rawCat === 'RECAPTURE_OR_HUMAN_REVIEW' || rawCat === 'RECAPTURE_REQUIRED') {
    headline = 'Recapture or human review';
    reason = 'Optical criteria not satisfied';
    action = 'Recapture fundus photograph with improved alignment or route for qualified clinician assessment.';
    themeColor = 'amber';
  } else if (rawCat.includes('HUMAN') || rawCat === 'HUMAN_REVIEW') {
    headline = 'Qualified human review recommended';
    reason = 'Frontline review gate hold';
    action = 'Route for qualified human-in-the-loop review based on local workflow criteria.';
    themeColor = 'amber';
  } else if (!isReferable || rawCat.includes('ROUTINE') || rawCat === 'ROUTINE_MONITORING') {
    headline = 'Routine rescreening recommended';
    reason = 'ICDR Grade < 2 identified';
    action = 'A non-referable AI screening result does not guarantee absence of disease. Continue follow-up according to the applicable local clinical protocol and qualified practitioner guidance.';
    themeColor = 'emerald';
  } else {
    headline = 'Specialist referral recommended';
    reason = 'ICDR Grade ≥ 2 identified';
    action = 'Specialist assessment recommended. Follow the applicable local referral pathway.';
    themeColor = 'rose';
  }

  return (
    <div
      className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
        themeColor === 'rose'
          ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/50 text-slate-900 dark:text-white'
          : themeColor === 'amber'
          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/50 text-slate-900 dark:text-white'
          : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/50 text-slate-900 dark:text-white'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
            themeColor === 'rose'
              ? 'bg-rose-100 dark:bg-rose-600/20 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/40'
              : themeColor === 'amber'
              ? 'bg-amber-100 dark:bg-amber-600/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40'
              : 'bg-emerald-100 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40'
          }`}
        >
          {themeColor === 'rose' ? (
            <AlertCircle className="w-5 h-5" />
          ) : themeColor === 'amber' ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                themeColor === 'rose'
                  ? 'bg-rose-600 text-white'
                  : themeColor === 'amber'
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {reason}
            </span>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
              {isReferable ? 'Referral Directive' : 'Rescreening Directive'}
            </span>
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {headline}
          </h2>

          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed font-sans">
            {action}
          </p>
        </div>
      </div>

      {/* Recommended Timeframe Pill */}
      {timeframe && (
        <div className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-[#0B0F14]/80 border border-slate-300 dark:border-slate-800 text-xs font-mono shadow-sm dark:shadow-none">
          <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span className="text-slate-700 dark:text-slate-300 font-medium">{timeframe}</span>
        </div>
      )}
    </div>
  );
};

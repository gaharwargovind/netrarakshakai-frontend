import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

const ATTRIBUTION_READING_STEPS = [
  {
    step: '1',
    title: 'Start with the ICDR screening result',
    description: 'Note the primary predicted grade (0 to 4) and referable determination.',
  },
  {
    step: '2',
    title: 'Review the calibrated confidence',
    description: 'Assess temperature-scaled model probability and referable likelihood P(DR ≥ 2).',
  },
  {
    step: '3',
    title: 'Inspect the attribution map for context',
    description: 'Examine warmer regions to understand which retinal zones influenced the model.',
  },
  {
    step: '4',
    title: 'Compare the attribution with the original fundus image',
    description: 'Use side-by-side or overlay mode to correlate attribution against anatomy.',
  },
  {
    step: '5',
    title: 'Do not interpret the heatmap as a lesion boundary',
    description: 'Grad-CAM reflects model feature activation, not lesion segmentation or diagnostic proof.',
  },
  {
    step: '6',
    title: 'Escalate uncertain or concerning cases for qualified human review',
    description: 'Always route boundary or referable cases to an ophthalmologist for dilated examination.',
  },
];

export const HowToReadAttribution: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-slate-800 overflow-hidden">
      <button
        type="button"
        id="toggle-how-to-read-attribution-btn"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            How to read the attribution
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400">
            6-Step Operator Protocol
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-slate-600 dark:text-slate-400">
          <span>{isExpanded ? 'Hide Protocol' : 'View Protocol'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-200 dark:border-slate-800/60">
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
            {ATTRIBUTION_READING_STEPS.map((item) => (
              <li
                key={item.step}
                className="p-3 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-2.5 shadow-sm dark:shadow-none"
              >
                <span className="w-5 h-5 rounded-full bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-sky-200 dark:border-slate-700">
                  {item.step}
                </span>
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                    {item.title}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

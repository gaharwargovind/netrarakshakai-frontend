import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface GradCamLegendProps {
  showExplanation?: boolean;
}

export const GradCamLegend: React.FC<GradCamLegendProps> = ({ showExplanation = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3 text-xs font-mono text-slate-700 dark:text-slate-300">
        <span className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold">
          Attribution:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">Lower weight</span>
          <div
            className="w-28 sm:w-36 h-2 rounded-full bg-gradient-to-r from-blue-600 via-emerald-400 via-amber-400 to-rose-600 border border-slate-300 dark:border-slate-700/60 shadow-inner"
            aria-label="Grad-CAM colormap: blue (lower) to red (higher contribution)"
          />
          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">Higher weight</span>
        </div>

        <button
          type="button"
          onClick={() => setShowTooltip(!showTooltip)}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-slate-500 cursor-pointer"
          title="Attribution colormap guidance"
          aria-label="Toggle Grad-CAM attribution colormap guidance"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {(showExplanation || showTooltip) && (
        <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-[#0B0F14] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-800 dark:text-slate-300 font-sans leading-relaxed space-y-1">
          <p>
            <strong className="text-slate-900 dark:text-slate-200">How to read:</strong> Warmer/high-intensity regions indicate areas contributing more strongly to the model&apos;s prediction under the Grad-CAM method.
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-[10px] font-mono">
            Notice: Not a lesion segmentation, lesion detection, pathology boundary, or ground-truth annotation.
          </p>
        </div>
      )}
    </div>
  );
};


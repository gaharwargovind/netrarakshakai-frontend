import React from 'react';
import { ICDRGrade, ICDRClassification } from '../../types/screening';
import { Check } from 'lucide-react';

interface ICDRScaleProps {
  classification: ICDRClassification;
}

const ICDR_LEVELS: {
  grade: ICDRGrade;
  name: string;
  short: string;
  isReferable: boolean;
  clinicalCriteria: string;
}[] = [
  {
    grade: 0,
    name: 'No Apparent DR',
    short: 'Grade 0',
    isReferable: false,
    clinicalCriteria: 'No retinal abnormalities or lesions.',
  },
  {
    grade: 1,
    name: 'Mild NPDR',
    short: 'Grade 1',
    isReferable: false,
    clinicalCriteria: 'Microaneurysms only.',
  },
  {
    grade: 2,
    name: 'Moderate NPDR',
    short: 'Grade 2',
    isReferable: true,
    clinicalCriteria: 'More than microaneurysms; dot/blot hemorrhages, hard exudates.',
  },
  {
    grade: 3,
    name: 'Severe NPDR',
    short: 'Grade 3',
    isReferable: true,
    clinicalCriteria: '4-2-1 rule: severe hemorrhages in 4 quadrants, venous beading in 2, or IRMA in 1.',
  },
  {
    grade: 4,
    name: 'Proliferative DR',
    short: 'Grade 4',
    isReferable: true,
    clinicalCriteria: 'Neovascularization and/or vitreous/preretinal hemorrhage.',
  },
];

export const ICDRScale: React.FC<ICDRScaleProps> = ({ classification }) => {
  const predictedGrade = classification.predicted_grade;

  return (
    <div className="bg-white dark:bg-[#11171F] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
            International Clinical Diabetic Retinopathy (ICDR) Scale
          </h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono mt-0.5">
            Five-tier ICDR classification framework
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-slate-600 dark:text-slate-400">Non-Referable (0–1)</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-slate-600 dark:text-slate-400">Referable (≥ 2)</span>
        </div>
      </div>

      {/* 5-Level Progress Bar Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-2">
        {ICDR_LEVELS.map((level) => {
          const isSelected = level.grade === predictedGrade;
          const prob = classification.probabilities[level.grade];
          const probPercent = Math.round(prob * 100);

          return (
            <div
              key={level.grade}
              className={`p-3.5 rounded-lg border transition-all text-left relative flex flex-col justify-between ${
                isSelected
                  ? level.isReferable
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-slate-900 dark:text-white ring-2 ring-rose-500/30 shadow-md'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-slate-900 dark:text-white ring-2 ring-emerald-500/30 shadow-md'
                  : 'bg-slate-50 dark:bg-[#0B0F14] border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div
                  className={`absolute -top-2.5 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider ${
                    level.isReferable ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                  }`}
                >
                  PREDICTED
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-bold">
                    LEVEL {level.grade}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1 rounded ${
                      level.isReferable
                        ? 'text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60'
                        : 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60'
                    }`}
                  >
                    {level.isReferable ? 'Referable' : 'Routine'}
                  </span>
                </div>

                <div
                  className={`text-xs font-semibold leading-tight ${
                    isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-300'
                  }`}
                >
                  {level.name}
                </div>

                <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1.5 leading-snug line-clamp-2">
                  {level.clinicalCriteria}
                </p>
              </div>

              {/* Model Softmax Probability for this level */}
              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500 dark:text-slate-400">P(Grade)</span>
                <span className={`font-bold ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                  {probPercent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

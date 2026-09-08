import React from 'react';
import {
  SafetyOperationalState,
  SAFETY_STATE_DEFINITIONS,
  SafetyStateDefinition,
} from '../../types/safety';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  AlertCircle,
  UserCheck,
  RefreshCw,
  WifiOff,
  Sparkles,
  Cpu,
  Camera,
  ArrowRight,
} from 'lucide-react';

interface SafetyStatusCardProps {
  state: SafetyOperationalState;
  customExplanation?: string;
  customAction?: string;
  className?: string;
  actionButtons?: React.ReactNode;
  compact?: boolean;
}

export const SafetyStatusCard: React.FC<SafetyStatusCardProps> = ({
  state,
  customExplanation,
  customAction,
  className = '',
  actionButtons,
  compact = false,
}) => {
  const def: SafetyStateDefinition = SAFETY_STATE_DEFINITIONS[state] || SAFETY_STATE_DEFINITIONS.READY;

  const renderIcon = () => {
    const iconClass = 'w-5 h-5 shrink-0';
    switch (def.iconName) {
      case 'check-circle':
        return <CheckCircle2 className={iconClass} />;
      case 'alert-triangle':
        return <AlertTriangle className={iconClass} />;
      case 'alert-octagon':
        return <AlertOctagon className={iconClass} />;
      case 'alert-circle':
        return <AlertCircle className={iconClass} />;
      case 'user-check':
        return <UserCheck className={iconClass} />;
      case 'refresh-cw':
        return <RefreshCw className={iconClass} />;
      case 'wifi-off':
        return <WifiOff className={iconClass} />;
      case 'sparkles':
        return <Sparkles className={iconClass} />;
      case 'cpu':
        return <Cpu className={iconClass} />;
      case 'camera':
      default:
        return <Camera className={iconClass} />;
    }
  };

  const getThemeClasses = () => {
    switch (def.theme) {
      case 'emerald':
        return {
          container: 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200',
          iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
          badge: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60',
          actionText: 'text-emerald-300',
        };
      case 'amber':
        return {
          container: 'bg-amber-950/30 border-amber-500/40 text-amber-200',
          iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
          badge: 'bg-amber-900/60 text-amber-300 border border-amber-700/60',
          actionText: 'text-amber-300',
        };
      case 'rose':
        return {
          container: 'bg-rose-950/30 border-rose-500/50 text-rose-200',
          iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
          badge: 'bg-rose-900/60 text-rose-300 border border-rose-700/60',
          actionText: 'text-rose-300',
        };
      case 'sky':
        return {
          container: 'bg-sky-950/30 border-sky-500/40 text-sky-200',
          iconBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/40',
          badge: 'bg-sky-900/60 text-sky-300 border border-sky-700/60',
          actionText: 'text-sky-300',
        };
      case 'neutral':
      default:
        return {
          container: 'bg-slate-900/50 border-slate-700/60 text-slate-200',
          iconBg: 'bg-slate-800 text-slate-300 border border-slate-700',
          badge: 'bg-slate-800 text-slate-300 border border-slate-700',
          actionText: 'text-slate-300',
        };
    }
  };

  const themeClasses = getThemeClasses();

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border font-mono text-xs ${themeClasses.container} ${className}`}
      >
        <div className={`p-1 rounded-md ${themeClasses.iconBg}`}>{renderIcon()}</div>
        <div className="min-w-0">
          <div className="font-bold uppercase tracking-wider text-[11px] truncate">
            {def.textLabel}
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            {customAction || def.recommendedAction}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 sm:p-5 rounded-xl border space-y-3.5 font-mono shadow-lg ${themeClasses.container} ${className}`}
    >
      {/* Header: Label, Icon, Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${themeClasses.iconBg}`}>
            {renderIcon()}
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white block">
              {def.textLabel}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Status Code: {def.state}
            </span>
          </div>
        </div>

        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded ${themeClasses.badge}`}>
          {def.badge}
        </span>
      </div>

      {/* Restrained Clinical Hierarchy: What happened -> Why -> What to do next */}
      <div className="space-y-2.5 font-sans text-xs">
        {/* What Happened */}
        <div>
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
            Event / Observation:
          </span>
          <p className="text-slate-200 leading-relaxed font-medium">
            {def.whatHappened}
          </p>
        </div>

        {/* Why / Explanation */}
        <div>
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
            Operational Context:
          </span>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {customExplanation || def.whyExplanation}
          </p>
        </div>

        {/* What to do next (Action) */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/10 mt-1">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
            <ArrowRight className="w-3 h-3 text-rose-400" />
            <span>Recommended Clinical Next Step:</span>
          </span>
          <p className={`font-mono text-xs font-semibold leading-relaxed ${themeClasses.actionText}`}>
            {customAction || def.recommendedAction}
          </p>
        </div>
      </div>

      {/* Action Buttons Slot */}
      {actionButtons && <div className="pt-2">{actionButtons}</div>}
    </div>
  );
};

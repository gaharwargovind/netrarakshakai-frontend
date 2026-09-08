import React from 'react';

interface RetinalReticleProps {
  showReticle?: boolean;
  eye?: 'OD' | 'OS';
}

export const RetinalReticle: React.FC<RetinalReticleProps> = ({
  showReticle = true,
  eye = 'OD',
}) => {
  if (!showReticle) return null;

  const isOD = eye === 'OD'; // Right eye: Disc is on nasal (right) side, macula is temporal (left)

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10">
      {/* Precision 45-degree Retinal FOV Ring */}
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="vignetteRing" cx="50%" cy="50%" r="50%">
            <stop offset="90%" stopColor="transparent" />
            <stop offset="99%" stopColor="#05080c" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#05080c" stopOpacity="0.95" />
          </radialGradient>
        </defs>

        {/* Outer Circular Mask */}
        <circle cx="500" cy="500" r="475" fill="none" stroke="#2a3746" strokeWidth="1" strokeDasharray="4,6" opacity="0.4" />
        <circle cx="500" cy="500" r="470" fill="url(#vignetteRing)" />

        {/* Center Graticule Marks */}
        {/* Subtle crosshair marks at 12, 3, 6, 9 o'clock */}
        <line x1="500" y1="20" x2="500" y2="40" stroke="#64748b" strokeWidth="1.5" opacity="0.6" />
        <line x1="500" y1="960" x2="500" y2="980" stroke="#64748b" strokeWidth="1.5" opacity="0.6" />
        <line x1="20" y1="500" x2="40" y2="500" stroke="#64748b" strokeWidth="1.5" opacity="0.6" />
        <line x1="960" y1="500" x2="980" y2="500" stroke="#64748b" strokeWidth="1.5" opacity="0.6" />

        {/* Macular Region Graticule Guide (Temporal) */}
        <g transform={`translate(${isOD ? 480 : 520}, 500)`} opacity="0.55">
          <circle cx="0" cy="0" r="85" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,4" />
          <line x1="-8" y1="0" x2="8" y2="0" stroke="#38bdf8" strokeWidth="1" />
          <line x1="0" y1="-8" x2="0" y2="8" stroke="#38bdf8" strokeWidth="1" />
          <text x="0" y="-95" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontFamily="monospace" letterSpacing="1">
            MACULAR REGION
          </text>
        </g>

        {/* Optic Disc Graticule Guide (Nasal) */}
        <g transform={`translate(${isOD ? 680 : 320}, 500)`} opacity="0.45">
          <ellipse cx="0" cy="0" rx="44" ry="54" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3" />
          <text x="0" y="-64" textAnchor="middle" fill="#fde68a" fontSize="13" fontFamily="monospace" letterSpacing="1">
            OPTIC DISC
          </text>
        </g>

        {/* Angular Tick marks around FOV ring */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 500 + 472 * Math.cos(rad);
          const y1 = 500 + 472 * Math.sin(rad);
          const x2 = 500 + 465 * Math.cos(rad);
          const y2 = 500 + 465 * Math.sin(rad);
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#64748b"
              strokeWidth="1"
              opacity="0.35"
            />
          );
        })}
      </svg>

      {/* Floating HUD Badges */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/80 text-slate-300">
          FOV: 45° STANDARD
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/80 text-rose-300">
          FIELD: {eye}
        </span>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          APERTURE: NON-MYDRIATIC
        </span>
      </div>
    </div>
  );
};

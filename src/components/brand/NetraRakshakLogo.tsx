import React from 'react';

export interface NetraRakshakLogoProps {
  size?: number;
  className?: string;
  variant?: 'mark' | 'full' | 'compact';
  themeMode?: 'light' | 'dark' | 'auto';
  ariaLabel?: string;
}

/**
 * Official NetraRakshakAI Brand Mark
 * Precise vector translation of the clinical fundus icon:
 * - Circular boundary with ruby-red retinal field
 * - Anatomical dendritic branching retinal vasculature
 * - Central optic disc ring
 * - Dynamic white dividing swoosh
 * - Deep contrast quadrant
 */
export const NetraRakshakMark: React.FC<{
  size?: number;
  className?: string;
  idPrefix?: string;
}> = ({ size = 32, className = '', idPrefix = 'nr' }) => {
  const retinaGradId = `${idPrefix}-retina-grad`;
  const quadrantGradId = `${idPrefix}-quadrant-grad`;
  const vesselGlowId = `${idPrefix}-vessel-glow`;
  const clipCircleId = `${idPrefix}-clip-circle`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
      style={{ aspectRatio: '1 / 1' }}
    >
      <defs>
        {/* Radial depth for retinal field */}
        <radialGradient
          id={retinaGradId}
          cx="44%"
          cy="52%"
          r="54%"
          fx="44%"
          fy="52%"
        >
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="25%" stopColor="#e11d48" />
          <stop offset="65%" stopColor="#9f1239" />
          <stop offset="100%" stopColor="#4c0519" />
        </radialGradient>

        {/* Lower-right dark quadrant */}
        <linearGradient
          id={quadrantGradId}
          x1="60%"
          y1="50%"
          x2="90%"
          y2="90%"
        >
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#090d16" />
        </linearGradient>

        {/* Circular boundary clip */}
        <clipPath id={clipCircleId}>
          <circle cx="50" cy="50" r="47.5" />
        </clipPath>
      </defs>

      {/* Main clipped logo shape */}
      <g clipPath={`url(#${clipCircleId})`}>
        {/* 1. Base Dark Quadrant (Bottom-Right) */}
        <rect x="0" y="0" width="100" height="100" fill={`url(#${quadrantGradId})`} />

        {/* 2. Red Retinal Field (Upper & Left Sector) */}
        <path
          d="M 50 2.5 
             A 47.5 47.5 0 1 0 37.8 88.2 
             C 45 74, 52 61, 57.5 50.8 
             L 92.5 37.2 
             A 47.5 47.5 0 0 0 50 2.5 Z"
          fill={`url(#${retinaGradId})`}
        />

        {/* Subtle shadow gradient at the swoosh boundary */}
        <path
          d="M 37.8 88.2 C 45 74, 52 61, 57.5 50.8 L 92.5 37.2 Z"
          stroke="#000000"
          strokeWidth="3"
          strokeOpacity="0.4"
        />

        {/* 3. Retinal Blood Vessels (Branching Dendritic Vasculature) */}
        <g stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round">
          {/* Superior Temporal Trunk */}
          <path
            d="M 44 45 C 43 38, 38 31, 31 22 C 27 17, 24 13, 21 8"
            strokeWidth="1.8"
            strokeOpacity="0.95"
          />
          <path
            d="M 38 31 C 41 26, 45 19, 47 11"
            strokeWidth="1.2"
            strokeOpacity="0.85"
          />
          <path
            d="M 31 22 C 34 18, 36 13, 37 6"
            strokeWidth="0.9"
            strokeOpacity="0.75"
          />

          {/* Superior Nasal Trunk */}
          <path
            d="M 46 45 C 48 37, 51 28, 59 19 C 64 14, 69 10, 75 7"
            strokeWidth="1.7"
            strokeOpacity="0.95"
          />
          <path
            d="M 51 28 C 55 24, 61 20, 68 16"
            strokeWidth="1.1"
            strokeOpacity="0.85"
          />
          <path
            d="M 59 19 C 61 14, 64 11, 67 6"
            strokeWidth="0.8"
            strokeOpacity="0.75"
          />

          {/* Nasal Horizontal Vessels */}
          <path
            d="M 48 51 C 55 50, 63 47, 72 43 C 78 40, 83 37, 88 33"
            strokeWidth="1.6"
            strokeOpacity="0.95"
          />
          <path
            d="M 63 47 C 68 44, 73 39, 78 34"
            strokeWidth="1.0"
            strokeOpacity="0.85"
          />

          {/* Inferior Nasal / Descending Trunk */}
          <path
            d="M 44 58 C 44 65, 43 72, 41 79 C 39 83, 38 86, 37 88"
            strokeWidth="1.7"
            strokeOpacity="0.95"
          />
          <path
            d="M 43 70 C 47 73, 50 76, 52 80"
            strokeWidth="1.1"
            strokeOpacity="0.85"
          />

          {/* Temporal Left Radial Branching */}
          <path
            d="M 37 50 C 30 49, 23 48, 15 48 C 11 48, 8 48, 5 49"
            strokeWidth="1.6"
            strokeOpacity="0.95"
          />
          <path
            d="M 30 49 C 26 43, 21 39, 15 35"
            strokeWidth="1.1"
            strokeOpacity="0.85"
          />
          <path
            d="M 23 48 C 20 54, 16 60, 11 65"
            strokeWidth="1.0"
            strokeOpacity="0.85"
          />

          {/* Inferior Temporal Branches */}
          <path
            d="M 40 56 C 36 63, 30 70, 24 76 C 20 80, 16 83, 11 86"
            strokeWidth="1.7"
            strokeOpacity="0.95"
          />
          <path
            d="M 36 63 C 31 66, 26 70, 21 73"
            strokeWidth="1.1"
            strokeOpacity="0.85"
          />
          <path
            d="M 30 70 C 32 75, 34 80, 34 85"
            strokeWidth="0.9"
            strokeOpacity="0.75"
          />

          {/* Fine Capillary Accents */}
          <path d="M 40 37 C 36 34, 32 32, 27 30" strokeWidth="0.75" strokeOpacity="0.7" />
          <path d="M 52 35 C 57 32, 63 30, 69 28" strokeWidth="0.75" strokeOpacity="0.7" />
          <path d="M 38 67 C 33 71, 28 75, 22 79" strokeWidth="0.75" strokeOpacity="0.7" />
        </g>

        {/* 4. Central Optic Disc Ring & Core */}
        <circle cx="43.5" cy="52" r="6.8" fill="#ffffff" />
        <circle cx="43.5" cy="52" r="6.8" stroke="#e11d48" strokeWidth="1.4" fill="none" />
        <circle cx="43.5" cy="52" r="3.2" fill="#ffffff" />

        {/* 5. Dynamic White Dividing Swoosh (The clinical wing cut) */}
        <path
          d="M 36.5 89.2 
             C 44.2 74.8, 51.5 62, 57.5 50.8 
             L 92.5 37.2 
             L 93.8 40.5 
             L 60 53.5 
             C 53.5 65.5, 46 78, 38.8 90 Z"
          fill="#ffffff"
        />
      </g>

      {/* Outer subtle edge stroke */}
      <circle
        cx="50"
        cy="50"
        r="47.5"
        stroke="currentColor"
        strokeWidth="1"
        className="text-slate-700/30 dark:text-slate-600/40"
        fill="none"
      />
    </svg>
  );
};

/**
 * NetraRakshakAI Responsive Brand Component
 * Handles mark, compact mobile header lockup, and full desktop header lockup.
 */
export const NetraRakshakLogo: React.FC<NetraRakshakLogoProps> = ({
  size = 32,
  className = '',
  variant = 'full',
  ariaLabel = 'NetraRakshakAI - Diabetic Retinopathy Screening',
}) => {
  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center ${className}`} aria-label={ariaLabel} role="img">
        <NetraRakshakMark size={size} />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2.5 select-none ${className}`}
        aria-label={ariaLabel}
        role="img"
      >
        <NetraRakshakMark size={size} />
        <div className="flex items-baseline tracking-tight">
          <span className="font-bold text-[var(--text-primary)] text-sm sm:text-base tracking-tight">
            NetraRakshak
          </span>
          <span className="text-rose-600 dark:text-rose-400 font-black text-sm sm:text-base ml-0.5">
            AI
          </span>
        </div>
      </div>
    );
  }

  // Full variant: Mark + Wordmark + Clean Subtitle
  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${className}`}
      aria-label={ariaLabel}
      role="img"
    >
      <NetraRakshakMark size={size} />
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline leading-none">
          <span className="font-bold tracking-tight text-[var(--text-primary)] text-sm sm:text-base">
            NetraRakshak
          </span>
          <span className="text-rose-600 dark:text-rose-400 font-black text-sm sm:text-base ml-0.5">
            AI
          </span>
        </div>
        <span className="text-[11px] text-[var(--text-muted)] tracking-tight mt-1 leading-none font-normal">
          Diabetic Retinopathy Screening
        </span>
      </div>
    </div>
  );
};

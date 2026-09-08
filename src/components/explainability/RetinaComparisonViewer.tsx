import React, { useState, useRef, useCallback } from 'react';
import { ExplanationData, PatientInfo } from '../../types/screening';
import { GradCamLegend } from './GradCamLegend';
import { HowToReadAttribution } from './HowToReadAttribution';
import {
  Sliders,
  AlertCircle,
  Info,
  SplitSquareVertical,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Layers,
  Eye,
} from 'lucide-react';

interface RetinaComparisonViewerProps {
  originalImageUrl: string;
  explanation: ExplanationData;
  patient: PatientInfo;
}

type ViewMode = 'side-by-side' | 'overlay' | 'split' | 'attribution-only' | 'original';

export const RetinaComparisonViewer: React.FC<RetinaComparisonViewerProps> = ({
  originalImageUrl,
  explanation,
  patient,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const [opacity, setOpacity] = useState<number>(65); // 0 - 100
  const [splitPos, setSplitPos] = useState<number>(50); // percentage 0 - 100

  // Synchronized Zoom & Pan State for Retinal Invariant Preservation
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingSplit = useRef<boolean>(false);

  // Zoom handlers
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.0));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(Number((prev - 0.25).toFixed(2)), 1.0);
      if (next === 1.0) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers when zoomed
  const handlePanStart = (e: React.PointerEvent) => {
    if (zoom <= 1.0) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handlePanMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanning || zoom <= 1.0) return;
      const maxPan = (zoom - 1.0) * 150;
      const newX = Math.min(Math.max(e.clientX - panStartRef.current.x, -maxPan), maxPan);
      const newY = Math.min(Math.max(e.clientY - panStartRef.current.y, -maxPan), maxPan);
      setPan({ x: newX, y: newY });
    },
    [isPanning, zoom]
  );

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  // Interactive Split divider handlers
  const handleSplitPointerDown = () => {
    isDraggingSplit.current = true;
  };

  const handleSplitPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingSplit.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setSplitPos(percent);
  }, []);

  const handleSplitPointerUp = () => {
    isDraggingSplit.current = false;
  };

  // Transform style applied identically to preserve retinal geometry
  const transformStyle: React.CSSProperties = {
    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
    transformOrigin: 'center center',
    transition: isPanning ? 'none' : 'transform 0.15s ease-out',
  };

  return (
    <div className="bg-white dark:bg-[#11171F] border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
      {/* 1. MODEL EXPLANATION Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
              MODEL EXPLANATION
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Layer: {explanation.target_layer}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-sans">
            Visual attribution from the screening model (Grad-CAM feature attribution)
          </p>
        </div>

        {/* View Mode & Zoom Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div
            className="flex items-center gap-1 bg-slate-100 dark:bg-[#0B0F14] p-1 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar"
            role="tablist"
            aria-label="Retinal view modes"
          >
            {(
              [
                { id: 'side-by-side', label: 'Side-by-Side' },
                { id: 'overlay', label: 'Overlay' },
                { id: 'split', label: 'Split Slider' },
                { id: 'attribution-only', label: 'Attribution Alone' },
                { id: 'original', label: 'Original' },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                id={`view-mode-${mode.id}`}
                role="tab"
                aria-selected={viewMode === mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all min-h-[40px] cursor-pointer ${
                  viewMode === mode.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold border border-slate-300 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Zoom & Fit-to-View Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0B0F14] p-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              id="zoom-out-btn"
              onClick={handleZoomOut}
              disabled={zoom <= 1.0}
              className="w-8 h-8 rounded flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-800 dark:text-slate-300 px-1.5 min-w-[42px] text-center select-none font-medium">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              id="zoom-in-btn"
              onClick={handleZoomIn}
              disabled={zoom >= 3.0}
              className="w-8 h-8 rounded flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors cursor-pointer"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 mx-0.5" />
            <button
              type="button"
              id="reset-zoom-btn"
              onClick={handleResetZoom}
              className="px-2 h-8 rounded flex items-center gap-1 text-[11px] font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Fit to View (Reset 100%)"
              aria-label="Fit to View (Reset Zoom)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fit</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REQUIRED CLINICAL BOUNDARY NOTICE (Exact Requirement 14) */}
      <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-500/40 text-xs font-mono space-y-2">
        <div className="flex items-center gap-2 text-rose-900 dark:text-rose-300 font-bold uppercase tracking-wider text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>Grad-CAM is model feature attribution.</span>
        </div>
        <div className="text-[11px] text-rose-950 dark:text-rose-200/90 pl-6 space-y-0.5">
          <div className="font-semibold">It is NOT:</div>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>lesion segmentation</li>
            <li>lesion detection</li>
            <li>anatomical quantification</li>
            <li>clinical proof</li>
            <li>a substitute for clinician review</li>
          </ul>
        </div>
      </div>

      {/* 3. Retinal Comparison Workstation Viewing Area */}
      {viewMode === 'side-by-side' ? (
        /* Side by Side Mode: Stacked vertically on mobile (<768px), side-by-side on desktop */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left: ORIGINAL FUNDUS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300 px-1">
              <span className="font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                ORIGINAL FUNDUS ({patient.eye})
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">UNALTERED ACQUISITION</span>
            </div>
            <div
              className={`relative aspect-square rounded-xl bg-[#06090D] border border-slate-800 overflow-hidden p-2 flex items-center justify-center select-none ${
                zoom > 1.0 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''
              }`}
              onPointerDown={handlePanStart}
              onPointerMove={handlePanMove}
              onPointerUp={handlePanEnd}
              onPointerLeave={handlePanEnd}
            >
              <img
                src={originalImageUrl}
                alt={`Original fundus photograph of ${patient.eye} field`}
                className="w-full h-full object-contain rounded-lg select-none pointer-events-none"
                style={transformStyle}
                referrerPolicy="no-referrer"
              />
              {zoom > 1.0 && (
                <div className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-slate-300 border border-slate-700 pointer-events-none">
                  Pan Active · {Math.round(zoom * 100)}%
                </div>
              )}
            </div>
          </div>

          {/* Right: MODEL ATTRIBUTION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300 px-1">
              <span className="font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                MODEL ATTRIBUTION
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">GRAD-CAM SALIENCE</span>
            </div>
            <div
              className={`relative aspect-square rounded-xl bg-[#06090D] border border-slate-800 overflow-hidden p-2 flex items-center justify-center select-none ${
                zoom > 1.0 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''
              }`}
              onPointerDown={handlePanStart}
              onPointerMove={handlePanMove}
              onPointerUp={handlePanEnd}
              onPointerLeave={handlePanEnd}
            >
              <img
                src={originalImageUrl}
                alt="Underlying fundus structure"
                className="w-full h-full object-contain rounded-lg select-none pointer-events-none"
                style={transformStyle}
                referrerPolicy="no-referrer"
              />
              {explanation.overlay_image_url && (
                <img
                  src={explanation.overlay_image_url}
                  alt="Grad-CAM model attribution visual overlay indicating regions contributing to prediction"
                  className="absolute inset-0 w-full h-full object-contain p-2 rounded-lg pointer-events-none mix-blend-screen transition-opacity"
                  style={{
                    ...transformStyle,
                    opacity: opacity / 100,
                  }}
                  referrerPolicy="no-referrer"
                />
              )}
              {zoom > 1.0 && (
                <div className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-slate-300 border border-slate-700 pointer-events-none">
                  Synchronized · {Math.round(zoom * 100)}%
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Single Viewport Mode (Overlay, Interactive Split, or Original) */
        <div className="space-y-2">
          <div
            ref={containerRef}
            onPointerMove={viewMode === 'split' ? handleSplitPointerMove : handlePanMove}
            onPointerUp={viewMode === 'split' ? handleSplitPointerUp : handlePanEnd}
            onPointerLeave={viewMode === 'split' ? handleSplitPointerUp : handlePanEnd}
            onPointerDown={zoom > 1.0 && viewMode !== 'split' ? handlePanStart : undefined}
            className={`relative w-full aspect-square max-w-[620px] mx-auto rounded-2xl bg-[#06090D] border border-slate-800 overflow-hidden shadow-2xl select-none ${
              zoom > 1.0 && viewMode !== 'split'
                ? isPanning
                  ? 'cursor-grabbing'
                  : 'cursor-grab'
                : 'touch-none'
            }`}
          >
            {/* Base: Original Fundus (hidden in attribution-only) */}
            {viewMode !== 'attribution-only' && (
              <img
                src={originalImageUrl}
                alt="Base fundus photograph"
                className="w-full h-full object-contain p-2 rounded-2xl select-none pointer-events-none"
                style={transformStyle}
                referrerPolicy="no-referrer"
              />
            )}

            {/* Mode: Attribution Alone */}
            {viewMode === 'attribution-only' && (
              <div className="relative w-full h-full flex items-center justify-center p-2">
                {explanation.overlay_image_url ? (
                  <img
                    src={explanation.overlay_image_url}
                    alt="Grad-CAM model attribution heatmap alone"
                    className="w-full h-full object-contain rounded-2xl select-none pointer-events-none"
                    style={transformStyle}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-slate-400 text-xs font-mono">Attribution data not available</div>
                )}
                <div className="absolute top-4 left-4 z-10 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/85 border border-slate-700 text-rose-300">
                  ATTRIBUTION ALONE (SALIENT CONV REGIONS)
                </div>
              </div>
            )}

            {/* Mode: Overlay */}
            {viewMode === 'overlay' && explanation.overlay_image_url && (
              <img
                src={explanation.overlay_image_url}
                alt="Grad-CAM model attribution overlay"
                className="absolute inset-0 w-full h-full object-contain p-2 rounded-2xl pointer-events-none mix-blend-screen transition-opacity"
                style={{
                  ...transformStyle,
                  opacity: opacity / 100,
                }}
                referrerPolicy="no-referrer"
              />
            )}

            {/* Mode: Interactive Split Slider */}
            {viewMode === 'split' && explanation.overlay_image_url && (
              <>
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ clipPath: `polygon(${splitPos}% 0, 100% 0, 100% 100%, ${splitPos}% 100%)` }}
                >
                  <img
                    src={originalImageUrl}
                    alt="Fundus Base in Split"
                    className="w-full h-full object-contain p-2 rounded-2xl select-none"
                    style={transformStyle}
                    referrerPolicy="no-referrer"
                  />
                  <img
                    src={explanation.overlay_image_url}
                    alt="Grad-CAM Attribution in Split"
                    className="absolute inset-0 w-full h-full object-contain p-2 rounded-2xl mix-blend-screen"
                    style={{
                      ...transformStyle,
                      opacity: opacity / 100,
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Draggable Divider with touch target */}
                <div
                  className="absolute top-0 bottom-0 w-10 -ml-5 flex items-center justify-center cursor-ew-resize z-20 touch-none"
                  style={{ left: `${splitPos}%` }}
                  onPointerDown={handleSplitPointerDown}
                  aria-label="Adjust split comparison position"
                  role="separator"
                  aria-valuenow={Math.round(splitPos)}
                >
                  <div className="w-0.5 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <div className="absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white shadow-lg pointer-events-none">
                    <SplitSquareVertical className="w-4 h-4" />
                  </div>
                </div>

                <div className="absolute top-4 left-4 z-10 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/85 border border-slate-700 text-slate-300">
                  ORIGINAL FUNDUS
                </div>
                <div className="absolute top-4 right-4 z-10 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/85 border border-slate-700 text-rose-300">
                  MODEL ATTRIBUTION
                </div>
              </>
            )}

            {/* Mode: Pure Original */}
            {viewMode === 'original' && (
              <div className="absolute top-4 left-4 z-10 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/85 border border-slate-700 text-slate-300">
                ORIGINAL ACQUISITION ({patient.eye})
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Opacity Slider & Attribution Legend */}
      {viewMode !== 'original' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Sliders className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <label htmlFor="gradcam-opacity-slider" className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Attribution Opacity: {opacity}%
            </label>
            <input
              id="gradcam-opacity-slider"
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              aria-label="Attribution layer opacity percentage"
              className="w-36 h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 min-h-[30px]"
            />
          </div>

          <GradCamLegend showExplanation={false} />
        </div>
      )}

      {/* Screen Reader Detailed Textual Explanation */}
      <div className="sr-only" aria-live="polite">
        Grad-CAM model attribution visualization for patient {patient.patientId}, eye {patient.eye}.
        Target convolutional layer {explanation.target_layer}.
        This visualization reflects convolutional feature attribution, not definitive anatomical quantification.
      </div>

      {/* 5. Operator Protocol: How to Read the Attribution */}
      <HowToReadAttribution />
    </div>
  );
};


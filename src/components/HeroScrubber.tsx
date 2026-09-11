"use client";

import { useRef, useEffect, useState, useCallback } from "react";

const FRAME_COUNT = 120;
const ARROW_STEP = 18; // ~15-20 frames per arrow click or tap
const TAP_STEP = 18;

// Path to transparent PNG frames
function frameSrc(index: number): string {
  const num = String(index + 1).padStart(3, "0");
  return `/turntable-transparent/frame_${num}.png`;
}

/** Wrap frame index into 0..119 range continuously */
function wrapIndex(i: number): number {
  return ((i % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
}

interface HeroScrubberProps {
  onFrameChange?: (frameIndex: number) => void;
}

export default function HeroScrubber({ onFrameChange }: HeroScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [activeFrame, setActiveFrame] = useState(0);

  // Smooth physics interpolation state
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const rafLoopRef = useRef<number>(0);

  // Press-and-hold auto-rotation refs
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdRafRef = useRef<number | null>(null);

  const dragRef = useRef({
    active: false,
    startX: 0,
    lastX: 0,
    totalMoved: 0,
  });

  /* ── Draw frame to canvas (clean alpha transparency) ────────── */
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[idx];
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, []);

  /* ── Preload 120 transparent frames ─────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    framesRef.current = images;
    let count = 0;

    console.log(`[HeroScrubber] Preloading ${FRAME_COUNT} frames from /turntable-transparent/...`);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameSrc(i);

      img.onload = () => {
        if (cancelled) return;
        images[i] = img;
        count++;
        setLoaded(count);

        // Draw initial frame as soon as frame 0 is ready
        if (i === 0 && lastDrawnFrameRef.current === -1) {
          lastDrawnFrameRef.current = 0;
          drawFrame(0);
        }

        if (count === FRAME_COUNT) {
          setReady(true);
          console.log(`[HeroScrubber] Successfully loaded all ${count} frames from /turntable-transparent/`);
        }
      };

      img.onerror = (err) => {
        if (cancelled) return;
        console.error(`[HeroScrubber] Failed to load frame ${i}: ${img.src}`, err);
        count++;
        setLoaded(count);
        if (count === FRAME_COUNT) {
          setReady(true);
        }
      };
    }

    return () => {
      cancelled = true;
    };
  }, [drawFrame]);

  /* ── Continuous smooth interpolation loop (rAF) ─────────────── */
  useEffect(() => {
    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      const diff = targetFrameRef.current - currentFrameRef.current;

      if (Math.abs(diff) > 0.001) {
        // Smooth ease-out tracking
        currentFrameRef.current += diff * 0.15;

        const wrapped = wrapIndex(Math.round(currentFrameRef.current));
        if (wrapped !== lastDrawnFrameRef.current) {
          lastDrawnFrameRef.current = wrapped;
          drawFrame(wrapped);
          setActiveFrame(wrapped);
          onFrameChange?.(wrapped);
        }
      }

      rafLoopRef.current = requestAnimationFrame(tick);
    };

    rafLoopRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafLoopRef.current);
    };
  }, [drawFrame, onFrameChange]);

  /* ── Pointer Drag: Full viewport drag ≈ 120-frame rotation ─── */
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      active: true,
      startX: e.clientX,
      lastX: e.clientX,
      totalMoved: 0,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    const deltaX = e.clientX - drag.lastX;
    drag.lastX = e.clientX;
    drag.totalMoved += Math.abs(deltaX);

    // Viewport-width mapping:
    // Dragging across 1 viewport width = 120 frames
    const viewportW = window.innerWidth || 1200;
    const framesPerPixel = FRAME_COUNT / viewportW;
    targetFrameRef.current += deltaX * framesPerPixel;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    drag.active = false;

    // If pointer barely moved, treat as tap
    if (drag.totalMoved < 6 && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const midpoint = rect.width / 2;

      // Tap right half -> animate forward ~18 frames, tap left -> animate backward ~18 frames
      if (clickX > midpoint) {
        targetFrameRef.current += TAP_STEP;
      } else {
        targetFrameRef.current -= TAP_STEP;
      }
    }
  };

  /* ── Press-and-Hold & Tap on Arrow Buttons ──────────────────── */
  const stopHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (holdRafRef.current) {
      cancelAnimationFrame(holdRafRef.current);
      holdRafRef.current = null;
    }
  }, []);

  const startHold = useCallback((direction: 1 | -1) => {
    stopHold();
    // Immediate step on click/tap
    targetFrameRef.current += direction * ARROW_STEP;

    // After 220ms of holding, continuously auto-rotate
    holdTimerRef.current = setTimeout(() => {
      const stepPerFrame = direction * 1.6;
      const loop = () => {
        targetFrameRef.current += stepPerFrame;
        holdRafRef.current = requestAnimationFrame(loop);
      };
      holdRafRef.current = requestAnimationFrame(loop);
    }, 220);
  }, [stopHold]);

  useEffect(() => {
    window.addEventListener("pointerup", stopHold);
    window.addEventListener("pointercancel", stopHold);
    return () => {
      window.removeEventListener("pointerup", stopHold);
      window.removeEventListener("pointercancel", stopHold);
      stopHold();
    };
  }, [stopHold]);

  /* ── Keyboard accessibility ─────────────────────────────────── */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      targetFrameRef.current -= ARROW_STEP;
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      targetFrameRef.current += ARROW_STEP;
    }
  };

  const pct = FRAME_COUNT > 1 ? Math.round((loaded / FRAME_COUNT) * 100) : 0;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center select-none pointer-events-auto"
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="region"
      aria-label={`Interactive 3D model rotation — frame ${activeFrame + 1} of ${FRAME_COUNT}. Drag, tap, or hold arrow keys to rotate.`}
      data-loaded-frames={loaded}
      data-active-frame={activeFrame}
      data-ready={ready}
    >
      {/* Loading Progress */}
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="w-48 h-1 bg-card-border/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent/60 rounded-full transition-all duration-200"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="font-mono text-xs text-muted/60 mt-3 tracking-widest uppercase">
            Loading {pct}%
          </p>
        </div>
      )}

      {/* Transparent Frame Canvas (clean true alpha transparency) */}
      <canvas
        ref={canvasRef}
        className={`
          max-h-[85vh] w-auto object-contain
          cursor-grab active:cursor-grabbing
          pointer-events-auto
          transition-opacity duration-500
          ${ready || loaded > 0 ? "opacity-100" : "opacity-0"}
        `}
        style={{
          touchAction: "pan-y",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragRef.current.active = false;
        }}
      />

      {/* Accessible Arrow Buttons with Press-and-Hold support */}
      {ready && (
        <>
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              startHold(-1);
            }}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30
              w-11 h-11 md:w-13 md:h-13 rounded-full
              bg-card/80 border border-card-border/90 backdrop-blur-md
              text-foreground hover:text-white hover:bg-card
              transition-all duration-200 flex items-center justify-center
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
              hover:scale-105 active:scale-95 shadow-xl pointer-events-auto"
            aria-label="Rotate counter-clockwise (click to step, hold to auto-rotate)"
            title="Click to step, hold to rotate"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              startHold(1);
            }}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30
              w-11 h-11 md:w-13 md:h-13 rounded-full
              bg-card/80 border border-card-border/90 backdrop-blur-md
              text-foreground hover:text-white hover:bg-card
              transition-all duration-200 flex items-center justify-center
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
              hover:scale-105 active:scale-95 shadow-xl pointer-events-auto"
            aria-label="Rotate clockwise (click to step, hold to auto-rotate)"
            title="Click to step, hold to rotate"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

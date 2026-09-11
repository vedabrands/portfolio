"use client";

import { useState } from "react";
import HeroScrubber from "./HeroScrubber";

const HEADLINES = [
  {
    eyebrow: "Hi, I'm Your Name",
    lines: ["Creative", "Developer"],
    fontSize: "text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.75rem] 2xl:text-[6.5rem]",
    lineHeight: "leading-[0.92]",
    tagline: "// Turning Ideas Into Reality",
    desc: "Available for hire. Building fast, responsive web applications using modern tech stacks.",
  },
  {
    eyebrow: "Systems & Architecture",
    lines: ["Scalable", "Systems"],
    fontSize: "text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.75rem] 2xl:text-[6.5rem]",
    lineHeight: "leading-[0.92]",
    tagline: "// High-Performance Engineering",
    desc: "Designing robust data pipelines, scalable cloud infrastructure, and low-latency systems.",
  },
  {
    eyebrow: "Intelligent Interfaces",
    lines: ["AI &", "Vision", "Engineer"],
    fontSize: "text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.75rem] 2xl:text-[5.5rem]",
    lineHeight: "leading-[0.95]",
    tagline: "// Next-Gen AI Applications",
    desc: "Integrating state-of-the-art vision models and generative AI into fluid web experiences.",
  },
];

export default function Hero() {
  const [frameIndex, setFrameIndex] = useState(0);

  // 120 frames total: 3 sectors of 40 frames each
  // Sector 0: frames 100-119 & 0-19 (centered around 0)
  // Sector 1: frames 20-59 (centered around 40)
  // Sector 2: frames 60-99 (centered around 80)
  const activeSector = Math.floor(((frameIndex + 20) % 120) / 40);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden select-none"
    >
      {/* ── BACKGROUND: SUBTLE HERO GRID PATTERN ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 50%, black 25%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 50%, black 25%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      {/* ── TWO-COLUMN HERO GRID CONTAINER ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[calc(100vh-160px)]">
          
          {/* ── LEFT COLUMN: EYEBROW, HEADLINE, CTA BUTTONS, ROTATION HINT (lg:col-span-6) ── */}
          <div className="lg:col-span-6 flex flex-col justify-center gap-6 sm:gap-8 z-20">
            {/* Eyebrow & Display Headline Group (fixed min-h to prevent layout shift) */}
            <div className="grid grid-cols-1 grid-rows-1 min-h-[260px] sm:min-h-[300px] lg:min-h-[340px] xl:min-h-[360px] items-end">
              {HEADLINES.map((hl, i) => (
                <div
                  key={`headline-block-${i}`}
                  className={`col-start-1 row-start-1 flex flex-col justify-end transition-all ${
                    i === activeSector
                      ? "opacity-100 translate-y-0 scale-100 duration-250 delay-100 ease-out visible"
                      : "opacity-0 translate-y-4 scale-[0.98] duration-150 ease-in invisible pointer-events-none"
                  }`}
                >
                  {/* Dynamic Eyebrow label */}
                  <p className="font-mono text-xs md:text-sm text-muted tracking-[0.25em] uppercase mb-3">
                    {hl.eyebrow}
                  </p>

                  {/* Giant Ultra-Bold Display Headline */}
                  <h1
                    className={`font-display font-black ${hl.fontSize} text-foreground uppercase tracking-[0.03em] ${hl.lineHeight}`}
                    style={{
                      WebkitTextStroke: "1px rgba(237, 237, 237, 0.3)",
                    }}
                  >
                    {hl.lines.map((line, lIdx) => (
                      <span key={lIdx} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                </div>
              ))}
            </div>

            {/* Left Column CTA Buttons & Hint */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-full border border-card-border bg-card/90 backdrop-blur-sm text-foreground hover:bg-card hover:border-muted/50 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent shadow-lg"
                >
                  View My Work
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-full bg-accent text-background hover:bg-accent/90 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent shadow-lg"
                >
                  Contact Me
                </a>
              </div>

              {/* Rotation hint & live frame counter */}
              <div className="flex items-center gap-4 text-xs font-mono text-muted tracking-widest uppercase">
                <span>↻ Hover, drag or tap to rotate</span>
                <span className="text-muted/40">•</span>
                <span className="text-accent font-bold" id="hero-frame-counter">
                  {String(frameIndex + 1).padStart(3, "0")} / 120
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: TURNTABLE MODEL PHOTO CANVAS + SUPPORTING DESCRIPTION (lg:col-span-6) ── */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center gap-2 z-20">
            {/* Interactive 3D Turntable Photo Canvas */}
            <div className="w-full flex items-center justify-center">
              <HeroScrubber onFrameChange={setFrameIndex} />
            </div>

            {/* Repositioned Supporting Text Block (centered beneath the photo) */}
            <div className="w-full max-w-md mx-auto grid grid-cols-1 grid-rows-1 min-h-[76px] text-center pt-1">
              {HEADLINES.map((hl, i) => (
                <div
                  key={`desc-${i}`}
                  className={`col-start-1 row-start-1 flex flex-col items-center transition-all ${
                    i === activeSector
                      ? "opacity-100 translate-y-0 duration-200 delay-75 ease-out visible"
                      : "opacity-0 translate-y-2 duration-150 ease-in invisible pointer-events-none"
                  }`}
                >
                  <p className="font-mono text-xs text-muted tracking-[0.18em] uppercase mb-1">
                    {hl.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-sm">
                    {hl.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

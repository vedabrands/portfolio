"use client";

import { useState } from "react";
import HeroScrubber from "./HeroScrubber";

const HEADLINES = [
  {
    eyebrow: "Hi, I'm Your Name",
    line1: "Creative",
    line2: "Developer",
    tagline: "// Turning Ideas Into Reality",
    desc: "Available for hire. Building fast, responsive web applications using modern tech stacks.",
  },
  {
    eyebrow: "Systems & Architecture",
    line1: "Scalable",
    line2: "Systems",
    tagline: "// High-Performance Engineering",
    desc: "Designing robust data pipelines, scalable cloud infrastructure, and low-latency systems.",
  },
  {
    eyebrow: "Intelligent Interfaces",
    line1: "AI & Vision",
    line2: "Engineer",
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
      className="relative min-h-screen flex items-end pb-16 md:pb-24 overflow-hidden select-none"
    >
      {/* ── LAYER 0 (z-0): SUBTLE HERO GRID PATTERN (HERO SECTION ONLY) ── */}
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

      {/* ── LAYER 1 (z-10): HEADLINE TEXT BEHIND THE PERSON SILHOUETTE ── */}
      <div className="absolute inset-0 z-10 flex items-end pb-32 sm:pb-36 md:pb-40 pointer-events-none">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 max-w-4xl">
            {/* Dynamic Eyebrow label — Clean crossfade without ghosting */}
            <div className="grid grid-cols-1 grid-rows-1 h-6 overflow-hidden">
              {HEADLINES.map((hl, i) => (
                <p
                  key={`eyebrow-${i}`}
                  className={`col-start-1 row-start-1 font-mono text-xs md:text-sm text-muted tracking-[0.25em] uppercase transition-all ${
                    i === activeSector
                      ? "opacity-100 translate-y-0 duration-200 delay-75 ease-out visible"
                      : "opacity-0 -translate-y-3 duration-150 ease-in invisible pointer-events-none"
                  }`}
                >
                  {hl.eyebrow}
                </p>
              ))}
            </div>

            {/* Giant Ultra-Bold Display Headline — Clean single-phrase display */}
            <div className="grid grid-cols-1 grid-rows-1 min-h-[160px] sm:min-h-[220px] md:min-h-[280px] lg:min-h-[340px] xl:min-h-[380px]">
              {HEADLINES.map((hl, i) => (
                <h1
                  key={`headline-${i}`}
                  className={`col-start-1 row-start-1 font-display font-black text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11.5rem] text-foreground uppercase tracking-[-0.025em] leading-[0.88] transition-all ${
                    i === activeSector
                      ? "opacity-100 translate-y-0 scale-100 duration-250 delay-100 ease-out visible"
                      : "opacity-0 translate-y-6 scale-[0.97] duration-150 ease-in invisible pointer-events-none"
                  }`}
                  style={{
                    WebkitTextStroke: "1.5px rgba(237, 237, 237, 0.35)",
                  }}
                >
                  {hl.line1}
                  <br />
                  {hl.line2}
                </h1>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── LAYER 2 (z-20): TURNTABLE PERSON SILHOUETTE (IN FRONT OF TEXT) ── */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <HeroScrubber onFrameChange={setFrameIndex} />
      </div>

      {/* ── LAYER 3 (z-30): FOREGROUND CONTROLS (BUTTONS, HINTS, SUPPORTING) ─ */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          {/* Left CTA Buttons & Hint */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 pointer-events-auto">
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
            <div className="flex items-center gap-4 text-xs font-mono text-muted tracking-widest uppercase pointer-events-auto">
              <span>↻ Hover, drag or tap to rotate</span>
              <span className="text-muted/40">•</span>
              <span className="text-accent font-bold" id="hero-frame-counter">
                {String(frameIndex + 1).padStart(3, "0")} / 120
              </span>
            </div>
          </div>

          {/* Right side supporting text — clean crossfade */}
          <div className="max-w-xs grid grid-cols-1 grid-rows-1 min-h-[90px] pointer-events-auto">
            {HEADLINES.map((hl, i) => (
              <div
                key={`desc-${i}`}
                className={`col-start-1 row-start-1 transition-all ${
                  i === activeSector
                    ? "opacity-100 translate-y-0 duration-200 delay-75 ease-out visible"
                    : "opacity-0 translate-y-3 duration-150 ease-in invisible pointer-events-none"
                }`}
              >
                <p className="font-mono text-xs text-muted tracking-[0.15em] uppercase mb-2">
                  {hl.tagline}
                </p>
                <p className="text-sm text-muted leading-relaxed">
                  {hl.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

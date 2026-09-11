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
      className="relative min-h-screen flex flex-col justify-between overflow-hidden select-none"
    >
      {/* ── LAYER 1 (z-10): HEADLINE TEXT BEHIND THE PERSON SILHOUETTE ── */}
      <div className="absolute inset-0 z-10 flex items-center pointer-events-none">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
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

            {/* Giant Display Headline — Proportional clamp scaling & increased line spacing */}
            <div className="grid grid-cols-1 grid-rows-1 min-h-[140px] sm:min-h-[180px] md:min-h-[220px] lg:min-h-[260px]">
              {HEADLINES.map((hl, i) => (
                <h1
                  key={`headline-${i}`}
                  className={`col-start-1 row-start-1 font-display font-black text-foreground uppercase tracking-[-0.04em] leading-[0.94] transition-all ${
                    i === activeSector
                      ? "opacity-100 translate-y-0 scale-100 duration-250 delay-100 ease-out visible"
                      : "opacity-0 translate-y-6 scale-[0.97] duration-150 ease-in invisible pointer-events-none"
                  }`}
                  style={{
                    fontSize: "clamp(3rem, 5.2vw + 1.8vh, 6.25rem)",
                    WebkitTextStroke: "1px rgba(237, 237, 237, 0.3)",
                  }}
                >
                  <span className="block mb-1">{hl.line1}</span>
                  <span className="block">{hl.line2}</span>
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

      {/* ── LAYER 3 (z-30): TOP-RIGHT SUPPORTING TEXT BLOCK ─────────────── */}
      <div className="hidden sm:block absolute top-20 sm:top-24 md:top-28 right-4 sm:right-6 lg:right-8 z-30 max-w-[260px] sm:max-w-[280px] md:max-w-xs pointer-events-auto text-right md:text-left">
        <div className="grid grid-cols-1 grid-rows-1 min-h-[80px]">
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
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {hl.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── LAYER 3 (z-30): BOTTOM-LEFT FOREGROUND CONTROLS (BUTTONS & HINT) ─ */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 md:pb-14 mt-auto pointer-events-none">
        <div className="flex flex-col gap-4 max-w-md">
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
      </div>
    </section>
  );
}

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

const TECH_STACK = [
  {
    name: "React",
    icon: (
      <svg className="w-4 h-4" viewBox="-11.5 -10.23174 23 20.46348" fill="none" stroke="currentColor">
        <circle cx="0" cy="0" r="2.05" fill="currentColor" stroke="none" />
        <g stroke="currentColor" strokeWidth="1">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: "Next.js",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5zm4.8 14.8l-5.6-7.3v7.3H9.7V7.7h1.5l5.6 7.4V7.7h1.5v8.6h-1.5z" />
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.975 12 6.001 12z" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5L3.5 7.4v9.8L12 22.1l8.5-4.9V7.4L12 2.5zm0 2.2l6.6 3.8v7.6L12 19.9l-6.6-3.8V8.5L12 4.7zm-1.8 5.6v4.8h1.8v-3.2l2.4 3.2h1.8v-4.8h-1.8v3.1l-2.4-3.1h-1.8z" />
      </svg>
    ),
  },
  {
    name: "Python",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.91 2c-5.07 0-4.75 2.2-4.75 2.2l.01 2.28h4.82v.69H5.16S2 6.8 2 11.89c0 5.08 2.75 4.9 2.75 4.9h1.64v-2.31s-.09-2.75 2.71-2.75h4.68s2.61.04 2.61-2.55V4.65S16.98 2 11.91 2zm-2.58 1.48c.47 0 .85.38.85.85s-.38.85-.85.85-.85-.38-.85-.85.38-.85.85-.85zm2.76 18.52c5.07 0 4.75-2.2 4.75-2.2l-.01-2.28h-4.82v-.69h6.83S22 17.2 22 12.11c0-5.08-2.75-4.9-2.75-4.9h-1.64v2.31s.09 2.75-2.71 2.75h-4.68s-2.61-.04-2.61 2.55v4.53s-.59 2.65 4.48 2.65zm2.58-1.48c-.47 0-.85-.38-.85-.85s.38-.85.85-.85.85.38.85.85-.38.85-.85.85z" />
      </svg>
    ),
  },
  {
    name: "Docker",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.8 10.4c-.3-.2-1.2-.4-2.3-.1-.3-.7-.7-1.4-1.3-1.9l-.6-.4-.4.6c-.5.8-.7 1.8-.5 2.7-.8.5-1.9.7-3.1.8H1.3c-.3 1.4.1 2.9.9 4.1 1.6 2.3 4.3 3.8 7.3 3.8 6.4 0 11.7-4.4 12.6-10.4l.7-.8v-.5zm-14.7.1H6.3V8.7h1.8v1.8zm2.6 0H8.9V8.7h1.8v1.8zm2.6 0h-1.8V8.7h1.8v1.8zm2.6 0h-1.8V8.7h1.8v1.8zm-5.2-2.6H8.9V6.1h1.8v1.8zm2.6 0h-1.8V6.1h1.8v1.8zm2.6 0h-1.8V6.1h1.8v1.8z" />
      </svg>
    ),
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
          
          {/* ── LEFT COLUMN: TECH STACK, EYEBROW, HEADLINE, CTA BUTTONS, ROTATION HINT (lg:col-span-6) ── */}
          <div className="lg:col-span-6 flex flex-col justify-center gap-6 sm:gap-7 z-20">
            {/* Tech Stack Icon Row */}
            <div className="flex flex-col gap-2.5">
              <p className="font-mono text-xs text-muted/60 tracking-[0.2em] uppercase">
                {"// Tech Stack"}
              </p>
              <div className="flex items-center gap-2 sm:gap-2.5">
                {TECH_STACK.map((tech) => (
                  <div
                    key={tech.name}
                    title={tech.name}
                    className="w-9 h-9 rounded-lg bg-card/50 border border-card-border/50 flex items-center justify-center text-muted/50 hover:text-foreground hover:bg-card hover:border-card-border/90 hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-default group"
                  >
                    <span className="sr-only">{tech.name}</span>
                    {tech.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Eyebrow & Display Headline Group */}
            <div className="grid grid-cols-1 grid-rows-1 min-h-[190px] sm:min-h-[220px] lg:min-h-[250px] xl:min-h-[270px] items-start">
              {HEADLINES.map((hl, i) => (
                <div
                  key={`headline-block-${i}`}
                  className={`col-start-1 row-start-1 flex flex-col justify-start transition-all ${
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
            <div className="flex flex-col gap-4 mt-1 sm:mt-2">
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

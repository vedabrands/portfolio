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

interface ClusterItem {
  name: string;
  icon: React.ReactNode;
  offsetY: string;
  rot: string;
  animClass: string;
  delay: string;
}

interface ClusterSet {
  label: string;
  items: ClusterItem[];
}

const CLUSTER_SETS: ClusterSet[] = [
  // Sector 0: CREATIVE DEVELOPER (Design & Creative Tools)
  {
    label: "// Design & Creative Toolkit",
    items: [
      {
        name: "Figma",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm-4-4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zm8-4h4a4 4 0 1 1 0 8h-4V4zM4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zm0 8a4 4 0 0 1 4-4h4v4a4 4 0 0 1-4 4 4 4 0 0 1-4-4z" />
          </svg>
        ),
        offsetY: "-mt-1.5",
        rot: "-rotate-3",
        animClass: "anim-float-1",
        delay: "0s",
      },
      {
        name: "Framer",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
          </svg>
        ),
        offsetY: "mt-2.5",
        rot: "rotate-2",
        animClass: "anim-float-2",
        delay: "0.6s",
      },
      {
        name: "Photoshop",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.3 11.8H8.2V7.2h2.5c1.8 0 2.8.9 2.8 2.3 0 1.4-1 2.3-2.8 2.3H9.7v3zm6 0h-1.6l-.1-.9c-.5.7-1.3 1-2.1 1-1.3 0-2.1-.8-2.1-2.2 0-1.7 1.3-2.3 3.8-2.5v-.3c0-.6-.4-.9-1.2-.9-.7 0-1.4.3-1.9.7l-.6-1c.8-.6 1.8-.9 2.9-.9 2 0 2.8.9 2.8 2.5v4.5zm-4.3-5.3c-1.4.1-2.1.4-2.1 1.3 0 .7.4 1.1 1.2 1.1.7 0 1.4-.4 1.7-.9l.1-.3v-1.2h-.9zM9.7 10.5h.9c.8 0 1.3-.4 1.3-1 0-.6-.5-1-1.3-1h-.9v2z" />
          </svg>
        ),
        offsetY: "-mt-2",
        rot: "-rotate-2",
        animClass: "anim-float-3",
        delay: "1.2s",
      },
      {
        name: "Blender",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="14" r="3" />
            <path d="M12 9a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9.8-9.8l-4 2.3c-.4-.5-.9-1-1.4-1.3l2.8-4.2a1 1 0 0 0-.3-1.4 1 1 0 0 0-1.4.3L14.7 9c-.6-.2-1.3-.3-2-.3a8 8 0 0 0-4.8 1.6L4.2 8a1 1 0 0 0-1.4.3 1 1 0 0 0 .3 1.4l4 2.3A8 8 0 1 0 21.8 7.2z" />
          </svg>
        ),
        offsetY: "mt-3",
        rot: "rotate-3",
        animClass: "anim-float-1",
        delay: "1.8s",
      },
      {
        name: "Three.js",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        ),
        offsetY: "-mt-1",
        rot: "-rotate-1",
        animClass: "anim-float-2",
        delay: "2.4s",
      },
      {
        name: "GSAP",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-4v-2h4v2zm2-4h-6v-2h6v2zm2-4h-8V6.5h8V8.5z" />
          </svg>
        ),
        offsetY: "mt-1.5",
        rot: "rotate-2",
        animClass: "anim-float-3",
        delay: "3.0s",
      },
      {
        name: "v0 by Vercel",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 5h4l4 9 4-9h4l-6 14H10L4 5zm14 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          </svg>
        ),
        offsetY: "-mt-2",
        rot: "-rotate-3",
        animClass: "anim-float-1",
        delay: "3.6s",
      },
    ],
  },
  // Sector 1: SCALABLE SYSTEMS (Modern Web & Systems Engineering Stack)
  {
    label: "// Scalable Systems & Architecture",
    items: [
      {
        name: "React",
        icon: (
          <svg className="w-5 h-5" viewBox="-11.5 -10.23174 23 20.46348" fill="none" stroke="currentColor">
            <circle cx="0" cy="0" r="2.05" fill="currentColor" stroke="none" />
            <g stroke="currentColor" strokeWidth="1">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        ),
        offsetY: "-mt-1",
        rot: "-rotate-2",
        animClass: "anim-float-1",
        delay: "0.2s",
      },
      {
        name: "Next.js",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5zm4.8 14.8l-5.6-7.3v7.3H9.7V7.7h1.5l5.6 7.4V7.7h1.5v8.6h-1.5z" />
          </svg>
        ),
        offsetY: "mt-2.5",
        rot: "rotate-3",
        animClass: "anim-float-2",
        delay: "0.8s",
      },
      {
        name: "Tailwind CSS",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.975 12 6.001 12z" />
          </svg>
        ),
        offsetY: "-mt-2",
        rot: "-rotate-3",
        animClass: "anim-float-3",
        delay: "1.4s",
      },
      {
        name: "Node.js",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.5L3.5 7.4v9.8L12 22.1l8.5-4.9V7.4L12 2.5zm0 2.2l6.6 3.8v7.6L12 19.9l-6.6-3.8V8.5L12 4.7zm-1.8 5.6v4.8h1.8v-3.2l2.4 3.2h1.8v-4.8h-1.8v3.1l-2.4-3.1h-1.8z" />
          </svg>
        ),
        offsetY: "mt-3",
        rot: "rotate-2",
        animClass: "anim-float-1",
        delay: "2.0s",
      },
      {
        name: "Docker",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.8 10.4c-.3-.2-1.2-.4-2.3-.1-.3-.7-.7-1.4-1.3-1.9l-.6-.4-.4.6c-.5.8-.7 1.8-.5 2.7-.8.5-1.9.7-3.1.8H1.3c-.3 1.4.1 2.9.9 4.1 1.6 2.3 4.3 3.8 7.3 3.8 6.4 0 11.7-4.4 12.6-10.4l.7-.8v-.5zm-14.7.1H6.3V8.7h1.8v1.8zm2.6 0H8.9V8.7h1.8v1.8zm2.6 0h-1.8V8.7h1.8v1.8zm2.6 0h-1.8V8.7h1.8v1.8zm-5.2-2.6H8.9V6.1h1.8v1.8zm2.6 0h-1.8V6.1h1.8v1.8zm2.6 0h-1.8V6.1h1.8v1.8z" />
          </svg>
        ),
        offsetY: "-mt-1.5",
        rot: "-rotate-2",
        animClass: "anim-float-2",
        delay: "2.6s",
      },
      {
        name: "PostgreSQL",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93V17c-.6.04-1.2.07-1.8.07-2.6 0-4.2-1.3-4.2-3.4 0-1.8 1.2-3.1 3-3.5-.1-.3-.1-.7-.1-1 0-2.3 1.6-4.1 4-4.1 1.5 0 2.7.7 3.3 1.8l-1.3.9c-.4-.7-1.1-1.1-2-1.1-1.4 0-2.3 1.1-2.3 2.5 0 .3 0 .6.1.9h2.3v1.6h-2.1c-.2.5-.3 1-.3 1.6 0 1.5.9 2.3 2.5 2.3.6 0 1.2-.1 1.8-.2v1.5c-.6.2-1.2.3-1.9.3-1.6 0-2.7-.4-3.5-1.2l-1.1 1.2c1.1 1.1 2.7 1.6 4.7 1.6v.93z" />
          </svg>
        ),
        offsetY: "mt-1",
        rot: "rotate-3",
        animClass: "anim-float-3",
        delay: "3.2s",
      },
      {
        name: "Supabase",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.362 9.354H12V.3a.3.3 0 0 0-.535-.192L.223 14.288a.3.3 0 0 0 .23.498H12v9.054a.3.3 0 0 0 .535.192l11.242-14.18a.3.3 0 0 0-.23-.498z" />
          </svg>
        ),
        offsetY: "-mt-2",
        rot: "-rotate-1",
        animClass: "anim-float-1",
        delay: "3.8s",
      },
    ],
  },
  // Sector 2: AI & VISION ENGINEER (Frontier AI, Vision & Code Intelligence)
  {
    label: "// Frontier AI & Vision Intelligence",
    items: [
      {
        name: "Claude",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 2h-3v5.2l-3.7-3.7-2.1 2.1 3.7 3.7H3.2v3h5.2l-3.7 3.7 2.1 2.1 3.7-3.7V22h3v-5.2l3.7 3.7 2.1-2.1-3.7-3.7h5.2v-3h-5.2l3.7-3.7-2.1-2.1-3.7 3.7V2z" />
          </svg>
        ),
        offsetY: "-mt-2",
        rot: "-rotate-3",
        animClass: "anim-float-1",
        delay: "0.1s",
      },
      {
        name: "Gemini",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
          </svg>
        ),
        offsetY: "mt-2.5",
        rot: "rotate-2",
        animClass: "anim-float-2",
        delay: "0.7s",
      },
      {
        name: "ChatGPT",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.5 10.5a4.3 4.3 0 0 0-.4-3.5 4.5 4.5 0 0 0-4.3-2.2 4.4 4.4 0 0 0-3.3-1.5 4.5 4.5 0 0 0-4.3 3.1 4.4 4.4 0 0 0-3 2.1 4.5 4.5 0 0 0 .5 4.8 4.3 4.3 0 0 0 .4 3.5 4.5 4.5 0 0 0 4.3 2.2 4.4 4.4 0 0 0 3.3 1.5 4.5 4.5 0 0 0 4.3-3.1 4.4 4.4 0 0 0 3-2.1 4.5 4.5 0 0 0-.5-4.8z" />
            <path d="M12 7.5v9M8 10l8 4M8 14l8-4" />
          </svg>
        ),
        offsetY: "-mt-1",
        rot: "-rotate-2",
        animClass: "anim-float-3",
        delay: "1.3s",
      },
      {
        name: "DeepSeek",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-3 0-5.5-2.2-5.5-5 0-1.8 1-3.4 2.5-4.3l1.1 1.8c-.9.5-1.6 1.4-1.6 2.5 0 1.7 1.6 3 3.5 3s3.5-1.3 3.5-3c0-1.1-.7-2-1.6-2.5l1.1-1.8c1.5.9 2.5 2.5 2.5 4.3 0 2.8-2.5 5-5.5 5z" />
          </svg>
        ),
        offsetY: "mt-3",
        rot: "rotate-4",
        animClass: "anim-float-1",
        delay: "1.9s",
      },
      {
        name: "Perplexity",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
          </svg>
        ),
        offsetY: "-mt-2",
        rot: "-rotate-1",
        animClass: "anim-float-2",
        delay: "2.5s",
      },
      {
        name: "Cursor",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l9 5.2v10.4l-9 5.2-9-5.2V7.2L12 2zm0 2.4L5.2 8.3 12 12.2l6.8-3.9L12 4.4zm7 5.2l-6 3.5v7.7l6-3.5V9.6zm-8 11.2v-7.7l-6-3.5v7.7l6 3.5z" />
          </svg>
        ),
        offsetY: "mt-1",
        rot: "rotate-2",
        animClass: "anim-float-3",
        delay: "3.1s",
      },
      {
        name: "Antigravity",
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3.5" fill="currentColor" />
            <ellipse cx="12" cy="12" rx="9" ry="4" strokeLinecap="round" transform="rotate(-25 12 12)" />
            <path d="M12 3v3M12 18v3" strokeLinecap="round" />
          </svg>
        ),
        offsetY: "-mt-1",
        rot: "-rotate-3",
        animClass: "anim-float-1",
        delay: "3.7s",
      },
    ],
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
            {/* Dynamic Floating Tech Stack Cluster */}
            <div className="grid grid-cols-1 grid-rows-1 min-h-[95px] sm:min-h-[105px] items-center mb-1">
              {CLUSTER_SETS.map((cluster, i) => (
                <div
                  key={`cluster-${i}`}
                  className={`col-start-1 row-start-1 flex flex-col gap-2 transition-all duration-300 ${
                    i === activeSector
                      ? "opacity-100 translate-y-0 scale-100 visible pointer-events-auto"
                      : "opacity-0 -translate-y-2 scale-95 invisible pointer-events-none"
                  }`}
                >
                  <p className="font-mono text-xs text-muted/60 tracking-[0.2em] uppercase">
                    {cluster.label}
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 py-1">
                    {cluster.items.map((item) => (
                      <div
                        key={item.name}
                        style={{ animationDelay: item.delay }}
                        className={`cluster-wrapper ${item.animClass} ${item.offsetY}`}
                      >
                        <div
                          title={item.name}
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-card/60 border border-card-border/70 backdrop-blur-sm flex items-center justify-center text-muted/60 cluster-icon shadow-sm cursor-pointer ${item.rot}`}
                        >
                          <span className="sr-only">{item.name}</span>
                          {item.icon}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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

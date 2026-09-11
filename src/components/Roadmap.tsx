"use client";

import { useEffect, useRef, useState } from "react";

const roadmapCards = [
  {
    id: "01",
    title: "Frontend Development",
    description: "Architecting responsive, high-performance UI components.",
    tech: "React & Tailwind",
  },
  {
    id: "02",
    title: "Backend Development",
    description: "Building secure REST APIs and robust data pipelines.",
    tech: "Node.js & Databases",
  },
  {
    id: "03",
    title: "AI & Machine Learning",
    description: "Integrating intelligent models and automated workflows.",
    tech: "Generative AI & LLMs",
  },
  {
    id: "04",
    title: "Cloud & Deployment",
    description: "Containerizing systems and ensuring seamless production.",
    tech: "Docker & CI/CD",
  },
];

export default function Roadmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);

  const [pathD, setPathD] = useState<string>("");
  const [dotPos, setDotPos] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });
  const [activeDotCard, setActiveDotCard] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Measure card positions and generate the smooth connecting wave path
  const updateWavePath = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const points: { x: number; y: number }[] = [];

    cardRefs.current.forEach((card) => {
      if (card) {
        const r = card.getBoundingClientRect();
        points.push({
          x: r.left - containerRect.left + r.width / 2,
          y: r.top - containerRect.top + r.height / 2,
        });
      }
    });

    if (points.length === 4) {
      const [p0, p1, p2, p3] = points;
      const dx01 = p1.x - p0.x;
      const dx12 = p2.x - p1.x;
      const dx23 = p3.x - p2.x;

      const d = `M ${p0.x} ${p0.y} C ${p0.x + dx01 * 0.5} ${p0.y}, ${p1.x - dx01 * 0.5} ${p1.y}, ${p1.x} ${p1.y} C ${p1.x + dx12 * 0.5} ${p1.y}, ${p2.x - dx12 * 0.5} ${p2.y}, ${p2.x} ${p2.y} C ${p2.x + dx23 * 0.5} ${p2.y}, ${p3.x - dx23 * 0.5} ${p3.y}, ${p3.x} ${p3.y}`;
      setPathD(d);
    }
  };

  useEffect(() => {
    updateWavePath();
    window.addEventListener("resize", updateWavePath);
    return () => window.removeEventListener("resize", updateWavePath);
  }, []);

  // Moving dot loop & auto-highlight synchronization
  useEffect(() => {
    let animId: number;
    let startTime: number | null = null;
    const DURATION = 9000; // 9s total loop (~2.4s per segment + reset)

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % DURATION;
      const pathEl = pathRef.current;

      if (pathEl && pathEl.getTotalLength) {
        const totalLen = pathEl.getTotalLength();
        if (totalLen > 0) {
          // 0 to 7400ms: travels forward from Card 1 to Card 4
          // 7400 to 8200ms: holds at Card 4 & fades out
          // 8200 to 8600ms: moves to start while hidden
          // 8600 to 9000ms: fades in at Card 1
          if (elapsed < 7400) {
            const travelProgress = elapsed / 7400;
            const pt = pathEl.getPointAtLength(travelProgress * totalLen);
            setDotPos({ x: pt.x, y: pt.y, opacity: 1 });

            // Auto-highlight card based on progress
            if (travelProgress < 0.14) {
              setActiveDotCard(0);
            } else if (travelProgress >= 0.26 && travelProgress <= 0.42) {
              setActiveDotCard(1);
            } else if (travelProgress >= 0.58 && travelProgress <= 0.74) {
              setActiveDotCard(2);
            } else if (travelProgress >= 0.88) {
              setActiveDotCard(3);
            } else {
              setActiveDotCard(null);
            }
          } else if (elapsed < 8200) {
            // Fade out at card 4
            const pt = pathEl.getPointAtLength(totalLen);
            const fade = 1 - (elapsed - 7400) / 800;
            setDotPos({ x: pt.x, y: pt.y, opacity: Math.max(0, fade) });
            setActiveDotCard(3);
          } else {
            // Reset to card 1
            const pt = pathEl.getPointAtLength(0);
            const fadeIn = (elapsed - 8200) / 800;
            setDotPos({ x: pt.x, y: pt.y, opacity: Math.min(1, fadeIn) });
            setActiveDotCard(0);
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section id="roadmap" className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <p className="font-mono text-xs text-muted tracking-[0.2em] uppercase mb-4">
            {"// Engineering Roadmap"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
            Core Execution Root Map
          </h2>
        </div>

        {/* Roadmap Staggered Wave Container */}
        <div ref={containerRef} className="relative pb-12 lg:pb-24">
          {/* Connecting SVG Curved Wave Path & Moving Glowing Dot */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D9A441" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#F5CD79" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#D9A441" stopOpacity="0.35" />
              </linearGradient>
              <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background dashed guide line */}
            {pathD && (
              <>
                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(217, 164, 65, 0.15)"
                  strokeWidth="3"
                />
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#waveGradient)"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  className="opacity-70"
                />
              </>
            )}

            {/* Hidden path for getPointAtLength measurements */}
            {pathD && (
              <path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke="transparent"
                strokeWidth="1"
              />
            )}

            {/* Glowing Traveling Dot */}
            {dotPos.opacity > 0 && (
              <g
                transform={`translate(${dotPos.x}, ${dotPos.y})`}
                opacity={dotPos.opacity}
                className="transition-opacity duration-150"
              >
                {/* Large outer pulse halo */}
                <circle
                  r="16"
                  fill="rgba(217, 164, 65, 0.25)"
                  className="animate-ping origin-center"
                />
                {/* Outer warm glow */}
                <circle
                  r="12"
                  fill="rgba(217, 164, 65, 0.45)"
                  filter="url(#dotGlow)"
                />
                {/* Inner bright core */}
                <circle r="5" fill="#FFF4D0" />
              </g>
            )}
          </svg>

          {/* Staggered Wave Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {roadmapCards.map((card, idx) => {
              const isEven = idx % 2 === 1; // Cards 1 and 3 (0-indexed) are lower
              const isActive = hoveredCard === idx || activeDotCard === idx;

              return (
                <div
                  key={card.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group relative bg-gradient-to-b from-[#18181b] to-[#111113] border rounded-2xl p-7 flex flex-col justify-between min-h-[260px] overflow-hidden cursor-pointer transition-all duration-500 ease-out transform ${
                    isEven ? "lg:translate-y-16" : "lg:translate-y-0"
                  } ${
                    isActive
                      ? "scale-[1.04] z-30 border-accent/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_32px_rgba(217,164,65,0.25),0_12px_28px_rgba(0,0,0,0.5)]"
                      : "border-card-border/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_4px_12px_rgba(0,0,0,0.35)]"
                  }`}
                >
                  {/* Diagonal Color Sweep Overlay (Sweeps from Top-Left Corner across the card) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                    <div
                      className={`absolute -inset-[80%] transition-all duration-700 ease-out ${
                        isActive
                          ? "scale-100 opacity-100 translate-x-0 translate-y-0"
                          : "scale-0 opacity-0 -translate-x-16 -translate-y-16"
                      }`}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(217, 164, 65, 0.32) 0%, rgba(217, 164, 65, 0.16) 40%, rgba(217, 164, 65, 0.04) 75%, transparent 100%)",
                        transformOrigin: "top left",
                      }}
                    />
                  </div>

                  {/* Card Content (Relative z-10 so text stays super crisp above sweep) */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <p
                        className={`font-mono text-xs tracking-wider transition-colors duration-300 ${
                          isActive ? "text-accent font-semibold" : "text-muted"
                        }`}
                      >
                        {"// ROOT "}{card.id}
                      </p>
                      {/* Active indicator dot on card */}
                      <span
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-accent scale-125 shadow-[0_0_8px_#D9A441]"
                            : "bg-card-border"
                        }`}
                      />
                    </div>

                    <h3
                      className={`font-display text-xl mb-3 tracking-tight transition-all duration-300 ${
                        isActive
                          ? "text-[#F5CD79] drop-shadow-[0_0_10px_rgba(217,164,65,0.4)]"
                          : "text-foreground"
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6">
                    <span
                      className={`inline-block px-3.5 py-1.5 font-mono text-xs rounded-full border transition-all duration-300 ${
                        isActive
                          ? "bg-accent/15 border-accent/60 text-[#EDEDED] shadow-[0_0_12px_rgba(217,164,65,0.2)]"
                          : "bg-background/80 border-card-border text-muted"
                      }`}
                    >
                      {card.tech}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


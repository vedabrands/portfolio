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

// Imperfect organic vertical offset and subtle tilts matching the hand-drawn flow sketch
const cardLayout = [
  {
    offsetClass: "lg:translate-y-2",
    rotationClass: "lg:-rotate-2",
  },
  {
    offsetClass: "lg:translate-y-28",
    rotationClass: "lg:rotate-[2.5deg]",
  },
  {
    offsetClass: "lg:-translate-y-2",
    rotationClass: "lg:-rotate-[1.5deg]",
  },
  {
    offsetClass: "lg:translate-y-36",
    rotationClass: "lg:rotate-[2deg]",
  },
];

interface Point {
  x: number;
  y: number;
}

interface SegmentData {
  d: string;
  start: Point;
  end: Point;
}

export default function Roadmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const segRefs = useRef<(SVGPathElement | null)[]>([]);

  const [segments, setSegments] = useState<SegmentData[]>([]);
  const [dotPos, setDotPos] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });
  const [activeDotCard, setActiveDotCard] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Measure card boundary points and generate the sweeping curved wave paths
  const updateWavePath = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const cardBoxes: { lx: number; rx: number; cy: number }[] = [];

    cardRefs.current.forEach((card) => {
      if (card) {
        const r = card.getBoundingClientRect();
        cardBoxes.push({
          lx: r.left - containerRect.left,
          rx: r.right - containerRect.left,
          cy: r.top - containerRect.top + r.height / 2,
        });
      }
    });

    if (cardBoxes.length === 4) {
      const [c0, c1, c2, c3] = cardBoxes;
      const newSegments: SegmentData[] = [];

      // Segment 0 -> 1: Card 1 (high) to Card 2 (low) — dips down into a sweeping valley before rising into Card 2
      const dx01 = c1.lx - c0.rx;
      const dy01 = c1.cy - c0.cy;
      const cp0A = { x: c0.rx + dx01 * 0.45, y: c0.cy + dy01 * 0.15 };
      const cp0B = { x: c1.lx - dx01 * 0.35, y: c1.cy + 38 }; // sweeps into a deep valley trough
      const d0 = `M ${c0.rx} ${c0.cy} C ${cp0A.x} ${cp0A.y}, ${cp0B.x} ${cp0B.y}, ${c1.lx} ${c1.cy}`;
      newSegments.push({
        d: d0,
        start: { x: c0.rx, y: c0.cy },
        end: { x: c1.lx, y: c1.cy },
      });

      // Segment 1 -> 2: Card 2 (low) to Card 3 (high) — crests UP over a high arc before descending into Card 3
      const dx12 = c2.lx - c1.rx;
      const cp1A = { x: c1.rx + dx12 * 0.35, y: c1.cy - (c1.cy - c2.cy) * 0.3 - 48 };
      const cp1B = { x: c2.lx - dx12 * 0.45, y: c2.cy - 52 }; // high crest wave above the cards
      const d1 = `M ${c1.rx} ${c1.cy} C ${cp1A.x} ${cp1A.y}, ${cp1B.x} ${cp1B.y}, ${c2.lx} ${c2.cy}`;
      newSegments.push({
        d: d1,
        start: { x: c1.rx, y: c1.cy },
        end: { x: c2.lx, y: c2.cy },
      });

      // Segment 2 -> 3: Card 3 (high) to Card 4 (lowest) — cascading long graceful S-curve slide
      const dx23 = c3.lx - c2.rx;
      const cp2A = { x: c2.rx + dx23 * 0.48, y: c2.cy + 25 };
      const cp2B = { x: c3.lx - dx23 * 0.38, y: c3.cy - 45 };
      const d2 = `M ${c2.rx} ${c2.cy} C ${cp2A.x} ${cp2A.y}, ${cp2B.x} ${cp2B.y}, ${c3.lx} ${c3.cy}`;
      newSegments.push({
        d: d2,
        start: { x: c2.rx, y: c2.cy },
        end: { x: c3.lx, y: c3.cy },
      });

      setSegments(newSegments);
    }
  };

  useEffect(() => {
    updateWavePath();
    window.addEventListener("resize", updateWavePath);
    return () => window.removeEventListener("resize", updateWavePath);
  }, []);

  // Moving dot loop & auto-highlight synchronization (slow, deliberate glide pace)
  useEffect(() => {
    let animId: number;
    let startTime: number | null = null;

    // Timeline durations:
    // 8000ms travel per segment = ~8.0s slow glide across each sweeping connector
    // 1600ms dwell per card = steady arrival activation
    // Total cycle = 1600 (card 0) + 8000 (seg 0) + 1600 (card 1) + 8000 (seg 1) + 1600 (card 2) + 8000 (seg 2) + 2000 (card 3) + 1400 (fade/reset) = ~32.2s
    const T_DWELL = 1600;
    const T_TRAVEL = 8000;
    const T_FINAL = 2000;
    const T_FADE = 1400;

    const t0 = 0;
    const t1 = t0 + T_DWELL; // 1600: start seg 0
    const t2 = t1 + T_TRAVEL; // 9600: arrive card 1
    const t3 = t2 + T_DWELL; // 11200: start seg 1
    const t4 = t3 + T_TRAVEL; // 19200: arrive card 2
    const t5 = t4 + T_DWELL; // 20800: start seg 2
    const t6 = t5 + T_TRAVEL; // 28800: arrive card 3
    const t7 = t6 + T_FINAL; // 30800: start fade out
    const TOTAL_CYCLE = t7 + T_FADE; // 32200ms

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % TOTAL_CYCLE;

      if (segments.length === 3) {
        if (elapsed < t1) {
          // Card 0 dwell: dot sits at start of segment 0 (right edge of Card 1)
          const pt = segments[0].start;
          setDotPos({ x: pt.x, y: pt.y, opacity: 1 });
          setActiveDotCard(0);
        } else if (elapsed < t2) {
          // Segment 0 travel: Card 1 to Card 2
          const segEl = segRefs.current[0];
          if (segEl && segEl.getTotalLength) {
            const progress = (elapsed - t1) / T_TRAVEL;
            const pt = segEl.getPointAtLength(progress * segEl.getTotalLength());
            setDotPos({ x: pt.x, y: pt.y, opacity: 1 });
            setActiveDotCard(progress > 0.88 ? 1 : null);
          }
        } else if (elapsed < t3) {
          // Card 1 dwell: dot sits at end of segment 0 / start of segment 1
          const pt = segments[0].end;
          setDotPos({ x: pt.x, y: pt.y, opacity: 1 });
          setActiveDotCard(1);
        } else if (elapsed < t4) {
          // Segment 1 travel: Card 2 to Card 3
          const segEl = segRefs.current[1];
          if (segEl && segEl.getTotalLength) {
            const progress = (elapsed - t3) / T_TRAVEL;
            const pt = segEl.getPointAtLength(progress * segEl.getTotalLength());
            setDotPos({ x: pt.x, y: pt.y, opacity: 1 });
            setActiveDotCard(progress > 0.88 ? 2 : null);
          }
        } else if (elapsed < t5) {
          // Card 2 dwell: dot sits at end of segment 1 / start of segment 2
          const pt = segments[1].end;
          setDotPos({ x: pt.x, y: pt.y, opacity: 1 });
          setActiveDotCard(2);
        } else if (elapsed < t6) {
          // Segment 2 travel: Card 3 to Card 4
          const segEl = segRefs.current[2];
          if (segEl && segEl.getTotalLength) {
            const progress = (elapsed - t5) / T_TRAVEL;
            const pt = segEl.getPointAtLength(progress * segEl.getTotalLength());
            setDotPos({ x: pt.x, y: pt.y, opacity: 1 });
            setActiveDotCard(progress > 0.88 ? 3 : null);
          }
        } else if (elapsed < t7) {
          // Card 3 dwell: dot sits at end of segment 2 (entrance of Card 4)
          const pt = segments[2].end;
          setDotPos({ x: pt.x, y: pt.y, opacity: 1 });
          setActiveDotCard(3);
        } else {
          // Fade out and cycle back to Card 0
          const fadeProgress = (elapsed - t7) / T_FADE;
          const pt = segments[2].end;
          setDotPos({ x: pt.x, y: pt.y, opacity: Math.max(0, 1 - fadeProgress * 1.8) });
          setActiveDotCard(3);
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [segments]);

  return (
    <section id="roadmap" className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="text-center mb-16 md:mb-24">
          <p className="font-mono text-xs text-muted tracking-[0.2em] uppercase mb-4">
            {"// Engineering Roadmap"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
            Core Execution Root Map
          </h2>
        </div>

        {/* Roadmap Staggered Wave Container */}
        <div ref={containerRef} className="relative pb-24 lg:pb-48">
          {/* Connecting SVG Curved Wave Path & Moving Glowing Dot */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block overflow-visible"
            aria-hidden="true"
          >
            <defs>
              {/* Solid Rich Gold/Amber Core Gradient */}
              <linearGradient id="solidWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D9A441" stopOpacity="0.5" />
                <stop offset="30%" stopColor="#F5CD79" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#F5CD79" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#D9A441" stopOpacity="0.5" />
              </linearGradient>

              {/* Soft Luminous Line Blur Filter */}
              <filter id="lineGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Dot Glow Halo Filter */}
              <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Hidden paths for getPointAtLength measurements */}
            {segments.map((seg, sIdx) => (
              <path
                key={`meas-${sIdx}`}
                ref={(el) => {
                  segRefs.current[sIdx] = el;
                }}
                d={seg.d}
                fill="none"
                stroke="transparent"
                strokeWidth="1"
              />
            ))}

            {/* Solid, Subtly Glowing Wave Connectors (Not Dashed!) */}
            {segments.map((seg, sIdx) => (
              <g key={`vis-${sIdx}`}>
                {/* 1. Deep ambient glow stroke */}
                <path
                  d={seg.d}
                  fill="none"
                  stroke="rgba(217, 164, 65, 0.16)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                {/* 2. Soft luminous aura */}
                <path
                  d={seg.d}
                  fill="none"
                  stroke="rgba(245, 205, 121, 0.35)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#lineGlow)"
                />
                {/* 3. Solid crisp gold core */}
                <path
                  d={seg.d}
                  fill="none"
                  stroke="url(#solidWaveGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Subtle terminal node anchors where line touches card edges */}
                <circle cx={seg.start.x} cy={seg.start.y} r="3" fill="#D9A441" />
                <circle cx={seg.end.x} cy={seg.end.y} r="3" fill="#F5CD79" />
              </g>
            ))}

            {/* Glowing Traveling Dot */}
            {dotPos.opacity > 0 && (
              <g
                transform={`translate(${dotPos.x}, ${dotPos.y})`}
                opacity={dotPos.opacity}
                className="transition-opacity duration-200"
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

          {/* Staggered "Imperfect" Wave Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 xl:gap-16 relative z-10">
            {roadmapCards.map((card, idx) => {
              const layout = cardLayout[idx];
              const isActive = hoveredCard === idx || activeDotCard === idx;

              return (
                <div
                  key={card.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group relative bg-gradient-to-b from-[#18181b] to-[#111113] border rounded-2xl p-5 flex flex-col justify-between min-h-[220px] max-w-[270px] w-full mx-auto overflow-hidden cursor-pointer transition-all duration-500 ease-out transform ${
                    layout.offsetClass
                  } ${layout.rotationClass} ${
                    isActive
                      ? "scale-[1.05] z-30 border-accent/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_32px_rgba(217,164,65,0.25),0_12px_28px_rgba(0,0,0,0.5)]"
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
                    <div className="flex items-center justify-between mb-3">
                      <p
                        className={`font-mono text-[11px] tracking-wider transition-colors duration-300 ${
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
                      className={`font-display text-base sm:text-lg mb-2 tracking-tight transition-all duration-300 ${
                        isActive
                          ? "text-[#F5CD79] drop-shadow-[0_0_10px_rgba(217,164,65,0.4)]"
                          : "text-foreground"
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-muted leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-5">
                    <span
                      className={`inline-block px-3 py-1 font-mono text-[11px] rounded-full border transition-all duration-300 ${
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


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

interface PathStage {
  d: string;
  isCurve: boolean;
  cardIndex: number | null;
}

export default function Roadmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const segRefs = useRef<(SVGPathElement | null)[]>([]);

  const [stages, setStages] = useState<PathStage[]>([]);
  const [mergedPath, setMergedPath] = useState<string>("");
  const [dotPos, setDotPos] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });
  const [activeDotCard, setActiveDotCard] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Measure card boundary points and generate the sweeping wave paths merging into cards
  const updateWavePath = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const cardBoxes: { cx: number; cy: number; lx: number; rx: number }[] = [];

    cardRefs.current.forEach((card) => {
      if (card) {
        const r = card.getBoundingClientRect();
        cardBoxes.push({
          cx: r.left - containerRect.left + r.width / 2,
          cy: r.top - containerRect.top + r.height / 2,
          lx: r.left - containerRect.left,
          rx: r.right - containerRect.left,
        });
      }
    });

    if (cardBoxes.length === 4) {
      const [c0, c1, c2, c3] = cardBoxes;
      const PENETRATION = 22; // 22px inside the card edge ensures seamless merging under card border

      const x0_start = c0.cx;
      const y0_start = c0.cy;
      const x0_exit = c0.rx - PENETRATION;
      const y0_exit = c0.cy;

      const x1_enter = c1.lx + PENETRATION;
      const y1_enter = c1.cy;
      const x1_exit = c1.rx - PENETRATION;
      const y1_exit = c1.cy;

      const x2_enter = c2.lx + PENETRATION;
      const y2_enter = c2.cy;
      const x2_exit = c2.rx - PENETRATION;
      const y2_exit = c2.cy;

      const x3_enter = c3.lx + PENETRATION;
      const y3_enter = c3.cy;
      const x3_end = c3.cx;
      const y3_end = c3.cy;

      // Curve 0: Card 0 exit to Card 1 entrance (sweeping valley wave)
      const dx01 = x1_enter - x0_exit;
      const dy01 = y1_enter - y0_exit;
      const cp0A = { x: x0_exit + dx01 * 0.45, y: y0_exit + dy01 * 0.15 };
      const cp0B = { x: x1_enter - dx01 * 0.35, y: y1_enter + 38 };

      // Curve 1: Card 1 exit to Card 2 entrance (high cresting wave arc)
      const dx12 = x2_enter - x1_exit;
      const cp1A = { x: x1_exit + dx12 * 0.35, y: y1_exit - (y1_exit - y2_enter) * 0.3 - 48 };
      const cp1B = { x: x2_enter - dx12 * 0.45, y: y2_enter - 52 };

      // Curve 2: Card 2 exit to Card 3 entrance (cascading S-curve slide)
      const dx23 = x3_enter - x2_exit;
      const cp2A = { x: x2_exit + dx23 * 0.48, y: y2_exit + 25 };
      const cp2B = { x: x3_enter - dx23 * 0.38, y: y3_enter - 45 };

      // 7 Stages of continuous physical movement without any teleportation:
      // Stage 0: Inside Card 0 (start dwell)
      // Stage 1: Curve 0 in open space (Card 0 -> Card 1)
      // Stage 2: Inside Card 1 (moves through card while Card 1 glows)
      // Stage 3: Curve 1 in open space (Card 1 -> Card 2)
      // Stage 4: Inside Card 2 (moves through card while Card 2 glows)
      // Stage 5: Curve 2 in open space (Card 2 -> Card 3)
      // Stage 6: Inside Card 3 (moves to center while Card 3 glows)
      const stageData: PathStage[] = [
        { d: `M ${x0_start} ${y0_start} L ${x0_exit} ${y0_exit}`, isCurve: false, cardIndex: 0 },
        { d: `M ${x0_exit} ${y0_exit} C ${cp0A.x} ${cp0A.y}, ${cp0B.x} ${cp0B.y}, ${x1_enter} ${y1_enter}`, isCurve: true, cardIndex: null },
        { d: `M ${x1_enter} ${y1_enter} L ${x1_exit} ${y1_exit}`, isCurve: false, cardIndex: 1 },
        { d: `M ${x1_exit} ${y1_exit} C ${cp1A.x} ${cp1A.y}, ${cp1B.x} ${cp1B.y}, ${x2_enter} ${y2_enter}`, isCurve: true, cardIndex: null },
        { d: `M ${x2_enter} ${y2_enter} L ${x2_exit} ${y2_exit}`, isCurve: false, cardIndex: 2 },
        { d: `M ${x2_exit} ${y2_exit} C ${cp2A.x} ${cp2A.y}, ${cp2B.x} ${cp2B.y}, ${x3_enter} ${y3_enter}`, isCurve: true, cardIndex: null },
        { d: `M ${x3_enter} ${y3_enter} L ${x3_end} ${y3_end}`, isCurve: false, cardIndex: 3 },
      ];

      // Single continuous merged path running into and behind the cards
      const merged = `M ${x0_start} ${y0_start} ` +
        `L ${x0_exit} ${y0_exit} ` +
        `C ${cp0A.x} ${cp0A.y}, ${cp0B.x} ${cp0B.y}, ${x1_enter} ${y1_enter} ` +
        `L ${x1_exit} ${y1_exit} ` +
        `C ${cp1A.x} ${cp1A.y}, ${cp1B.x} ${cp1B.y}, ${x2_enter} ${y2_enter} ` +
        `L ${x2_exit} ${y2_exit} ` +
        `C ${cp2A.x} ${cp2A.y}, ${cp2B.x} ${cp2B.y}, ${x3_enter} ${y3_enter} ` +
        `L ${x3_end} ${y3_end}`;

      setStages(stageData);
      setMergedPath(merged);
    }
  };

  useEffect(() => {
    updateWavePath();
    window.addEventListener("resize", updateWavePath);
    return () => window.removeEventListener("resize", updateWavePath);
  }, []);

  // Moving dot loop & auto-highlight synchronization
  // Bidirectional physical movement: travels forward across all cards, then follows the reversed path back to Card 1
  useEffect(() => {
    let animId: number;
    let startTime: number | null = null;

    const STAGE_DURATIONS = [
      1500, // Stage 0: Inside Card 0 (turnaround dwell)
      7000, // Stage 1: Curve 0 travel (Card 0 -> Card 1)
      1500, // Stage 2: Move inside Card 1 (Card 1 glows)
      7000, // Stage 3: Curve 1 travel (Card 1 -> Card 2)
      1500, // Stage 4: Move inside Card 2 (Card 2 glows)
      7000, // Stage 5: Curve 2 travel (Card 2 -> Card 3)
      1500, // Stage 6: Inside Card 3 (turnaround dwell)
    ];

    const FORWARD_TOTAL = STAGE_DURATIONS.reduce((a, b) => a + b, 0); // 27000ms
    const ROUND_TRIP_TOTAL = FORWARD_TOTAL * 2; // 54000ms total bidirectional loop

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % ROUND_TRIP_TOTAL;

      if (stages.length === 7) {
        const isForward = elapsed < FORWARD_TOTAL;
        const legElapsed = isForward ? elapsed : elapsed - FORWARD_TOTAL;

        let accum = 0;
        let stageIndex = 0;
        let stageElapsed = 0;

        if (isForward) {
          // Forward journey: Card 0 -> Card 1 -> Card 2 -> Card 3
          for (let i = 0; i < STAGE_DURATIONS.length; i++) {
            if (legElapsed < accum + STAGE_DURATIONS[i]) {
              stageIndex = i;
              stageElapsed = legElapsed - accum;
              break;
            }
            accum += STAGE_DURATIONS[i];
          }
        } else {
          // Reverse journey: Card 3 -> Card 2 -> Card 1 -> Card 0
          for (let i = STAGE_DURATIONS.length - 1; i >= 0; i--) {
            if (legElapsed < accum + STAGE_DURATIONS[i]) {
              stageIndex = i;
              stageElapsed = legElapsed - accum;
              break;
            }
            accum += STAGE_DURATIONS[i];
          }
        }

        const stage = stages[stageIndex];
        const stageEl = segRefs.current[stageIndex];

        if (stageEl && stageEl.getTotalLength) {
          const len = stageEl.getTotalLength();
          const rawProgress = Math.min(1, Math.max(0, stageElapsed / STAGE_DURATIONS[stageIndex]));
          // In reverse leg, progress runs from 1 down to 0 along the path
          const progress = isForward ? rawProgress : 1 - rawProgress;
          const pt = stageEl.getPointAtLength(progress * len);

          setDotPos({ x: pt.x, y: pt.y, opacity: 1 });
          setActiveDotCard(stage.cardIndex);
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [stages]);

  return (
    <section id="roadmap" className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div data-reveal className="text-center mb-16 md:mb-24">
          <p className="font-mono text-xs text-muted tracking-[0.2em] uppercase mb-4">
            {"// Engineering Roadmap"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
            Core Execution Root Map
          </h2>
        </div>

        {/* Roadmap Staggered Wave Container */}
        <div ref={containerRef} data-reveal style={{ transitionDelay: "150ms" }} className="relative pb-24 lg:pb-48">
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

            {/* Hidden individual stage paths for getPointAtLength measurement */}
            {stages.map((stg, sIdx) => (
              <path
                key={`meas-${sIdx}`}
                ref={(el) => {
                  segRefs.current[sIdx] = el;
                }}
                d={stg.d}
                fill="none"
                stroke="transparent"
                strokeWidth="1"
              />
            ))}

            {/* Seamless, Solid Luminous Wave Path merging into and behind cards */}
            {mergedPath && (
              <g>
                {/* 1. Deep ambient glow stroke */}
                <path
                  d={mergedPath}
                  fill="none"
                  stroke="rgba(217, 164, 65, 0.16)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* 2. Soft luminous aura */}
                <path
                  d={mergedPath}
                  fill="none"
                  stroke="rgba(245, 205, 121, 0.35)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#lineGlow)"
                />
                {/* 3. Solid crisp gold core */}
                <path
                  d={mergedPath}
                  fill="none"
                  stroke="url(#solidWaveGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}

            {/* Glowing Traveling Dot (Travels continuously along the path — naturally hidden behind opaque cards) */}
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


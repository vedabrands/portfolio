import type { Project } from "@/types/database";

const DEFAULT_PROJECTS = [
  {
    id: "1",
    title: "AI Content Generator",
    description:
      "An AI-powered content generation platform with natural language processing capabilities.",
    tags: ["Next.js", "OpenAI", "Tailwind"],
    project_url: "#",
    github_url: "https://github.com/vedabrands/portfolio",
    display_order: 1,
    floatClass: "card-float-1",
    brief_detail:
      "Architected with Next.js App Router and OpenAI streaming endpoints. Implements multi-model reasoning pipelines, automated prompt templating, and sub-second token delivery.",
    features: [
      "Streaming token inference",
      "Dynamic prompt decomposition",
      "Edge runtime caching",
    ],
  },
  {
    id: "2",
    title: "E-Commerce Dashboard",
    description:
      "Real-time analytics dashboard for e-commerce metrics and insights.",
    tags: ["React", "D3.js", "Node.js"],
    project_url: "#",
    github_url: "https://github.com/vedabrands/portfolio",
    display_order: 2,
    floatClass: "card-float-2",
    brief_detail:
      "High-throughput enterprise metric monitor handling high-concurrency event telemetry. Visualizes live funnel attrition, revenue spikes, and customer lifetime value via D3 charts.",
    features: [
      "Real-time socket streams",
      "Custom D3 cohort visualizers",
      "Sub-100ms query latency",
    ],
  },
  {
    id: "3",
    title: "Smart Home IoT",
    description:
      "IoT dashboard for monitoring and controlling smart home devices.",
    tags: ["React", "MQTT", "Python"],
    project_url: "#",
    github_url: "https://github.com/vedabrands/portfolio",
    display_order: 3,
    floatClass: "card-float-3",
    brief_detail:
      "Decentralized device management hub interfacing with local MQTT brokers. Synchronizes home state, ambient environmental metrics, and power automation rules across edge nodes.",
    features: [
      "Low-latency MQTT pub/sub",
      "Biometric sensor telemetry",
      "Automated edge failover",
    ],
  },
  {
    id: "4",
    title: "Portfolio CMS",
    description:
      "Headless CMS-powered portfolio with dynamic content management.",
    tags: ["Next.js", "Sanity", "Vercel"],
    project_url: "#",
    github_url: "https://github.com/vedabrands/portfolio",
    display_order: 4,
    floatClass: "card-float-4",
    brief_detail:
      "Production-ready publication workflow with instant edge on-demand revalidation. Features schema-strict types, rich portable text rendering, and automated media compression.",
    features: [
      "On-demand ISR revalidation",
      "Live schema validation",
      "Global CDN asset pipelines",
    ],
  },
];

interface ProjectsProps {
  projects?: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const projectList =
    projects && projects.length > 0 ? projects : DEFAULT_PROJECTS;

  return (
    <section id="projects" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-reveal className="text-center mb-14">
          <p className="font-mono text-xs text-muted tracking-[0.2em] uppercase mb-4">
            {"// Selected Work"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
            Projects
          </h2>
        </div>

        {/* Noticeably wider grid spacing for generous breathing room during 3D flips */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {projectList.map((project, idx) => {
            const floatClass =
              (project as { floatClass?: string }).floatClass ||
              `card-float-${(idx % 4) + 1}`;
            const brief =
              project.brief_detail ||
              project.description ||
              "Architected with modern, scalable web patterns and optimized performance.";
            const features = (project as { features?: string[] }).features || [
              "Production-ready architecture",
              "Optimized edge performance",
              "Responsive modern UI",
            ];
            const projectUrl = project.project_url || "#";
            const githubUrl = project.github_url;

            return (
              <div
                key={project.id || project.title}
                data-reveal
                style={{ transitionDelay: `${idx * 110}ms` }}
                className="project-card-wrapper perspective-1200 relative min-h-[460px] sm:min-h-[470px] w-full"
              >
                {/* Floating Idle Motion Wrapper (starts once revealed on scroll, pauses on hover) */}
                <div
                  className={`card-floating-body preserve-3d w-full h-full ${floatClass}`}
                >
                  {/* 3D Flipper Element (flips 180deg on wrapper hover) */}
                  <div className="project-flipper preserve-3d w-full h-full relative">
                    {/* ── FRONT FACE ── */}
                    <div className="absolute inset-0 backface-hidden rounded-2xl bg-card border border-card-border/90 flex flex-col justify-between overflow-hidden shadow-lg select-none">
                      {/* Thumbnail placeholder */}
                      <div className="relative h-48 bg-gradient-to-b from-card-border/30 to-card-border/10 flex items-center justify-center border-b border-card-border/60">
                        <span className="font-mono text-xs text-muted/50 tracking-widest uppercase">
                          Project Thumbnail
                        </span>
                        {/* Interactive Flip Hint Badge */}
                        <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-mono tracking-wider text-muted/70 bg-background/80 border border-card-border/70 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                          <span>↻</span> Flip Details
                        </span>
                      </div>

                      <div className="p-6 flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="font-display text-lg text-foreground mb-2">
                            {project.title}
                          </h3>
                          <p className="text-sm text-muted leading-relaxed mb-4">
                            {project.description}
                          </p>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 text-xs font-mono text-muted bg-background border border-card-border rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-card-border/50 text-xs font-mono text-accent">
                            <span>Hover to reveal brief</span>
                            <span>→</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── BACK FACE (Revealed on hover with warm gold/amber glow) ── */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-b from-[#1b1915] via-[#141312] to-[#0f0e0d] border border-accent/80 p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_28px_rgba(217,164,65,0.28),0_12px_28px_rgba(0,0,0,0.6)]">
                      {/* Top: Eyebrow + Title */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-[11px] text-accent tracking-widest uppercase font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_6px_#D9A441]" />
                            {"// Architecture Brief"}
                          </span>
                          <span className="text-xs font-mono text-muted/60">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="font-display text-lg sm:text-xl text-[#F5CD79] mb-3 drop-shadow-[0_0_10px_rgba(217,164,65,0.3)]">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted/90 leading-relaxed mb-4">
                          {brief}
                        </p>

                        {/* Key features bullet chips */}
                        <div className="space-y-1.5 mb-4">
                          {features.map((feat) => (
                            <div
                              key={feat}
                              className="flex items-center gap-2 text-xs text-foreground/80 font-mono"
                            >
                              <span className="text-accent text-[10px]">◆</span>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom: Action link & flip indicator */}
                      <div className="pt-3 border-t border-card-border/60 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <a
                            href={projectUrl}
                            className="btn-press inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-background font-semibold text-xs hover:bg-[#e6b14c] hover:shadow-[0_0_16px_rgba(217,164,65,0.5)] active:scale-95 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                          >
                            <span>View Project</span>
                            <span>↗</span>
                          </a>
                          {githubUrl && githubUrl !== "#" && (
                            <a
                              href={githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-muted hover:text-foreground font-mono transition-colors"
                            >
                              GitHub ↗
                            </a>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-muted/50 tracking-wider">
                          ↺ Leave to reset
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

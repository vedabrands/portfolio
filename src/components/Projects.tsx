const projects = [
  {
    title: "AI Content Generator",
    description:
      "An AI-powered content generation platform with natural language processing capabilities.",
    tags: ["Next.js", "OpenAI", "Tailwind"],
    link: "#",
  },
  {
    title: "E-Commerce Dashboard",
    description:
      "Real-time analytics dashboard for e-commerce metrics and insights.",
    tags: ["React", "D3.js", "Node.js"],
    link: "#",
  },
  {
    title: "Smart Home IoT",
    description:
      "IoT dashboard for monitoring and controlling smart home devices.",
    tags: ["React", "MQTT", "Python"],
    link: "#",
  },
  {
    title: "Portfolio CMS",
    description:
      "Headless CMS-powered portfolio with dynamic content management.",
    tags: ["Next.js", "Sanity", "Vercel"],
    link: "#",
  },
];

export default function Projects() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <div
              key={project.title}
              data-reveal
              style={{ transitionDelay: `${idx * 110}ms` }}
              className="bg-card border border-card-border rounded-xl overflow-hidden group hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300"
            >
              {/* Thumbnail placeholder */}
              <div className="h-48 bg-card-border/20 flex items-center justify-center">
                <span className="font-mono text-xs text-muted/50 tracking-widest uppercase">
                  Project Thumbnail
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-display text-lg text-foreground mb-2 group-hover:text-accent transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  {project.description}
                </p>
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
                <a
                  href={project.link}
                  className="btn-press inline-flex items-center text-sm text-accent hover:text-[#F5CD79] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  View Project →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

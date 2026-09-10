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
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-mono text-xs text-muted tracking-[0.2em] uppercase mb-4">
            {"// Engineering Roadmap"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
            Core Execution Root Map
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {roadmapCards.map((card) => (
            <div
              key={card.id}
              className="relative bg-card border border-card-border rounded-xl p-6 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <p className="font-mono text-xs text-muted mb-4">
                  {"// ROOT "}{card.id}
                </p>
                <h3 className="font-display text-lg text-foreground mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className="mt-4">
                <span className="inline-block px-3 py-1 font-mono text-xs text-muted bg-background border border-card-border rounded-full">
                  {card.tech}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

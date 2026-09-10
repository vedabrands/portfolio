const stats = [
  { label: "Years Experience", value: "5+" },
  { label: "Projects Completed", value: "50+" },
  { label: "Happy Clients", value: "30+" },
  { label: "Certifications", value: "10+" },
];

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: heading + text */}
          <div>
            <p className="font-mono text-xs text-muted tracking-[0.2em] uppercase mb-4">
              {"// About Me"}
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
              Passionate About Building the Future
            </h2>
            <div className="space-y-4 text-sm md:text-base text-muted leading-relaxed">
              <p>
                I&apos;m a creative developer with a deep passion for crafting
                digital experiences that merge cutting-edge technology with
                thoughtful design. With expertise spanning full-stack
                development, AI/ML, and cloud infrastructure, I build systems
                that scale.
              </p>
              <p>
                My approach combines clean code architecture with a keen eye for
                user experience, ensuring every project not only works flawlessly
                but feels intuitive and polished.
              </p>
            </div>
          </div>

          {/* Right: stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-card border border-card-border rounded-xl p-6 flex flex-col items-center justify-center text-center"
              >
                <span className="font-display text-3xl md:text-4xl text-accent mb-2">
                  {stat.value}
                </span>
                <span className="font-mono text-xs text-muted tracking-wide uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

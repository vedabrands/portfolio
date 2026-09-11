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
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative bg-gradient-to-b from-[#18181b] to-[#111113] border border-card-border/90 rounded-2xl p-6 sm:p-7 md:p-8 flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-300 ease-out transform hover:scale-[1.04] hover:z-10 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_4px_12px_rgba(0,0,0,0.35)] hover:border-accent/60 hover:from-[#231e17] hover:to-[#171410] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_0_28px_rgba(217,164,65,0.22),0_12px_24px_rgba(0,0,0,0.5)]"
              >
                {/* Subtle radial ambient glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 40%, rgba(217, 164, 65, 0.12) 0%, transparent 70%)",
                  }}
                />

                {/* Animated Stat Value */}
                <span className="relative z-10 font-display text-3xl sm:text-4xl md:text-5xl text-accent mb-2 tracking-tight transition-all duration-300 ease-out group-hover:scale-105 group-hover:text-[#F5CD79] group-hover:drop-shadow-[0_0_14px_rgba(217,164,65,0.5)]">
                  {stat.value}
                </span>

                {/* Stat Label */}
                <span className="relative z-10 font-mono text-xs text-muted tracking-wider uppercase transition-colors duration-300 group-hover:text-[#EDEDED]">
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

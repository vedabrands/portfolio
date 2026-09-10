export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-end pb-16 md:pb-24 overflow-hidden"
    >
      {/* Placeholder image area — user will integrate custom scroll animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[600px] md:w-[600px] md:h-[750px] rounded-2xl bg-gradient-to-b from-card-border/20 to-transparent flex items-center justify-center">
          <span className="font-mono text-xs text-muted/40 tracking-widest uppercase">
            Hero Image Area
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          {/* Left content */}
          <div className="flex flex-col gap-8">
            <p
              className="font-mono text-xs text-muted tracking-[0.2em] uppercase motion-safe:animate-fade-up"
              style={{ animationDelay: "0.1s", animationFillMode: "both" }}
            >
              Hi, I&apos;m Your Name
            </p>

            <h1
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground uppercase leading-[0.9] motion-safe:animate-fade-up"
              style={{ animationDelay: "0.2s", animationFillMode: "both" }}
            >
              Creative
              <br />
              Developer
            </h1>

            <div
              className="flex flex-wrap items-center gap-3 motion-safe:animate-fade-up"
              style={{ animationDelay: "0.4s", animationFillMode: "both" }}
            >
              <a
                href="#projects"
                className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-full border border-card-border bg-card text-foreground hover:bg-card-border/80 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-full bg-accent text-background hover:bg-accent/90 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Contact Me
              </a>
            </div>

            <p
              className="font-mono text-xs text-muted tracking-widest uppercase motion-safe:animate-fade-up"
              style={{ animationDelay: "0.5s", animationFillMode: "both" }}
            >
              ↓ Scroll to explore
            </p>
          </div>

          {/* Right side supporting text */}
          <div
            className="max-w-xs motion-safe:animate-fade-up"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            <p className="font-mono text-xs text-muted tracking-[0.15em] uppercase mb-3">
              {"// Turning Ideas Into Reality"}
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Available for hire. Building fast, responsive web applications
              using modern tech stacks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

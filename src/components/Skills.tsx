const skills = [
  "Generative AI",
  "LLMs",
  "Computer Vision",
  "Prompt Engineering",
  "Machine Learning",
  "NLP",
  "Deep Learning",
  "Data Science",
  "Neural Networks",
  "Model Fine-Tuning",
  "RAG Systems",
  "Vector Databases",
];

export default function Skills() {
  return (
    <section id="expertise" className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs text-muted tracking-[0.2em] uppercase text-center mb-10">
          {"// Expertise"}
        </p>
      </div>

      {/* Marquee Wrapper with soft edge gradient masks */}
      <div
        id="skills"
        className="group relative w-full overflow-hidden py-4 select-none"
      >
        {/* Left & Right Edge Gradient Fades for seamless entry/exit */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-36 z-20 pointer-events-none bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-36 z-20 pointer-events-none bg-gradient-to-l from-background via-background/80 to-transparent" />

        {/* Marquee Track Container: pauses when cursor hovers ANYWHERE in the marquee row */}
        <div className="flex w-max">
          {/* First Track */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4 pr-3 sm:pr-4 animate-marquee group-hover:[animation-play-state:paused]">
            {skills.map((skill, index) => (
              <span
                key={`skill-1-${index}`}
                className="relative px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium tracking-wide text-foreground bg-gradient-to-b from-[#18181b] to-[#111113] border border-card-border/90 rounded-full cursor-pointer whitespace-nowrap shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out transform hover:scale-[1.06] hover:z-30 hover:border-accent/70 hover:from-[#241e17] hover:to-[#171410] hover:text-[#F5CD79] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_24px_rgba(217,164,65,0.28),0_8px_20px_rgba(0,0,0,0.5)]"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Second Track (Exact duplicate for seamless infinite wrap) */}
          <div
            className="flex shrink-0 items-center gap-3 sm:gap-4 pr-3 sm:pr-4 animate-marquee group-hover:[animation-play-state:paused]"
            aria-hidden="true"
          >
            {skills.map((skill, index) => (
              <span
                key={`skill-2-${index}`}
                className="relative px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium tracking-wide text-foreground bg-gradient-to-b from-[#18181b] to-[#111113] border border-card-border/90 rounded-full cursor-pointer whitespace-nowrap shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out transform hover:scale-[1.06] hover:z-30 hover:border-accent/70 hover:from-[#241e17] hover:to-[#171410] hover:text-[#F5CD79] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_24px_rgba(217,164,65,0.28),0_8px_20px_rgba(0,0,0,0.5)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

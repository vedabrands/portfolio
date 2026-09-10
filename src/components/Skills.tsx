const skills = [
  "Generative AI",
  "LLMs",
  "Computer Vision",
  "Prompt Engineering",
  "Machine Learning",
  "NLP",
  "Deep Learning",
  "Data Science",
];

export default function Skills() {
  return (
    <section id="expertise" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs text-muted tracking-[0.2em] uppercase text-center mb-10">
          {"// Expertise"}
        </p>

        <div id="skills" className="flex flex-wrap justify-center gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-5 py-2.5 text-sm font-medium text-foreground bg-card border border-card-border rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

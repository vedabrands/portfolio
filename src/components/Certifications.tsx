const certifications = [
  {
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2024",
    link: "#",
  },
  {
    name: "Google Cloud Professional",
    issuer: "Google Cloud",
    date: "2024",
    link: "#",
  },
  {
    name: "TensorFlow Developer Certificate",
    issuer: "Google",
    date: "2023",
    link: "#",
  },
  {
    name: "Meta Frontend Developer",
    issuer: "Meta",
    date: "2023",
    link: "#",
  },
  {
    name: "Azure AI Fundamentals",
    issuer: "Microsoft",
    date: "2023",
    link: "#",
  },
];

export default function Certifications() {
  return (
    <section id="certifications" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-mono text-xs text-muted tracking-[0.2em] uppercase mb-4">
            {"// Credentials"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
            Certifications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="bg-card border border-card-border rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-display text-base text-foreground mb-1">
                  {cert.name}
                </h3>
                <p className="text-sm text-muted mb-2">{cert.issuer}</p>
                <p className="font-mono text-xs text-muted">{cert.date}</p>
              </div>
              <a
                href={cert.link}
                className="mt-4 text-sm text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View Certificate →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

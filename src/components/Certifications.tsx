const certifications = [
  {
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2024",
    link: "#",
    // [PLACEHOLDER] Coverage note for AWS Certified Solutions Architect:
    note: "Validates technical expertise in designing and deploying resilient, highly available, secure, and cost-optimized distributed systems on AWS.",
    topics: "Cloud Architecture • VPC & IAM • Distributed Storage",
  },
  {
    name: "Google Cloud Professional",
    issuer: "Google Cloud",
    date: "2024",
    link: "#",
    // [PLACEHOLDER] Coverage note for Google Cloud Professional:
    note: "Demonstrates advanced proficiency in architecting robust cloud infrastructure, containerized deployments, and managed data analytics pipelines on GCP.",
    topics: "GCP Infrastructure • Cloud Run • BigQuery Pipelines",
  },
  {
    name: "TensorFlow Developer Certificate",
    issuer: "Google",
    date: "2023",
    link: "#",
    // [PLACEHOLDER] Coverage note for TensorFlow Developer Certificate:
    note: "Certifies foundational capabilities in architecting, training, and fine-tuning deep neural networks, convolutional vision models, and NLP architectures.",
    topics: "Deep Learning • CNNs & Computer Vision • NLP Models",
  },
  {
    name: "Meta Frontend Developer",
    issuer: "Meta",
    date: "2023",
    link: "#",
    // [PLACEHOLDER] Coverage note for Meta Frontend Developer:
    note: "Validates end-to-end mastery of modern React component design patterns, responsive layout engineering, state trees, and web accessibility standards.",
    topics: "React.js • Advanced JavaScript • WCAG Accessibility",
  },
  {
    name: "Azure AI Fundamentals",
    issuer: "Microsoft",
    date: "2023",
    link: "#",
    // [PLACEHOLDER] Coverage note for Azure AI Fundamentals:
    note: "Demonstrates core understanding of machine learning principles, generative AI capabilities, and computer vision services hosted on Microsoft Azure.",
    topics: "Azure Cognitive Services • Conversational AI • Computer Vision",
  },
];

export default function Certifications() {
  return (
    <section id="certifications" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-reveal className="text-center mb-14">
          <p className="font-mono text-xs text-muted tracking-[0.2em] uppercase mb-4">
            {"// Credentials"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
            Certifications
          </h2>
        </div>

        {/* 3D Horizontal Flip Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => (
            <div
              key={cert.name}
              data-reveal
              style={{ transitionDelay: `${idx * 80}ms` }}
              className="cert-card-wrapper perspective-1200 relative min-h-[220px] sm:min-h-[235px] w-full"
            >
              {/* Horizontal 3D Flipper Element */}
              <div className="cert-flipper preserve-3d w-full h-full relative">
                
                {/* ── FRONT FACE ── */}
                <div className="absolute inset-0 backface-hidden rounded-xl bg-card border border-card-border/90 p-6 flex flex-col justify-between overflow-hidden shadow-lg select-none">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-muted/70 tracking-wider uppercase">
                        {cert.issuer}
                      </span>
                      <span className="font-mono text-xs text-muted/60 bg-card-border/40 px-2 py-0.5 rounded-full">
                        {cert.date}
                      </span>
                    </div>
                    <h3 className="font-display text-base sm:text-lg text-foreground mb-1 leading-snug">
                      {cert.name}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-card-border/50 flex items-center justify-between text-xs font-mono text-accent">
                    <span>Hover to flip</span>
                    <span>↻</span>
                  </div>
                </div>

                {/* ── BACK FACE (Horizontal Flip with Warm Amber Glow) ── */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl bg-gradient-to-b from-[#1b1915] via-[#141312] to-[#0f0e0d] border border-accent/80 p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_24px_rgba(217,164,65,0.28),0_8px_20px_rgba(0,0,0,0.5)]">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[11px] text-accent font-semibold tracking-wider uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_6px_#D9A441]" />
                        {cert.issuer}
                      </span>
                      <span className="font-mono text-xs text-accent/90 bg-accent/10 border border-accent/30 px-2 py-0.5 rounded-full">
                        Issued {cert.date}
                      </span>
                    </div>
                    <h3 className="font-display text-sm sm:text-base text-[#F5CD79] mb-2 leading-snug drop-shadow-[0_0_8px_rgba(217,164,65,0.3)]">
                      {cert.name}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mb-2">
                      {cert.note}
                    </p>
                    <p className="text-[11px] font-mono text-accent/80 truncate">
                      {cert.topics}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-card-border/60 flex items-center justify-between text-xs">
                    <a
                      href={cert.link}
                      className="btn-press inline-flex items-center gap-1 text-accent hover:text-[#F5CD79] font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span>Verify Credential</span>
                      <span>↗</span>
                    </a>
                    <span className="font-mono text-[10px] text-muted/50 tracking-wider">
                      ↺ Reset
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { Certification } from "@/types/database";

const DEFAULT_CERTIFICATIONS: Certification[] = [
  {
    id: "1",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date_issued: "2024",
    description: "Validates technical expertise in designing and deploying resilient, highly available, secure, and cost-optimized distributed systems on AWS.",
    display_order: 1,
  },
  {
    id: "2",
    title: "Google Cloud Professional",
    issuer: "Google Cloud",
    date_issued: "2024",
    description: "Demonstrates advanced proficiency in architecting robust cloud infrastructure, containerized deployments, and managed data analytics pipelines on GCP.",
    display_order: 2,
  },
  {
    id: "3",
    title: "TensorFlow Developer Certificate",
    issuer: "Google",
    date_issued: "2023",
    description: "Certifies foundational capabilities in architecting, training, and fine-tuning deep neural networks, convolutional vision models, and NLP architectures.",
    display_order: 3,
  },
  {
    id: "4",
    title: "Meta Frontend Developer",
    issuer: "Meta",
    date_issued: "2023",
    description: "Validates end-to-end mastery of modern React component design patterns, responsive layout engineering, state trees, and web accessibility standards.",
    display_order: 4,
  },
  {
    id: "5",
    title: "Azure AI Fundamentals",
    issuer: "Microsoft",
    date_issued: "2023",
    description: "Demonstrates core understanding of machine learning principles, generative AI capabilities, and computer vision services hosted on Microsoft Azure.",
    display_order: 5,
  },
];

interface CertificationsProps {
  certifications?: Certification[];
}

export default function Certifications({
  certifications,
}: CertificationsProps) {
  const certList =
    certifications && certifications.length > 0
      ? certifications
      : DEFAULT_CERTIFICATIONS;

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

        {/* 3D Vertical Flip Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certList.map((cert, idx) => (
            <div
              key={cert.id || cert.title}
              data-reveal
              style={{ transitionDelay: `${idx * 80}ms` }}
              className="cert-card-wrapper perspective-1200 relative min-h-[220px] sm:min-h-[235px] w-full"
            >
              {/* Vertical 3D Flipper Element */}
              <div className="cert-flipper preserve-3d w-full h-full relative">

                {/* ── FRONT FACE ── */}
                <div className="absolute inset-0 backface-hidden rounded-xl bg-card border border-card-border/90 p-6 flex flex-col justify-between overflow-hidden shadow-lg select-none">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-muted/70 tracking-wider uppercase">
                        {cert.issuer}
                      </span>
                      <span className="font-mono text-xs text-muted/60 bg-card-border/40 px-2 py-0.5 rounded-full">
                        {cert.date_issued}
                      </span>
                    </div>
                    <h3 className="font-display text-base sm:text-lg text-foreground mb-1 leading-snug">
                      {cert.title}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-card-border/50 flex items-center justify-between text-xs font-mono text-accent">
                    <span>Hover to flip</span>
                    <span>⇅</span>
                  </div>
                </div>

                {/* ── BACK FACE (Vertical Flip with Warm Amber Glow) ── */}
                <div className="absolute inset-0 backface-hidden rotate-x-180 rounded-xl bg-gradient-to-b from-[#1b1915] via-[#141312] to-[#0f0e0d] border border-accent/80 p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_24px_rgba(217,164,65,0.28),0_8px_20px_rgba(0,0,0,0.5)]">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[11px] text-accent font-semibold tracking-wider uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_6px_#D9A441]" />
                        {cert.issuer}
                      </span>
                      <span className="font-mono text-xs text-accent/90 bg-accent/10 border border-accent/30 px-2 py-0.5 rounded-full">
                        Issued {cert.date_issued}
                      </span>
                    </div>
                    <h3 className="font-display text-sm sm:text-base text-[#F5CD79] mb-2 leading-snug drop-shadow-[0_0_8px_rgba(217,164,65,0.3)]">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mb-2">
                      {cert.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-card-border/60 flex items-center justify-between text-xs">
                    <a
                      href={cert.image_url || "#"}
                      className="btn-press inline-flex items-center gap-1 text-accent hover:text-[#F5CD79] font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span>View Credential</span>
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

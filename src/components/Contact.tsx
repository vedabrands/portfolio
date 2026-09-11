import type { LinkItem } from "@/types/database";

const DEFAULT_SOCIALS = [
  { label: "Email", href: "mailto:unifiedram@gmail.com", icon: "✉" },
  { label: "GitHub", href: "https://github.com/vedabrands/portfolio", icon: "⌘" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
  { label: "Twitter", href: "https://twitter.com", icon: "𝕏" },
];

function getIconForLink(label: string, iconName?: string | null): string {
  if (iconName === "mail" || label.toLowerCase().includes("email")) return "✉";
  if (iconName === "github" || label.toLowerCase().includes("github")) return "⌘";
  if (iconName === "linkedin" || label.toLowerCase().includes("linkedin")) return "in";
  if (iconName === "twitter" || label.toLowerCase().includes("twitter")) return "𝕏";
  return "↗";
}

interface ContactProps {
  links?: LinkItem[];
  name?: string;
}

export default function Contact({ links, name }: ContactProps) {
  const socialLinks =
    links && links.length > 0
      ? links
          .filter((l) => !l.url.startsWith("#"))
          .map((l) => ({
            label: l.label,
            href: l.url,
            icon: getIconForLink(l.label, l.icon_name),
          }))
      : DEFAULT_SOCIALS;

  const currentYear = new Date().getFullYear();
  const displayName = name || "YourName";

  return (
    <section id="contact" className="py-20 md:py-28 border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-reveal className="text-center mb-14">
          <p className="font-mono text-xs text-muted tracking-[0.2em] uppercase mb-4">
            {"// Get In Touch"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-muted text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Have a project in mind? Let&apos;s discuss how we can bring your
            ideas to life.
          </p>
        </div>

        <div data-reveal style={{ transitionDelay: "150ms" }} className="flex flex-wrap justify-center gap-3">
          {socialLinks.map((social, idx) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ transitionDelay: `${idx * 60}ms` }}
              className="btn-press inline-flex items-center gap-2 px-5 py-2.5 text-sm text-foreground bg-card border border-card-border rounded-full hover:bg-card-border/80 hover:scale-105 hover:border-accent/60 hover:text-[#F5CD79] active:scale-95 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span>{social.icon}</span>
              {social.label}
            </a>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="font-mono text-xs text-muted">
            © {currentYear} {displayName}. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}

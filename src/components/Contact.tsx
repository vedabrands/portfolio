import Link from "next/link";
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

        <div className="mt-20 flex items-center justify-center gap-2">
          <p className="font-mono text-xs text-muted">
            © {currentYear} {displayName}. All rights reserved.
          </p>
          <Link
            href="/admin/login"
            aria-label="Admin Portal"
            className="text-muted/40 hover:text-accent transition-colors duration-200 p-1 rounded hover:bg-card-border/30"
            title="Admin Portal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5 inline opacity-50 hover:opacity-100"
            >
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

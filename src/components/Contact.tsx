const socials = [
  { label: "Email", href: "mailto:hello@example.com", icon: "✉" },
  { label: "GitHub", href: "https://github.com", icon: "⌘" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
  { label: "Twitter", href: "https://twitter.com", icon: "𝕏" },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28 border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
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

        <div className="flex flex-wrap justify-center gap-3">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-foreground bg-card border border-card-border rounded-full hover:bg-card-border/80 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span>{social.icon}</span>
              {social.label}
            </a>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="font-mono text-xs text-muted">
            © 2024 YourName. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}

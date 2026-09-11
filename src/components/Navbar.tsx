"use client";

import { useState } from "react";
import type { LinkItem } from "@/types/database";

const DEFAULT_NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  links?: LinkItem[];
  name?: string;
}

export default function Navbar({ links, name }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks =
    links && links.length > 0
      ? links
          .filter((l) => l.url.startsWith("#"))
          .map((l) => ({ label: l.label, href: l.url }))
      : DEFAULT_NAV_LINKS;

  const displayName = name ? (name.includes(" ") ? `${name.split(" ")[0]}.` : `${name}.`) : "Dev Vashisht";

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#hero" className="font-display text-xl text-foreground tracking-tight">
            {displayName}
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative px-3 py-2 text-sm text-muted/80 hover:text-foreground transition-colors duration-200 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span className="relative z-10 transition-colors duration-200 group-hover:text-foreground">
                  {link.label}
                </span>
                {/* Sliding Accent Underline Indicator */}
                <span
                  className="absolute bottom-1 left-3 right-3 h-[2px] bg-gradient-to-r from-accent via-[#F5CD79] to-accent rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out shadow-[0_0_8px_rgba(217,164,65,0.6)] pointer-events-none"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>

          {/* Hire Me + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="btn-press hidden md:inline-flex items-center px-5 py-2 text-sm font-semibold rounded-full bg-accent text-background hover:bg-[#e4ad46] hover:scale-105 hover:shadow-[0_0_22px_rgba(217,164,65,0.5)] active:scale-95 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Hire Me
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-muted hover:text-foreground transition-colors rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-card-border">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="btn-press block mt-2 text-center px-5 py-2 text-sm font-semibold rounded-full bg-accent text-background hover:bg-[#e4ad46] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(217,164,65,0.45)] active:scale-95 transition-all duration-200"
            >
              Hire Me
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

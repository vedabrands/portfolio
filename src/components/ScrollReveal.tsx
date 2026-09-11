"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const elements = document.querySelectorAll("[data-reveal]");
      if (!elements.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -40px 0px",
          threshold: 0.1,
        }
      );

      elements.forEach((el) => observer.observe(el));
    }, 60);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}

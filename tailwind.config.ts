import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0B",
        foreground: "#EDEDED",
        muted: "#8A8A8E",
        accent: "#D9A441",
        card: "#141416",
        "card-border": "#232326",
      },
      fontFamily: {
        display: [
          "var(--font-display)",
          '"Anton"',
          '"Archivo Black"',
          "Impact",
          "sans-serif",
        ],
        body: ["var(--font-body)", '"Inter"', "sans-serif"],
        mono: ["var(--font-mono)", '"JetBrains Mono"', "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;

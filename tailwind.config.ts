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
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "drift-1": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(80px, 100px, 0) scale(1.08)" },
          "66%": { transform: "translate3d(-60px, 60px, 0) scale(0.94)" },
        },
        "drift-2": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(-90px, -70px, 0) scale(1.10)" },
          "66%": { transform: "translate3d(60px, -90px, 0) scale(0.92)" },
        },
        "drift-3": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(70px, -50px, 0) scale(1.06)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        marquee: "marquee 26s linear infinite",
        "drift-1": "drift-1 22s ease-in-out infinite",
        "drift-2": "drift-2 26s ease-in-out infinite",
        "drift-3": "drift-3 19s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

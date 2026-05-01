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
        // Legacy (keep for existing components)
        dark: "#030C10",
        card: "#0A1520",
        cardHover: "#0F1E30",
        accentBlue: "#00D4FF",
        neon: "#00FF87",
        darker: "#020A0E",
        // New design system
        void: "#030C10",
        neonGreen: "#00FF87",
        neonCyan: "#00D4FF",
        neonPurple: "#7B2FFF",
        surface: "rgba(0,255,135,0.04)",
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)"],
        poppins: ["var(--font-poppins)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-glow": "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,255,135,0.15) 0%, transparent 70%)",
        "card-glow": "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,255,135,0.06) 0%, transparent 70%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "marquee": "marquee 30s linear infinite",
        "scan": "scan 8s linear infinite",
        "glow-border": "glowBorder 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,255,135,0.3), 0 0 60px rgba(0,255,135,0.1)" },
          "50%": { boxShadow: "0 0 40px rgba(0,255,135,0.6), 0 0 120px rgba(0,255,135,0.2)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        glowBorder: {
          "0%, 100%": { borderColor: "rgba(0,255,135,0.3)" },
          "50%": { borderColor: "rgba(0,255,135,0.9)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

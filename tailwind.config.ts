import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bass: "#2E6E3D",
        bassLight: "#3D9451",
        trophyGold: "#D4AF37",
        goldLight: "#E8CC6E",
        midnight: "#0C1A23",
        midnightLight: "#162D3D",
        mist: "#F5F1E6",
        deepPanel: "#132532",
        deeperPanel: "#1A2C3A",
        liftedPanel: "#1E3548",
        copyLight: "#F5F1E6",
        copyMuted: "#C9D3DA",
        copyDark: "#0C1A23",
        copyDarkMuted: "#546674",
        electric: "#4FC3F7",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        badge: "0 12px 40px rgba(19, 37, 50, 0.45)",
        glow: "0 0 25px rgba(212, 175, 55, 0.25)",
        glowBlue: "0 0 25px rgba(79, 195, 247, 0.2)",
        cardHover: "0 20px 60px rgba(3, 12, 20, 0.6), 0 0 30px rgba(212, 175, 55, 0.15)",
      },
      backgroundImage: {
        heroMesh: "radial-gradient(circle at 20% 30%, rgba(79, 195, 247, 0.10), transparent 50%), radial-gradient(circle at 80% 15%, rgba(79, 195, 247, 0.08), transparent 55%)",
        shimmer: "linear-gradient(45deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 60%)",
        sectionGlow: "radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.06), transparent 60%)",
        sectionGlowBlue: "radial-gradient(ellipse at 50% 0%, rgba(79, 195, 247, 0.06), transparent 60%)",
      },
      animation: {
        "spin-slow": "spin 12s linear infinite",
        shimmer: "shimmer 2s infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-100%" },
          "100%": { backgroundPosition: "200%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

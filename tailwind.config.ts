import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bass: "#2E6E3D",
        trophyGold: "#D4AF37",
        midnight: "#0C1A23",
        mist: "#F5F1E6",
        deepPanel: "#132532",
        deeperPanel: "#1A2C3A",
        copyLight: "#F5F1E6",
        copyMuted: "#C9D3DA",
        copyDark: "#0C1A23",
        copyDarkMuted: "#546674",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        badge: "0 12px 40px rgba(19, 37, 50, 0.45)",
      },
      backgroundImage: {
        heroMesh: "radial-gradient(circle at 15% 25%, rgba(212, 175, 55, 0.18), transparent 50%), radial-gradient(circle at 85% 10%, rgba(46, 110, 61, 0.45), transparent 55%)",
        shimmer: "linear-gradient(45deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 60%)",
      },
      animation: {
        "spin-slow": "spin 12s linear infinite",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-100%" },
          "100%": { backgroundPosition: "200%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

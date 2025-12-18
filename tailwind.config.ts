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
        heroMesh: "radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(46, 110, 61, 0.35), transparent 40%)",
      },
    },
  },
  plugins: [],
};

export default config;

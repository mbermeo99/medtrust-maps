import type { Config } from "tailwindcss";

// MedTrust Maps — Midnight Mint palette (extraído del Stitch)
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces
        background: "#0e0e0e",
        surface: "#131313",
        "surface-low": "#1c1b1b",
        "surface-high": "#2a2a2a",
        "surface-bright": "#393939",
        "surface-highest": "#353534",
        // Text
        foreground: "#e5e2e1",
        "muted-fg": "#bccabb",
        // Brand
        primary: "#6bfb9a",
        "primary-dim": "#4de082",
        "primary-container": "#4ade80",
        "on-primary": "#003919",
        // Borders / outlines
        outline: "#869486",
        "outline-variant": "#3d4a3e",
        // States
        danger: "#ffb4ab",
        "danger-container": "#93000a",
        // Accent (para badges)
        accent: "#a3ffb5",
      },
      fontFamily: {
        headline: ["var(--font-manrope)", "Manrope", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "2.5rem",
      },
      boxShadow: {
        glow: "0 0 40px rgba(107, 251, 154, 0.18)",
      },
      backgroundImage: {
        "radial-mint":
          "radial-gradient(ellipse at 50% 20%, rgba(107,251,154,0.08) 0%, transparent 60%)",
      },
    },
  },
  plugins: [],
};
export default config;

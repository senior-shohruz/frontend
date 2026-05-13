import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // Refined neutrals — Linear-inspired
        ink: {
          50:  "#f8f8f7",
          100: "#f1f0ee",
          200: "#e6e4e0",
          300: "#d2cfc8",
          400: "#9c988e",
          500: "#6b675e",
          600: "#4a4740",
          700: "#34322d",
          800: "#222220",
          900: "#161614",
          950: "#0c0c0b",
        },
        // Accent — warm amber, not generic blue/purple
        accent: {
          50:  "#fdf8f0",
          100: "#faecd6",
          200: "#f3d3a3",
          300: "#ecb46d",
          400: "#e29547",
          500: "#d97a2c",
          600: "#bb5d23",
          700: "#984621",
          800: "#7a3920",
          900: "#65301d",
        },
        // Status hues
        success: "#1d7d4a",
        danger:  "#c1392b",
        warning: "#d97a2c",
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.01em" }],
        xs:    ["0.75rem",   { lineHeight: "1rem", letterSpacing: "0" }],
        sm:    ["0.8125rem", { lineHeight: "1.25rem", letterSpacing: "0" }],
        base:  ["0.9375rem", { lineHeight: "1.5rem", letterSpacing: "-0.005em" }],
        lg:    ["1.0625rem", { lineHeight: "1.625rem", letterSpacing: "-0.01em" }],
        xl:    ["1.25rem",   { lineHeight: "1.75rem", letterSpacing: "-0.015em" }],
        "2xl": ["1.5rem",    { lineHeight: "2rem", letterSpacing: "-0.02em" }],
        "3xl": ["1.875rem",  { lineHeight: "2.25rem", letterSpacing: "-0.025em" }],
        "4xl": ["2.5rem",    { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "5xl": ["3.5rem",    { lineHeight: "1.05", letterSpacing: "-0.035em" }],
        "6xl": ["4.5rem",    { lineHeight: "1.02", letterSpacing: "-0.04em" }],
      },
      borderRadius: {
        none: "0",
        sm:   "3px",
        DEFAULT: "5px",
        md:   "7px",
        lg:   "10px",
        xl:   "14px",
        "2xl": "20px",
      },
      boxShadow: {
        "subtle":  "0 1px 2px 0 rgb(22 22 20 / 0.04)",
        "soft":    "0 1px 3px 0 rgb(22 22 20 / 0.05), 0 1px 2px -1px rgb(22 22 20 / 0.05)",
        "card":    "0 1px 0 0 rgb(22 22 20 / 0.04), 0 4px 12px -2px rgb(22 22 20 / 0.04)",
        "popover": "0 8px 24px -4px rgb(22 22 20 / 0.08), 0 2px 6px -2px rgb(22 22 20 / 0.06)",
        "focus":   "0 0 0 3px rgb(217 122 44 / 0.18)",
      },
      animation: {
        "fade-in":     "fadeIn 0.2s ease-out",
        "slide-up":    "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in":    "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "shimmer":     "shimmer 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

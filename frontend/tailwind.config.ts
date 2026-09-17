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
        digonto: {
          navy: {
            950: "#071630",
            900: "#0b2149",
            800: "#0f2f64",
            700: "#154286",
            600: "#1c58b0",
            500: "#2563eb",
          },
          blue: {
            DEFAULT: "#1e5eb3",
            light: "#3b82f6",
            dark: "#144280",
            soft: "#e8f2fe",
          },
          green: {
            DEFAULT: "#00a86b",
            emerald: "#059669",
            light: "#10b981",
            soft: "#e6f8f1",
          },
          gold: {
            DEFAULT: "#f59e0b",
            amber: "#d97706",
            light: "#fbbf24",
            soft: "#fef3c7",
          },
          bg: {
            tint: "#dcf0f8",
            soft: "#f3f7fa",
            card: "#ffffff",
          },
        },
      },
      fontFamily: {
        bengali: ["var(--font-hind-siliguri)", "Hind Siliguri", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px -1px rgba(0, 0, 0, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 6px 16px -2px rgba(0, 0, 0, 0.09), 0 2px 6px -1px rgba(0, 0, 0, 0.05)",
        floating: "0 10px 25px -5px rgba(11, 33, 73, 0.15), 0 8px 10px -6px rgba(11, 33, 73, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;

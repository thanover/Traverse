import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          bg: "#0f1117",
          DEFAULT: "#161921",
          alt: "#1c1f2b",
        },
        border: {
          DEFAULT: "#252836",
          light: "#1e2130",
        },
        text: {
          DEFAULT: "#e2e8f0",
          muted: "#64748b",
          dim: "#3e4459",
        },
        stage: {
          dev: "#818cf8",
          test: "#38bdf8",
          mo: "#fbbf24",
          prod: "#34d399",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "'Helvetica Neue'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;

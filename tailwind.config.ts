import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // GLASSHAVEN palette
        slate: {
          950: "#0d1418",
          900: "#141c21",
          850: "#1a242b",
          800: "#202c33",
        },
        ink: {
          DEFAULT: "#3b4a52",
          light: "#4a5a64",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.35)",
      },
      borderRadius: {
        glass: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;

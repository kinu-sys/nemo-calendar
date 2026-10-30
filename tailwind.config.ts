import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: "#fbf5f4",
          soft: "#faf4f2",
          card: "#ffffff",
        },
        pink: {
          accent: "#e89587",
          hover: "#dc8475",
          soft: "#fcf1ee",
          border: "#ebd3cd",
          badge: "#faeee9",
        },
        text: {
          main: "#5c4d49",
          muted: "#9e8e8a",
          light: "#cfc2be",
        },
        card: {
          border: "#f2e3df",
        },
        sun: "#d66d5e",
        sat: "#6e8aa6",
        weekday: "#8c7a75",
      },
      fontFamily: {
        zen: ["'Zen Maru Gothic'", "sans-serif"],
        quicksand: ["'Quicksand'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px rgba(215, 175, 168, 0.12)",
        subtle: "0 2px 8px rgba(215, 175, 168, 0.08)",
        pink: "0 3px 10px rgba(232, 149, 135, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;

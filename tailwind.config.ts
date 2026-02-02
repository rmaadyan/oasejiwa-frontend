import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#68b7f7",
          dark: "#1964ae",
          nav: "#D1EAFF",
          navText: "#2B5379",
        },
        "bg-base": "#ECF7FF",
        "text-base": "#2B5379",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundColor: {
        "base": "#ECF7FF",
      },
      textColor: {
        "base": "#2B5379",
      },
    },
  },
  plugins: [],
};
export default config;

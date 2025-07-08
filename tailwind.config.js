/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        white: "var(--color-white)",
        black: "var(--color-black)",
      },
      fontFamily: {
        bellota: "var(--font-bellota)",
        noto: "var(--font-noto)",
      },
    },
  },
  plugins: [],
};

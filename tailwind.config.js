/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#080808",
        accent: "#C3FF2E", // Lime green
        purple: "#A855F7",
        primary: "#FDFDFD",
        gray: {
          900: "#111111",
          800: "#1A1A1A",
          700: "#222222",
          600: "#333333",
          500: "#666666",
          400: "#999999",
        },
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontWeight: {
        black: "900",
        extrabold: "800",
        bold: "700",
        semibold: "600",
        medium: "500",
        regular: "400",
      },
      borderRadius: {
        "3xl": "24px",
        "4xl": "32px",
        "5xl": "48px",
      },
    },
  },
  plugins: [],
};

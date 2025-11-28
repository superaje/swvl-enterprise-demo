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
        swvl: {
          primary: "#FC153B", // SWVL Red - Primary brand color (matches logo)
          secondary: "#004E89", // SWVL Blue
          accent: "#FF6B35", // Orange/Red accent
          dark: "#1A1A1A", // Dark text
          light: "#F5F5F5", // Light background
          gray: {
            100: "#F7F7F7",
            200: "#E5E5E5",
            300: "#CCCCCC",
            400: "#999999",
            500: "#666666",
            600: "#333333",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "sans-serif"],
      },
      backgroundImage: {
        'gradient-swvl': 'linear-gradient(135deg, #FC153B 0%, #FF6B35 100%)',
        'gradient-hero': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'gradient-light': 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      },
    },
  },
  plugins: [],
};
export default config;


import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        custom: '#001C4A',
        cred: '#A20604', 
        primary: "#f2f2f2",
        first: "#1A2633",
        second: "#334D66",
        orange: "#FDAC4A ",
        brown: "#664C33",
        brownalt: "#99724D",
        gradient1: "#7fdacd",
        gradient2: "#8ddfd3",
        gradient3: "#9be3d8",
        gradient4: "#aae7de",
        contrast1: "#020618",
        contrast2: "#111526",
        contrast3: "#2f3241",
        contrast4: "#797b85",
        secondary: "#000000",
        button1: "#007CF2",
        button1alt: "#003B73",
        button2: "#64042C",
        button2alt: "#4C2A38",
      },
    },
  },
  plugins: [],
};
export default config;

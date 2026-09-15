import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { forest: "#0D2E14", survey: "#2B6636", topo: "#7BC635", mist: "#F4F9F5", ink: "#14231A" },
      fontFamily: { display: ["var(--font-display)", "system-ui", "sans-serif"], body: ["var(--font-body)", "system-ui", "sans-serif"] },
      boxShadow: { lift: "0 18px 45px -22px rgba(13, 46, 20, 0.45)", glow: "0 0 0 1px rgba(123, 198, 53, 0.25), 0 18px 55px -28px rgba(123, 198, 53, 0.72)" },
      backgroundImage: { topography: "radial-gradient(circle at 82% 14%, rgba(123,198,53,.19), transparent 0 19rem), repeating-linear-gradient(175deg, transparent 0 43px, rgba(123,198,53,.09) 44px, transparent 46px)" },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;

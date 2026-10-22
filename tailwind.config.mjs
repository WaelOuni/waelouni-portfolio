/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#204FBB",
          600: "#1D4ED8",
          700: "#1E40AF"
        },
        ink: "#12253D",
        muted: "#64748B",
        line: "#DCE2E9",
        canvas: "#FAFAF9"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

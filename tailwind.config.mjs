/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E40AF"
        },
        ink: "#0F172A",
        muted: "#64748B",
        line: "#E2E8F0",
        canvas: "#F8FAFC"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

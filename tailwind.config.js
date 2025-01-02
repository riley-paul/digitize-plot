import { radixThemePreset } from 'radix-themes-tw';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  presets: [radixThemePreset],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  plugins: [require("tailwindcss-animate")],
};

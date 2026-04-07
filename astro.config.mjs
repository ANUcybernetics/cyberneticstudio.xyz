// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import remarkSmartypants from "remark-smartypants";
import { astromotion } from "astromotion";

export default defineConfig({
  site: "https://cyberneticstudio.xyz",
  integrations: [
    svelte(),
    astromotion({ theme: "./src/decks/theme.css" }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    smartypants: false,
    remarkPlugins: [
      /** @type {any} */ ([remarkSmartypants, { dashes: "oldschool" }]),
    ],
  },
});

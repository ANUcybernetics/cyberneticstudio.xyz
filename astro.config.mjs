// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import remarkSmartypants from "remark-smartypants";

export default defineConfig({
  site: "https://cyberneticstudio.xyz",
  integrations: [svelte()],
  markdown: {
    smartypants: false,
    remarkPlugins: [
      /** @type {any} */ ([remarkSmartypants, { dashes: "oldschool" }]),
    ],
  },
});

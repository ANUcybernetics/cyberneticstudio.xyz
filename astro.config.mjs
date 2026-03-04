// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import remarkSmartypants from "remark-smartypants";
import { deckPreprocessor } from "./src/lib/deck-preprocessor.ts";

const shimPath = new URL(
  "./src/lib/sveltekit-shims/environment.js",
  import.meta.url,
).pathname;

export default defineConfig({
  site: "https://cyberneticstudio.xyz",
  integrations: [svelte({ preprocess: [deckPreprocessor()] })],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { "$app/environment": shimPath },
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          {
            name: "sveltekit-shim",
            setup(build) {
              build.onResolve({ filter: /^\$app\/environment$/ }, () => ({
                path: shimPath,
              }));
            },
          },
        ],
      },
    },
  },
  markdown: {
    smartypants: false,
    remarkPlugins: [
      /** @type {any} */ ([remarkSmartypants, { dashes: "oldschool" }]),
    ],
  },
});

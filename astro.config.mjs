// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import anuTheme from "astro-theme-anu";

export default defineConfig({
  site: "https://cyberneticstudio.xyz",
  integrations: [
    mdx(),
    svelte(),
    anuTheme({ defaultLayout: "src/layouts/PageLayout.astro" }),
  ],
});

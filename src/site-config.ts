import { defineSiteConfig } from "astro-theme-anu/types";

export const siteConfig = defineSiteConfig({
  name: "Cybernetic Studio",
  links: [
    { text: "Projects", href: "/#projects" },
    { text: "News", href: "/news/" },
    { text: "People", href: "/people/" },
  ],
  licence: "CC-BY-4.0",
});

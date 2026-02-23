# cyberneticstudio.xyz

Portfolio site. Astro (static) + Vue (client-side SPA experiments). GitHub Pages.

## Commands

All commands via `mise exec -- npm run <script>`:
`dev`, `build` (type-check + build), `lint` (oxlint), `fmt` (oxfmt, .ts/.js only), `test` (vitest), `test:e2e` (playwright).

## Key patterns

- **Projects**: markdown + co-located images in `src/data/projects/<slug>/index.md`, content collection defined in `src/content.config.ts`
- **Experiments**: Vue source in `src/experiments/<name>/App.vue`, Astro page at `src/pages/experiments/<name>/index.astro` using `ExperimentLayout` + `client:only="vue"` (no SSR)
- **Styling**: vanilla CSS, design tokens in `src/styles/global.css` --- black bg, white fg, `#ccff00` accent with neon glow effects
- **Fonts**: Tilt Neon (display/headings), Space Grotesk (body) --- self-hosted woff2 in `public/fonts/`
- **VCS**: jj colocated mode --- always use `jj`, never bare `git`

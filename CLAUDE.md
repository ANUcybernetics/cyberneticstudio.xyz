# cyberneticstudio.xyz

Portfolio site. Astro (static) + Svelte (client-side SPA experiments). GitHub Pages.

## Commands

All commands via `mise exec -- npm run <script>`:
`dev`, `build` (type-check + build), `lint` (oxlint), `fmt` (oxfmt, .ts/.js only), `test` (vitest), `test:e2e` (playwright).

## Key patterns

- **Projects**: markdown + co-located images in `src/data/projects/<slug>/index.md`, content collection defined in `src/content.config.ts`
- **Experiments**: Svelte source in `src/experiments/<name>/App.svelte`, Astro page at `src/pages/experiments/<name>/index.astro` using `ExperimentLayout` + `client:only="svelte"` (no SSR)
- **Styling**: vanilla CSS, design tokens in `src/styles/global.css` --- black bg, white fg, `#e6ff44` accent with glow effects
- **Fonts**: Space Grotesk (all text) --- self-hosted woff2 in `public/fonts/`
- **VCS**: jj colocated mode --- always use `jj`, never bare `git`

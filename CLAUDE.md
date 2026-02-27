# cyberneticstudio.xyz

Portfolio site. Astro (static) + Svelte (client-side standalone projects). GitHub Pages.

## Commands

All commands via `mise exec -- npm run <script>`:
`dev`, `build` (type-check + build), `lint` (oxlint), `fmt` (oxfmt, .ts/.js only), `test` (vitest), `test:e2e` (playwright).

## Key patterns

- **Projects**: markdown + co-located images in `src/data/projects/<slug>/index.md`, content collection defined in `src/content.config.ts`. Standard projects use `ProjectLayout`; standalone projects (`layout: "standalone"` in frontmatter) get their own explicit Astro page importing a Svelte component
- **News**: markdown in `src/data/news/<slug>/index.md`, paginated listing at `/news/`, individual posts via `NewsLayout`
- **Standalone projects**: Svelte source in `src/experiments/<name>/App.svelte`, Astro page at `src/pages/projects/<name>/index.astro` using `StandaloneLayout` + `client:only="svelte"` (no SSR)
- **Nav**: Projects, News, People
- **Styling**: vanilla CSS, design tokens in `src/styles/global.css` --- `#0d0d0d` bg, white fg, `#e6ff44` accent with glow effects. Modern CSS: view transitions, `@starting-style`, `:has()`, scroll-driven animations, CSS nesting, container queries
- **Fonts**: Space Grotesk (all text) --- self-hosted woff2 in `public/fonts/`
- **View transitions**: `<ClientRouter />` in `BaseHead` for site-wide cross-fade; hero images morph between card and detail page via `view-transition-name`
- **VCS**: jj colocated mode --- always use `jj`, never bare `git`

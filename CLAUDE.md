# cyberneticstudio.xyz

Portfolio site for Cybernetic Studio. Built with Astro + Vue.

## Stack

- **Framework**: Astro (static site) with Vue (client-side SPA experiments)
- **Styling**: vanilla CSS with custom properties as design tokens
- **Fonts**: Tilt Neon (display), Space Grotesk (body) --- self-hosted woff2
- **Linting**: oxlint (`.oxlintrc.json`)
- **Formatting**: oxfmt (`.ts`/`.js` only --- doesn't support `.vue`/`.astro`)
- **Testing**: Vitest (unit), Playwright (e2e)
- **VCS**: jj colocated mode (`jj` workflow locally, `git` for GitHub)
- **Hosting**: GitHub Pages

## Commands

```sh
mise exec -- npm run dev       # dev server
mise exec -- npm run build     # type-check + static build
mise exec -- npm run lint      # oxlint
mise exec -- npm run fmt       # oxfmt
mise exec -- npm run test      # vitest
mise exec -- npm run test:e2e  # playwright
```

## Architecture

### Content

Projects live in `src/data/projects/<slug>/index.md` with co-located images.
Defined as an Astro content collection in `src/content.config.ts`.

### SPA experiments

Each experiment has:
1. Vue source in `src/experiments/<name>/App.vue`
2. Astro page at `src/pages/experiments/<name>/index.astro`
3. Uses `ExperimentLayout` and `client:only="vue"` (no SSR)

For experiments needing client-side routing, use `[...all].astro` catch-all.

### Design tokens

Defined in `src/styles/global.css`:
- `--color-bg: #000`, `--color-fg: #fff`, `--color-accent: #ccff00`
- `--font-display` (Tilt Neon), `--font-body` (Space Grotesk)
- `--glow-accent` for neon glow effects

# cyberneticstudio.xyz

Portfolio site. Astro static build using the `astro-theme-anu` theme (ANU institutional look), plus Svelte for the home-page Lissajous wave. Deploys to GitHub Pages.

## Commands

All commands via `mise exec -- pnpm run <script>`:
`dev`, `build` (type-check + build), `lint` (oxlint), `fmt` (oxfmt, .ts/.js only).

## Theme

The theme comes from `astro-theme-anu` (pulled from the ANU GitLab mirror) and supplies the `BaseLayout`, `ContentLayout`, `Card`, `CardGrid`, `Pagination`, `Hero`, `Nav`, `Footer`, and the Pagefind-backed search dialog. `src/site-config.ts` declares site name, nav links, and licence via `defineSiteConfig` --- update that file to change the nav.

The theme runs its own `astro:build:done` checks: a11y (axe), broken-link checking, and search-index build. Failures block the build.

## Content collections (`src/content.config.ts`)

- **projects** --- `src/data/projects/<slug>/index.md` with co-located images. Fields: `title`, `description`, `creators`, `materials`, `date`, `hero` (image), `heroAlt`, `url`, `github`, `publications`, `relatedProjects`, `order`, `layout`. Rendered via `src/layouts/ProjectLayout.astro`, which wraps `ContentLayout` and adds a structured metadata `<dl>` above the body
- **news** --- `src/data/news/<slug>/index.md`. Fields: `title`, `description`, `date`, `hero`, `heroAlt`. Paginated listing at `/news/` using theme `Pagination`; posts via `src/layouts/NewsLayout.astro`
- **people** --- `src/data/people/<slug>/index.md` with co-located photo. Fields: `name`, `role`, `photo`, `photoAlt`, `order`. Bio in markdown body. Rendered inline on `/people/`

## Pages

- `src/pages/index.astro` --- home: Lissajous hero + Projects `CardGrid` + News `CardGrid`
- `src/pages/projects/[slug].astro` --- dynamic project routes (filters out any `layout: "standalone"` entries for future use)
- `src/pages/news/[...page].astro` and `[slug].astro` --- paginated news listing + per-post
- `src/pages/people/index.astro` --- reads the people collection, renders cards

## Layouts

- `src/layouts/PageLayout.astro` --- default layout for MDX pages (set via `anuTheme({ defaultLayout: ... })`), wraps theme `BaseLayout` and spreads `siteConfig`
- `src/layouts/ProjectLayout.astro` / `NewsLayout.astro` --- thin wrappers over theme `ContentLayout` that add collection-specific metadata

## Styling

Theme-driven --- no custom global stylesheet. Theme tokens (CSS custom properties, `--at-*` and `--anu-*` prefixes) come from `astro-theme-anu/styles/base.css`. The home-page `LissajousWave.svelte` reads `--at-accent` at runtime so it picks up light/dark theme changes automatically.

## Images

Co-located with content (`./hero.avif` in the markdown directory) and validated via the collection's `image()` schema. Theme `Hero`/`Card` components run images through Astro's image pipeline.

# cyberneticstudio.xyz

Portfolio site. Astro (static) + Svelte (client-side standalone projects). GitHub Pages.

## Commands

All commands via `mise exec -- pnpm run <script>`:
`dev`, `build` (type-check + build), `lint` (oxlint), `fmt` (oxfmt, .ts/.js only), `test` (vitest), `test:e2e` (playwright).

## Key patterns

- **Projects**: markdown + co-located images in `src/data/projects/<slug>/index.md`, content collection defined in `src/content.config.ts`. Standard projects use `ProjectLayout`; standalone projects (`layout: "standalone"` in frontmatter) get their own explicit Astro page importing a Svelte component
- **News**: markdown in `src/data/news/<slug>/index.md`, paginated listing at `/news/`, individual posts via `NewsLayout`
- **Standalone projects** (planned, not yet implemented): Svelte source in `src/experiments/<name>/App.svelte`, Astro page at `src/pages/projects/<name>/index.astro` using `StandaloneLayout` + `client:only="svelte"` (no SSR)
- **Nav**: Projects, News, People
- **Styling**: vanilla CSS, design tokens in `src/styles/global.css` --- `#0d0d0d` bg, white fg, `#e6ff44` accent with glow effects. Modern CSS: view transitions, `@starting-style`, `:has()`, scroll-driven animations, CSS nesting, container queries
- **Fonts**: Space Grotesk (all text) --- self-hosted woff2 in `public/fonts/`
- **Images**: never use regular raster images on the site. Always generate an SVG version using `mise exec -- uv run tools/image-to-svg.py <input> -o <output>` and use the SVG instead. SVGs go in `public/svg/` and are displayed via the `LineSvg` component with accent-coloured animated paths
- **View transitions**: `<ClientRouter />` in `BaseHead` for site-wide cross-fade; hero images morph between card and detail page via `view-transition-name`

## Decks (slide presentations)

Markdown-authored slide decks powered by the `astromotion` package (`github:benswift/astromotion`) --- Astro + Reveal.js + Marp-inspired syntax. No JS framework shipped for markdown decks. Full-viewport, not listed in navigation --- accessed by direct URL only.

### File structure

- slides: `src/decks/<name>.deck.md` --- top-level deck files where `<name>` is the slug (URL: `/decks/<name>/`)
- shared assets: `src/decks/assets/` (shared bg images across decks)
- listing page: `src/pages/decks/index.astro` (uses site's `BaseLayout`)
- route page: injected by `astromotion` integration (catch-all `/decks/[...slug]`)
- theme, layout: provided by `astromotion` package

### Authoring

Slides are `.deck.md` files in `src/decks/` processed by astromotion's Vite plugin into static HTML `<section>` elements. Separate slides with `\n---\n`.

- `<!-- _class: impact -->` --- set slide CSS class (available: `impact`, `banner`, `quote`, `centered`)
- `<!-- notes: Speaker notes here -->` --- presenter notes
- `![bg](url)` --- full-bleed background image (also `contain`, `cover`). Relative paths resolve via Vite: `./assets/photo.jpg` for shared images in `src/decks/assets/`; absolute paths (`/images/...`) reference `public/`
- `![bg left:50%](url)` / `![bg right:40%](url)` --- split layout with image
- `![bg blur:5px brightness:0.7](url)` --- CSS filters on background
- `![qr](url)` --- generates animated SVG QR code at build time
- `<!-- _class: anu-logo -->` / `<!-- _class: socy-logo -->` --- full-slide animated SVG logos
- `<!-- @include ./shared-intro.md -->` --- inline markdown from another file
- `.columns` CSS class available for two-column grid layout within slide content
- smartypants typography applied automatically (curly quotes, em dashes)

For interactive decks needing Svelte, use `.deck.svelte` instead (requires `@astrojs/svelte` + `deckPreprocessor()` in astro config).

### Layout notes

- deck pages use `DeckLayout` from `astromotion` (no `<ClientRouter />` --- would conflict with Reveal.js keyboard navigation)
- decks import their own theme CSS (visually independent from site's `global.css`)
- `@tailwindcss/vite` in `astro.config.mjs` only processes CSS files containing `@import "tailwindcss"` --- rest of site unaffected

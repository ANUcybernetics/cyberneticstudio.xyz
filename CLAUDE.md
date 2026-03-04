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

## Decks (slide presentations)

Markdown-authored slide decks using animotion (Svelte + Reveal.js + Tailwind). Full-viewport, not listed in navigation --- accessed by direct URL only.

### File structure

- slides: `src/decks/<slug>/slides.deck.svelte`
- Astro page: `src/pages/decks/<slug>/index.astro` (uses `DeckLayout` + `client:only="svelte"`)
- theme: `src/decks/deck-theme.css` (ANU gold/copper palette, Public Sans via Google Fonts)
- preprocessor: `src/lib/deck-preprocessor.ts` (registered in `astro.config.mjs`)
- SvelteKit shim: `src/lib/sveltekit-shims/environment.js` (mocks `$app/environment` for animotion's Transition component)

### Authoring

Slides are `.deck.svelte` files in `src/decks/` that get preprocessed: markdown content is converted to HTML and wrapped in `<Presentation><Slide>` components. Separate slides with `\n---\n`.

- `<!-- _class: impact -->` --- set slide CSS class (available: `impact`, `quote`, `centered`)
- `<!-- notes: Speaker notes here -->` --- presenter notes
- `![bg](url)` --- full-bleed background image (also `contain`, `cover`)
- `![bg left:50%](url)` / `![bg right:40%](url)` --- split layout with image
- `![bg blur:5px brightness:0.7](url)` --- CSS filters on background
- sections containing animotion components (`<Action>`, `<Code>`, `<Transition>`) skip markdown processing and pass through as raw Svelte
- `<script>` and `<style>` blocks are preserved; auto-imports for animotion components are added if missing
- `.columns` CSS class available for two-column grid layout within slide content

### Animotion docs

Upstream animotion documentation: https://animotion.pages.dev/llms.txt

### Layout notes

- `DeckHead.astro` is identical to `BaseHead.astro` but without `<ClientRouter />` (would conflict with Reveal.js keyboard navigation)
- `DeckLayout.astro` imports `deck-theme.css` instead of `global.css` (decks are visually independent)
- `@tailwindcss/vite` in `astro.config.mjs` only processes CSS files containing `@import "tailwindcss"` --- rest of site unaffected

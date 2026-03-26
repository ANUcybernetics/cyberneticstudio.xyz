---
id: TASK-19
title: Replace lissajous hero images with stylised SVG line drawings
status: Done
assignee: []
created_date: '2026-03-21 01:41'
updated_date: '2026-03-25 23:45'
labels:
  - frontend
  - design
dependencies: []
references:
  - tools/image-to-svg.py
  - src/components/SvgHero.astro
  - public/heroes/
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replace the current per-project lissajous canvas animations (generated from `scripts/generate-lissajous-2d.ts` and rendered via `LissajousImage.svelte`) with stylised SVG line drawings derived from each project's reference/hero image.

The new approach uses `tools/image-to-svg.py` (committed in 8dd4472) which runs edge detection (XDoG or Canny) through potrace to produce bezier-curve SVG paths. The SVGs can include a subtle `feTurbulence` + `feDisplacementMap` animation for organic movement.

This replaces the JSON-based lissajous data pipeline (`/lissajous/*.json` files loaded at runtime) with static SVG assets that are lighter, resolution-independent, and visually tied to each project's actual imagery.

### Current architecture

- `scripts/generate-lissajous-2d.ts` generates per-project JSON data files from reference images or text
- `LissajousImage.svelte` fetches JSON at runtime and renders animated curves on a `<canvas>`
- `LissajousWave.svelte` renders the homepage hero animation
- Used in: `ProjectCard.astro`, `ProjectLayout.astro`, `index.astro`, `test-lissajous.astro`

### Target architecture

- Run `tools/image-to-svg.py` on each project's hero image to produce a static `.svg` file (with `--animate` for the displacement wobble)
- Replace `LissajousImage.svelte` canvas rendering with inline SVG (either `<img>` tag or inlined SVG markup)
- Update `ProjectCard.astro` and `ProjectLayout.astro` to use the new SVG assets
- Preserve the view-transition-name morphing between card and detail page hero images
- Decide whether the homepage hero (`LissajousWave.svelte`) should also change or remain as-is
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Each project has a stylised SVG line drawing generated from its reference image via tools/image-to-svg.py
- [x] #2 SVG hero images display correctly in ProjectCard and ProjectLayout with the subtle displacement animation
- [x] #3 View transitions (morph between card and detail page) continue to work with SVG hero images
- [x] #4 The lissajous JSON data pipeline (generate-lissajous-2d.ts, /lissajous/*.json, LissajousImage.svelte) is removed
- [x] #5 Build passes with no regressions
- [x] #6 SVG file sizes are reasonable (under ~200KB each after potrace optimisation)
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Replaced lissajous canvas heroes with stylised SVG line drawings using canny edge detection + potrace. Each project's hero image is processed into a clean inline SVG with per-path CSS animations (sinusoidal pulse with staggered timing via `--i` custom property). Hardware-accelerated using only transform and opacity. Respects prefers-reduced-motion. Static fallback for no-JS. SVGs optimised with svgo (11--46KB each). Removed: LissajousImage.svelte, generate-lissajous-2d.ts, /lissajous/*.json, test-lissajous page. Kept: LissajousWave.svelte (homepage hero).
<!-- SECTION:FINAL_SUMMARY:END -->

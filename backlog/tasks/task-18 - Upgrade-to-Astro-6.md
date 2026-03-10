---
id: TASK-18
title: Upgrade to Astro 6
status: Done
assignee: []
created_date: '2026-03-10 22:03'
labels:
  - upgrade
  - astro
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Upgrade from Astro 5 to Astro 6, following the same process used for benswift-me.
<!-- SECTION:DESCRIPTION:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Upgraded astro 5→6.0.2, @astrojs/svelte 7→8, @astrojs/check 0.9.6→0.9.7. Moved Zod import from astro:content to astro/zod (Zod 4). Switched vitest config from getViteConfig to plain defineConfig to avoid CJS/ESM conflict with cookie package. Build, lint, and all 108 tests pass.
<!-- SECTION:FINAL_SUMMARY:END -->

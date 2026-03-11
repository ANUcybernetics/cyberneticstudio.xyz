---
id: TASK-9
title: refactor astro animotion deck workflow into a standalone package
status: Done
assignee: []
created_date: '2026-03-04 10:41'
updated_date: '2026-03-11 01:35'
labels: []
dependencies: []
---

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Extracted slide deck infrastructure into the `astromotion` package (github:benswift/astromotion). The package provides an Astro integration, Svelte preprocessor, theme CSS, components, and route injection. cyberneticstudio-xyz now consumes it as a dependency --- all 108 tests pass and build output is unchanged.
<!-- SECTION:FINAL_SUMMARY:END -->

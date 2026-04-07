---
id: TASK-20
title: Replace SCyb horizontal logo SVGs with proper vector versions
status: To Do
assignee: []
created_date: '2026-04-07 03:53'
labels:
  - assets
  - branding
dependencies: []
references:
  - ~/projects/marp-anu/decks/logos/SCyb_Horizontal_GoldWhite.svg
  - ~/projects/marp-anu/decks/logos/SCyb_Horizontal_GoldBlack.svg
  - ~/projects/cyberneticstudio-xyz/src/decks/includes/socy-logo.md
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The two `SCyb_Horizontal_GoldWhite.svg` and `SCyb_Horizontal_GoldBlack.svg` files (used in `marp-anu` and `cyberneticstudio-xyz` logo slides) are raster PNGs wrapped in an SVG container — zero `<path>` elements, just a base64-encoded `<image>`. All the other ANU logo SVGs are proper vector paths.

Need to source or recreate proper vector versions with actual paths, like the ANU primary/secondary logos already have.
<!-- SECTION:DESCRIPTION:END -->

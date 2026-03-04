---
id: TASK-7
title: decks should use *.deck.svelte naming scheme
status: Done
assignee: []
created_date: '2026-03-04 06:09'
updated_date: '2026-03-04 09:10'
labels: []
dependencies: []
---

The animotion + svelte plugin is currently activated by path, but I think it'd
be better activated based on a \*.deck.svelte naming convention. Update the
config and rename the example deck file. Check it all still builds.

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Switched deck preprocessor activation from path-based (`/src/decks/`) to filename-based (`*.deck.svelte`). Renamed `slides.svelte` → `slides.deck.svelte`, updated the preprocessor regex, Astro page, DeckLoader glob, tests, and CLAUDE.md. All 43 tests pass, build clean.
<!-- SECTION:FINAL_SUMMARY:END -->

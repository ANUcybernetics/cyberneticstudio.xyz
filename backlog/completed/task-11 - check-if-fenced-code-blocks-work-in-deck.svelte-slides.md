---
id: TASK-11
title: check if fenced code blocks work in deck.svelte slides
status: Done
assignee: []
created_date: '2026-03-04 10:49'
updated_date: '2026-03-04 11:09'
labels: []
dependencies: []
---

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Fenced code blocks mostly worked but had two bugs: `---` inside code fences incorrectly split slides, and `<script>`/`<style>` tags inside code fences were extracted as real script/style blocks. Fixed by adding a `protectFencedCode`/`restoreFencedCode` mechanism that replaces fenced code blocks with placeholders before script extraction and slide splitting, then restores them before markdown processing. Added 4 new tests covering these cases. Also fixed a stale auto-imports test expectation (missing `getPresentation`). All 60 tests pass.
<!-- SECTION:FINAL_SUMMARY:END -->

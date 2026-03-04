---
id: TASK-14
title: Refactor deck preprocessor to use remark plugin for slide splitting
status: To Do
assignee: []
created_date: '2026-03-04 21:33'
labels:
  - refactor
  - decks
dependencies: []
references:
  - src/lib/deck-preprocessor.ts
  - tests/unit/deck-preprocessor.test.ts
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replace the regex-based pre-processing stage in `src/lib/deck-preprocessor.ts` with a custom remark plugin that handles slide boundaries as AST nodes.

Currently the preprocessor uses regex to:
- protect fenced code blocks with sentinels (`protectFencedCode`)
- split slides on `\n---\n`
- extract metadata comments (`_class:`, `notes:`) with regex
- detect animotion components with regex

A custom remark plugin would:
- handle `---` as a slide separator at the AST level (remark already understands fenced code blocks, so no sentinel protection needed)
- extract metadata from HTML comment nodes in the AST
- detect raw Svelte/animotion components via the AST rather than regex

Available infrastructure: unified 11, remark-parse 11, remark-gfm 4, unist-util-visit 5 (installed but unused). The Svelte preprocessor API only provides raw text, so the remark pipeline is the right place to push structure.
<!-- SECTION:DESCRIPTION:END -->

---
id: TASK-17
title: Unify fundamentals slides between LLMs Unplugged decks
status: To Do
assignee: []
created_date: '2026-03-10 10:06'
labels:
  - decks
  - llms-unplugged
dependencies: []
references:
  - src/decks/llms-unplugged/fundamentals.deck.svelte
  - src/decks/llms-unplugged/fundamentals-pre-trained-model-sampling.deck.svelte
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The `fundamentals.deck.svelte` and `fundamentals-pre-trained-model-sampling.deck.svelte` decks in `src/decks/llms-unplugged/` cover the same "fundamentals" content (training + generation sections) but have diverged. They should share exactly the same slides for these sections so changes only need to be made once.

### Current differences

1. **QR codes vs inline content**: The longer deck uses QR code slides linking to `llmsunplugged.org/lessons/*`, while fundamentals has inline tables (bigram grids) and images. Need to pick one approach.
2. **Heading names**: "Training" vs "Basic training", "Generation" vs "Basic inference", "Pre-trained generation" vs "Pre-trained bigram model". Need to align.
3. **Banner/divider slides**: The longer deck has `<!-- _class: banner -->` divider slides with background images between sections (e.g. "Training" with `bg-div-mechanic.avif`, "Generation" with `bg-div-lessons.avif`). Fundamentals doesn't have these.
4. **Background image differences**: e.g. the title slide uses `bg right:40%` in the longer deck vs `bg` (full bleed) in fundamentals; Shannon slide uses `left:60%` vs `right:60%`.
5. **Icebreaker slide**: Fundamentals has a `<!-- _class: banner -->` on the icebreaker that the longer deck doesn't.
6. **"Who we are" slide**: Eddie's headshot `<img>` is in a different grid cell between the two decks.
7. **Training content**: Fundamentals has inline "See Spot run" preprocessed text example and bigram table; longer deck doesn't.
8. **Inference content**: Fundamentals has the bigram table inline; longer deck uses a QR code instead.
9. **Pre-trained model section**: Fundamentals shows a `bigram-booklet-excerpt.png` image; longer deck uses a QR code.
10. **Ending**: Fundamentals has reflection + Q&A + socy-logo slides; longer deck continues into sampling.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The training and generation slides are byte-for-byte identical between both decks (aside from the frontmatter title)
- [ ] #2 The longer deck's extra sections (pre-trained model, sampling) come after the shared fundamentals content
- [ ] #3 Both decks build and render correctly
<!-- AC:END -->

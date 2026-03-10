---
title: "LLM Library"
description: "Pre-trained language models in printed, hardbound book form --- n-gram frequency tables typeset from classic literature that you can use to generate text with pen, paper, and dice."
creators:
  - Ben Swift
materials: "printed and hardbound books (Libertinus Serif, Typst)"
date: 2025-01-01
hero: ./llm-library-collection.avif
heroAlt: "The LLM Library collection --- hardbound volumes in green, purple, brown, and blue lined up on a shelf"
github: "https://github.com/ANUcybernetics/llms-unplugged"
relatedProjects:
  - llms-unplugged
order: 4
---

The LLM Library is a collection of pre-trained language models in printed, hardbound book form. Each volume contains n-gram frequency tables typeset from a classic work of literature --- the same statistical patterns that underpin modern LLMs, but at human scale. You can hold the entire model in your hands and use it to generate new text with pen, paper, and dice.

![Title page of a Hemingway bigram volume, published by Cybernetic Studio Press](./llm-library-title-page.avif)

## Context

The distinctive feature is the curation. Each volume is built from a specific literary work (or the collected works of an author), then typeset in bigram, trigram, and 4-gram variants. The progression across volumes demonstrates the fundamental trade-off between model size and output quality --- a trigram model of _Frankenstein_ produces noticeably more coherent text than the bigram version, but the book is considerably thicker. Pick up a Hemingway bigram and you get terse, punchy fragments; the _Cloudstreet_ model wanders into something more sprawling. The model _is_ the text it was trained on, in a way that's immediately legible.

Current volumes include Mary Shelley's _Frankenstein_, Tim Winton's _Cloudstreet_, the collected works of Ernest Hemingway, and a synthetic dataset ([TinyStories](https://huggingface.co/datasets/roneneldan/TinyStories)) for comparison. Published by Cybernetic Studio Press under CC BY-NC-SA 4.0.

## Technical details

The booklets are typeset using the same Rust-to-JSON-to-Typst pipeline that generates the grids for [LLMs Unplugged](/projects/llms-unplugged/) workshops. A Rust CLI tokenises the source text and computes n-gram frequency tables, which are exported as JSON and then laid out by a Typst template into A4 pages with four columns of frequency data, binding margins for hardcover production, and front matter including a copyright page and usage instructions. The Library volumes are specifically curated, printed, and hardbound as standalone artefacts rather than disposable workshop materials.

---
title: "LLMs Unplugged"
description: "Hands-on teaching resources for understanding how large language models work. No computers or coding required."
date: 2025-06-01
tags: ["education", "language-models", "unplugged", "teaching"]
url: "https://llmsunplugged.org"
featured: true
---

Most people's mental model of how ChatGPT works is basically "magic" --- and that's a problem if we want informed public discourse about AI. LLMs Unplugged is our attempt to fix that, one dice roll at a time.

The core activity is disarmingly simple: participants count word patterns in a children's book (tally marks on grid paper, tokens in labelled buckets, whatever works), then generate new text through weighted random sampling with dice. No computers, no coding, no hand-waving. Just the actual mechanism that underpins modern language models, running at human scale. Something clicks when you're sitting there rolling dice and watching plausible-ish sentences emerge from pure statistics --- you realise that the difference between your grid paper and GPT-4 is scale, not sorcery.

We've run these activities with hundreds of participants, from primary school students through to senior executives, and the format adapts surprisingly well across that range. The project builds on the [CS Unplugged](https://csunplugged.org) tradition but fills a genuine gap in AI/LLM-specific unplugged resources. For those who want to go deeper, advanced lessons cover temperature and truncation, trigrams, hand-crafted attention (we call them "context columns"), word embeddings, LoRA, RLHF, synthetic data, and agentic tool use.

Behind the scenes, an automated pipeline takes a text file through a Rust CLI to produce a JSON model, then uses Typst to generate a PDF booklet --- everything a participant needs for dice-powered text generation. All materials are available under CC BY-NC-SA 4.0 at [llmsunplugged.org](https://llmsunplugged.org), and the work was published at ACE 2026 (Australasian Computing Education Conference).

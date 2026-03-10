---
title: "LLMs Unplugged"
description: "Hands-on teaching resources for understanding how large language models work --- no computers or coding required."
creators:
  - Ben Swift
materials: "paper, dice, pens, scissors"
date: 2025-02-01
url: "https://llmsunplugged.org"
hero: ./hero-index.avif
heroAlt: "Stylised illustration of a hand writing on paper with dice, depicting the LLMs Unplugged activities"
github: "https://github.com/ANUcybernetics/llms-unplugged"
publications:
  - title: "LLMs Unplugged: Teaching Resources for a ChatGPT World"
    venue: "ACE 2026 (Australasian Computing Education Conference)"
    date: "2026"
    url: "https://doi.org/10.1145/3786228.3786237"
relatedProjects:
  - llm-library
  - perceptron-apparatus
order: 1
---

Most people's mental model of how ChatGPT works is basically "magic" --- and that's a problem if we want informed public discourse about AI. LLMs Unplugged is a set of hands-on activities that teach the training-to-generation loop using hand-built n-gram models and weighted random sampling. No computers, no coding, no hand-waving.

## Context

![Sorting word tokens into labelled buckets](./hero-bucket-training.avif)

The core activity is disarmingly simple: participants count word patterns in a children's book (tally marks on grid paper, tokens in labelled buckets, whatever works), then generate new text by rolling dice weighted according to those counts. Something clicks when you're sitting there rolling dice and watching plausible-ish sentences emerge from pure statistics --- you realise that the difference between your grid paper and GPT-4 is scale, not sorcery.

The project builds on the [CS Unplugged](https://csunplugged.org) tradition --- and, further back, on Claude Shannon's 1948 work systematically generating synthetic English text from hand-drawn frequency tables --- but fills a genuine gap in LLM-specific unplugged resources. The fundamental insight that training is counting and generation is sampling carries through from a single-page bigram grid all the way to a transformer with billions of parameters.

![Weighted random sampling with a spinner and funnel](./hero-sampling.avif)

We've run these activities with over 400 participants, from primary school students through to senior APS executives, and the format adapts surprisingly well across that range. The most common "aha moment" people report is realising that LLMs are doing probability and randomness at scale --- not reasoning, not understanding, but sophisticated pattern matching and weighted sampling. That demystification seems particularly valuable for non-technical participants who may have heard LLMs described in almost magical terms.

For those who want to go deeper, extension lessons cover temperature and truncation, trigrams, hand-crafted attention (we call them "context columns"), word embeddings, LoRA, RLHF, synthetic data, and agentic tool use.

## Technical details

![A book spilling its contents into generated text](./hero-pretrained-generation.avif)

Behind the scenes, an automated pipeline takes any plain text file through a [Rust CLI](https://github.com/ANUcybernetics/llms-unplugged) to produce a JSON n-gram model, then uses [Typst](https://typst.app) to generate a PDF booklet --- everything a participant needs for dice-powered text generation. The same toolchain produces the web-based tools at [llmsunplugged.org/tools](https://www.llmsunplugged.org/tools). Booklets can be generated for bigram, trigram, and 4-gram models from arbitrary source texts, and the progression across model orders demonstrates the fundamental trade-off between context length and output coherence.

All materials are available under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) at [llmsunplugged.org](https://llmsunplugged.org).

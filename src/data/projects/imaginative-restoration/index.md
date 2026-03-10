---
title: "Imaginative Restoration"
description: "An immersive installation where participants hand-draw Australian flora and fauna that are composited into damaged archival film footage in real time using generative AI."
creators:
  - Charlotte Bradley
  - Joe Hepworth
  - Daniel Herten
  - Ripley Rubens
  - Beth Shulman
  - Ben Swift
  - Lily Thomson
  - Marcelo Zavala-Baeza
materials: "digital, paper, pens, camera, screens"
date: 2024-07-01
hero: ./imgres-inside.avif
heroAlt: "Inside the Imaginative Restoration installation --- a cave-like space with screens, a keyboard, and red spray-painted text on sandstone walls"
github: "https://github.com/ANUcybernetics/imaginative-restoration"
relatedProjects:
  - panic
order: 5
---

_Imaginative Restoration: Rewilding Division_ is an immersive installation created in collaboration with NIDA and the National Film and Sound Archive of Australia (NFSA). Participants step into the role of Storytellers in a distant future where humanity has retreated underground, safeguarding and breathing new life into fragments of the past through a process called Imaginative Restoration. Your mission: hand-draw Australian flora and fauna that are composited into damaged archival film footage in real time.

## Context

![Marcelo Zavala-Baeza outside the installation entrance, a sculpted rock overhang draped with native plants](./imgres-outside-w-marcelo.avif)

The work emerged from a July 2024 workshop in Canberra that brought together experts in dramatic writing, props and effects, curation, and digital technologies to explore the future of dramatic arts creation, recording, and archiving in the age of generative AI. The collaboration between the ANU School of Cybernetics, NIDA's Future Centre, and the NFSA was driven by a shared question: what happens when generative AI is embedded in participatory, embodied creative experiences rather than sitting behind a chat interface?

The fictional framing matters. Participants aren't just "using AI" --- they're inhabiting a narrative world where restoration is an act of imagination. As a Storyteller in the Rewilding Division, you work to repopulate archival scenes with the creatures you can dream up, drawing them by hand and watching them enter black-and-white footage of the past in live time. The source footage --- _Annette Kellerman Performing Water Ballet at Silver Springs, Florida_ (1939) --- comes from the NFSA collection.

## Technical details

A camera captures each hand drawing, which is then processed through a pipeline of AI models: object detection ([Florence-2](https://arxiv.org/abs/2311.06242)) identifies what's been drawn, a text-to-image adapter ([T2I-Adapter](https://arxiv.org/abs/2302.08453)) generates a stylised version conditioned on the drawing, and background removal ([Tracer B7](https://huggingface.co/Carve/tracer_b7)) isolates the creature before compositing it into the archival footage.

The installation runs on an Ash/Phoenix web application written in Elixir and hosted on Fly.io, with AI models served via Replicate. The physical setup uses dual screens --- one showing the capture interface where drawings are photographed, the other displaying the composited film --- driven by a Mac mini or Raspberry Pi configured as a kiosk. An earlier prototype ran CUDA-accelerated models locally on an NVIDIA Jetson Orin AGX.

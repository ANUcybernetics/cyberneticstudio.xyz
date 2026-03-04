---
title: "Imaginative Restoration"
description: "An immersive installation where participants hand-draw Australian flora and fauna that are composited into damaged archival film footage in real time using generative AI."
date: 2024-07-01
url: "https://github.com/ANUcybernetics/imaginative_restoration"
hero: ./imgres-inside.avif
heroAlt: "Inside the Imaginative Restoration installation --- a cave-like space with screens, a keyboard, and red spray-painted text on sandstone walls"
featured: false
---

Imaginative Restoration: Rewilding Division is an immersive installation created in collaboration with NIDA and the National Film and Sound Archive of Australia (NFSA). Participants hand-draw Australian flora and fauna --- a bilby here, a banksia there --- that are composited into damaged archival film footage in real time using generative AI.

The work emerged from a July 2024 workshop in Canberra that brought together experts in dramatic writing, props and effects, curation, and digital technologies to explore the future of dramatic arts creation, recording, and archiving in the age of generative AI.

![Marcelo Zavala-Baeza outside the installation entrance, a sculpted rock overhang draped with native plants](./imgres-outside-w-marcelo.avif)

A camera captures each hand drawing, which is then processed through a pipeline of AI models --- object detection (Florence-2), text-to-image adaptation (T2I-Adapter), and background removal --- before being composited into the archival footage. The result is a living, collectively authored rewilding of Australia's film heritage.

The installation runs on an Ash/Phoenix web application hosted on Fly.io, with AI models served via Replicate. The technical architecture reflects a broader interest in how generative AI can be embedded in participatory, embodied creative experiences rather than sitting behind a chat interface.

Collaborators: Charlotte Bradley, Joe Hepworth, Daniel Herten, Ripley Rubens, Beth Shulman, Ben Swift, Lily Thomson, and Marcelo Zavala-Baeza.

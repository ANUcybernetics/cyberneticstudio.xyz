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

You step into a cave. Two screens glow in the dim light. A camera points down at a drawing station scattered with pens and paper. You're a Storyteller in the Rewilding Division --- one of the last humans, sheltering underground, tasked with breathing life back into fragments of the old world through a process called Imaginative Restoration. Your job is to draw a creature, any Australian flora or fauna you can dream up, and watch it enter a piece of damaged archival footage in real time. Colour bleeds into black-and-white. The creature you just sketched on paper is now swimming through 1939 footage of Annette Kellerman performing water ballet at Silver Springs, Florida --- sourced from the National Film and Sound Archive of Australia.

## The fiction and the question

![Marcelo Zavala-Baeza outside the installation entrance, a sculpted rock overhang draped with native plants](./imgres-outside-w-marcelo.avif)

The speculative fiction framing is the point. Participants aren't "using AI" --- they're inhabiting a narrative world where restoration is an act of imagination, where hand-drawing is the interface, and where the output isn't a chat response but a living scene unfolding on screen. The work asks a question that drove the whole collaboration between the ANU School of Cybernetics, NIDA's Future Centre, and the NFSA: what happens when generative AI is embedded in participatory, embodied creative experiences rather than sitting behind a text prompt?

_Imaginative Restoration: Rewilding Division_ emerged from a workshop in Canberra that brought together experts in dramatic writing, props and effects, curation, and digital technologies. The result is deliberately physical --- you hold a pen, you make marks on paper, you watch something you created with your hands enter a world on screen. The AI is powerful but invisible. It serves the experience rather than announcing itself.

## How it works

A camera captures each hand drawing and sends it through a pipeline of AI models. First, object detection identifies what's been drawn. Then a style-transfer model generates a version of the creature conditioned on the original sketch --- preserving the character of the drawing while adapting it for the scene. Finally, background removal isolates the creature so it can be composited into the archival footage, adding colour to the black-and-white film.

The whole system runs on an Ash/Phoenix web application written in Elixir, hosted on Fly.io, with AI models served via Replicate. The physical setup uses dual screens --- one showing the capture interface where drawings are photographed, the other displaying the composited film --- driven by a Mac mini or Raspberry Pi configured as a kiosk.

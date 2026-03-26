---
title: "PANIC!"
description:
  "An interactive installation and research project exploring feedback loops of
  generative AI models connected end-to-end."
creators:
  - Ben Swift
materials: "digital, screens, split-flap displays"
date: 2022-08-01
hero: ./2022-installation-view.avif
heroAlt:
  "PANIC! installation view showing multiple screens displaying AI-generated
  image sequences"
github: "https://github.com/ANUcybernetics/panic"
publications:
  - title:
      "Semantic Topologies in the Recursive Application of Generative AI Models"
    venue: "IEEE SMC 2025"
    date: "2025"
    url: "https://github.com/ANUcybernetics/panic-tda"
relatedProjects:
  - llms-unplugged
  - imaginative-restoration
order: 2
---

PANIC! --- Playground AI Network for Interactive Creativity --- is an
interactive installation that connects generative AI models end-to-end in
feedback loops and lets you watch what happens. Take a text-to-image model, feed
its output into an image-to-text model, loop the result back around, and stand
back.

## What happens when AI models talk to each other

Think of it as a game of Telephone where the players are billion-parameter
neural networks. A starting prompt produces an image, which gets described in
words, which produces a new image, which gets described again --- on and on. The
interesting part isn't what any single model does. It's the emergent behaviour
of the coupled system: recurring visual motifs, strange attractors in meaning
space, and occasionally complete collapse into nonsense. The trajectories are
genuinely unpredictable --- a seemingly innocuous starting prompt can spiral in
directions nobody anticipated.

![PANIC! in action during an exhibition](./2022-in-action.avif)

Different ways of wiring the models together produce fundamentally different
dynamics. Swap in a different image generator or change the captioning model and
the whole character of the system shifts. This is the core cybernetic insight
PANIC! is built around: feedback loops --- and the connections between
components --- define the behaviour of the systems in which we live, work and
create. The individual parts matter far less than how they're coupled.

One of the more revealing demonstrations is what we call "camel erasure". Feed
in a picture of a camel and watch it get quietly replaced by a giraffe within a
few iterations, because the captioning model doesn't recognise camels
particularly well. The bias here isn't a property of any individual model ---
it's an emergent property of the loop. You only see it when the models start
talking to each other.

There's a deeper point here, drawn from second-order cybernetics: you're always
part of the system you're observing. Every prompt is an intervention, every
observation a perturbation. When visitors interact with PANIC!, they're not just
watching AI do its thing --- they're steering the system, whether they intend to
or not.

## How it works

![Terminal showing PANIC! model output sequences](./2022-terminal.avif)

The installation runs as an Elixir web application that orchestrates the
feedback loop in real time. Models from different cloud platforms --- OpenAI,
Replicate, Gemini --- can be swapped in and out of the network, and their
outputs stream live to screens, terminals, and Vestaboard split-flap displays.
The architecture treats the network topology itself as the central object: which
models are connected, in what order, and how their outputs route to one another.

![PANIC! installation at Birch, 2024](./2024-birch-install.avif)

Alongside the installation, there's a research programme investigating the
mathematical structure of these feedback trajectories. Running thousands of
iterations across different model configurations, we embed each output into a
high-dimensional semantic space and use topological data analysis to
characterise the shape of each trajectory. The questions driving this work are
deceptively simple: are these trajectories predictable? Do they stabilise, or
keep drifting? And which part of the system --- the image generator, the
captioner, the topology --- matters most?

![PANIC! installation at SXSW Sydney, 2025](./2025-sxsw-install.avif)

PANIC! was first exhibited at the ANU School of Cybernetics in 2022 and has
since been shown at Birch (2024) and SXSW Sydney (2025). It has also been used
in teaching contexts including Decoding AI courses and the Cybernetic Leadership
program.

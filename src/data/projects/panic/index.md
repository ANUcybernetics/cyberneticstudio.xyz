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
interactive installation and computational research project exploring how
semantic information degrades and transforms when generative AI systems are
connected in feedback loops, recursively feeding outputs back as inputs.

## Context

Take a text-to-image model, feed its output into an image-to-text model, and
loop the result back around. Then stand back and watch.

What makes this interesting isn't any single model's output --- it's the
emergent behaviour of the system as a whole. Different network topologies (ways
of wiring models together) produce different dynamics: recurring visual motifs,
semantic attractors, and occasionally complete degeneracy. The trajectories are
genuinely unpredictable --- a seemingly innocuous starting prompt can spiral in
directions nobody anticipated.

![PANIC! in action during an exhibition](./2022-in-action.avif)

One of the more revealing findings is what we call "camel erasure". Feed in a
picture of a camel and watch it get quietly replaced by a giraffe within a few
iterations, because the captioning model doesn't recognise camels particularly
well. Bias here isn't a property of any individual model --- it's an emergent
property of the coupled system. You only see it when the models start talking to
each other.

This connects to a deeper point drawn from second-order cybernetics: the viewer
is always part of the system they're observing. Every prompt is an intervention,
every observation a perturbation. Through time-lapse visualisations, visitors
trace how semantic content drifts through repeated AI transformations --- like a
game of Telephone where the players are billion-parameter neural networks.

## Technical details

![Terminal showing PANIC! model output sequences](./2022-terminal.avif)

The installation is built as an Ash/Phoenix web application in Elixir. A
`NetworkRunner` GenServer manages the feedback loop, creating invocations
recursively and dispatching outputs to connected displays --- screens,
terminals, and Vestaboard split-flap displays --- via Phoenix PubSub. Models are
defined as structs with platform-specific adapters for OpenAI, Replicate, and
Gemini, allowing different text-to-image and image-to-text models to be swapped
in and out of the network graph.

![PANIC! installation at Birch, 2024](./2024-birch-install.avif)

The research side uses a separate Python tool
([trajectory-tracer](https://github.com/ANUcybernetics/trajectory-tracer)) for
batch-mode experiments at scale. It runs the same text→image→text loops for
thousands of iterations across multiple model configurations, embeds each text
output into a 768-dimensional semantic space, then applies persistent homology
(topological data analysis) to characterise the shape of each trajectory. The
pipeline uses Ray for parallelisation across three stages: generating runs,
computing embeddings, and producing persistence diagrams.

![PANIC! installation at SXSW Sydney, 2025](./2025-sxsw-install.avif)

PANIC! was first exhibited at the ANU School of Cybernetics in 2022 and has
since been shown at Birch (2024) and SXSW Sydney (2025). It has also been used
in teaching contexts including Decoding AI courses and the Cybernetic Leadership
program.

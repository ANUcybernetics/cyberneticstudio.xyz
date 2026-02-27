---
title: "PANIC!"
description: "An interactive installation exploring feedback loops of generative AI models hooked end-to-end."
date: 2024-06-01
tags: ["generative-ai", "installation", "cybernetics", "research"]
url: "https://github.com/ANUcybernetics/panic-tda/"
featured: true
---

PANIC! --- Playground AI Network for Interactive Creativity --- is what happens when you hook generative AI models together end-to-end and let them run. Take a text-to-image model, feed its output into an image-to-text model, and loop the result back around. Then stand back and watch.

What makes this interesting isn't any single model's output --- it's the emergent behaviour of the system as a whole. Different network topologies (ways of wiring models together) produce different dynamics: recurring visual motifs, semantic attractors, and occasionally complete degeneracy. The trajectories are genuinely unpredictable --- a seemingly innocuous starting prompt can spiral in directions nobody anticipated.

One of the more revealing findings is what we call "camel erasure". Feed in a picture of a camel and watch it get quietly replaced by a giraffe within a few iterations, because the captioning model doesn't recognise camels particularly well. Bias here isn't a property of any individual model --- it's an emergent property of the coupled system. You only see it when the models start talking to each other.

This connects to a deeper point drawn from second-order cybernetics: the viewer is always part of the system they're observing. Every prompt is an intervention, every observation a perturbation.

The research is documented in "Semantic Topologies in the Recursive Application of Generative AI Models" (Swift & Hong, IEEE SMC 2025) and in the NIME 2025 proceedings, where the work was also exhibited. PANIC! has been used in teaching contexts including our Decoding AI courses and Cybernetic Leadership program. Code and data are [available on GitHub](https://github.com/ANUcybernetics/panic-tda/).

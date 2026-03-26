---
title: "LLM Brainscan"
description:
  "A real-time visualisation of transformer weight changes during training,
  mapped pixel-by-pixel onto an 8K display."
creators:
  - Ben Swift
materials: "digital, 8K display, NVIDIA Jetson Orin"
date: 2026-01-01
github: "https://github.com/ANUcybernetics/llm-brainscan"
relatedProjects:
  - panic
  - llms-unplugged
order: 1
---

LLM Brainscan maps every trainable parameter of a transformer neural network
onto an 8K display --- one pixel per weight, updating live as the model learns.
Attention mechanisms form, MLP features sharpen, embedding clusters emerge, and
you watch it all happen frame by frame.

## Context

Training a language model is an opaque process --- you stare at a loss curve
ticking downward and hope for the best. LLM Brainscan makes the internal
dynamics visible: roughly 30 million trainable parameters, laid out as a spatial
image you can actually watch evolve.

The mapping works because the numbers line up. An 8K display offers 7680×4320
pixels --- just over 33 million --- which fits a compact transformer's parameter
count almost exactly. Weight matrices tile across the top 4128 rows of the
display, while the bottom 192 rows render the model's generated text output in
real time, with each token coloured by prediction confidence. You can see
structure forming in the attention heads, watch layer norms stabilise, and spot
the moment the model starts producing coherent output.

Static snapshots of learned weights are common enough. The temporal dimension is
where it gets interesting --- watching training dynamics unfold live, at full
resolution, reveals patterns that summary statistics flatten out. Symmetry
breaking in the attention layers. Transient features that appear and dissolve.
Different parts of the network learning at visibly different rates. Loss curves
don't show you any of this.

## Technical details

The renderer uses wgpu with GLFW for fullscreen GPU-accelerated display, running
fragment shaders that handle real-time weight normalisation directly on the GPU.
There's no CPU readback in the display pipeline --- weights transfer from PyTorch
tensors to the GPU framebuffer and straight to the screen, which is the only way
to maintain interactive frame rates at 8K resolution. The target hardware is an
NVIDIA Jetson Orin with 64GB of unified memory connected to the 8K panel,
keeping the whole system compact enough to deploy as an installation. Frame
capture to PNG sequences is available for documentation, but the intended
experience is live.

The model is deliberately small: 8 transformer layers, 9 attention heads,
558-dimensional embeddings, and a 256-token context window with byte-level
vocabulary. Byte-level tokenisation means only 256 tokens, so the embedding
table occupies under 1% of the display --- the vast majority of pixels go to the
weight matrices where the interesting dynamics happen. The architecture is sized
to fit the display, not to achieve state-of-the-art performance, which is rather
the point --- the model exists to be watched, and maybe to be useful.

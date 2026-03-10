---
title: "Perceptron Apparatus"
description: "A physical computational device that makes neural network calculations tangible --- an abacus for deep learning."
creators:
  - Ben Swift
materials: "laser-cut and CNC-routed plywood, 1200mm diameter"
date: 2024-09-01
hero: ./ben-with-apparatus.avif
heroAlt: "Ben standing next to the Perceptron Apparatus"
github: "https://github.com/ANUcybernetics/perceptron-apparatus"
relatedProjects:
  - llms-unplugged
order: 3
---

The Perceptron Apparatus is a 1.2 metre diameter circular wooden instrument with concentric rings of sliders, each ring representing a layer in a simple neural network. You physically slide the rings to perform matrix multiplication and ReLU activation, turning what's usually an invisible cascade of floating-point arithmetic into something you can see and touch.

![Perceptron Apparatus schematic diagram](./apparatus.svg)

## Context

The apparatus uses defamiliarisation to critically examine neural computing. By recontextualising neural computation in a strange way --- framing it as something between a séance and a slide rule --- it creates critical distance to examine the philosophical and cultural assumptions embedded in our conception of AI. If the network is intelligent, where does this intelligence reside? In the users? In the apparatus? In the immaterial pattern of information organised by the ritual?

Unlike digital computers that distance users from computation through layers of abstraction, analog computation draws users in. The apparatus functions not as an automatic device but as what Charles Philip Care calls an "interactive visualisation" --- cognitive support rather than automation. Users become active participants, "human computers" in the neural network calculation.

At its core, AI is built on an ontology that separates mind from material reality. The apparatus challenges this by making computation physical and embodied, forcing us to confront the strangeness at the core of AI.

## Technical details

The architecture maps directly onto a feedforward network: concentric rings for input (A), weights (B), hidden layer (C), more weights (D), and output (E). A logarithmic scale ring --- essentially a circular slide rule --- handles the multiplications. The ring dimensions follow the network topology: for MNIST digit recognition the apparatus has 36 input positions (a 6x6 downsampled image), 6 hidden neurons, and 10 outputs. The same 36→6→10 architecture also handles poker hand classification, with five-card hands encoded as 36 features. Two very different domains, one shared physical form.

The fabrication files are generated programmatically in Elixir, producing SVGs with distinct cut classes for laser cutting and CNC routing. The ML side uses Axon and Nx for training the weights that get printed onto A3 reference posters and interactive worksheets --- draw a digit, look up the weights, slide the rings, read off the answer. Documentation is typeset in Typst. Fabrication support came from Sam Shellard at UC Workshop7.

Is it an abacus? Is it an ouija board? No --- it's a perceptron apparatus.

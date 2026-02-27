---
title: "Perceptron Apparatus"
description: "A physical computational device that makes neural network calculations tangible --- an abacus for deep learning."
date: 2024-09-01
tags: ["fabrication", "machine-learning", "education", "physical-computing"]
featured: true
---

The Perceptron Apparatus is a physical computational device that makes neural network calculations tangible --- an abacus for deep learning, if you will. It's a large circular instrument (1200mm diameter) with concentric rings of sliders, each ring representing a layer in a simple neural network. You physically slide the rings to perform matrix multiplication and ReLU activation, turning what's usually an invisible cascade of floating-point arithmetic into something you can see and touch.

The architecture maps directly onto a feedforward network: concentric rings for input, weights, hidden layer, more weights, and output. A logarithmic scale ring --- essentially a circular slide rule --- handles the multiplications. The ring dimensions follow the network topology, so for MNIST digit recognition the apparatus has 36 input positions, 6 hidden neurons, and 10 outputs. The same 36→6→10 architecture also handles poker hand classification, with five-card hands encoded as 36 features. Two very different domains, one shared physical form.

The whole thing was fabricated via laser cutting and CNC routing, with the SVG cut files generated programmatically in Elixir. The ML side uses Axon and Nx for training the weights that get printed onto the A3 reference posters and interactive worksheets --- draw a digit, look up the weights, slide the rings, read off the answer. Documentation is typeset in Typst. Fabrication support came from Sam Shellard at UC Workshop7.

Is it an abacus? Is it an ouija board? No --- it's a perceptron apparatus.

---
id: TASK-16
title: animated lissajous style widgets for all images on site
status: To Do
assignee: []
created_date: "2026-03-09 22:32"
labels: []
dependencies: [task-2]
---

Building on task-2, I want to an "animated lissajous-esque lines" aesthetic for
_all_ the images on this site.

My initial idea is this. For each image:

- start with a reference image
- take a 2d FFT (or similar; perhaps cosine) and keep only the low frequency
  components
- use those amplitudes to modulate (and animate) the lissajous lines (see the
  existing hero LissajousWave.svelte for an example, but it doesn't have to work
  exactly like that)

I'd like to animate the lines in such a way that periodically (perhaps with t=0)
the lines will resolve to something that looks like a stylised, lpf'd version of
the original image. But at other times the lines just look like cool, evolving
patterns.

My priorities are:

- looking cool
- using mathetmatically-nice tricks to make sure the code is relatively simple
- make it easy to generate a new one of these (from a reference image) and use
  it as the hero (and card image) for that project

I don't actually want the reference image to show up at all.

If there's a nicer way to achieve my goals, then I'm open to suggestions.

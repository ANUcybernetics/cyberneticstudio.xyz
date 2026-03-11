---
id: TASK-2
title: static lissajou for logo
status: Done
assignee: []
created_date: "2026-03-03 21:58"
labels: []
dependencies: []
---

The svelte lissajous component works great in the browser. However, sometimes
(e.g. for print, or as a favicon) it'd be nice to have a static version of it.

I'd like:

- a no-text version of just the lissajous (at a suitably interesting stage of
  it's animation)
- a "with text" version; similar to above, but with the text on top
- a "with text" version but with the lissajous on the left and the "Cybernetic
  Studio" text on the right

I'd like to have both svg and image (e.g. avif) versions. And I think I want
them to be square aspect ratio (except the "text beside" version, which would
obviously be landscape because the text takes up room).

I'm not 100% sure the best way to do this, and I don't mind if it's a _bit_
manual. It'll just be a one-off to create the assets then we can commit them to
the repo.

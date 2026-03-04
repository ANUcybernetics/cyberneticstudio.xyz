---
title: Example Deck
description: Demonstrating animotion slide deck features
---

<!-- _class: title -->

# Example Deck

## Demonstrating animotion features

---

## Content slide

- Markdown rendered to HTML
- **Bold** and *italic* text
- [Links](https://cyberneticstudio.xyz) work naturally
- Inline `code` with styling

---

## GFM features

| Feature | Status |
| --- | --- |
| Tables | Supported |
| ~~Strikethrough~~ | Supported |
| Task lists | Supported |

---

![bg right:50%](/images/ben-swift.webp)

## Split layout

Image on the right, content on the left.

- Uses marp `![bg right:50%]` syntax
- Preprocessor generates a flex layout
- Percentage controls the image width

---

<!-- _class: impact -->

# Impact

---

<!-- _class: divider -->

![bg brightness:0.5](/images/bg-div-mechanic.avif)

# Section break

---

<!-- _class: dark -->

## Dark variant

Content on a dark background with adapted colour scheme.

---

<!-- _class: centered -->

## Centred slide

Content is vertically and horizontally centred.

---

<script lang="ts">
  let count = $state(0);
</script>

<h2>Interactive slide</h2>
<p>Counter: {count}</p>
<Action do={() => count++}>
  <button>Increment</button>
</Action>

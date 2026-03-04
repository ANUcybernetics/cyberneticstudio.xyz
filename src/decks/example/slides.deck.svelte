---
title: Example Deck
description: Demonstrating animotion slide deck features
---

# Example Deck

Demonstrating animotion features

---

## Content slide

- Markdown rendered to HTML
- **Bold** and _italic_ text
- [Links](https://cyberneticstudio.xyz) work naturally
- Inline `code` with styling

---

## GFM features

| Feature           | Status    |
| ----------------- | --------- |
| Tables            | Supported |
| ~~Strikethrough~~ | Supported |
| Task lists        | Supported |

---

![bg right:50%](/images/ben-swift.webp)

## Split layout

Image on the right, content on the left.

- Uses marp `![bg right:50%]` syntax
- Preprocessor generates a flex layout
- Percentage controls the image width

---

<!-- _class: impact -->

_here's_ the **thing**

---

![bg brightness:0.5](/images/bg-div-mechanic.avif)

# Section break

---

<!-- _class: centered -->

## Centred slide

Content is vertically and horizontally centred.

---

<!-- _class: anu-logo -->

---

<!-- _class: socy-logo -->

---

<!-- _class: socy-logo light -->

---

<!-- _class: centered -->

![qr](https://cyberneticstudio.xyz/decks/example/)

---

<script lang="ts">
  let count = $state(0);
</script>

<h2>Interactive slide</h2>
<p>Counter: {count}</p>
<Action do={() => count++}>
  <button>Increment</button>
</Action>

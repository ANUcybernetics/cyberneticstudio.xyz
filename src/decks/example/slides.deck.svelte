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

## Code blocks

```elixir
defmodule Greeter do
  def hello(name \\ "world") do
    "Hello, #{name}!"
  end
end
```

---

![bg right:50%](./assets/ben-swift.avif)

## Split layout

Image on the right, content on the left.

- Uses marp `![bg right:50%]` syntax
- Preprocessor generates a flex layout
- Percentage controls the image width

---

<!-- _class: impact -->

_here's_ the **thing**

---

<!-- _class: banner -->

![bg brightness:0.5](../assets/bg-div-mechanic.avif)

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

<!-- _class: centered -->

![qr](https://cyberneticstudio.xyz/decks/example/)

---

<script lang="ts">
  import { tween } from "@animotion/motion";

  const GOLD = "#be830e";
  const TEAL = "#0085ad";
  const COPPER = "#be4e0e";

  let cx = tween(100);
  let cy = tween(150);
  let r = tween(20);
  let fill = tween(GOLD);

  let codeRef: ReturnType<typeof Code>;
</script>

<h2>Animated code</h2>

<Code
  bind:this={codeRef}
  lang="javascript"
  theme="poimandres"
  code={`function greet(name) {\n  return "hello, " + name\n}`}
/>

<Action do={() => codeRef.update`function greet(name) {\n  return \`hello, \${name}!\`\n}`}>
  Template literal
</Action>

<Action do={() => codeRef.selectLines`2`}>
  Highlight return
</Action>

<Action do={() => codeRef.selectToken`greet`}>
  Highlight function name
</Action>

<Action do={() => codeRef.selectLines`*`}>
  Clear selection
</Action>

---

<h2>Animated SVG</h2>

<svg viewBox="0 0 600 300" style="width: 100%; max-height: 50vh;">
  <circle cx={cx.current} cy={cy.current} r={r.current} fill={fill.current} />
</svg>

<Action do={() => cx.to(300)}>
  Move
</Action>

<Action do={() => r.to(60)}>
  Grow
</Action>

<Action do={() => fill.to(TEAL)}>
  Recolour
</Action>

<Action do={() => cx.to(500).then(() => fill.to(COPPER))}>
  Slide &amp; shift
</Action>
